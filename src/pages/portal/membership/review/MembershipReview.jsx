import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import * as React from "react";
import {
    anyInList,
    equalString,
    isNullOrEmpty,
    moreThanOneInList,
    notValidScroll,
    oneListItem,
    toBoolean
} from "@/utils/Utils.jsx";
import {useEffect, useRef, useState} from "react";
import apiService from "@/api/api.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {Button, Divider, Flex, Skeleton, Typography} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {parseSafeInt, randomNumber} from "@/utils/NumberUtils.jsx";
import MembershipDetailedDetails from "@/components/modules/membership/MembershipDetailedDetails.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import FormPaymentProfile from "@/form/formpaymentprofile/FormPaymentProfile.jsx";
import MembershipReceiptBlock from "@/components/receiptblock/MembershipReceiptBlock.jsx";
import FormDisclosures from "@/form/formdisclosures/FormDisclosures.jsx";
import MembershipPurchaseReview from "@/components/modules/membership/MembershipPurchaseReview.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import {orgCardCountryCode} from "@/utils/OrganizationUtils.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {setFormikErrorN, validateDisclosures, validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import {
    membershipRequirePayment
} from "@/utils/CostUtils.jsx";
import {useTranslation} from "react-i18next";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import appService from "@/api/app.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";

const {Title, Text} = Typography;

function MembershipReview() {
    const navigate = useNavigate();
    const {setIsLoading, token, setIsFooterVisible, setFooterContent,isLoading } = useApp();
    const {orgId, authData} = useAuth();
    const {setHeaderRightIcons} = useHeader();
    const [isFetching, setIsFetching] = useState(true);
    const [selectedMembership, setSelectedMembership] = useState(null);
    const [signupData, setSignupData] = useState(null);
    const [selectedMembershipRequirePayment, setSelectedMembershipRequirePayment] = useState(false);
    const paymentProfileRef = useRef(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const membershipId = queryParams.get("membershipId");
    const [showReceipt, setShowReceipt] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const { t } = useTranslation('login');
    const [paymentInfoData, setPaymentInfoData] = useState(null);
    
    const initialValues = {
        ...CardConstants,
        card_country: orgCardCountryCode(authData?.UiCulture),
        paymentFrequency: '',
        disclosureAgree: false,
        hiddenFortisTokenId: '',
        disclosures: [],
        firstName: authData?.MemberFirstName,
        lastName: authData?.MemberLastName,
        PaymentProfileId: ''
    };

    const formik = useCustomFormik({
        initialValues: initialValues,
        validation: () => {
            let isValidFormik = true;
            //first validation always when use disclosure
            let isValidDisclosures = validateDisclosures(t, formik, signupData);

            //card details
            let formikPaymentFrequency = formik?.values?.paymentFrequency;
            const isMembershipRequirePayment = (membershipRequirePayment(selectedMembership, formikPaymentFrequency) || toBoolean(signupData?.RequireCardOnFile));
            let isValidPaymentProfile = true;

            if (equalString(formik?.values?.PaymentProfileId, 1)) {
                isValidPaymentProfile = validatePaymentProfile(t, formik, isMembershipRequirePayment, paymentInfoData)
            }
            
            if (moreThanOneInList(selectedMembership?.Prices) && isNullOrEmpty(formik?.values?.paymentFrequency)) {
                setFormikErrorN(formik, 'paymentFrequency', 'Pricing Option is required.');
                isValidFormik = false;
            }
            
            return isValidPaymentProfile && isValidDisclosures && isValidFormik;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            let isNewCard = (isNullOrEmpty(values?.PaymentProfileId)) || equalString(values?.PaymentProfileId, 0);
            let paymentProfileId = isNewCard ? 1 : values?.PaymentProfileId;
            
            if (equalString(paymentProfileId, 1)) {
                if (paymentProfileRef.current) {
                    let isValidTokenObj = await paymentProfileRef.current.submitCreateToken();
                    if (!isValidTokenObj.isValid) {
                        setIsLoading(false);
                        displayMessageModal({
                            title: 'Error',
                            html: (onClose) => `${isValidTokenObj?.errorMessage}`,
                            type: "error",
                            buttonType: modalButtonType.DEFAULT_CLOSE,
                            onClose: () => {
                                notValidScroll();
                            },
                        })
                        return;
                    }
                }
            }
            
            let postModel = {
                MembershipId: membershipId,
                PaymentFrequency: values.paymentFrequency,
                CardDetails: {
                    //Number: "",
                    CardNumber: values.card_number,
                    Cvv: values.card_securityCode,
                    ExpiryDate: values.card_expiryDate,
                    StripeBankAccountToken: values.card_number,
                    AccountType: parseSafeInt(values.card_accountType, ''),
                    PaymentProfileId: paymentProfileId,
                    AccountNumber: values.card_accountNumber,
                    RoutingNumber: values.card_routingNumber,
                    FirstName: values?.card_firstName,
                    LastName: values?.card_lastName,
                    Address: values?.card_streetAddress,
                    City: values?.card_city,
                    State: values?.card_state,
                    ZipCode: values?.card_zipCode,
                    //StripeBankAccountToken: values?.stripeBankAccountToken,
                    //HiddenFortisTokenId: values?.hiddenFortisTokenId
                },
                Country: values?.card_country,
                SaveDataForFutureUse: values?.card_savePaymentProfile,
                PaymentTypeId: equalString(paymentProfileId, 1) ? null : paymentProfileId,
                Disclosures: values?.disclosures
            }
            
            let response = await appService.post(`/app/Online/Memberships/PurchaseMembership_Post?id=${orgId}`, postModel);
            
            if (response && response?.data?.redirectUrl) {
                pNotify('Successfully purchased membership.');
                navigate(response.data.redirectUrl);
                setIsLoading(false);
                
            } else {
                displayMessageModal({
                    title: "Error",
                    html: (onClose) => response.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {

                    },
                })
            }
            
            setIsLoading(false);
        },
    });
    
    useEffect(() => {
        loadMembership();
    }, []);

    const loadMembership = async () => {
        setIsFetching(true);
        setIsLoading(true);
        let response = await apiService.get(`/api/membership-member-portal/get-list?orgId=${orgId}&membershipId=${membershipId}&flowName=review-and-finalize`);

        if (anyInList(response?.MembershipsData)) {
            let firstMembership = response?.MembershipsData[0];
            
            setSelectedMembership(firstMembership);

            if (anyInList(firstMembership?.DisclosuresToSign)) {
                let disclosuresToSign = firstMembership?.DisclosuresToSign.map((disclosure) => {
                    return {
                        ...disclosure,
                        AcceptAgreement: isNullOrEmpty(disclosure.ReadAgreementMessage),
                        Status: ''
                    };
                });

                formik.setFieldValue('disclosures', disclosuresToSign);
            }
            
            let signupData = {
                UiCulture: authData?.UiCulture,
                IsUsingCollectJs: response.IsUsingCollectJs,
                OrgId: orgId,
                PaymentProvider: response.PaymentProvider,
                PaymentTypes: response.PaymentTypes,
                StripePublishableKey: response.StripePublishableKey,
                OnlinePaymentsEnabled: response.OnlinePaymentsEnabled,
                AllowCreditCard: response.AllowCreditCard,
                AllowECheck: response.AllowECheck,
                AllowSaveCreditCardProfile: response.AllowSaveCreditCardProfile,
                WaiverSignedOnDateTimeDisplay: response.WaiverSignedOnDateTimeDisplay,
                //IsDisclosuresRequired: anyInList(firstMembership.DisclosuresToSign),
                //Disclosures: firstMembership.DisclosuresToSign,
            };
            
            setSignupData(signupData);

            setPaymentInfoData({
                ...signupData,
                ShowSegment: toBoolean(firstMembership?.AllowCreditCard) && toBoolean(firstMembership?.AllowECheck),
                AllowCreditCard: toBoolean(firstMembership?.AllowCreditCard),
                AllowECheck: toBoolean(firstMembership?.AllowECheck),
                AllowSaveCreditCardProfile: toBoolean(firstMembership?.AllowSaveCreditCardProfile),
                SelectedSegment: toBoolean(firstMembership?.AllowCreditCard) && toBoolean(firstMembership?.AllowECheck) ? 'Credit Card' : (toBoolean(firstMembership?.AllowECheck) ? 'eCheck' : 'Credit Card')
            })
            
            let paymentFrequencyValue = null;

            if (!isNullOrEmpty(firstMembership) && anyInList(firstMembership?.Prices)) {
                if (oneListItem(firstMembership.Prices)) {
                    paymentFrequencyValue = firstMembership.Prices[0].CostTypeFrequency;
                }
            }

            formik.setFieldValue('card_accountType', '1');
            
            formik.setFieldValue('firstName', authData.MemberFirstName);
            formik.setFieldValue('lastName', authData.MemberLastName);
            
            //hidden fields
            formik.setFieldValue('card_firstName', authData.MemberFirstName);
            formik.setFieldValue('card_lastName', authData.MemberLastName);
            
            if (!isNullOrEmpty(paymentFrequencyValue)){
                formik.setFieldValue("paymentFrequency", paymentFrequencyValue);
                formik.setFieldTouched("paymentFrequency", true, false);
            }
            if (anyInList(response.PaymentTypes)) {
                if (moreThanOneInList(response.PaymentTypes)) {
                    formik.setFieldValue("PaymentProfileId", response.PaymentTypes[1]?.Value);
                } else {
                    formik.setFieldValue("PaymentProfileId", response.PaymentTypes[0]?.Value);
                }
            }
            
        }

        setIsFetching(false);
        setIsLoading(false);
    }

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values)){
            let selectedPaymentFrequency = formik?.values?.paymentFrequency;

            const isMembershipRequirePayment = membershipRequirePayment(selectedMembership, selectedPaymentFrequency);
            setSelectedMembershipRequirePayment(toBoolean(isMembershipRequirePayment));
            if ((isMembershipRequirePayment || toBoolean(signupData?.RequireCardOnFile)) && !isNullOrEmpty(signupData?.PaymentProvider) ) {
                setShowPayment(true);
                setShowReceipt(isMembershipRequirePayment);
            } else {
                setShowPayment(false);
                setShowReceipt(false);
            }
        }
    }, [formik?.values]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('');
        
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    disabled={isFetching}
                    loading={isLoading}
                    onClick={() => {
                       formik.submitForm();
                    }}>
                Join Membership
            </Button>
        </FooterBlock>);
    }, [isFetching, isLoading]);
    
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
                                    <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <>
                    <MembershipPurchaseReview selectedMembership={selectedMembership}
                                              signupData={signupData}
                                              formik={formik}
                                              showReceipt={showReceipt}
                                              paymentInfoData={paymentInfoData}
                                              convenienceFeeObj={signupData}
                                              showPayment={showPayment}
                                              paymentProfileRef={paymentProfileRef}
                                              selectedMembershipRequirePayment={selectedMembershipRequirePayment} />
                </>
            }
        </>
    )
}

export default MembershipReview
