import {useApp} from "@/context/AppProvider.jsx";
import * as Yup from "yup";
import React, {useEffect, useRef, useState} from "react";
import {Button, Checkbox, Divider, Flex, Skeleton, Typography} from 'antd';
import {
    anyInList, equalString,
    isNullOrEmpty,
    moreThanOneInList, notValidScroll,
    oneListItem,
    toBoolean
} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useTranslation} from "react-i18next";
import {orgCardCountryCode} from "@/utils/OrganizationUtils.jsx";
import {
    calculateConvenienceFee,
    costDisplay, membershipCalculateTaxProperties,
    membershipPaymentFrequencyCost,
    membershipRequirePayment
} from "@/utils/CostUtils.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import FormPaymentProfile from "@/form/formpaymentprofile/FormPaymentProfile.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {
    setFormikError,
    setFormikErrorN,
    validateDisclosures,
    validatePaymentProfile
} from "@/utils/ValidationUtils.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import FormDisclosures from "@/form/formdisclosures/FormDisclosures.jsx";
import {useStyles} from "./../styles.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {getMembershipText} from "@/utils/TranslateUtils.jsx";
import LoginCreateAccountReviewModal from "@portal/account/login/Login.CreateAccountReviewModal.jsx";
import MembershipReceiptBlock from "@/components/receiptblock/MembershipReceiptBlock.jsx";
import JoinOrganizationReviewModal from "@portal/account/joinorganization/JoinOrganization.ReviewModal.jsx";
import MembershipPurchaseReview from "@/components/modules/membership/MembershipPurchaseReview.jsx";

const {Paragraph, Link, Title, Text} = Typography;

