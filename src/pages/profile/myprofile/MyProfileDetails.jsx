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
import {dateToString} from "../../../utils/DateUtils.jsx";
import FormCustomFields from "../../../form/formcustomfields/FormCustomFields.jsx";
import FormRatingCategories from "../../../form/formratingcategories/FormRatingCategories.jsx";
import {getRatingCategoriesList, getUserDefinedFieldsList} from "../../../utils/ListUtils.jsx";

function MyProfileDetails({selectedTab}) {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const {t} = useTranslation('');
    const [isFetching, setIsFetching] = useState(true);

    const {isMockData, setIsFooterVisible, setHeaderRightIcons, setFooterContent, isLoading, setIsLoading} = useApp();
    const {orgId} = useAuth();

    const loadData = () => {
        setIsFetching(true);

        appService.get(`/app/Online/MyProfile/MyProfile?id=${orgId}`).then(r => {
            if (toBoolean(r?.IsValid)) {
                setProfileData(r.Data);
                setFormikValues(r.Data)
                console.log(r.Data)
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
            hidePersonalInformation: data.HidePersonalInformation || false,
            UnsubscribeFromMarketingEmails: data.UnsubscribeFromMarketingEmails || false,
            unsubscribeFromPush: data.UnsubscribeFromMarketingPushNotifications || false,
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
        newPassword: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        hidePersonalInformation: false,
        UnsubscribeFromMarketingEmails: false,
        unsubscribeFromPush: false,
    };

    const getValidationSchema = (profileData) => {
        let schemaFields = {
            firstName: Yup.string().required(t('profile.firstNameRequired')),
            lastName: Yup.string().required(t('profile.lastNameRequired')),
            email: Yup.string().email(t('profile.emailInvalid')).required(t('profile.emailRequired')),
        };

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
            
            console.log(ratings)
            console.log(udfs)
            
            if (isMockData) {

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
                    Save
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
            <FormInput label="First Name"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='firstName'
            />
            <FormInput label="Last Name"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='lastName'
            />
            <FormInput label={t('profile.email')}
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='email'
            />
            <FormInput label="Username"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='username'
            />

            {!toBoolean(profileData?.IsGenderDisabled) && toBoolean(profileData?.IncludeGender) &&
                <FormSelect form={formik}
                            name={`gender`}
                            label={t('profile.gender')}
                            loading={isFetching}
                            options={genderList}
                            required={toBoolean(profileData?.IsGenderRequired)}/>
            }

            <FormInput label="Current password"
                       form={formik}
                       loading={isFetching}
                       type={'password'}
                       name='currentPassword'
            />

            <FormInput label="New password"
                       form={formik}
                       loading={isFetching}
                       type={'password'}
                       name='newPassword'
            />
            <FormInput label="Confirm password"
                       form={formik}
                       loading={isFetching}
                       type={'password'}
                       name='comfirmPassword'
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

                    <FormInput label={t('profile.zipCode')}
                               form={formik}
                               loading={isFetching}
                               required={toBoolean(profileData?.Address?.IsRequired)}
                               name='zipCode'
                    />
                </>
            }

            <FormCustomFields customFields={profileData?.CustomFields} form={formik} loading={isFetching} />
            
            <FormSwitch label={'Hide my Personal Information from my club/organization\'s public member directories'}
                        form={formik}
                        loading={isFetching}
                        rows={2}
                        name={'hidePersonalInformation'}/>

            <FormSwitch label={'Unsubscribe from my Club/Organization\'s Emails/Alerts/Newsletters'}
                        form={formik}
                        loading={isFetching}
                        rows={2}
                        name={'UnsubscribeFromMarketingEmails'}/>

            <FormSwitch label={'Unsubscribe From Organizations Marketing Push Notifications'}
                        form={formik}
                        loading={isFetching}
                        rows={2}
                        name={'unsubscribeFromPush'}/>

        </PaddingBlock>
    )
}

export default MyProfileDetails
