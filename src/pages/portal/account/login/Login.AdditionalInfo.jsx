import {useApp} from "@/context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import {Button, Checkbox, Flex, Skeleton, Typography} from 'antd';
import FormInput from "@/form/input/FormInput.jsx";

import {
    anyInList, equalString,
    isNullOrEmpty,
    nullToEmpty,
    toBoolean
} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import PageForm from "@/form/pageform/PageForm.jsx";
import apiService from "@/api/api.jsx";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {isCanadaCulture} from "@/utils/OrganizationUtils.jsx";
import {isNonUsCulture} from "@/utils/DateUtils.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import FormCustomFields from "@/form/formcustomfields/FormCustomFields.jsx";
import {genderList} from "@/utils/SelectUtils.jsx";
import FormDateOfBirth from "@/form/formdateofbirth/FormDateOfBirth.jsx";
import FormStateProvince from "@/form/formstateprovince/FormStateProvince.jsx";
import {requiredMessage} from "@/utils/TranslateUtils.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {validateRatingCategories, validateUdfs} from "@/utils/ValidationUtils.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import LoginCreateAccountReviewModal from "@portal/account/login/Login.CreateAccountReviewModal.jsx";
import JoinOrganizationReviewModal from "@portal/account/joinorganization/JoinOrganization.ReviewModal.jsx";

const {Paragraph, Link, Title} = Typography;