function LoginReview({mainFormik, signupData, page = 'create-account'}) {
    const {setHeaderTitleKey} = useHeader();
    const {setIsFooterVisible, setFooterContent, token} = useApp();
    const [selectedMembershipRequirePayment, setSelectedMembershipRequirePayment] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [paymentInfoData, setPaymentInfoData] = useState(null);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [convenienceFeeObj, setConvenienceFeeObj] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const { t } = useTranslation('login');

    const paymentProfileRef = useRef(null);
    const selectedMembership = mainFormik?.values?.selectedMembership;

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderTitleKey('loginReview');
        setIsFetching(false);
    }, []);

    useEffect(() => {
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    loading={isSubmitLoading}
                    onClick={formik.handleSubmit}>
                {t('review.button.continue')}
            </Button>
        </FooterBlock>);
    }, [isSubmitLoading, isFetching]);

    const initialValues = {
        ...CardConstants,
        card_country: orgCardCountryCode(mainFormik?.values?.UiCulture),
        paymentFrequency: '',
        disclosureAgree: false,
        hiddenFortisTokenId: '',
        disclosures: [],
        firstName: mainFormik?.values?.firstName,
        lastName: mainFormik?.values?.lastName,
        card_firstName: mainFormik?.values?.firstName,
        card_lastName: mainFormik?.values?.lastName,
        card_streetAddress: mainFormik?.values?.streetAddress,
        card_city: mainFormik?.values?.city,
        card_state: mainFormik?.values?.state,
        card_zipCode: mainFormik?.values?.zipCode,
        card_phoneNumber: mainFormik?.values?.phoneNumber
    };

    const formik = useCustomFormik({
        initialValues: initialValues,
        validation: () => {
            let isValidFormik = true;
            let selectedMembership = mainFormik?.values?.selectedMembership;
            //first validation always when use disclosure
            let isValidDisclosures = validateDisclosures(t, formik, signupData);

            //card details
            let formikPaymentFrequency = formik?.values?.paymentFrequency;
            const isMembershipRequirePayment = (membershipRequirePayment(selectedMembership, formikPaymentFrequency) || toBoolean(signupData.RequireCardOnFile));
            let isValidPaymentProfile = validatePaymentProfile(t, formik, isMembershipRequirePayment, paymentInfoData);

            if (moreThanOneInList(selectedMembership?.Prices) && isNullOrEmpty(formik?.values?.paymentFrequency)) {
                setFormikErrorN(formik, 'paymentFrequency', 'Pricing Option is required.');
                isValidFormik = false;
            }
            return isValidPaymentProfile && isValidDisclosures && isValidFormik;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {

            //card validation
            if (!isSubmitLoading) {
                setIsSubmitLoading(true);

                if (paymentProfileRef.current) {
                    let isValidTokenObj = await paymentProfileRef.current.submitCreateToken();
                    if (!isValidTokenObj.isValid) {
                        setIsSubmitLoading(false);
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
                
                let confirmMessageText = `You are going to join organization. Review the information provided and confirm before creating your account.`;
                if (equalString(page, 'join-organization')) {
                    confirmMessageText = `You are going to join organization. Review the information provided and confirm.`;
                }
                
                let selectedMembership = mainFormik?.values?.selectedMembership;

                if (selectedMembership) {
                    confirmMessageText = `You are going to join the <b>${getMembershipText(selectedMembership?.Name)}</b> and create an account. Review the information provided and confirm before creating your account.`;

                    if (equalString(page, 'join-organization')) {
                        confirmMessageText = `You are going to join the <b>${getMembershipText(selectedMembership?.Name)}</b>. Review the information provided and confirm.`;
                    }
                    
                    if (signupData && signupData?.AllowMembersToPayTransactionsOnPortal) {
                        let paymentFrequencyCost = membershipPaymentFrequencyCost(selectedMembership, values?.paymentFrequency);
                        let convenienceFeeHtml = '';

                        if (!equalString(values?.card_accountType, 2)) {
                            let calculatedConvenienceFee = calculateConvenienceFee(/*total*/ paymentFrequencyCost, /*org*/ convenienceFeeObj, /*onlyFee*/ true);

                            if (!isNullOrEmpty(calculatedConvenienceFee) && calculatedConvenienceFee > 0) {
                                convenienceFeeHtml = `<span class='red'> + ${costDisplay(calculatedConvenienceFee)} Convinience Fee</span>`;
                            }
                        }

                        if (!isNullOrEmpty(paymentFrequencyCost)) {
                            let membershipTax = membershipCalculateTaxProperties(selectedMembership, values?.paymentFrequency, paymentFrequencyCost);
                            if (!isNullOrEmpty(membershipTax)) {
                                paymentFrequencyCost = paymentFrequencyCost + membershipTax;
                            }

                            if (!isNullOrEmpty(selectedMembership.InitiationFeePriceDisplay)) {
                                paymentFrequencyCost = paymentFrequencyCost + selectedMembership.InitiationFeePrice;
                            }

                            confirmMessageText = `You are going to join the <b>${getMembershipText(selectedMembership?.Name)}</b> and be charged <b>${costDisplay(paymentFrequencyCost)}${convenienceFeeHtml}</b>. Review the information provided and confirm before creating your account. `;
                            
                            if (equalString(page, 'join-organization')) {
                                confirmMessageText = `You are going to join the <b>${getMembershipText(selectedMembership?.Name)}</b> and be charged <b>${costDisplay(paymentFrequencyCost)}${convenienceFeeHtml}</b>. Review the information provided and confirm. `;
                            }
                        }
                    }
                }

                formik.setFieldValue('reviewModalTitle', confirmMessageText);
                setShowReviewModal(true);
                setIsSubmitLoading(false);
            }
        },
    });

    useEffect(() => {
        if (selectedMembership) {
            let paymentFrequencyValue = null;

            if (!isNullOrEmpty(selectedMembership) && anyInList(selectedMembership?.Prices)) {
                if (oneListItem(selectedMembership.Prices)) {
                    paymentFrequencyValue = selectedMembership.Prices[0].CostTypeFrequency;
                }
            }

            formik.setFieldValue('card_accountType', '1');
            if (!isNullOrEmpty(paymentFrequencyValue)){
                formik.setFieldValue("paymentFrequency", paymentFrequencyValue);
                formik.setFieldTouched("paymentFrequency", true, false);
            }
        }

        if (anyInList(selectedMembership?.DisclosuresToSign)) {
            let disclosuresToSign = selectedMembership?.DisclosuresToSign.map((disclosure) => {
                return {
                    ...disclosure,
                    AcceptAgreement: isNullOrEmpty(disclosure.ReadAgreementMessage),
                    Status: ''
                };
            });

            formik.setFieldValue('disclosures', disclosuresToSign);
        }

        setPaymentInfoData({
            ...signupData,
            ShowSegment: toBoolean(selectedMembership?.AllowCreditCard) && toBoolean(selectedMembership?.AllowECheck),
            AllowCreditCard: toBoolean(selectedMembership?.AllowCreditCard),
            AllowECheck: toBoolean(selectedMembership?.AllowECheck),
            AllowSaveCreditCardProfile: toBoolean(selectedMembership?.AllowSaveCreditCardProfile),
            SelectedSegment: toBoolean(selectedMembership?.AllowCreditCard) && toBoolean(selectedMembership?.AllowECheck) ? 'Credit Card' : (toBoolean(selectedMembership?.AllowECheck) ? 'eCheck' : 'Credit Card')
        })
    }, []);

    useEffect(() => {
        if (signupData && toBoolean(signupData.IsUsingConvenienceFee)) {
            setConvenienceFeeObj({
                convenienceFeeFixedAmount: signupData?.ConvenienceFeeFixedAmount,
                convenienceFeePercent: signupData?.ConvenienceFeePercent,
            });
        } else {
            setConvenienceFeeObj(null);
        }
    }, [signupData]);

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
                                              convenienceFeeObj={convenienceFeeObj}
                                              showPayment={showPayment}
                                              paymentProfileRef={paymentProfileRef}
                                              selectedMembershipRequirePayment={selectedMembershipRequirePayment} />

                    {equalString(page, 'create-account') &&
                        <LoginCreateAccountReviewModal
                            data={{
                                ...signupData,
                                ...mainFormik.values,
                                ...formik.values
                            }}
                            show={showReviewModal}
                            setShow={setShowReviewModal}
                        />
                    }

                    {equalString(page, 'join-organization') &&
                        <JoinOrganizationReviewModal
                            data={{
                                ...signupData,
                                ...mainFormik.values,
                                ...formik.values
                            }}
                            show={showReviewModal}
                            setShow={setShowReviewModal}
                        />
                    }
                </>
            }
        </>
    )
}

export default LoginReview
