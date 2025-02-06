import React, {useRef, useState, forwardRef, useImperativeHandle, useEffect} from 'react';
import {Divider, Flex, Segmented, Skeleton, Typography} from 'antd';
import { FortisPaymentType_Ach, FortisPaymentType_CreditCard, PAYMENT_FORTIS_SOURCE_CreateMember, PAYMENT_FORTIS_SOURCE_CreatePaymentProfileAdmin, PAYMENT_FORTIS_SOURCE_CreatePaymentProfilePortal, PAYMENT_FORTIS_SOURCE_POS, PAYMENT_FORTIS_SOURCE_PayTransactionAdmin, PAYMENT_FORTIS_SOURCE_PortalPayment, PAYMENT_FORTIS_SOURCE_PortalRequestAccess, PaymentProfileAccountType_Card, TransactionPaymentTypeEnum_CreditCardSwipe } from './FormPaymentProfile_Contants.jsx';
import {isNullOrEmpty, equalString, toBoolean, focus, anyInList} from "../../utils/Utils.jsx";
import {getConfigValue} from "../../config/WebConfig.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import FormInput from "../input/FormInput.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {getAllCountries} from "../../utils/CountryUtils.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {isNonUsCulture} from "../../utils/DateUtils.jsx";
import FormSwitch from "../formswitch/FormSwitch.jsx";
import FormStateProvince from "../formstateprovince/FormStateProvince.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import FormPaymentProfileCardConnect from "@/form/formpaymentprofile/FormPaymentProfile.CardConnect.jsx";
import FormPaymentProfileStripe from "@/form/formpaymentprofile/FormPaymentProfile.Stripe.jsx";
import FormPaymentProfileSafeSave from "@/form/formpaymentprofile/FormPaymentProfile.SafeSave.jsx";
import FormPaymentProfileECheck from "@/form/formpaymentprofile/FormPaymentProfile.ECheck.jsx";
const { Paragraph, Title } = Typography;

let resolvePaymentRequest, rejectPaymentRequest;

