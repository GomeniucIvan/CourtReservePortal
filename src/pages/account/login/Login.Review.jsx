import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import React, {useEffect, useState} from "react";
import {Button, Checkbox, Divider, Flex, Skeleton, Typography} from 'antd';
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import {
    anyInList,
    equalString,
    focus,
    isNullOrEmpty,
    isValidEmail, moreThanOneInList,
    oneListItem,
    randomNumber,
    toBoolean
} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {orgCardCountryCode} from "../../../utils/OrganizationUtils.jsx";
import {costDisplay, membershipPaymentFrequencyCost, membershipRequirePayment} from "../../../utils/CostUtils.jsx";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import FormInputDisplay from "../../../form/input/FormInputDisplay.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import FormPaymentProfile from "../../../form/formpaymentprofile/FormPaymentProfile.jsx";
import LoginCreateAccountReviewModal from "./Login.CreateAccountReviewModal.jsx";
import useCustomFormik from "../../../components/formik/CustomFormik.jsx";
import IframeContent from "../../../components/iframecontent/IframeContent.jsx";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import {validatePaymentProfile} from "../../../utils/ValidationUtils.jsx";

const {Paragraph, Link, Title} = Typography;

function LoginReview() {
    const {formikData, setFormikData, setIsLoading, setIsFooterVisible, setFooterContent, token, globalStyles} = useApp();
    const { t } = useTranslation('login');
    const navigate = useNavigate();
    const [validationSchema, setValidationSchema] = useState(Yup.object({}));
    const [paymentFrequencyCost, setPaymentFrequencyCost] = useState(null);
    const [selectedMembershipRequirePayment, setSelectedMembershipRequirePayment] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showTermAndCondition, setShowTermAndCondition] = useState(false);

    const email = formikData?.email;
    const password = formikData?.password;
    const confirmPassword = formikData?.confirmPassword;
    const selectedOrgId = formikData?.selectedOrgId;
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    onClick={formik.handleSubmit}>
                {t('review.button.continue')}
            </Button>
        </PaddingBlock>);
        
        setIsFetching(false);

        if (isNullOrEmpty(email) ||
            isNullOrEmpty(password) ||
            isNullOrEmpty(confirmPassword) ||
            isNullOrEmpty(selectedOrgId)){
            navigate(AuthRouteNames.LOGIN);
        } else{
            let selectedMembership = formik?.values?.selectedMembership;

            if (selectedMembership) {
                let paymentFrequencyValue = null;
                if (!isNullOrEmpty(selectedMembership) && anyInList(selectedMembership?.DetailedPaymentOptions)) {
                    if (oneListItem(selectedMembership.DetailedPaymentOptions)) {
                        paymentFrequencyValue = selectedMembership.DetailedPaymentOptions[0].Value;
                    }
                }

                formik.setFieldValue("paymentFrequency", paymentFrequencyValue);
            }
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
    };

    const getMembershipInitialValues = (incData) => {
        return  {
            ...initialValues,
            ...incData,
        };
    }

    const getAdditionalInfoValidationSchema = () => {
        let selectedMembership = formik?.values?.selectedMembership;
        
        let schemaFields = {

        };
        
        if (!isNullOrEmpty(selectedMembership) && moreThanOneInList(selectedMembership?.DetailedPaymentOptions)) {
            schemaFields.paymentFrequency = Yup.string().required('Payment Frequency is required.');
        }
        
        if (toBoolean(formik?.values?.isDisclosuresRequired)) {
            //todo(IV) not working
            schemaFields.disclosureAgree = Yup.bool().oneOf([true], 'You must agree to the terms & conditions.');
        }

        return Yup.object(schemaFields);
    }
    
    const formik = useCustomFormik({
        initialValues: getMembershipInitialValues(formikData),
        validationSchema: validationSchema,
        validation: () => {
            
            let formikPaymentFrequency = formik?.values?.paymentFrequency;
            let selectedMembership = formik?.values?.selectedMembership;
            const isMembershipRequirePayment = membershipRequirePayment(selectedMembership, formikPaymentFrequency) || toBoolean(formik?.values?.requireCardOnFile);
            let isValidPaymentProfile = validatePaymentProfile(t, formik, isMembershipRequirePayment);
            
            let isValidForm = true;
            
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
            let selectedMembership = formik?.values?.selectedMembership;

            const isMembershipRequirePayment = membershipRequirePayment(selectedMembership, selectedPaymentFrequency);
            const paymentFrequencyCost = membershipPaymentFrequencyCost(selectedMembership, selectedPaymentFrequency);
            setPaymentFrequencyCost(paymentFrequencyCost);
            setSelectedMembershipRequirePayment(toBoolean(isMembershipRequirePayment));
            setValidationSchema(getAdditionalInfoValidationSchema());
        }
    }, [formik?.values]);
    
    const checkToShowRecipient = () => {
        const selectedPaymentFrequency = formik?.values?.paymentFrequency;
        const selectedAccountType = formik?.values?.card_accountNumber;
        const selectedMembership = formik?.values?.selectedMembership;
        let innerShowRecipient = false;

        if (selectedMembership && !isNullOrEmpty(selectedPaymentFrequency) && !isNullOrEmpty(selectedAccountType)) {
            if (paymentFrequencyCost > 0 || selectedMembership.InitiationFee > 0) {
                innerShowRecipient = true;
            }
        }

        //setShowReciept(innerShowRecipient);
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
                    {!isNullOrEmpty(formik?.values?.selectedMembership) &&
                        <>
                            <PaddingBlock onlyTop={true}>
                                <FormInputDisplay label={t(`review.membership`)} value={formik?.values?.selectedMembership?.Name}/>

                                {anyInList(formik?.values?.selectedMembership?.DetailedPaymentOptions) &&
                                    <FormSelect
                                        form={formik}
                                        name='paymentFrequency'
                                        label={t(`review.paymentFrequency`)}
                                        options={formik?.values?.selectedMembership?.DetailedPaymentOptions}
                                        required={moreThanOneInList(formik?.values?.selectedMembership?.DetailedPaymentOptions)}
                                        disabled={oneListItem(formik?.values?.selectedMembership?.DetailedPaymentOptions)}
                                        propText='Text'
                                        propValue='Value'
                                        onValueChange={e => {
                                            checkToShowRecipient();
                                        }}
                                    />
                                }
                            </PaddingBlock>
                        </>
                    }

                    {(!isNullOrEmpty(formik?.values?.selectedMembership) && (selectedMembershipRequirePayment || toBoolean(formik?.values?.requireCardOnFile))) &&
                        <Divider />
                    }
                    
                    {(selectedMembershipRequirePayment || toBoolean(formik?.values?.requireCardOnFile)) &&
                        <PaddingBlock onlyBottom={true}>
                            <Title level={1}>{t(`review.paymentProfileBilling`)}</Title>

                            <Paragraph>
                                {t(`review.paymentProfileBillingDescription`)}
                            </Paragraph>
                            
                            <FormPaymentProfile form={formik}
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
                    
                    {toBoolean(formik?.values?.isDisclosuresRequired) &&
                        <PaddingBlock>
                            <Flex align={'center'}>
                                <Checkbox onChange={(e) => {formik.setFieldValue('disclosureAgree', e.target.checked)}}>I agree to the </Checkbox>
                                <u style={{color: token.colorLink}}
                                   onClick={() => setShowTermAndCondition(true)}> Terms and
                                    Conditions</u>
                            </Flex>
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
                        label={'Terms and Conditions'}
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
