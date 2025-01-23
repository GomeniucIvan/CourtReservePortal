import {useApp} from "@/context/AppProvider.jsx";
import * as Yup from "yup";
import React, {useEffect, useState} from "react";
import {Button, Checkbox, Divider, Flex, Skeleton, Typography} from 'antd';
import {
    anyInList, equalString,
    isNullOrEmpty,
    moreThanOneInList,
    oneListItem,
    toBoolean
} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {orgCardCountryCode} from "@/utils/OrganizationUtils.jsx";
import {costDisplay, membershipPaymentFrequencyCost, membershipRequirePayment} from "@/utils/CostUtils.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import FormPaymentProfile from "@/form/formpaymentprofile/FormPaymentProfile.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import {setFormikError, validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import FormCheckbox from "@/form/formcheckbox/FomCheckbox.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import LoginCreateAccountReviewModal from "@portal/account/modules/Login.CreateAccountReviewModal.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import FormDisclosures from "@/form/formdisclosures/FormDisclosures.jsx";

const {Paragraph, Link, Title} = Typography;

function LoginReview({mainFormik, signupData}) {
    const {setHeaderTitleKey} = useHeader();
    const {setIsFooterVisible, setFooterContent, token} = useApp();
    const { t } = useTranslation('login');
    const [paymentFrequencyCost, setPaymentFrequencyCost] = useState(null);
    const [selectedMembershipRequirePayment, setSelectedMembershipRequirePayment] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showTermAndCondition, setShowTermAndCondition] = useState(false);
    const [paymentInfoData, setPaymentInfoData] = useState(null);

    const selectedMembership = mainFormik?.values?.selectedMembership;
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    onClick={formik.handleSubmit}>
                {t('review.button.continue')}
            </Button>
        </FooterBlock>);
        setHeaderTitleKey('loginReview');
        
        setIsFetching(false);
    }, []);

    console.log(mainFormik)
    
    const initialValues = {
        ...CardConstants,
        card_country: orgCardCountryCode(mainFormik?.values?.UiCulture),
        paymentFrequency: '',
        disclosureAgree: false,
        hiddenFortisTokenId: '',
        disclosures: [],
        card_firstName: mainFormik?.values?.firstName,
        card_lastName: mainFormik?.values?.lastName,
        card_streetAddress: mainFormik?.values?.streetAddress,
        card_city: mainFormik?.values?.city,
        card_state: mainFormik?.values?.state,
        card_zipCode: mainFormik?.values?.zipCode,
        card_phoneNumber: mainFormik?.values?.phoneNumber,
    };

    const getMembershipInitialValues = () => {
        return  {
            ...initialValues,
            ...mainFormik,
        };
    }

    const validationSchema = () => {
        let schemaFields = {

        };

        if (!isNullOrEmpty(selectedMembership) && moreThanOneInList(selectedMembership?.DetailedPaymentOptions)) {
            schemaFields.paymentFrequency = Yup.string().required(t('common:requiredMessage', {label: 'review.form.paymentFrequency'}));
        }

        return Yup.object(schemaFields);
    }
    
    const formik = useCustomFormik({
        initialValues: getMembershipInitialValues(),
        validationSchema: validationSchema(),
        validation: () => {
            //card details
            let formikPaymentFrequency = formik?.values?.paymentFrequency;
            const isMembershipRequirePayment = (membershipRequirePayment(selectedMembership, formikPaymentFrequency) || toBoolean(signupData.RequireCardOnFile));
            let isValidPaymentProfile = validatePaymentProfile(t, formik, isMembershipRequirePayment);
            
            let isValidForm = true;
            
            if (signupData && !isNullOrEmpty(signupData.Disclosures) && toBoolean(signupData.IsDisclosuresRequired)) {
                setFormikError(t, formik, 'disclosureAgree', null, t('review.form.disclosureAgreeRequired'))
                isValidForm = false;
            }
            
            return isValidPaymentProfile && isValidForm;
        },
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setShowReviewModal(true);
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
            formik.setFieldValue('card_segmentAccountType', 1);
            formik.setFieldValue("paymentFrequency", paymentFrequencyValue);
            formik.setFieldTouched("paymentFrequency", true, false);
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
        if (!isNullOrEmpty(formik?.values)){
            let selectedPaymentFrequency = formik?.values?.paymentFrequency;

            const isMembershipRequirePayment = membershipRequirePayment(selectedMembership, selectedPaymentFrequency);
            const paymentFrequencyCost = membershipPaymentFrequencyCost(selectedMembership, selectedPaymentFrequency);
            setPaymentFrequencyCost(paymentFrequencyCost);
            setSelectedMembershipRequirePayment(toBoolean(isMembershipRequirePayment));
        }
    }, [formik?.values]);
    
    useEffect(() => {
        const selectedPaymentFrequency = formik?.values?.paymentFrequency;
        const selectedAccountType = formik?.values?.card_accountNumber;
        let innerShowRecipient = false;

        if (selectedMembership && !isNullOrEmpty(selectedPaymentFrequency) && !isNullOrEmpty(selectedAccountType)) {
            if (paymentFrequencyCost > 0 || selectedMembership.InitiationFee > 0) {
                innerShowRecipient = true;
            }
        }
    }, [formik?.values?.paymentFrequency])
    
    const visibleSeparatorByKey = (key) => {
        let isMembershipVisible = !isNullOrEmpty(selectedMembership?.Name);
        let isBillingVisible = (selectedMembershipRequirePayment || toBoolean(signupData.RequireCardOnFile));
        let isAgreementsVisible = (signupData && !isNullOrEmpty(signupData.Disclosures) && toBoolean(signupData.IsDisclosuresRequired));
        
        if (equalString(key, 'membership-billing')) {
            return isMembershipVisible && isBillingVisible;
        } else if (equalString(key, 'billing-disclosure')){
            return (isMembershipVisible || isBillingVisible) && isAgreementsVisible;
        }
    }
    
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
                    {!isNullOrEmpty(selectedMembership?.Name) &&
                        <>
                            <PaddingBlock onlyTop={true}>
                                <Flex vertical={true} gap={token.padding}>
                                    <FormInputDisplay label={t(`review.membership`)} value={selectedMembership?.Name}/>

                                    {anyInList(selectedMembership?.Prices) &&
                                        <FormSelect
                                            formik={formik}
                                            name='paymentFrequency'
                                            label={t(`review.form.paymentFrequency`)}
                                            options={selectedMembership?.Prices}
                                            required={moreThanOneInList(selectedMembership?.Prices)}
                                            disabled={oneListItem(selectedMembership?.Prices)}
                                            propText='FullPriceDisplay'
                                            propValue='CostTypeFrequency'
                                        />
                                    }
                                </Flex>
                            </PaddingBlock>
                        </>
                    }

                    {visibleSeparatorByKey('membership-billing') &&
                        <Divider />
                    }
                    
                    {(selectedMembershipRequirePayment || toBoolean(signupData.RequireCardOnFile)) &&
                        <>
                            <PaddingBlock onlyTop={!visibleSeparatorByKey('membership-billing')}>
                                <Flex vertical={true} gap={token.paddingXS}>
                                    <Title level={1}>{t(`review.paymentProfileBilling`)}</Title>

                                    <Paragraph>
                                        {t(`review.paymentProfileBillingDescription`)}
                                    </Paragraph>
                                </Flex>

                                <Flex vertical={true} gap={token.padding}>
                                    <FormPaymentProfile formik={formik}
                                                        isPaymentProfile={false}
                                                        includeCustomerDetails={true}
                                                        allowToSavePaymentProfile={false}
                                                        showStatesDropdown={toBoolean(signupData.ShowStatesDropdown)}
                                                        uiCulture={signupData.UiCulture}
                                                        hideFields={{
                                                            address2: true,
                                                            phoneNumber: true
                                                        }}
                                                        paymentProviderData={paymentInfoData}
                                                        paymentTypes={signupData.PaymentTypes}
                                    />
                                </Flex>
                            </PaddingBlock>
                        </>
                    }

                    {visibleSeparatorByKey('billing-disclosure') &&
                        <Divider />
                    }
                    
                    {(signupData && !isNullOrEmpty(signupData.Disclosures) && toBoolean(signupData.IsDisclosuresRequired)) &&
                        <PaddingBlock topBottom={!visibleSeparatorByKey('billing-disclosure')}>
                            <FormDisclosures formik={formik} disclosureHtml={signupData.Disclosures} dateTimeDisplay={signupData.WaiverSignedOnDateTimeDisplay}/>
                        </PaddingBlock>
                    }
                    
                    <LoginCreateAccountReviewModal formik={formik} show={showReviewModal} setShow={setShowReviewModal}/>
                </>
            }
        </>
    )
}

export default LoginReview
