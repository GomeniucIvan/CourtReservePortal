import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {useTranslation} from "react-i18next";
import LoginCourtReserve from "@portal/account/login/Login.PageCourtReserve.jsx";
import LoginSpGuide from "@portal/account/login/Login.PageSpGuide.jsx";
import LoginAuthorize from "@portal/account/login/Login.Authorize.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import LoginCreateAccount from "@portal/account/login/Login.CreateAccount.jsx";
import LoginGetStarted from "@portal/account/login/Login.GetStarted.jsx";
import LoginForgotPassword from "@portal/account/login/Login.ForgotPassword.jsx";
import {getMembershipText} from "@/utils/TranslateUtils.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import LoginMemberships from "@portal/account/modules/Login.Memberships.jsx";
import LoginSearchOrganization from "@portal/account/modules/Login.SearchOrganization.jsx";
import LoginVerificationCode from "@portal/account/modules/Login.VerificationCode.jsx";
import LoginUpdatePassword from "@portal/account/modules/Login.UpdatePassword.jsx";
import LoginReview from "@portal/account/modules/Login.Review.jsx";
import LoginAdditionalInfo from "@portal/account/login/Login.AdditionalInfo.jsx";
import LoginRequestCode from "@portal/account/modules/Login.RequestCode.jsx";
import LoginCreateAccountReviewModal from "@portal/account/modules/Login.CreateAccountReviewModal.jsx";