const FormPaymentProfile = React.forwardRef(({ formik,
                                                 paymentTypes,
                                                 convenienceFeeObj,
                                                 paymentFrequencyCost,
                                                 isPaymentProfile,
                                                 allowToSavePaymentProfile,
                                                 paymentProviderData = {},
                                                 showBillingInformation = true,
                                                 hideFields = {
                                                     firstLastName: true,
                                                     address2: true,
                                                     phoneNumber: true,
                                                     accountType: true
                                                 }}, ref) => {

    const [validationMessage, setValidationMessage] = useState('');
    const [stripe, setStripe] = useState(null);
    const [stripeCardElement, setStripeCardElement] = useState(null);
    const [isUsingCollectJsLoading, setIsUsingCollectJsLoading] = useState(true);
    const [selectedSegmentType, setSelectedSegmentType] = useState('');

    const stripeCardElementRef = useRef(null);
    const [validationMessages, setValidationMessages] = useState({});
    const {token, globalStyles} = useApp();

    let paymentProvider = paymentProviderData?.PaymentProvider;
    let stripeKey = paymentProviderData?.StripePublishableKey;
    let isUsingCollectJs = paymentProviderData?.IsUsingCollectJs;
    let uiCulture = paymentProviderData?.UiCulture;
    let showStatesDropdown = toBoolean(paymentProviderData?.ShowStatesDropdown);

    const [fieldValidity, setFieldValidity] = useState({
        ccnumber: false,
        ccexp: false,
        cvv: false,
        checkname: false,
        checkaba: false,
        checkaccount: false,
    });

    useImperativeHandle(ref, () => ({
        async submitCreateToken() {

            let isValid = false;
            let errorMessage = '';

            let isECheck = equalString(selectedSegmentType, 'eCheck');
            let isCreditCard = equalString(selectedSegmentType, 'Credit Card');

            //credit card
            if (isCreditCard) {
                if (equalString(paymentProvider, 2) && stripe && stripeCardElement) {
                    try {
                        const result = await stripe.createToken(stripeCardElement);
                        if (result.error) {
                            errorMessage = result.error.message;
                        } else {
                            isValid = true;
                            formik.setFieldValue("card_number", result.token.id);
                        }
                    } catch (error) {
                        // Handle any other errors
                        errorMessage = error.message || 'An unknown error occurred';
                    }
                }
                else if (equalString(paymentProvider, 3) && toBoolean(isUsingCollectJs)) {
                    const allFieldsValid = Object.values(fieldValidity).every(status => status === true);
                    if (allFieldsValid) {
                        try {

                            //SAFE SAVE FUNCTION
                            const safeSaveTimeoutPromise = new Promise((_, reject) => {
                                setTimeout(() => reject(new Error('Payment request timed out')), 10000)
                            });

                            // Function to start payment request with SafeSave's Collect.js
                            const collectSafeSavePaymentRequest = () => {
                                return new Promise((resolve, reject) => {
                                    resolvePaymentRequest = resolve;
                                    rejectPaymentRequest = reject;

                                    try {
                                        CollectJS.startPaymentRequest();
                                    } catch (error) {
                                        reject(error);
                                    }
                                });
                            };

                            const result = await Promise.race([collectSafeSavePaymentRequest(), safeSaveTimeoutPromise]);
                            if (result.token) {
                                isValid = true;
                            }
                        } catch (error) {
                            errorMessage = error.message || 'An unknown error occurred';
                        }
                    } else {
                        isValid = false;

                        const firstInvalidField = Object.keys(fieldValidity).find(field => !fieldValidity[field]);
                        if (firstInvalidField) {
                            errorMessage = validationMessages[firstInvalidField] || 'Please correct card fields.';
                            errorMessage = errorMessage.replace('CVV', 'Security Code');
                        }
                    }
                }
                else {
                    isValid = true
                }
            }

            //echeck
            else if (isECheck) {
                if (equalString(paymentProvider, 3) && toBoolean(isUsingCollectJs)) {

                    const allFieldsValid = Object.values(fieldValidity).every(status => status === true);
                    if (allFieldsValid) {
                        try {

                            //SAFE SAVE FUNCTION
                            const safeSaveTimeoutPromise = new Promise((_, reject) => {
                                setTimeout(() => reject(new Error('Payment request timed out')), 10000)
                            });

                            // Function to start payment request with SafeSave's Collect.js
                            const collectSafeSavePaymentRequest = () => {
                                return new Promise((resolve, reject) => {
                                    resolvePaymentRequest = resolve;
                                    rejectPaymentRequest = reject;

                                    try {
                                        CollectJS.startPaymentRequest();
                                    } catch (error) {
                                        reject(error);
                                    }
                                });
                            };

                            const result = await Promise.race([collectSafeSavePaymentRequest(), safeSaveTimeoutPromise]);
                            if (result.token) {
                                isValid = true;
                            }
                        } catch (error) {
                            errorMessage = error.message || 'An unknown error occurred';
                        }
                    } else {
                        isValid = false;

                        const firstInvalidField = Object.keys(fieldValidity).find(field => !fieldValidity[field]);
                        if (firstInvalidField) {
                            errorMessage = validationMessages[firstInvalidField] || 'Please correct card fields.';
                            if (equalString(errorMessage, 'Field is empty')) {
                                if (!toBoolean(fieldValidity?.checkname)) {
                                    errorMessage = 'Account Holder Name is required.';
                                } else if (!toBoolean(fieldValidity?.checkaba)) {
                                    errorMessage = 'Routing Number is required.';
                                } else if (!toBoolean(fieldValidity?.checkaccount)) {
                                    errorMessage = 'Account Number is required.';
                                }
                            }

                            errorMessage = errorMessage.replace('CVV', 'Security Code');
                        }
                    }
                }
                else if (equalString(paymentProvider, 2) && stripe) {
                    try {
                        const paramObject = {
                            country: 'US',
                            currency: 'usd',
                            routing_number: formik?.values?.card_routingNumber,
                            account_number: formik?.values?.card_accountNumber,
                            account_holder_name: `${formik?.values?.card_firstName} ${formik?.values?.card_lastName}`,
                            account_holder_type: 'individual',
                        };
                        const result = await stripe.createToken('bank_account', paramObject);

                        if (result.error) {
                            errorMessage = result.error.message;
                        } else {
                            isValid = true;
                            formik.setFieldValue("card_number", result.token.id);
                        }
                    } catch (error) {
                        // Handle any other errors
                        errorMessage = error.message || 'An unknown error occurred';
                    }
                }
                else {
                    isValid = true;
                }
            }
            else {
                isValid = true;
            }

            return {
                isValid: isValid,
                errorMessage: errorMessage
            };
        }
    }));

    // if (isNullOrEmpty(paymentTypes)) {
    //     paymentTypes = [];
    // }

    // const accountTypeChange = (selectedValue) => {
    //     setShowCardDetails(equalString(selectedValue, 1));
    //     setShowECheckDetails(equalString(selectedValue, 2));
    // }
    //
    // useEffect(() => {
    //     if (!isNullOrEmpty(formik?.values?.card_accountType)){
    //         accountTypeChange(formik?.values?.card_accountType);
    //     }
    // }, [])
    //
    // useEffect(() => {
    //     let accType = formik?.values?.card_accountType;
    //     accountTypeChange(accType);
    // }, [formik?.values?.card_accountType]);

    useEffect(() => {
        setSelectedSegmentType(paymentProviderData?.SelectedSegment);
    }, [paymentProviderData?.SelectedSegment]);

    useEffect(() => {
        if (equalString(selectedSegmentType, 'Credit Card')){
            formik.setFieldValue('card_accountType', 1);
        } else if (equalString(selectedSegmentType, 'ECheck')){
            formik.setFieldValue('card_accountType', 2);
        }
    }, [selectedSegmentType])

    return (
        <Flex vertical={true} gap={token.padding}>
            {(anyInList(paymentTypes) && !toBoolean(hideFields?.accountType)) &&
                <FormSelect
                    formik={formik}
                    name='card_accountType'
                    label='Account Type'
                    options={paymentTypes}
                    required={true}
                    propText='Text'
                    propValue='Value' />
            }

            {showBillingInformation &&
                <>
                    <Flex vertical={true} gap={token.paddingLG}>
                        <Title level={3}>Billing Information</Title>

                        <Flex gap={token.padding} vertical={true}>
                            {!toBoolean(hideFields?.firstLastName) &&
                                <>
                                    <FormInput label="First Name"
                                               formik={formik}
                                               required={true}
                                               name='card_firstName'
                                    />

                                    <FormInput label="Last Name"
                                               formik={formik}
                                               required={true}
                                               name='card_lastName'
                                    />
                                </>
                            }

                            <FormInput label="Street Address"
                                       formik={formik}
                                       name='card_streetAddress' />

                            {!toBoolean(hideFields?.address2) &&
                                <FormInput label="Street Address2"
                                           formik={formik}
                                           name='card_streetAddress2' />
                            }

                            <FormInput label="City"
                                       formik={formik}
                                       name='card_city' />

                            <Flex gap={token.padding}>
                                <FormStateProvince formik={formik}
                                                   dropdown={toBoolean(showStatesDropdown)}
                                                   uiCulture={uiCulture}
                                                   name='card_state'
                                />

                                <FormInput label={isNonUsCulture() ? 'Postal Code' : 'Zip Code'}
                                           formik={formik}
                                           name='card_zipCode' />
                            </Flex>

                            {!toBoolean(hideFields?.phoneNumber) &&
                                <FormInput label={'Phone Number'}
                                           formik={formik}
                                           name='card_phoneNumber' />
                            }

                            {equalString(paymentProvider, 1) &&
                                <FormSelect
                                    formik={formik}
                                    name='card_country'
                                    label='Country'
                                    options={getAllCountries()}
                                    required={true}
                                    propText='Name'
                                    propValue='Code'/>
                            }
                        </Flex>
                    </Flex>
                </>
            }

            {showBillingInformation &&
                <Divider className={globalStyles.noMargin} />
            }

            <>
                <Flex vertical={true} gap={token.paddingLG}>
                    <Title level={3}>Payment Information</Title>

                    <Flex vertical={true} gap={token.padding}>
                        {(toBoolean(paymentProviderData?.ShowSegment)) &&
                            <Segmented options={['Credit Card', 'eCheck']}
                                       defaultValue={selectedSegmentType}
                                       block
                                       onChange={(e) => { setSelectedSegmentType(e) }} />
                        }

                        {(equalString(selectedSegmentType, 'eCheck')) &&
                            <>
                                <FormPaymentProfileECheck formik={formik}
                                                          isUsingCollectJs={isUsingCollectJs}
                                                          validationMessages={validationMessages}
                                                          isUsingCollectJsLoading={isUsingCollectJsLoading} />
                            </>
                        }

                        {(equalString(selectedSegmentType, 'Credit Card')) &&
                            <>
                                {/*CARD CONNECT*/}
                                {(equalString(paymentProvider, 1)) &&
                                    <FormPaymentProfileCardConnect formik={formik} />
                                }

                                {/*STRIPE*/}
                                {(equalString(paymentProvider, 2)) &&
                                    <FormPaymentProfileStripe stripeCardElementRef={stripeCardElementRef}
                                                              stripeKey={stripeKey}
                                                              setStripeCardElement={setStripeCardElement}
                                                              setStripe={setStripe}
                                                              setValidationMessage={setValidationMessage}
                                                              validationMessage={validationMessage} />
                                }

                                {/*SAFESAVE*/}
                                {(equalString(paymentProvider, 3)) &&
                                    <FormPaymentProfileSafeSave formik={formik}
                                                                isUsingCollectJs={isUsingCollectJs}
                                                                stripeKey={stripeKey}
                                                                validationMessages={validationMessages}
                                                                setFieldValidity={setFieldValidity}
                                                                setValidationMessages={setValidationMessages}
                                                                resolvePaymentRequest={resolvePaymentRequest}
                                                                rejectPaymentRequest={rejectPaymentRequest}
                                                                setIsUsingCollectJsLoading={setIsUsingCollectJsLoading}
                                                                isUsingCollectJsLoading={isUsingCollectJsLoading}
                                                                isEcheck={equalString(selectedSegmentType, 'eCheck')}
                                    />
                                }

                                {(allowToSavePaymentProfile) &&
                                    <FormSwitch label={'Save Payment Profile'}
                                                formik={formik}
                                                name={'card_savePaymentProfile'}/>
                                }
                            </>
                        }
                    </Flex>
                </Flex>
            </>
        </Flex>
    );
})

export default FormPaymentProfile;