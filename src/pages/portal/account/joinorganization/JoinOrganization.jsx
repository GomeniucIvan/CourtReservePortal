import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {Button, Carousel, Flex, Typography} from "antd";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import React, {useCallback, useEffect, useState} from "react";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {useFormik} from "formik";
import {logDebug} from "@/utils/ConsoleUtils.jsx";
import LoginSearchOrganization from "@portal/account/modules/Login.SearchOrganization.jsx";
import {useAntd} from "@/context/AntdProvider.jsx";
import LoginAdditionalInfo from "@portal/account/login/Login.AdditionalInfo.jsx";
import LoginMemberships from "@portal/account/modules/Login.Memberships.jsx";
import LoginMembershipDetails from "@portal/account/modules/Login.MembershipDetails.jsx";
import {getMembershipText} from "@/utils/TranslateUtils.jsx";
import LoginReview from "@portal/account/modules/Login.Review.jsx";
import LoginCreateAccountReviewModal from "@portal/account/login/Login.CreateAccountReviewModal.jsx";
import * as Yup from "yup";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import JoinOrganizationReviewModal from "@portal/account/joinorganization/JoinOrganization.ReviewModal.jsx";
import {getLastFromHistory} from "@/toolkit/HistoryStack.js";
import {authMember} from "@/storage/AppStorage.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
const {Title, Text, Paragraph, Link} = Typography;

