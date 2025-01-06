import {useNavigate} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import {genderList} from "../../../utils/SelectUtils.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import FormDateOfBirth from "../../../form/formdateofbirth/FormDateOfBirth.jsx";
import {useEffect, useRef, useState} from "react";
import {Button, Flex, Skeleton} from "antd";
import FormStateProvince from "../../../form/formstateprovince/FormStateProvince.jsx";
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";
import {equalString, isNullOrEmpty, randomNumber, toBoolean} from "../../../utils/Utils.jsx";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {useTranslation} from "react-i18next";
import {isNonUsCulture, toReactDate} from "../../../utils/DateUtils.jsx";
import FormCustomFields from "../../../form/formcustomfields/FormCustomFields.jsx";
import FormRatingCategories from "../../../form/formratingcategories/FormRatingCategories.jsx";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {pNotify} from "../../../components/notification/PNotify.jsx";
import * as React from "react";
import useCustomFormik from "../../../components/formik/CustomFormik.jsx";
import {validatePersonalInformation} from "../../../utils/ValidationUtils.jsx";
import ReCAPTCHA from 'react-google-recaptcha';
import {getConfigValue} from "../../../config/WebConfig.jsx";
import FooterBlock from "../../../components/footer/FooterBlock.jsx";

function MyProfileDetails({selectedTab}) {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const {t} = useTranslation('');
    const [isFetching, setIsFetching] = useState(true);
    let captchaKey = getConfigValue('GoogleCaptchaKey_V3');
    
    const {setIsFooterVisible, setHeaderRightIcons, setFooterContent, isLoading, setIsLoading} = useApp();
    const {orgId, authData} = useAuth();
    const {token} = useApp();
    const recaptchaRef = useRef(null);

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

    const getValidationSchema = () => {
        let schemaFields = {
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

        return Yup.object(schemaFields);
    }
    
    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: getValidationSchema(profileData),
        validation: () => {
            let isValidForm = validatePersonalInformation(t, formik, null, profileData);
            return isValidForm;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            let postModel = profileData;
            postModel.FirstName = values.FirstName;
            postModel.LastName = values.LastName;
            postModel.Email = values.Email;
            postModel.Username = values.Username;
            postModel.Password = values.Password;
            postModel.ConfirmPassword = values.ConfirmPassword;
            postModel.CurrentPassword = values.CurrentPassword;
            postModel.Gender = values.Gender;
            postModel.DateOfBirth.DateOfBirthString = values.DateOfBirthString;
            postModel.Membership.MembershipNumber = values.MembershipNumber;
            postModel.PhoneNumber.PhoneNumber = values.PhoneNumber;
            postModel.Address.Address = values.Address;
            postModel.Address.City = values.City;
            postModel.Address.State = values.State;
            postModel.Address.ZipCode = values.ZipCode;
            postModel.ExcludeAccountInformationFromPublicGroups = values.ExcludeAccountInformationFromPublicGroups;
            postModel.UnsubscribeFromMarketingEmails = values.UnsubscribeFromMarketingEmails;
            postModel.DoNotAllowOtherPlayersToLinkMyProfile = values.DoNotAllowOtherPlayersToLinkMyProfile;
            postModel.UnsubscribeFromMarketingPushNotifications = values.UnsubscribeFromMarketingPushNotifications;
            postModel.RatingCategories = values.RatingCategories;
            postModel.CustomFields = values.CustomFields;

            postModel.Token = await recaptchaRef.current.executeAsync();
            
            let response = await appService.post(`/app/Online/MyProfile/MyProfilePost?id=${orgId}`, postModel);
            if (toBoolean(response?.IsValid)) {
                pNotify(t('profile.successfullyUpdate'))
                setIsLoading(false);
            } else {
                pNotify(response.Message, 'error')
                setIsLoading(false);
            }
        },
    });

    useEffect(() => {
        if (equalString(selectedTab, 'pers')) {
            setIsFooterVisible(true);
            setHeaderRightIcons(null);
            
            setFooterContent(<FooterBlock topBottom={true}>
                <Button type="primary"
                        block
                        htmlType="submit"
                        disabled={isFetching}
                        loading={isLoading}
                        onClick={formik.handleSubmit}>
                    {t('profile.updateInformation')}
                </Button>
            </FooterBlock>);
        }
    }, [selectedTab, isFetching, isLoading]);
    
    useEffect(() => {
        if (equalString(selectedTab, 'pers') && isNullOrEmpty(profileData)) {
            loadData();
        }
    }, [selectedTab]);

    return (
        <PaddingBlock onlyBottom={true}>
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

                    <FormRatingCategories ratingCategories={profileData?.RatingCategories} formik={formik} loading={isFetching} name={'RatingCategories[{ratingIndex}].{keyValue}'} />

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
            <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={captchaKey}
            />
        </PaddingBlock>
    )
}

export default MyProfileDetails