function LoginAdditionalInfo({mainFormik, onSignupSubmit, page = 'create-account'}) {
    const {setHeaderTitleKey} = useHeader();
    const {spGuideId, orgId} = useAuth();
    const {isLoading, setIsLoading, token, setIsFooterVisible, setFooterContent } = useApp();
    const [isFetching, setIsFetching] = useState(true);
    const [additionInfoData, setAdditionInfoData] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [skipReviewAndMemberships, setSkipReviewAndMemberships] = useState(false);
    const {t} = useTranslation('login');
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    onClick={formik.handleSubmit}>
                {t('additionalInfo.button.continue')}
            </Button>
        </FooterBlock>);
        setHeaderTitleKey('loginAdditionalInfo');
    }, [isFetching, isLoading]);

    const initialValues = {
        ...mainFormik.values,
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        dateOfBirthString: '',
        membershipNumber: '',
        gender: '',
        FamilyMembers: []
    };

    const getValidationSchema = (signupForm) => {
        let schemaFields = {
            firstName: Yup.string().required(t('common:requiredMessage', {label: t('additionalInfo.form.firstName')}) ),
            lastName: Yup.string().required(t('common:requiredMessage', {label: t('additionalInfo.form.lastName')})),
        };

        if (signupForm) {
            if (signupForm.IncludeAddressBlock && signupForm.IsAddressBlockRequired) {
                schemaFields.streetAddress = Yup.string().required(t('common:requiredMessage', {label: t('additionalInfo.form.streetAddress')}));
                schemaFields.city = Yup.string().required(t('common:requiredMessage', {label: t('additionalInfo.form.city')}));
                schemaFields.state = Yup.string().required(t('common:requiredMessage', {label: t(isCanadaCulture(signupForm.UiCulture) ? 'additionalInfo.form.province' : 'additionalInfo.form.state')}) );
                schemaFields.zipCode = Yup.string().required(t('common:requiredMessage', {label: t(isNonUsCulture(signupForm.UiCulture) ? 'additionalInfo.form.postalCode' : 'additionalInfo.form.zipCode')}));
            }
            if (signupForm.IncludePhoneNumberBlock && signupForm.IsPhoneNumberRequired) {
                schemaFields.phoneNumber = Yup.string().required(requiredMessage(t, 'additionalInfo.form.phoneNumber'));
            }
            if (signupForm.IncludeDateOfBirthBlock && signupForm.IsDateOfBirthRequired) {
                schemaFields.dateOfBirthString = Yup.string().required(requiredMessage(t, 'additionalInfo.form.dateOfBirth'));
            }
            if (signupForm.IncludeMembershipNumber && signupForm.IsMembershipNumberRequired) {
                schemaFields.membershipNumber = Yup.string().required(requiredMessage(t, 'additionalInfo.form.membershipNumber'));
            }
            if (signupForm.IncludeGender && signupForm.IsGenderRequired) {
                schemaFields.gender = Yup.string().required(requiredMessage(t, 'additionalInfo.form.gender'));
            }
        }

        return Yup.object(schemaFields);
    };

    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: getValidationSchema(additionInfoData),
        validation: () => {
            const isValidUdfs = validateUdfs(t, formik);
            const isValidRatingCategories = validateRatingCategories(t, formik);
            return isValidUdfs && isValidRatingCategories;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            
            if (skipReviewAndMemberships){
                setIsLoading(false);
                setShowReviewModal(true)
            } else {
                let postModel = values;
                postModel.customFields = values.Udfs;
                postModel.ratingCategories = values.RatingCategories;
                
                onSignupSubmit(postModel, additionInfoData);
                setIsLoading(false);
            }
        },
    });

    const loadData = async () => {
        setIsFetching(true);
        setIsLoading(true);

        const response = await apiService.get(`/api/create-account/signup-form?orgId=${nullToEmpty(mainFormik?.values?.selectedOrgId)}&isAddOrganization=${equalString(page, 'join-organization')}&spGuideId=${nullToEmpty(spGuideId)}&overrideOrgId=${nullToEmpty(orgId)}`);
        if (toBoolean(response?.IsValid)){
            const data = response.Data;
            setAdditionInfoData(data);
            let skipReviewAndMemberships = !toBoolean(data?.RequireMembershipOnSignUpForm) && !toBoolean(data?.RequireCardOnFile) && !toBoolean(data.IsDisclosuresRequired);
            setSkipReviewAndMemberships(skipReviewAndMemberships);

            let authMember = null;
            if (equalString(page, 'join-organization')) {
                let familyMembersResponse = await apiService.get(`/api/create-account/family-members?orgId=${orgId}`);

                if (toBoolean(familyMembersResponse?.IsValid)) {
                    const dbFamilyMembers = familyMembersResponse.Data.FamilyMembers;
                    if (anyInList(dbFamilyMembers)) {

                        dbFamilyMembers.forEach((member) => {
                            member.RatingCategories = data.RatingCategories || [];
                            member.Udfs = data.Udfs || [];
                        })
                        console.log(dbFamilyMembers);
                        
                        formik.setFieldValue('FamilyMembers', dbFamilyMembers);
                    }

                    authMember = familyMembersResponse.Data.AuthMember;
                }
            }
            
            formik.setValues({
                ...formik.values,
                firstName: authMember?.FirstName || '',
                lastName: authMember?.LastName || '',
                streetAddress: authMember?.Address || '',
                phoneNumber: authMember?.PhoneNumber || '',
                dateOfBirthString: '',
                membershipNumber: '',
                gender: authMember?.Gender || '',
                city: authMember?.City || '',
                state: authMember?.State || '',
                zipCode: authMember?.ZipCode || '',
                DateOfBirth: authMember?.DateOfBirth || '',
                
                skipReview: (!toBoolean(data?.RequireCardOnFile) && !toBoolean(data.IsDisclosuresRequired)),
                uiCulture: data.UiCulture || formik.values.uiCulture,
                requireCardOnFile: data.RequireCardOnFile,
                paymentTypes: data.PaymentTypes,
                disclosures: data.Disclosures,
                isDisclosuresRequired: !isNullOrEmpty(data.Disclosures) && toBoolean(data.IsDisclosuresRequired),
                paymentProvider: data.PaymentProvider || formik.values.paymentProvider,
                stripePublishableKey: data.StripePublishableKey || formik.values.stripePublishableKey,
                isUsingCollectJs: data.IsUsingCollectJs || formik.values.isUsingCollectJs,
                showStatesDropdown: toBoolean(data?.ShowStatesDropdown) || formik.values.showStatesDropdown,
                RatingCategories: data.RatingCategories || formik.values.RatingCategories,
                Udfs: data.UserDefinedFields || formik.values.Udfs
            });

            //formik validation
            getValidationSchema(data);
        }

        setIsFetching(false);
        setIsLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);
    
    return (
        <>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={16}>
                        {emptyArray(15).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block style={{height: `${token.Input.controlHeight}px`}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {(!isFetching && !isNullOrEmpty(additionInfoData)) &&
                <PaddingBlock topBottom={true}>
                    <PageForm formik={formik}>

                        {!isNullOrEmpty(additionInfoData?.InstructionText) &&
                            <>
                                
                            </>
                        }

                        <FormInput label={t(`additionalInfo.form.firstName`)}
                                   formik={formik}
                                   name='firstName'
                                   disabled={equalString(page, 'join-organization') && !isNullOrEmpty(formik.values.firstName)}
                                   placeholder={t(`additionalInfo.form.firstNamePlaceholder`)}
                                   required='true'
                        />
                        <FormInput label={t(`additionalInfo.form.lastName`)}
                                   formik={formik}
                                   name='lastName'
                                   disabled={equalString(page, 'join-organization') && !isNullOrEmpty(formik.values.lastName)}
                                   placeholder={t(`additionalInfo.form.lastNamePlaceholder`)}
                                   required='true'
                        />

                        {additionInfoData.IncludeGender &&
                            <FormSelect
                                formik={formik}
                                name='gender'
                                label={t(`additionalInfo.form.gender`)}
                                options={genderList}
                                required={additionInfoData.IsGenderRequired}
                            />
                        }

                        {additionInfoData.IncludePhoneNumberBlock &&
                            <FormInput label={t(`additionalInfo.form.phoneNumber`)}
                                       formik={formik}
                                       name='phoneNumber'
                                       required={additionInfoData.IsPhoneNumberRequired}
                            />
                        }

                        {additionInfoData.IncludeMembershipNumber &&
                            <FormInput label={t(`additionalInfo.form.membershipNumber`)}
                                       formik={formik}
                                       name='membershipNumber'
                                       required={additionInfoData.IsMembershipNumberRequired}
                            />
                        }

                        {additionInfoData.IncludeDateOfBirthBlock &&
                            <FormDateOfBirth label={t(`additionalInfo.form.dateOfBirth`)}
                                             formik={formik}
                                             uiCulture={additionInfoData.UiCulture}
                                             required={additionInfoData.IsDateOfBirthRequired}
                                             name='dateOfBirthString'
                            />
                        }

                        {additionInfoData.IncludeAddressBlock &&
                            <>
                                <FormInput label={t(`additionalInfo.form.streetAddress`)}
                                           formik={formik}
                                           name='streetAddress'
                                           required={additionInfoData.IsAddressBlockRequired}
                                />

                                <FormInput label={t(`additionalInfo.form.city`)}
                                           formik={formik}
                                           name='city'
                                           required={additionInfoData.IsAddressBlockRequired}
                                />

                                <Flex gap={token.padding}>
                                    <FormStateProvince formik={formik}
                                                       dropdown={toBoolean(additionInfoData?.ShowStatesDropdown)}
                                                       uiCulture={additionInfoData.UiCulture}
                                                       name={`state`}
                                                       required={additionInfoData.IsAddressBlockRequired}
                                    />

                                    <FormInput label={isNonUsCulture(additionInfoData.UiCulture) ? t(`additionalInfo.form.postalCode`) : t(`additionalInfo.form.zipCode`)}
                                               formik={formik}
                                               name='zipCode'
                                               required={additionInfoData.IsAddressBlockRequired}
                                    />
                                </Flex>
                            </>
                        }

                        <FormCustomFields customFields={formik?.values?.Udfs}
                                          formik={formik}
                                          name={`Udfs[{udfIndex}].Value`} />
                        
                        {anyInList(formik?.values?.RatingCategories) &&
                            <>
                                {formik.values.RatingCategories.map((ratingCategory, index) => {
                                    return (
                                        <FormSelect
                                            key={index}
                                            label={ratingCategory.Name}
                                            name={toBoolean(ratingCategory.AllowMultipleRatingValues) ? `RatingCategories[${index}].SelectedRatingsIds` : `RatingCategories[${index}].SelectedRatingId`}
                                            propText='Name'
                                            propValue={'Id'}
                                            multi={ratingCategory.AllowMultipleRatingValues}
                                            options={ratingCategory.Ratings}
                                            required={ratingCategory.IsRequired}
                                            formik={formik}
                                        />
                                    )
                                })}
                            </>
                        }
                    </PageForm>
                </PaddingBlock>
            }

            {equalString(page, 'create-account') &&
                <LoginCreateAccountReviewModal data={formik.values} show={showReviewModal} setShow={setShowReviewModal}/>
            }

            {equalString(page, 'join-organization') &&
                <JoinOrganizationReviewModal data={formik.values} show={showReviewModal} setShow={setShowReviewModal}/>
            }
        </>
    )
}

export default LoginAdditionalInfo
