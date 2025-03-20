import {useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {Avatar, Button, Card, Flex, QRCode, Skeleton, Typography} from "antd";
import {
    AppstoreAddOutlined,
    DeleteOutlined,
    EditOutlined, InfoOutlined, PlusCircleOutlined,
    SettingOutlined
} from "@ant-design/icons";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/personal-data.json";
import {
    anyInList,
    equalString,
    fullNameInitials,
    isNullOrEmpty,
    oneListItem,
    toBoolean
} from "@/utils/Utils.jsx";
import {Ellipsis} from "antd-mobile";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import {removeTabStorage, selectedTabStorage, setTabStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import {useTranslation} from "react-i18next";
import {pNotify, pNotifyClose, pNotifyLoading} from "@/components/notification/PNotify.jsx";
import toast from "react-hot-toast";
import Modal from "@/components/modal/Modal.jsx";
import Barcode from "react-barcode";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import {AccountRouteNames} from "@/routes/AccountRoutes.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {eReplace} from "@/utils/TranslateUtils.jsx";
import {isNonUsCulture, toReactDate} from "@/utils/DateUtils.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {setFormikError, validatePersonalInformation} from "@/utils/ValidationUtils.jsx";
import * as Yup from "yup";
import ReCAPTCHA from "react-google-recaptcha";
import {getWebConfigValue} from "@/config/WebConfig.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import ImageUploader from "@/components/imageuploader/ImageUploader.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import {genderList, memberRoles} from "@/utils/SelectUtils.jsx";
import FormRatingCategories from "@/form/formratingcategories/FormRatingCategories.jsx";
import FormDateOfBirth from "@/form/formdateofbirth/FormDateOfBirth.jsx";
import FormStateProvince from "@/form/formstateprovince/FormStateProvince.jsx";
import FormCustomFields from "@/form/formcustomfields/FormCustomFields.jsx";
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";
import {getLastFromHistoryPath, removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";

const {Text} = Typography;

function ProfileAddFamilyMember() {
    const navigate = useNavigate();
    const {setHeaderRightIcons} = useHeader();
    const recaptchaRef = useRef(null);
    
    const {
        setIsFooterVisible,
        setFooterContent,
        shouldFetch,
        resetFetch,
        isMockData,
        globalStyles,
        token,
        isLoading,
        setIsLoading
    } = useApp();
    
    const {orgId, authData} = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const {t} = useTranslation('');

    //merge with myPaymentProfileDetails
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

            if (isNullOrEmpty(formik.values.FirstName)) {
                setFormikError(t, 'FamilyMemberType', '', 'Family Role is required.' );
                isValidForm = false;
            }
            
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
            postModel.FamilyMemberType = values.FamilyMemberType;
            postModel.DateOfBirthString = values.DateOfBirthString;
            postModel.MembershipNumber = values.MembershipNumber;
            postModel.PhoneNumber = values.PhoneNumber;
            postModel.Address = values.Address;
            postModel.City = values.City;
            postModel.State = values.State;
            postModel.ZipCode = values.ZipCode;
            postModel.ExcludeAccountInformationFromPublicGroups = values.ExcludeAccountInformationFromPublicGroups;
            postModel.UnsubscribeFromMarketingEmails = values.UnsubscribeFromMarketingEmails;
            postModel.DoNotAllowOtherPlayersToLinkMyProfile = values.DoNotAllowOtherPlayersToLinkMyProfile;
            postModel.UnsubscribeFromMarketingPushNotifications = values.UnsubscribeFromMarketingPushNotifications;
            postModel.RatingCategories = values.RatingCategories;
            postModel.CustomFields = values.CustomFields;

            postModel.Token = await recaptchaRef.current.executeAsync();

            let response = await appService.post(`/app/Online/MyFamily/AddFamilyMember?id=${orgId}`, postModel);
            if (toBoolean(response?.IsValid)) {
                if (!isNullOrEmpty(response?.Message)) {
                    pNotify(isNullOrEmpty(response?.Message));
                } else {
                    pNotify('Member successfully added.');
                }
                
                if (!isNullOrEmpty(response?.Path)) {
                    removeLastHistoryEntry();
                    navigate(response?.Path);
                } else {
                    navigate(getLastFromHistoryPath());
                }
               
                setIsLoading(false);
            } else {
                pNotify(response.Message, 'error')
                setIsLoading(false);
            }
        },
    });
    
    const setFormikValues = (data) => {
        let valuesToSet = {
            FirstName: data.FirstName || '',
            LastName: data.LastName || '',
            DateOfBirthString:  toReactDate(data.DateOfBirth?.DateOfBirth),
            Gender: data.Gender || '',
            Email: data.Email || '',
            FamilyMemberType: data.FamilyMemberType || '',
            Username: data.Username || '',
            MembershipNumber: data.Membership?.MembershipNumber || '',
            PhoneNumber: data.PhoneNumber?.PhoneNumber || '',
            Address: data.Address?.Address || '',
            City: data.Address?.City || '',
            State: data.Address?.State || '',
            ZipCode: data.Address?.ZipCode || '',
            //ExcludeAccountInformationFromPublicGroups: data.ExcludeAccountInformationFromPublicGroups || false,
            //UnsubscribeFromMarketingEmails: data.UnsubscribeFromMarketingEmails || false,
            DoNotAllowOtherPlayersToLinkMyProfile: data.DoNotAllowOtherPlayersToLinkMyProfile || false,
            //UnsubscribeFromMarketingPushNotifications: data.UnsubscribeFromMarketingPushNotifications || false,
            CustomFields: data.CustomFields || [],
            RatingCategories: data.RatingCategories || [],
        };

        formik.setValues(valuesToSet);
    };
    
    const loadData = async () => {
        setIsFetching(true);

        let response = await appService.get(navigate, `/app/Online/MyFamily/AddFamilyMember?id=${orgId}`);

        if (toBoolean(response?.IsValid)) {
            setProfileData(response.Data);
            setFormikValues(response.Data)
        }
        setIsFetching(false);
        setIsLoading(false);
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                {t('profile.family.addNewFamilyMember')}
            </Button>
        </FooterBlock>);
    }, [isFetching, isLoading]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')

        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block>
                Add Family Member
            </Button>
        </FooterBlock>)

        loadData();
    }, []);
    
    return (
        <>
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

                        <FormSelect formik={formik}
                                    name={`FamilyMemberType`}
                                    label={'Family Role'}
                                    fetching={isFetching}
                                    options={memberRoles}
                                    required={true}/>
                        
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

                        <FormRatingCategories ratingCategories={profileData?.RatingCategories}
                                              formik={formik} 
                                              loading={isFetching}
                                              name={'RatingCategories[{ratingIndex}].{keyValue}'} />

                        {toBoolean(profileData?.IncludePhoneNumberBlock) &&
                            <FormInput label={t('profile.phoneNumber')}
                                       formik={formik}
                                       loading={isFetching}
                                       required={toBoolean(profileData?.IsPhoneNumberRequired)}
                                       name='PhoneNumber'
                            />
                        }

                        {toBoolean(profileData?.IncludeMembershipNumber) &&
                            <FormInput label={t('profile.membershipNumber')}
                                       formik={formik}
                                       loading={isFetching}
                                       required={toBoolean(profileData?.IsMembershipNumberRequired)}
                                       name='MembershipNumber'
                            />
                        }

                        {toBoolean(profileData?.IncludeDateOfBirthBlock) &&
                            <FormDateOfBirth label={t('profile.dateOfBirth')}
                                             formik={formik}
                                             loading={isFetching}
                                             required={toBoolean(profileData?.IsDateOfBirthRequired)}
                                             displayAge={true}
                                             name='DateOfBirthString'
                            />
                        }

                        {toBoolean(profileData?.IncludeAddressBlock) &&
                            <>
                                <FormInput label={t('profile.address')}
                                           formik={formik}
                                           loading={isFetching}
                                           required={toBoolean(profileData?.IsAddressRequired)}
                                           name='Address'
                                />

                                <FormInput label={t('profile.city')}
                                           formik={formik}
                                           loading={isFetching}
                                           required={toBoolean(profileData?.IsAddressRequired)}
                                           name='City'
                                />

                                <FormStateProvince formik={formik}
                                                   loading={isFetching}
                                                   dropdown={true}
                                                   name={`State`}
                                                   required={toBoolean(profileData?.IsStateRequired)}
                                />

                                <FormInput label={isNonUsCulture() ? t('profile.postalCode') : t('profile.zipCode')}
                                           formik={formik}
                                           loading={isFetching}
                                           required={toBoolean(profileData?.IsAddressRequired)}
                                           name='ZipCode'
                                />
                            </>
                        }

                        <FormCustomFields customFields={profileData?.CustomFields} formik={formik} loading={isFetching} name={`CustomFields[{udfIndex}].Value`} />

                        {toBoolean(authData?.UseOrganizedPlay) &&
                            <FormSwitch label={t('profile.doNotAllowOtherPlayersToLinkMyProfile')}
                                        formik={formik}
                                        loading={isFetching}
                                        rows={2}
                                        name={'DoNotAllowOtherPlayersToLinkMyProfile'}/>
                        }

                    </>)}
                </Flex>
                <ReCAPTCHA
                    ref={recaptchaRef}
                    size="invisible"
                    sitekey={getWebConfigValue('GoogleCaptchaKey_V3')}
                />
            </PaddingBlock>
        </>
    )
}

export default ProfileAddFamilyMember
