import {useNavigate} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import {genderList} from "../../../utils/SelectUtils.jsx";
import {useFormik} from "formik";
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import FormDateOfBirth from "../../../form/formdateofbirth/FormDateOfBirth.jsx";
import {useEffect, useState} from "react";
import {Button, Flex, Skeleton} from "antd";
import FormStateProvince from "../../../form/formstateprovince/FormStateProvince.jsx";
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";
import {anyInList, equalString, isNullOrEmpty, randomNumber, toBoolean} from "../../../utils/Utils.jsx";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {useTranslation} from "react-i18next";
import {isNonUsCulture, toReactDate} from "../../../utils/DateUtils.jsx";
import FormCustomFields from "../../../form/formcustomfields/FormCustomFields.jsx";
import FormRatingCategories from "../../../form/formratingcategories/FormRatingCategories.jsx";
import {emptyArray, getRatingCategoriesList, getUserDefinedFieldsList} from "../../../utils/ListUtils.jsx";
import {pNotify} from "../../../components/notification/PNotify.jsx";
import * as React from "react";

function MyProfileDetails({selectedTab}) {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const {t} = useTranslation('');
    const [isFetching, setIsFetching] = useState(true);

    const {isMockData, setIsFooterVisible, setHeaderRightIcons, setFooterContent, isLoading, setIsLoading} = useApp();
    const {orgId, authData} = useAuth();
    const {token} = useApp();

    const loadData = () => {
        setIsFetching(true);

        appService.get(navigate, `/app/Online/MyProfile/MyProfile?id=${orgId}`).then(r => {
            if (toBoolean(r?.IsValid)) {
                setProfileData(r.Data);
                setFormikValues(r.Data)
            }
            setIsFetching(false);
            setIsLoading(false);
        })
    }

    const setFormikValues = (data) => {
        let valuesToSet = {
            FirstName: data.FirstName || '',
            LastName: data.LastName || '',
            DateOfBirthString:  toReactDate(data.DateOfBirth?.DateOfBirth),
            Gender: data.Gender || '',
            Email: data.Email || '',
            Username: data.Username || '',
            MembershipNumber: data.Membership?.MembershipNumber || '',
            PhoneNumber: data.PhoneNumber?.PhoneNumber || '',
            Address: data.Address?.Address || '',
            City: data.Address?.City || '',
            State: data.Address?.State || '',
            ZipCode: data.Address?.ZipCode || '',
            ExcludeAccountInformationFromPublicGroups: data.ExcludeAccountInformationFromPublicGroups || false,
            UnsubscribeFromMarketingEmails: data.UnsubscribeFromMarketingEmails || false,
            DoNotAllowOtherPlayersToLinkMyProfile: data.DoNotAllowOtherPlayersToLinkMyProfile || false,
            UnsubscribeFromMarketingPushNotifications: data.UnsubscribeFromMarketingPushNotifications || false,
            CustomFields: data.CustomFields || [],
            RatingCategories: data.RatingCategories || [],
        };

        formik.setValues(valuesToSet);
    };

    const initialValues = {
        FirstName: '',
        LastName: '',
        DateOfBirthString: '',
        Gender: '',
        Email: '',
        Username: '',
        MembershipNumber: '',
        CurrentPassword: '',
        Password: '',
        ConfirmPassword: '',
        PhoneNumber: '',
        Address: '',
        City: '',
        State: '',
        ZipCode: '',
        ExcludeAccountInformationFromPublicGroups: false,
        UnsubscribeFromMarketingEmails: false,
        DoNotAllowOtherPlayersToLinkMyProfile: false,
        UnsubscribeFromMarketingPushNotifications: false,
        CustomFields: [],
        RatingCategories: [],
    };

    const getValidationSchema = (profileData) => {
        let schemaFields = {
            FirstName: Yup.string().required(t('profile.firstNameRequired')),
            LastName: Yup.string().required(t('profile.lastNameRequired')),
            Username: Yup.string().required(t('profile.usernameRequired')),
            Email: Yup.string().email(t('profile.emailInvalid')).required(t('profile.emailRequired')),
        };

        schemaFields.Password = Yup.string().when('CurrentPassword', {
            is: (currentPassword) => {
                return !isNullOrEmpty(currentPassword); 
            },
            then: (schema) =>
                schema
                    .required(t('profile.newPasswordRequired'))
                    .min(6, t('profile.newPasswordMinLength'))
                    .max(40, t('profile.newPasswordMaxLength')),
            otherwise: (schema) => schema.nullable(),
        });
        
        schemaFields.ConfirmPassword = Yup.string()
            .oneOf([Yup.ref('password'), null], t('profile.confirmPasswordNotMatch'))
            .when('Password', {
                is: (password) => {
                    return !isNullOrEmpty(password);
                },
                then: (schema) => schema.required(t('profile.confirmPasswordRequired')),
                otherwise: (schema) => schema.nullable(),
            });
        
        if (profileData){
            if (!toBoolean(profileData?.IsGenderDisabled) && toBoolean(profileData?.IncludeGender) && toBoolean(profileData?.IsGenderRequired)) {
                schemaFields.Gender = Yup.string().required(t('profile.genderRequired'))
            }

            if (profileData.RatingCategories) {
                profileData.RatingCategories.forEach(category => {
                    if (category.IsRequired) {
                        if (category.AllowMultipleRatingValues) {
                            schemaFields[`rat_${category.Id}`] = Yup.array().min(1, t('form.labelRequired', {label: category.Name})).required(t('form.labelRequired', {label: category.Name}))
                        } else {
                            schemaFields[`rat_${category.Id}`] = Yup.string().required(t('form.labelRequired', {label: category.Name}));
                        }
                    }
                });
            }
            
            if (toBoolean(profileData.PhoneNumber?.Include) && toBoolean(profileData.PhoneNumber?.IsRequired)){
                schemaFields.PhoneNumber = Yup.string().required(t('profile.phoneNumberRequired'));
            }

            if (toBoolean(profileData.DateOfBirth?.Include) && toBoolean(profileData.DateOfBirth?.IsRequired)){
                schemaFields.MembershipNumber = Yup.string().required(t('profile.membershipNumberRequired'));
            }

            if (toBoolean(profileData.Membership?.Include) && toBoolean(profileData.Membership?.IsRequired)){
                schemaFields.MembershipNumber = Yup.string().required(t('profile.membershipNumberRequired'));
            }

            if (toBoolean(profileData.DateOfBirth?.Include) && toBoolean(profileData.DateOfBirth?.IsRequired)){
                schemaFields.DateOfBirthString = Yup.string().required(t('date.dateOfBirthRequired'));
            }

            if (toBoolean(profileData.Address?.Include) && toBoolean(profileData.Address?.IsRequired)){
                schemaFields.Address = Yup.string().required(t('profile.addressRequired'));
                schemaFields.City = Yup.string().required(t('profile.cityRequired'));
                schemaFields.State = Yup.string().required(t('profile.stateRequired'));
                schemaFields.ZipCode = Yup.string().required(isNonUsCulture() ? t('profile.postalCodeRequired') : t('profile.zipCodeRequired'));
            }
            
            if (profileData.CustomFields) {
                profileData.CustomFields.forEach(udf => {
                    if (udf.IsRequired) {
                        schemaFields[`udf_${udf.Id}`] = Yup.string().required(t('form.labelRequired', {label: udf.Label}));
                    }
                });
            }
        }
        return Yup.object(schemaFields);
    }
    
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: getValidationSchema(profileData),
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            const ratings = getRatingCategoriesList(values);   
            const udfs = getUserDefinedFieldsList(values);  
            
            if (isMockData) {
                pNotify(t('profile.successfullyUpdate'))
                setIsLoading(false);
            } else {
                //todo
                alert('todo verification')
            }
        },
    });

    useEffect(() => {
        if (equalString(selectedTab, 'pers')) {
            setIsFooterVisible(true);
            setHeaderRightIcons(null);
            
            setFooterContent(<PaddingBlock topBottom={true}>
                <Button type="primary"
                        block
                        htmlType="submit"
                        disabled={isFetching}
                        loading={isLoading}
                        onClick={formik.handleSubmit}>
                    {t('profile.updateInformation')}
                </Button>
            </PaddingBlock>);
        }
    }, [selectedTab, isFetching]);
    
    useEffect(() => {
        if (equalString(selectedTab, 'pers')) {
            loadData();
        }
    }, [selectedTab]);

    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                {isFetching &&
                    <>
                        {emptyArray(18).map((item, index) => (
                            <Flex vertical={true} gap={8} key={index}>
                                <Skeleton.Button active={true} block style={{width: `${randomNumber(30, 45)}%`}}/>
                                <Skeleton.Button active={true} block style={{height: `40px`}}/>
                            </Flex>
                        ))}
                    </>
                }
                
                {!isFetching && (<>
                    <FormInput label={t('profile.firstName')}
                               formik={formik}
                               loading={isFetching}
                               required={true}
                               name='FirstName'
                    />
                    <FormInput label={t('profile.lastName')}
                               formik={formik}
                               loading={isFetching}
                               required={true}
                               name='LastName'
                    />
                    <FormInput label={t('profile.email')}
                               formik={formik}
                               loading={isFetching}
                               required={!toBoolean(profileData?.EmailIsNotRequired)}
                               name='Email'
                    />
                    <FormInput label={t('profile.username')}
                               formik={formik}
                               loading={isFetching}
                               required={true}
                               name='Username'
                    />

                    {!toBoolean(profileData?.IsGenderDisabled) && toBoolean(profileData?.IncludeGender) &&
                        <FormSelect formik={formik}
                                    name={`Gender`}
                                    label={t('profile.gender')}
                                    fetching={isFetching}
                                    options={genderList}
                                    required={toBoolean(profileData?.IsGenderRequired)}/>
                    }

                    <FormInput label={t('profile.currentPassword')}
                               formik={formik}
                               loading={isFetching}
                               type={'password'}
                               name='CurrentPassword'
                    />

                    <FormInput label={t('profile.password')}
                               formik={formik}
                               loading={isFetching}
                               required={toBoolean(!isNullOrEmpty(formik?.values?.CurrentPassword))}
                               type={'password'}
                               name='Password'
                    />
                    <FormInput label={t('profile.confirmPassword')}
                               formik={formik}
                               loading={isFetching}
                               required={toBoolean(!isNullOrEmpty(formik?.values?.CurrentPassword))}
                               type={'password'}
                               name='ConfirmPassword'
                    />

                    <FormRatingCategories ratingCategories={profileData?.RatingCategories} formik={formik} loading={isFetching}/>

                    {toBoolean(profileData?.PhoneNumber?.Include) &&
                        <FormInput label={t('profile.phoneNumber')}
                                   formik={formik}
                                   loading={isFetching}
                                   required={toBoolean(profileData?.PhoneNumber?.IsRequired)}
                                   name='PhoneNumber'
                        />
                    }

                    {toBoolean(profileData?.Membership?.Include) &&
                        <FormInput label={t('profile.membershipNumber')}
                                   formik={formik}
                                   loading={isFetching}
                                   required={toBoolean(profileData?.Membership?.IsRequired)}
                                   name='MembershipNumber'
                        />
                    }

                    {toBoolean(profileData?.DateOfBirth?.Include) &&
                        <FormDateOfBirth label={t('profile.dateOfBirth')}
                                         formik={formik}
                                         loading={isFetching}
                                         required={toBoolean(profileData?.DateOfBirth?.IsRequired)}
                                         displayAge={true}
                                         name='DateOfBirthString'
                        />
                    }

                    {toBoolean(profileData?.Address?.Include) &&
                        <>
                            <FormInput label={t('profile.address')}
                                       formik={formik}
                                       loading={isFetching}
                                       required={toBoolean(profileData?.Address?.IsRequired)}
                                       name='Address'
                            />

                            <FormInput label={t('profile.city')}
                                       formik={formik}
                                       loading={isFetching}
                                       required={toBoolean(profileData?.Address?.IsRequired)}
                                       name='City'
                            />

                            <FormStateProvince formik={formik}
                                               loading={isFetching}
                                               dropdown={true}
                                               name={`State`}
                                               required={toBoolean(profileData?.Address?.IsRequired)}
                            />

                            <FormInput label={isNonUsCulture() ? t('profile.postalCode') : t('profile.zipCode')}
                                       formik={formik}
                                       loading={isFetching}
                                       required={toBoolean(profileData?.Address?.IsRequired)}
                                       name='ZipCode'
                            />
                        </>
                    }

                    <FormCustomFields customFields={profileData?.CustomFields} formik={formik} loading={isFetching} name={`CustomFields[{udfIndex}].Value`} />

                    <FormSwitch label={t('profile.excludeAccountInformationFromPublicGroups')}
                                formik={formik}
                                loading={isFetching}
                                rows={2}
                                name={'ExcludeAccountInformationFromPublicGroups'}/>

                    <FormSwitch label={t('profile.unsubscribeFromMarketingEmails')}
                                formik={formik}
                                loading={isFetching}
                                rows={2}
                                name={'UnsubscribeFromMarketingEmails'}/>

                    {toBoolean(authData?.UseOrganizedPlay) &&
                        <FormSwitch label={t('profile.doNotAllowOtherPlayersToLinkMyProfile')}
                                    formik={formik}
                                    loading={isFetching}
                                    rows={2}
                                    name={'DoNotAllowOtherPlayersToLinkMyProfile'}/>
                    }

                    {toBoolean(authData?.IsUsingPushNotifications) &&
                        <FormSwitch label={t('profile.unsubscribeFromMarketingPushNotifications')}
                                    formik={formik}
                                    loading={isFetching}
                                    rows={2}
                                    name={'UnsubscribeFromMarketingPushNotifications'}/>
                    }
                </>)}
            </Flex>
        </PaddingBlock>
    )
}

export default MyProfileDetails
