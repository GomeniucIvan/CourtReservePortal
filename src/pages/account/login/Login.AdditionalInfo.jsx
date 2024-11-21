import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import {Button, Flex, Skeleton, Typography} from 'antd';
import FormInput from "../../../form/input/FormInput.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";

import {
    anyInList,
    isNullOrEmpty,
    nullToEmpty,
    randomNumber,
    toBoolean
} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import PageForm from "../../../form/pageform/PageForm.jsx";
import apiService from "../../../api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {isCanadaCulture} from "../../../utils/OrganizationUtils.jsx";
import {isNonUsCulture} from "../../../utils/DateUtils.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import FormCustomFields from "../../../form/formcustomfields/FormCustomFields.jsx";
import {genderList} from "../../../utils/SelectUtils.jsx";
import FormDateOfBirth from "../../../form/formdateofbirth/FormDateOfBirth.jsx";
import FormStateProvince from "../../../form/formstateprovince/FormStateProvince.jsx";
import LoginCreateAccountReviewModal from "./Login.CreateAccountReviewModal.jsx";
import {requiredMessage} from "../../../utils/TranslateUtils.jsx";
import useCustomFormik from "../../../components/formik/CustomFormik.jsx";

const {Paragraph, Link, Title} = Typography;

function LoginAdditionalInfo() {
    const {setFormikData, formikData, isLoading, setIsLoading, token, setIsFooterVisible, setFooterContent} = useApp();
    const [isFetching, setIsFetching] = useState(true);
    const [additionInfoData, setAdditionInfoData] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [skipReviewAndMemberships, setSkipReviewAndMemberships] = useState(false);
    const {t} = useTranslation('login');
    const navigate = useNavigate();

    const email = formikData?.email;
    const password = formikData?.password;
    const confirmPassword = formikData?.confirmPassword;
    const selectedOrgId = formikData?.selectedOrgId;
    const selectedOrgName = formikData?.selectedOrgName;
    const selectedOrgFullAddress = formikData?.selectedOrgFullAddress;
    const spGuideId = formikData?.spGuideId;

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    onClick={formik.handleSubmit}>
                {t('additionalInfo.button.continue')}
            </Button>
        </PaddingBlock>);
    }, [isFetching, isLoading]);

    const initialValues = {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        selectedOrgId: selectedOrgId,
        selectedOrgName: selectedOrgName,
        selectedOrgFullAddress: selectedOrgFullAddress,
        spGuideId: spGuideId,
        uiCulture: '',
        stripePublishableKey: '',
        isUsingCollectJs: '',
        showStatesDropdown: '',

        firstName: '',
        lastName: '',
        streetAddress: '',
        phoneNumber: '',
        dateOfBirthString: '',
        DateOfBirth: null, //(IV) uppercase first
        membershipNumber: '',
        gender: '',
        city: '',
        state: '',
        zipCode: '',
        paymentProvider: null,
        requireCardOnFile: false,
        isDisclosuresRequired: false,
        disclosures: '',
        formIncludes: {},
        paymentTypes: [],

        ratingCategories: [],
        userDefinedFields: [],
    };

    useEffect(() => {
        if (isNullOrEmpty(email) ||
            isNullOrEmpty(password) ||
            isNullOrEmpty(confirmPassword) ||
            isNullOrEmpty(selectedOrgId)){
            navigate(AuthRouteNames.LOGIN);
        }
    }, []);

    const getValidationSchema = (signupForm) => {
        let schemaFields = {
            firstName: Yup.string().required(requiredMessage(t, 'additionalInfo.form.firstName')),
            lastName: Yup.string().required(requiredMessage(t, 'additionalInfo.form.lastName')),
            email: Yup.string().required(requiredMessage(t, 'getStarted.form.email')),
            password: Yup.string().required(requiredMessage(t, 'createAccount.form.password'))
                .min(6, t(`createAccount.form.passwordMinLength`)),
            confirmPassword: Yup.string().required(requiredMessage(t, 'createAccount.form.confirmPassword'))
                .oneOf([Yup.ref('password'), null], t(`createAccount.form.passwordMatch`)),
            selectedOrgId:  Yup.string().required('Organization is required.')
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
            
            // Add validation for rating categories
            if (signupForm.RatingCategories) {
                signupForm.RatingCategories.forEach((category, index) => {
                    if (category.IsRequired) {
                        if (category.AllowMultipleRatingValues) {
                            schemaFields[`ratingCategories[${index}].SelectedRatingsIds`] = Yup.array().min(1, requiredMessage(t, category.Name)).required(requiredMessage(t, category.Name))
                        } else {
                            schemaFields[`ratingCategories[${index}].SelectedRatingId`] = Yup.string().required(requiredMessage(t, category.Name));
                        }
                    }
                });
            }

            if (signupForm.UserDefinedFields) {
                signupForm.UserDefinedFields.forEach((udf, index) => {
                    if (udf.IsRequired) {
                        schemaFields[`userDefinedFields[${index}].Value`] = Yup.string().required(requiredMessage(t, udf.Label));
                    }
                });
            }
        }

        return Yup.object(schemaFields);
    };

    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: getValidationSchema(additionInfoData),
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            
            if (skipReviewAndMemberships){
                setIsLoading(false);
                setShowReviewModal(true)
            } else {
                setIsLoading(false);
                setFormikData(values);
                navigate(AuthRouteNames.LOGIN_MEMBERSHIP);
            }
        },
    });

    const loadData = async () => {
        setIsFetching(true);
        setIsLoading(true);

        const response = await apiService.get(`/api/create-account/signup-form?orgId=${nullToEmpty(formik?.values?.selectedOrgId)}&spGuideId=${nullToEmpty(formik?.values?.spGuideId)}`);
        if (toBoolean(response?.IsValid)){
            const data = response.Data;
            setAdditionInfoData(data);
            let skipReviewAndMemberships = !toBoolean(data?.RequireMembershipOnSignUpForm) && !toBoolean(data?.RequireCardOnFile) && !toBoolean(data.IsDisclosuresRequired);
            setSkipReviewAndMemberships(skipReviewAndMemberships);
            
            formik.setValues({
                ...formik.values,
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
                ratingCategories: data.RatingCategories || formik.values.ratingCategories,
                userDefinedFields: data.UserDefinedFields || formik.values.userDefinedFields,
                formIncludes: {
                    IncludePhoneNumber: toBoolean(data.PhoneNumber?.IncludePhoneNumber),
                    IncludeGender: toBoolean(data.MemberGender?.IncludeGender),
                    IncludeAddressBlock: toBoolean(data.Address?.IncludeAddressBlock),
                    IncludeMembershipNumber: toBoolean(data.Membership?.IncludeMembershipNumber),
                    IncludeDateOfBirthBlock: toBoolean(data.DateOfBirth?.IncludeDateOfBirthBlock),
                }
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

                    <PageForm
                        formik={formik}>
                        <FormInput label={t(`additionalInfo.form.firstName`)}
                                   form={formik}
                                   name='firstName'
                                   placeholder={t(`additionalInfo.form.firstNamePlaceholder`)}
                                   required='true'
                        />
                        <FormInput label={t(`additionalInfo.form.lastName`)}
                                   form={formik}
                                   name='lastName'
                                   placeholder={t(`additionalInfo.form.lastNamePlaceholder`)}
                                   required='true'
                        />

                        {additionInfoData.IncludeGender &&
                            <FormSelect
                                form={formik}
                                name='gender'
                                label={t(`additionalInfo.form.gender`)}
                                options={genderList}
                                required={additionInfoData.IsGenderRequired}
                            />
                        }

                        {additionInfoData.IncludePhoneNumberBlock &&
                            <FormInput label={t(`additionalInfo.form.phoneNumber`)}
                                       form={formik}
                                       name='phoneNumber'
                                       required={additionInfoData.IsPhoneNumberRequired}
                            />
                        }

                        {additionInfoData.IncludeMembershipNumber &&
                            <FormInput label={t(`additionalInfo.form.membershipNumber`)}
                                       form={formik}
                                       name='membershipNumber'
                                       required={additionInfoData.IsMembershipNumberRequired}
                            />
                        }

                        {additionInfoData.IncludeDateOfBirthBlock &&
                            <FormDateOfBirth label={t(`additionalInfo.form.dateOfBirth`)}
                                             form={formik}
                                             uiCulture={additionInfoData.UiCulture}
                                             required={additionInfoData.IsDateOfBirthRequired}
                                             name='dateOfBirthString'
                            />
                        }

                        {additionInfoData.IncludeAddressBlock &&
                            <>
                                <FormInput label={t(`additionalInfo.form.streetAddress`)}
                                           form={formik}
                                           name='streetAddress'
                                           required={additionInfoData.IsAddressBlockRequired}
                                />

                                <FormInput label={t(`additionalInfo.form.city`)}
                                           form={formik}
                                           name='city'
                                           required={additionInfoData.IsAddressBlockRequired}
                                />

                                <Flex gap={token.padding}>
                                    <FormStateProvince form={formik}
                                                       dropdown={toBoolean(additionInfoData?.ShowStatesDropdown)}
                                                       uiCulture={additionInfoData.UiCulture}
                                                       nameKey={`state`}
                                                       required={additionInfoData.IsAddressBlockRequired}
                                    />

                                    <FormInput label={isNonUsCulture(additionInfoData.UiCulture) ? t(`additionalInfo.form.postalCode`) : t(`additionalInfo.form.zipCode`)}
                                               form={formik}
                                               name='zipCode'
                                               required={additionInfoData.IsAddressBlockRequired}
                                    />
                                </Flex>
                            </>
                        }

                        <FormCustomFields customFields={formik?.values?.userDefinedFields}
                                          form={formik}
                                          name={`userDefinedFields[{udfIndex}].Value`} />
                        
                        {anyInList(formik?.values?.ratingCategories) &&
                            <>
                                {formik.values.ratingCategories.map((ratingCategory, index) => {
                                    return (
                                        <FormSelect
                                            key={index}
                                            label={ratingCategory.Name}
                                            name={toBoolean(ratingCategory.AllowMultipleRatingValues) ? `ratingCategories[${index}].SelectedRatingsIds` : `ratingCategories[${index}].SelectedRatingId`}
                                            propText='Name'
                                            propValue={'Id'}
                                            multi={ratingCategory.AllowMultipleRatingValues}
                                            options={ratingCategory.Ratings}
                                            required={ratingCategory.IsRequired}
                                            form={formik}
                                        />
                                    )
                                })}
                            </>
                        }
                    </PageForm>
                </PaddingBlock>
            }
            
            <LoginCreateAccountReviewModal formik={formik} show={showReviewModal} setShow={setShowReviewModal}/>
        </>
    )
}

export default LoginAdditionalInfo
