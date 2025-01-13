import {useApp} from "@/context/AppProvider.jsx";
import * as Yup from "yup";
import React, {useEffect, useState} from "react";
import {Button, Checkbox, Divider, Flex, Skeleton, Typography} from 'antd';
import {
    anyInList,
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

const {Paragraph, Link, Title} = Typography;

function LoginReview({mainFormik}) {
    const {formikData, setIsFooterVisible, setFooterContent, token, globalStyles, setHeaderTitleKey} = useApp();
    const { t } = useTranslation('login');
    const [paymentFrequencyCost, setPaymentFrequencyCost] = useState(null);
    const [selectedMembershipRequirePayment, setSelectedMembershipRequirePayment] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showTermAndCondition, setShowTermAndCondition] = useState(false);

    const isDisclosuresRequired = mainFormik?.values?.isDisclosuresRequired;
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

        if (selectedMembership) {
            let paymentFrequencyValue = null;
            if (!isNullOrEmpty(selectedMembership) && anyInList(selectedMembership?.DetailedPaymentOptions)) {
                if (oneListItem(selectedMembership.DetailedPaymentOptions)) {
                    paymentFrequencyValue = selectedMembership.DetailedPaymentOptions[0].Value;
                }
            }

            mainFormik.setFieldValue("paymentFrequency", paymentFrequencyValue);
        }
    }, []);

    const initialValues = {
        card_firstName: '',
        card_lastName: '',
        card_streetAddress: '',
        card_streetAddress2: '',
        card_city: '',
        card_state: '',
        card_zipCode: '',
        card_phoneNumber: '',
        card_number: '',//--from here
        card_expiryDate: '',
        card_securityCode: '',
        card_accountType: '',
        card_routingNumber: '',
        card_accountNumber: '',
        card_savePaymentProfile: false,
        card_country: orgCardCountryCode(formikData?.UiCulture),
        
        paymentFrequency: '',
        disclosureAgree: false,
        hiddenFortisTokenId: '',
        isDisclosuresRequired: isDisclosuresRequired
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
            const isMembershipRequirePayment = membershipRequirePayment(selectedMembership, formikPaymentFrequency) || toBoolean(formik?.values?.requireCardOnFile);
            let isValidPaymentProfile = validatePaymentProfile(t, formik, isMembershipRequirePayment);
            
            let isValidForm = true;
            
            if (isDisclosuresRequired && !toBoolean(formik?.values?.disclosureAgree)) {
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
                    {!isNullOrEmpty(selectedMembership) &&
                        <>
                            <PaddingBlock onlyTop={true}>
                                <FormInputDisplay label={t(`review.membership`)} value={selectedMembership?.Name}/>

                                {anyInList(selectedMembership?.DetailedPaymentOptions) &&
                                    <FormSelect
                                        formik={formik}
                                        name='paymentFrequency'
                                        label={t(`review.form.paymentFrequency`)}
                                        options={selectedMembership?.DetailedPaymentOptions}
                                        required={moreThanOneInList(selectedMembership?.DetailedPaymentOptions)}
                                        disabled={oneListItem(selectedMembership?.DetailedPaymentOptions)}
                                        propText='Text'
                                        propValue='Value'
                                    />
                                }
                            </PaddingBlock>
                        </>
                    }

                    {(!isNullOrEmpty(selectedMembership) && (selectedMembershipRequirePayment || toBoolean(formik?.values?.requireCardOnFile))) &&
                        <Divider />
                    }
                    
                    {(selectedMembershipRequirePayment || toBoolean(formik?.values?.requireCardOnFile)) &&
                        <PaddingBlock onlyBottom={true}>
                            <Title level={1}>{t(`review.paymentProfileBilling`)}</Title>

                            <Paragraph>
                                {t(`review.paymentProfileBillingDescription`)}
                            </Paragraph>
                            
                            <FormPaymentProfile formik={formik}
                                                isPaymentProfile={false}
                                                includeCustomerDetails={true}
                                                allowToSavePaymentProfile={false}
                                                showStatesDropdown={toBoolean(formik?.values?.showStatesDropdown)}
                                                uiCulture={formik?.values?.uiCulture}
                                                hideFields={{
                                                    address2: true,
                                                    phoneNumber: true
                                                }}
                                                paymentProviderData={{
                                                    PaymentProvider: formik?.values?.paymentProvider,
                                                    StripePublishableKey: formik?.values?.stripePublishableKey,
                                                    IsUsingCollectJs: formik?.values?.isUsingCollectJs,
                                                }}
                                                paymentTypes={formik?.values?.paymentTypes}
                            />
                        </PaddingBlock>
                    }
                    
                    {toBoolean(isDisclosuresRequired) &&
                        <PaddingBlock>
                            <FormCheckbox label={''}
                                          formik={formik}
                                          name={'disclosureAgree'}
                                          text={t('review.form.disclosureAgree')}
                                          description={t('review.form.disclosureAgreeDescription')}
                                          descriptionClick={() => setShowTermAndCondition(true)}/>
                        </PaddingBlock>
                    }

                    <DrawerBottom
                        showDrawer={showTermAndCondition}
                        showButton={true}
                        customFooter={<Flex gap={token.padding}>
                            <Button type={'primary'} block onClick={() => {
                                setShowTermAndCondition(false)
                            }}>
                                {t('common:close')}
                            </Button>
                        </Flex>}
                        closeDrawer={() => setShowTermAndCondition(false)}
                        label={t('review.form.disclosureAgreeDescription')}
                        onConfirmButtonClick={() => setShowTermAndCondition(false)}
                    >
                        <PaddingBlock>
                            {!isNullOrEmpty(formik?.values?.disclosures) &&
                                <IframeContent content={formik?.values?.disclosures} id={'login-disclosure'}/>
                            }
                        </PaddingBlock>
                    </DrawerBottom>
                    
                    <LoginCreateAccountReviewModal formik={formik} show={showReviewModal} setShow={setShowReviewModal}/>
                </>
            }
        </>
    )
}

export default LoginReview