function JoinOrganization() {
    let { orgId, spGuideId, setAuthorizationData, authData } = useAuth();
    const navigate = useNavigate();
    const {setHeaderRightIcons, setHeaderTitle, setOnBack, setHeaderTitleKey} = useHeader();
    const {setIsFooterVisible, setFooterContent, token} = useApp();
    const [navigationSteps, setNavigationSteps] = useState([]);
    const {setPrimaryColor, setPrimaryTextColor} = useAntd();
    const [signupData, setSignupData] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [initialBaseColor, setInitialBaseColor] = useState(token.colorPrimary);
    const [initialTextColor, setInitialTextColor] = useState(token.colorOrgText);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setHeaderTitleKey(isNullOrEmpty(spGuideId) ? 'loginOrganization' : 'loginLocation')
        setIsFooterVisible(false);
        setFooterContent('');
        setNavigationSteps((prevSteps) => {
            return [...prevSteps, 'organizations'];
        });
    }, []);
    
    const initialValues = {
        step: 'organizations',
        selectedMembership: {},
        selectedMembershipId: '',
        reviewModalTitle: '',
        selectedOrgId: '',
        selectedOrgName: '',
        selectedOrgFullAddress: '',
        secretKey: '',
        maskedEmail: '',

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
        disclosures: '',

        RatingCategories: [],
        Udfs: [],
    };

    
    const validationSchema = Yup.object({
       
    });
    
    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        }
    });

    useEffect(() => {
        if (equalString(formik?.values?.step, 'organizations')) {
            setPrimaryColor(initialBaseColor);
            setPrimaryTextColor(initialTextColor);
        }
    }, [formik?.values?.step])
    
    const navigateToStep = useCallback((step, isBack) => {
        logDebug(`navigateToStep ${step}`);

        if (isBack) {
            setNavigationSteps((prevSteps) => {
                const lastNavigationPage = prevSteps[prevSteps.length - 2];
                if (isNullOrEmpty(lastNavigationPage)){
                    const lastPath = getLastFromHistory();
                    if (lastPath) {
                        navigate(`${lastPath.path}`);
                    } else {
                        navigate(HomeRouteNames.INDEX);
                    }
                } else{
                    formik.setFieldValue('step', lastNavigationPage);
                }
                return prevSteps.slice(0, -1);
            });
        } else {
            setNavigationSteps((prevSteps) => {
                formik.setFieldValue('step', step);
                return [...prevSteps, step];
            });
        }
    }, []);

    useEffect(() => {
        setOnBack(() => () => {
            navigateToStep('', true);
        });

        // Cleanup: Reset `onBack` when the component unmounts
        return () => setOnBack(null);
    }, [setOnBack, navigateToStep]);

    const isMembershipDetailsLastStep = () => {
        let formikSelectedMembership = formik?.values?.selectedMembership;
        let membershipNotRequireReviewStep = (formikSelectedMembership && formikSelectedMembership.OneFreePaymentOption && !anyInList(formikSelectedMembership?.DisclosuresToSign));
        let isReviewNext = toBoolean(signupData?.IsDisclosuresRequired) || toBoolean(signupData?.RequireCardOnFile);
        return membershipNotRequireReviewStep && !isReviewNext;
    }
    
    return (
        <>
            {equalString(formik?.values?.step, 'organizations') &&
                <LoginSearchOrganization mainFormik={formik}
                                         onOrganizationSelect={(formValues) => {
                                             formik.setFieldValue('selectedOrgId', formValues.selectedOrgId);
                                             formik.setFieldValue('selectedOrgName', formValues.selectedOrgName);
                                             formik.setFieldValue('selectedOrgFullAddress', formValues.selectedOrgFullAddress);
                                             setPrimaryColor(formValues.BaseBackgroundColor);
                                             setPrimaryTextColor(formValues.BaseTextColor);

                                             navigateToStep('sign-up');
                                         }}

                />
            }

            {equalString(formik?.values?.step, 'sign-up') &&
                <LoginAdditionalInfo mainFormik={formik}
                                     page={'join-organization'}
                                     onSignupSubmit={(formValues, incSignData) => {
                                         formik.setValues({
                                             ...formik.values,
                                             skipReview: formValues.skipReview,
                                             disclosures: formValues.Disclosures,
                                             RatingCategories: formValues.RatingCategories,
                                             Udfs: formValues.Udfs,

                                             firstName: formValues.firstName,
                                             lastName: formValues.lastName,
                                             streetAddress: formValues.streetAddress,
                                             phoneNumber: formValues.phoneNumber,
                                             dateOfBirthString: formValues.dateOfBirthString,
                                             DateOfBirth: formValues.DateOfBirth,
                                             membershipNumber: formValues.membershipNumber,
                                             gender: formValues.gender,
                                             city: formValues.city,
                                             state: formValues.state,
                                             zipCode: formValues.zipCode
                                         });

                                         setSignupData(incSignData);

                                         let familyMembers = formik.FamilyMembers;
                                         if (anyInList(familyMembers)) {
                                             
                                         } else {
                                             let isMembershipNext = incSignData && (toBoolean(incSignData.RequireMembershipOnSignUpForm) || (toBoolean(incSignData.HasAnyMemberships) && !toBoolean(incSignData.IsOneMembershipAndIsDefault)));
                                             if (isMembershipNext) {
                                                 navigateToStep('memberships');
                                             } else if (toBoolean(signupForm?.IsDisclosuresRequired) || toBoolean(signupForm?.RequireCardOnFile)) {
                                                 navigateToStep('review');
                                             } else {
                                                 formik.setFieldValue('reviewModalTitle', `You are going to join organization. Review the information provided and confirm before join to ${formik?.values?.selectedOrgName}.`)
                                                 setShowReviewModal(true);
                                             }
                                         }
                                     }}
                />
            }

            {equalString(formik?.values?.step, 'memberships') &&
                <LoginMemberships mainFormik={formik}
                                  page={'join-organization'}
                                  onSkip={() =>{
                                      formik.setFieldValue('selectedMembership', {})
                                      formik.setFieldValue('selectedMembershipId', '')
                                      navigateToStep('review');
                                  }}
                                  onMembershipSelect={(costType) => {
                                      formik.setFieldValue('selectedMembership', costType)
                                      formik.setFieldValue('selectedMembershipId', costType.Id)
                                      navigateToStep('membership-details');
                                  }}
                />
            }

            {equalString(formik?.values?.step, 'membership-details') &&
                <LoginMembershipDetails
                    mainFormik={formik}
                    lastStep={isMembershipDetailsLastStep()}
                    onNext={(formikValues) => {
                        if (isMembershipDetailsLastStep()) {
                            formik.setFieldValue('reviewModalTitle', `You are going to join the <b>${getMembershipText(formik?.values?.selectedMembership?.Name)}</b>. Review the information provided and confirm.` )
                            setShowReviewModal(true);
                        } else {
                            navigateToStep('review');
                        }
                    }}
                />
            }

            {equalString(formik?.values?.step, 'review') &&
                <LoginReview mainFormik={formik} signupData={signupData} page={'join-organization'}/>
            }

            <JoinOrganizationReviewModal data={signupData} show={showReviewModal} setShow={setShowReviewModal}/>
        </>
    )
}

export default JoinOrganization
