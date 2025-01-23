import React, {useRef, useState, forwardRef, useImperativeHandle, useEffect} from 'react';
import {Flex, Skeleton, Typography} from 'antd';
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
const { Paragraph } = Typography;

let resolvePaymentRequest, rejectPaymentRequest;

const FormPaymentProfile = React.forwardRef(({ formik,
                                                 paymentTypes,
                                                 convenienceFeeObj,
                                                 paymentFrequencyCost,
                                                 setBtnIsLoading,
                                                 includeCustomerDetails,
                                                 sourcePage,
                                                 calculateTotalToPay,
                                                 joinOrgId,
                                                 isPaymentProfile,
                                                 allowToSavePaymentProfile,
                                                 showStatesDropdown,
                                                 uiCulture,
                                                 orgData = {},
                                                 hideFields = {
                                                     address2: false,
                                                     phoneNumber: false
                                                 },
                                                 onAccountTypeChange}, ref) => {

    const [validationMessage, setValidationMessage] = useState('');
    const [stripe, setStripe] = useState(null);
    const [stripeCardElement, setStripeCardElement] = useState(null);
    const [showECheckDetails, setShowECheckDetails] = useState(false);
    const [showCardDetails, setShowCardDetails] = useState(false);
    const [convinienceFeeText, setConvinienceFeeText] = useState('');
    const [isUsingCollectJsLoading, setIsUsingCollectJsLoading] = useState(true);

    const stripeCardElementRef = useRef(null);
    const [validationMessages, setValidationMessages] = useState({});
    const {token} = useApp();

    let paymentProvider = orgData?.PaymentProvider;
    let stripeKey = orgData?.StripePublishableKey;
    let isUsingCollectJs = orgData?.IsUsingCollectJs;

    const [fieldValidity, setFieldValidity] = useState({
        ccnumber: false,
        ccexp: false,
        cvv: false,
        checkname: false,
        checkaba: false,
        checkaccount: false,
    });

    useImperativeHandle(ref, () => ({
        async submitCreateToken(values) {

            let isValid = false;
            let errorMessage = '';

            //credit card
            if (equalString(values.card_accountType, 1)) {
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
            else if (equalString(values.card_accountType, 2)) {
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
                            routing_number: values.card_routingNumber,
                            account_number: values.card_accountNumber,
                            account_holder_name: `${values.card_firstName} ${values.card_lastName}`,
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
    
    //conv fee
    useEffect(() => {
        checkConvinienceFeeDisplay(formik?.values?.card_accountType);
    }, [paymentFrequencyCost, formik?.values?.card_accountType])

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.card_accountType)){
            accountTypeChange(formik?.values?.card_accountType, true);
        }
    }, [])

    if (isNullOrEmpty(paymentTypes)) {
        paymentTypes = [];
    }

    const checkConvinienceFeeDisplay = (selectedAccountType) => {
        let clearConvinienceFeeText = true;

        if (equalString(selectedAccountType, 1) && !isNullOrEmpty(convenienceFeeObj) && paymentFrequencyCost) {
            if (paymentFrequencyCost > 0) {
                clearConvinienceFeeText = false;
                setConvinienceFeeText(`A CONVENIENCE FEE OF ${convenienceFeeObj.convenienceFeePercent}% WILL BE ADDED TO YOUR TOTAL CREDIT CARD PURCHASE`)
            }
        }

        if (clearConvinienceFeeText) {
            setConvinienceFeeText('');
        }
    }

    const accountTypeChange = (selectedValue, isInitialCall) => {
        setShowCardDetails(equalString(selectedValue, 1));
        setShowECheckDetails(equalString(selectedValue, 2));
        checkConvinienceFeeDisplay(selectedValue);

        if (!isInitialCall){
            if (typeof onAccountTypeChange === 'function') {
                onAccountTypeChange(selectedValue);
            }
        }

        if (equalString(paymentProvider, 4)) {
            //showFortisPaymentForm();
        }
    }

    useEffect(() => {
        let accType = formik?.values?.card_accountType;
        accountTypeChange(accType);
    }, [formik?.values?.card_accountType]);
    
    return (
        <>
            <FormSelect
                formik={formik}
                name='card_accountType'
                label='Account Type'
                options={paymentTypes}
                required={true}
                propText='Text'
                propValue='Value' />

            {(showCardDetails && !isNullOrEmpty(convinienceFeeText)) &&
                <div className='form-invalid' style={{ marginTop: '-16px', paddingBottom: '16px' }}>{convinienceFeeText}</div>
            }

            {showECheckDetails &&
                <>
                    <FormPaymentProfileECheck formik={formik} 
                                              isUsingCollectJs={isUsingCollectJs}
                                              validationMessages={validationMessages} 
                                              isUsingCollectJsLoading={isUsingCollectJsLoading} />
                </>
            }

            {(showCardDetails && toBoolean(includeCustomerDetails)) &&
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
            
            {/*CARD CONNECT*/}
            {(equalString(paymentProvider, 1) && showCardDetails) &&
               <FormPaymentProfileCardConnect formik={formik} />
            }

            {/*STRIPE*/}
            {(equalString(paymentProvider, 2) && showCardDetails) &&
                <FormPaymentProfileStripe stripeCardElementRef={stripeCardElementRef}
                                          stripeKey={stripeKey}
                                          setStripeCardElement={setStripeCardElement}
                                          setStripe={setStripe}
                                          setValidationMessage={setValidationMessage}
                                          validationMessage={validationMessage} />
            }

            {/*SAFESAVE*/}
            {(equalString(paymentProvider, 3) && showCardDetails) &&
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
                                            isEcheck={isEcheck}
                />
            }

            {(equalString(paymentProvider, 4) && showCardDetails) &&
                <>
                   
                </>
            }

            {(showCardDetails && toBoolean(includeCustomerDetails)) &&
                <>
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
                </>
            }

            {(showCardDetails && allowToSavePaymentProfile) &&
                <FormSwitch label={'Save Payment Profile'}
                            formik={formik}
                            name={'card_savePaymentProfile'}/>
            }
        </>
    );
})

export default FormPaymentProfile;