function Login() {
    const navigate = useNavigate();
    const {logout, spGuideId} = useAuth();
    const [isFromGetStarted, setIsFromGetStarted] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const location = useLocation();
    const {t} = useTranslation('login');

    useEffect(() => {
        if (equalString(location.pathname, AuthRouteNames.LOGIN)) {
            //should clear organization data on logout
            logout();
        }
    }, [location]);

    const initialValues = {
        step: 'initial',
        email: '',
        password: '',
        confirmPassword: '',
        selectedMembership: {},
        selectedMembershipId: '',
        reviewModalTitle: '',
        selectedOrgId: '',
        selectedOrgName: '',
        selectedOrgFullAddress: '',
        secretKey: '',
        maskedEmail: '',

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

        RatingCategories: [],
        Udfs: [],
    };

    const validationSchema = Yup.object({
        email: Yup.string().required(t('common:requiredMessage', {label: t('authorize.form.email')})),
        password: Yup.string().required(t('common:requiredMessage', {label: t('authorize.form.password')})),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        }
    });

    const navigateToStep = (step, isBack) => {
        if (isBack) {

        } else{
            formik.setFieldValue('step', step);
        }
    }

    return (
        <>
            {equalString(formik?.values?.step, 'initial') &&
                <>
                    {!isNullOrEmpty(spGuideId) &&
                        <LoginCourtReserve onGetStartedClick={() => {setIsFromGetStarted(true); navigateToStep('get-started'); }}
                                           onLoginClick={() => {setIsFromGetStarted(false); navigateToStep('authorize') }} />
                    }

                    {isNullOrEmpty(spGuideId) &&
                        <LoginSpGuide onGetStartedClick={() => {setIsFromGetStarted(true);  navigateToStep('get-started') }}
                                      onLoginClick={() => { setIsFromGetStarted(false);navigateToStep('authorize') }} />
                    }
                </>
            }

            {equalString(formik?.values?.step, 'authorize') &&
                <LoginAuthorize mainFormik={formik}
                                isFromGetStarted={isFromGetStarted}
                                onRequestACode={(formValues) => {
                                    formik.setFieldValue('email', formValues?.email);
                                    navigateToStep('request-code')
                                }}
                />
            }

            {equalString(formik?.values?.step, 'get-started') &&
                <LoginGetStarted mainFormik={formik}
                                 onNewEmail={(formValues) => {
                                     formik.setFieldValue('email', formValues.email);
                                     navigateToStep('create-account')
                                 }}
                                 onEmailExists={(formValues) => {
                                     formik.setFieldValue('email', formValues.email);
                                     navigateToStep('authorize')
                                 }}
                />
            }

            {equalString(formik?.values?.step, 'create-account') &&
                <LoginCreateAccount mainFormik={formik}
                                    onCreateSubmit={(accValues) => {
                                        formik.setFieldValue('password', accValues.password);
                                        formik.setFieldValue('confirmPassword', accValues.confirmPassword);
                                        navigateToStep('login-organization')  }}

                />
            }

            {equalString(formik?.values?.step, 'request-code') &&
                <LoginRequestCode mainFormik={formik}
                                  onSkip={() =>{navigateToStep('review')}}
                                  onRequestCodeResult={(accValues) => {
                                      formik.setFieldValue('secretKey', accValues.SecretKey);
                                      formik.setFieldValue('maskedEmail', accValues.EmailMasked);
                                      navigateToStep('verification-code')  }}

                />
            }



            {equalString(formik?.values?.step, 'organizations') &&
                <LoginSearchOrganization mainFormik={formik}
                                         onOrganizationSelect={(formValues) => {
                                             formik.setFieldValue('selectedOrgId', formValues.selectedOrgId);
                                             formik.setFieldValue('selectedOrgName', formValues.selectedOrgName);
                                             formik.setFieldValue('selectedOrgFullAddress', formValues.selectedOrgFullAddress);
                                             navigateToStep('sign-up');
                                         }}

                />
            }

            {equalString(formik?.values?.step, 'memberships') &&
                <LoginMemberships mainFormik={formik}
                                  onSkip={() =>{
                                      navigateToStep('review')
                                  }}
                                  onMembershipSelect={(costType) => {
                                      if (costType && costType.OneFreePaymentOption) {
                                          formik.setFieldValue('selectedMembershipId', costType.CostTypeId)
                                          formik.setFieldValue('reviewModalTitle', `You are going to join the <b>${getMembershipText(costType?.Name)}</b> and create an account. Review the information provided and confirm before creating your account.` )
                                          setShowReviewModal(true);
                                      } else {
                                          navigateToStep('review');
                                      }
                                  }}
                />
            }

            {equalString(formik?.values?.step, 'signup') &&
                <LoginAdditionalInfo mainFormik={formik}
                                     onSignupSubmit={(formValues) => {
                                         formik.setValues({
                                             ...formik.values,
                                             skipReview: formValues.skipReview,
                                             uiCulture: formValues.uiCulture,
                                             requireCardOnFile: formValues.RequireCardOnFile,
                                             paymentTypes: formValues.PaymentTypes,
                                             disclosures: formValues.Disclosures,
                                             isDisclosuresRequired: formValues.IsDisclosuresRequired,
                                             paymentProvider: formValues.paymentProvider,
                                             stripePublishableKey: formValues.stripePublishableKey,
                                             isUsingCollectJs: formValues.isUsingCollectJs,
                                             showStatesDropdown: formValues.showStatesDropdown,
                                             RatingCategories: formValues.RatingCategories,
                                             Udfs: formValues.Udfs,
                                             formIncludes: {
                                                 IncludePhoneNumber: toBoolean(formValues.IncludePhoneNumber),
                                                 IncludeGender: toBoolean(formValues.IncludeGender),
                                                 IncludeAddressBlock: toBoolean(formValues.IncludeAddressBlock),
                                                 IncludeMembershipNumber: toBoolean(formValues.IncludeMembershipNumber),
                                                 IncludeDateOfBirthBlock: toBoolean(formValues.IncludeDateOfBirthBlock),
                                             }
                                         });

                                         navigateToStep('memberships');
                                     }}

                />
            }

            {equalString(formik?.values?.step, 'review') &&
                <LoginReview mainFormik={formik} />
            }

            {equalString(formik?.values?.step, 'verification-code') &&
                <LoginVerificationCode mainFormik={formik}
                                       onPasswordVerify={(formValues) => {
                                           formik.setFieldValue('ssoKey', formValues.ssoKey);
                                           formik.setFieldValue('secretKey', formValues.secretKey);
                                           formik.setFieldValue('maskedEmail', formValues.maskedEmail);
                                           navigateToStep('update-password')
                                       }}/>
            }

            {equalString(formik?.values?.step, 'update-password') &&
                <LoginUpdatePassword mainFormik={formik}
                                     onSkipPasswordUpdate={() => {
                                         navigate(HomeRouteNames.INDEX);
                                     }}/>
            }

            <LoginCreateAccountReviewModal formik={formik} show={showReviewModal} setShow={setShowReviewModal}/>
        </>
    )
}

export default Login
