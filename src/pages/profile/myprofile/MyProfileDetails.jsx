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
import {Button} from "antd";
import FormStateProvince from "../../../form/formstateprovince/FormStateProvince.jsx";
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {useTranslation} from "react-i18next";
import {dateToString, isNonUsCulture} from "../../../utils/DateUtils.jsx";
import FormCustomFields from "../../../form/formcustomfields/FormCustomFields.jsx";
import FormRatingCategories from "../../../form/formratingcategories/FormRatingCategories.jsx";
import {getRatingCategoriesList, getUserDefinedFieldsList} from "../../../utils/ListUtils.jsx";
import {pNotify} from "../../../components/notification/PNotify.jsx";

function MyProfileDetails({selectedTab}) {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const {t} = useTranslation('');
    const [isFetching, setIsFetching] = useState(true);

    const {isMockData, setIsFooterVisible, setHeaderRightIcons, setFooterContent, isLoading, setIsLoading} = useApp();
    const {orgId, authData} = useAuth();

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
            firstName: data.FirstName || '',
            lastName: data.LastName || '',
            dateOfBirthString:  dateToString(data.DateOfBirth?.DateOfBirth),
            gender: data.Gender || '',
            email: data.Email || '',
            username: data.Username || '',
            membershipNumber: data.Membership?.MembershipNumber || '',
            phoneNumber: data.PhoneNumber?.PhoneNumber || '',
            address: data.Address?.Address || '',
            city: data.Address?.City || '',
            state: data.Address?.State || '',
            zipCode: data.Address?.ZipCode || '',
            excludeAccountInformationFromPublicGroups: data.ExcludeAccountInformationFromPublicGroups || false,
            unsubscribeFromMarketingEmails: data.UnsubscribeFromMarketingEmails || false,
            doNotAllowOtherPlayersToLinkMyProfile: data.DoNotAllowOtherPlayersToLinkMyProfile || false,
            unsubscribeFromMarketingPushNotifications: data.UnsubscribeFromMarketingPushNotifications || false,
        };

        if (data && anyInList(data.RatingCategories)) {
            data.RatingCategories.forEach(ratingCategory => {
                if (toBoolean(ratingCategory.AllowMultipleRatingValues)){
                    valuesToSet[`rat_${ratingCategory.Id}`] = ratingCategory.SelectedRatingsIds || [];
                } else{
                    valuesToSet[`rat_${ratingCategory.Id}`] = ratingCategory.SelectedRatingId || '';
                }
            });
        }

        if (data && anyInList(data.CustomFields)) {
            data.CustomFields.forEach(category => {
                valuesToSet[`udf_${category.Id}`] = isNullOrEmpty(category.Value) ? '' : category.Value; 
            });
        }
        
        formik.setValues(valuesToSet);
    };

    const initialValues = {
        firstName: '',
        lastName: '',
        dateOfBirthString: '',
        gender: '',
        email: '',
        username: '',
        membershipNumber: '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        excludeAccountInformationFromPublicGroups: false,
        unsubscribeFromMarketingEmails: false,
        doNotAllowOtherPlayersToLinkMyProfile: false,
        unsubscribeFromMarketingPushNotifications: false,
    };

    const getValidationSchema = (profileData) => {
        let schemaFields = {
            firstName: Yup.string().required(t('profile.firstNameRequired')),
            lastName: Yup.string().required(t('profile.lastNameRequired')),
            username: Yup.string().required(t('profile.usernameRequired')),
            email: Yup.string().email(t('profile.emailInvalid')).required(t('profile.emailRequired')),
        };

        schemaFields.password = Yup.string().when('currentPassword', {
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
        
        schemaFields.confirmPassword = Yup.string()
            .oneOf([Yup.ref('password'), null], t('profile.confirmPasswordNotMatch'))
            .when('password', {
                is: (password) => {
                    return !isNullOrEmpty(password);
                },
                then: (schema) => schema.required(t('profile.confirmPasswordRequired')),
                otherwise: (schema) => schema.nullable(),
            });
        
        if (profileData){
            if (!toBoolean(profileData?.IsGenderDisabled) && toBoolean(profileData?.IncludeGender) && toBoolean(profileData?.IsGenderRequired)) {
                schemaFields.gender = Yup.string().required(t('profile.genderRequired'))
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
                schemaFields.phoneNumber = Yup.string().required(t('profile.phoneNumberRequired'));
            }

            if (toBoolean(profileData.DateOfBirth?.Include) && toBoolean(profileData.DateOfBirth?.IsRequired)){
                schemaFields.membershipNumber = Yup.string().required(t('profile.membershipNumberRequired'));
            }

            if (toBoolean(profileData.Membership?.Include) && toBoolean(profileData.Membership?.IsRequired)){
                schemaFields.membershipNumber = Yup.string().required(t('profile.membershipNumberRequired'));
            }

            if (toBoolean(profileData.DateOfBirth?.Include) && toBoolean(profileData.DateOfBirth?.IsRequired)){
                schemaFields.dateOfBirthString = Yup.string().required(t('date.dateOfBirthRequired'));
            }

            if (toBoolean(profileData.Address?.Include) && toBoolean(profileData.Address?.IsRequired)){
                schemaFields.address = Yup.string().required(t('profile.addressRequired'));
                schemaFields.city = Yup.string().required(t('profile.cityRequired'));
                schemaFields.state = Yup.string().required(t('profile.stateRequired'));
                schemaFields.zipCode = Yup.string().required(isNonUsCulture() ? t('profile.postalCodeRequired') : t('profile.zipCodeRequired'));
            }
            
            if (toBoolean(profileData.Address?.Include) && toBoolean(profileData.Address?.IsRequired)){
                schemaFields.dateOfBirthString = Yup.string().required(t('date.dateOfBirthRequired'));
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
            <FormInput label={t('profile.firstName')}
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='firstName'
            />
            <FormInput label={t('profile.lastName')}
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='lastName'
            />
            <FormInput label={t('profile.email')}
                       form={formik}
                       loading={isFetching}
                       required={!toBoolean(profileData?.EmailIsNotRequired)}
                       name='email'
            />
            <FormInput label={t('profile.username')}
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='username'
            />

            {!toBoolean(profileData?.IsGenderDisabled) && toBoolean(profileData?.IncludeGender) &&
                <FormSelect form={formik}
                            name={`gender`}
                            label={t('profile.gender')}
                            fetching={isFetching}
                            options={genderList}
                            required={toBoolean(profileData?.IsGenderRequired)}/>
            }

            <FormInput label={t('profile.currentPassword')}
                       form={formik}
                       loading={isFetching}
                       type={'password'}
                       name='currentPassword'
            />

            <FormInput label={t('profile.password')}
                       form={formik}
                       loading={isFetching}
                       required={toBoolean(!isNullOrEmpty(formik?.values?.currentPassword))}
                       type={'password'}
                       name='password'
            />
            <FormInput label={t('profile.confirmPassword')}
                       form={formik}
                       loading={isFetching}
                       required={toBoolean(!isNullOrEmpty(formik?.values?.currentPassword))}
                       type={'password'}
                       name='confirmPassword'
            />

            <FormRatingCategories ratingCategories={profileData?.RatingCategories} form={formik} loading={isFetching}/>
            
            {toBoolean(profileData?.PhoneNumber?.Include) &&
                <FormInput label={t('profile.phoneNumber')}
                           form={formik}
                           loading={isFetching}
                           required={toBoolean(profileData?.PhoneNumber?.IsRequired)}
                           name='phoneNumber'
                />
            }

            {toBoolean(profileData?.Membership?.Include) &&
                <FormInput label={t('profile.membershipNumber')}
                           form={formik}
                           loading={isFetching}
                           required={toBoolean(profileData?.Membership?.IsRequired)}
                           name='membershipNumber'
                />
            }

            {toBoolean(profileData?.DateOfBirth?.Include) &&
                <FormDateOfBirth label={t('profile.dateOfBirth')}
                                 form={formik}
                                 loading={isFetching}
                                 required={toBoolean(profileData?.DateOfBirth?.IsRequired)}
                                 displayAge={true}
                                 name='dateOfBirthString'
                />
            }

            {toBoolean(profileData?.Address?.Include) &&
                <>
                    <FormInput label={t('profile.address')}
                               form={formik}
                               loading={isFetching}
                               required={toBoolean(profileData?.Address?.IsRequired)}
                               name='address'
                    />
                    
                    <FormInput label={t('profile.city')}
                               form={formik}
                               loading={isFetching}
                               required={toBoolean(profileData?.Address?.IsRequired)}
                               name='city'
                    />

                    <FormStateProvince form={formik}
                                       loading={isFetching}
                                       dropdown={true}
                                       name={`state`}
                                       required={toBoolean(profileData?.Address?.IsRequired)}
                    />
                    
                    <FormInput label={isNonUsCulture() ? t('profile.postalCode') : t('profile.zipCode')}
                               form={formik}
                               loading={isFetching}
                               required={toBoolean(profileData?.Address?.IsRequired)}
                               name='zipCode'
                    />
                </>
            }

            <FormCustomFields customFields={profileData?.CustomFields} form={formik} loading={isFetching} />
            
            <FormSwitch label={t('profile.excludeAccountInformationFromPublicGroups')}
                        form={formik}
                        loading={isFetching}
                        rows={2}
                        name={'excludeAccountInformationFromPublicGroups'}/>

            <FormSwitch label={t('profile.unsubscribeFromMarketingEmails')}
                        form={formik}
                        loading={isFetching}
                        rows={2}
                        name={'unsubscribeFromMarketingEmails'}/>

            {toBoolean(authData?.UseOrganizedPlay) &&
                <FormSwitch label={t('profile.doNotAllowOtherPlayersToLinkMyProfile')}
                            form={formik}
                            loading={isFetching}
                            rows={2}
                            name={'doNotAllowOtherPlayersToLinkMyProfile'}/>
            }

            {toBoolean(authData?.IsUsingPushNotifications) &&
                <FormSwitch label={t('profile.unsubscribeFromMarketingPushNotifications')}
                            form={formik}
                            loading={isFetching}
                            rows={2}
                            name={'unsubscribeFromMarketingPushNotifications'}/>
            }
        </PaddingBlock>
    )
}

export default MyProfileDetails
