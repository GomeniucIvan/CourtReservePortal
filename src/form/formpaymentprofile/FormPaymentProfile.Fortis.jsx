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
const { Paragraph } = Typography;

let resolvePaymentRequest, rejectPaymentRequest;

const FormPaymentProfileFortis = React.forwardRef(({ formik,
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
    const [fortisCardSwiped, setFortisCardSwiped] = useState(false);
    const [innerAccountType, setInnerAccountType] = useState(false);
    const [isFortisInitialized, setIsFortisInitialized] = useState(false);
    const [isUsingCollectJsLoading, setIsUsingCollectJsLoading] = useState(true);

    const tokenizerUrl = getConfigValue('CardConnect_TokenizerURL');
    const stripeCardElementRef = useRef(null);
    const fortisElementRef = useRef(null);
    const hidePostalCode = false;
    const workingFontFamily = 'Inter'; //cshtml
    const [fortisElements, setFortisElements] = useState(null);
    const [fortisTokenId, setFortisTokenId] = useState(null);
    const [validationMessages, setValidationMessages] = useState({});
    const {authData} = useAuth();
    const {token, globalStyles} = useApp();

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

    let metaCardConnectCard = null;
    let cardNumberField = null;

    if (equalString(paymentProvider, 1)) {
        if (formik && typeof formik.getFieldProps === 'function') {
            cardNumberField = formik.getFieldProps('card_number');
            metaCardConnectCard = formik.getFieldMeta('card_number');
        }
    }
    let cardConnectCardHasError = metaCardConnectCard && metaCardConnectCard.error && metaCardConnectCard.touched;

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
                else if (equalString(paymentProvider, 4) && fortisElementRef) {
                    if (isNullOrEmpty(fortisTokenId)) {
                        const tokenPromise = new Promise((resolve, reject) => {
                            fortisElements.promiseResolve = resolve;
                            fortisElements.promiseReject = reject;
                            fortisElements.submit();
                        });

                        const result = await tokenPromise;
                        isValid = result.isValid;
                        if (!toBoolean(isValid)) {
                            errorMessage = result.message || 'An unknown error occurred';
                        } else {
                            setFortisTokenId(result.tokenId);
                        }
                    } else {
                        //already set token
                        isValid = true;
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

    //paymentProvider 1 = CardConnect
    //paymentProvider 2 = Stripe
    //paymentProvider 3 = SafeSave
    //paymentProvider 4 = Fortis

    //Card Connect Only!
    useEffect(() => {
        if (equalString(paymentProvider, 1)) {
            const handleMessage = (event) => {
                if (event && event.data !== "recaptcha-setup") {
                    let token = '';

                    try {
                        token = JSON.parse(event.data);
                    } catch (e) {

                    }

                    if (token) {
                        formik.setFieldValue("card_number", token.message);
                        const validationMsg = token.validationError;
                        setValidationMessage(validationMsg);
                    }
                }
            };

            window.addEventListener('message', handleMessage, false);

            // Cleanup
            return () => {
                window.removeEventListener('message', handleMessage, false);
            };
        }
    }, []);

    //Stripe Only!
    useEffect(() => {
        const loadAndInitializeStripe = async () => {
            let localStripe;
            if (window.Stripe) {
                localStripe = window.Stripe(stripeKey);

                setStripe(localStripe);
                initializeStripeElements(localStripe);
            } else {
                const script = document.createElement('script');
                script.src = 'https://js.stripe.com/v3/';
                document.body.appendChild(script);
                script.onload = () => {
                    localStripe = window.Stripe(stripeKey);
                    setStripe(localStripe);
                    initializeStripeElements(localStripe);
                };
            }
        };

        const initializeStripeElements = (localStripe) => {
            //not initialize on echeck
            if (stripeCardElementRef.current) {
                let elementsOptions = {
                    locale: 'en'
                };

                if (workingFontFamily) {
                    elementsOptions.fonts = [{
                        cssSrc: `https://fonts.googleapis.com/css?family=${encodeURIComponent(workingFontFamily)}`,
                    }];
                }

                const elements = localStripe.elements(elementsOptions);
                const localCardElement = elements.create('card', {
                    style: {
                        base: {
                            fontFamily: workingFontFamily,
                            fontSize: '16px',
                            letterSpacing: "0.2px",
                            padding: '16px',
                            lineHeight: '16px',
                            '::placeholder': {
                                color: '#aab7c4'
                            }
                        },
                        invalid: {
                            color: '#fa755a',
                            iconColor: '#9fa19c'
                        }
                    },
                    hidePostalCode
                });

                localCardElement.mount(stripeCardElementRef.current);
                setStripeCardElement(localCardElement);

                localCardElement.addEventListener('change', (event) => {
                    if (event.error) {
                        setValidationMessage(event?.error?.message);
                    } else {
                        setValidationMessage('');
                    }
                });
            }
        };

        if (equalString(paymentProvider, 2) && (stripeCardElementRef.current && setShowCardDetails || showECheckDetails)) {
            //doto when value is prepopulated
            loadAndInitializeStripe();
        }
    }, [stripeKey, hidePostalCode, workingFontFamily, setShowCardDetails, stripeCardElementRef.current, showECheckDetails]);

    //SafeSave Only!
    useEffect(() => {
        const loadAndInitializeCollectSafeSave = (isEcheck) => {
            setIsUsingCollectJsLoading(true);
            const script = document.createElement('script');
            script.src = 'https://secure.safesavegateway.com/token/Collect.js';
            script.setAttribute('data-tokenization-key', stripeKey);
            script.setAttribute('data-google-font', 'Inter');
            script.setAttribute('data-variant', 'inline');

            script.setAttribute('data-custom-css', JSON.stringify({
                "min-height": "41px",
                "display": "block",
                "width": "100%",
                "height": "38px",
                "padding": "2px 8px",
                "font-family": "Inter",
                "font-size": "14px",
                "font-weight": "400",
                "line-height": "1.5",
                "color": "rgb(73, 80, 87)",
                "background-color": "rgb(255, 255, 255)",
                "background-clip": "padding-box",
                "border-color": "#dfdfdf",
                "border-style": "solid",
                "border-width": "1px",
                "transition": "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                "margin-bottom": "0px",
                "border-radius": "8px",
                "box-shadow": "none",
            }));

            script.setAttribute('data-invalid-css', JSON.stringify({
                "background-color": "",
                "color": "red"
            }));
            script.setAttribute('data-valid-css', JSON.stringify({
                "background-color": "",
                "color": "black"
            }));

            document.body.appendChild(script);

            script.onload = () => {
                const config = {
                    "variant": "inline",
                    "tokenizationKey": stripeKey,
                    'validationCallback': function (field, status, message) {
                        setFieldValidity(prev => ({
                            ...prev,
                            [field]: status
                        }));

                        setValidationMessages(prev => ({
                            ...prev,
                            [field]: status ? '' : message
                        }));

                        console.log(`${field} is now ${status ? 'valid' : 'invalid'}: ${message}`);
                    },
                    "timeoutDuration": 10000,
                    "timeoutCallback": function () {
                        //enableButtonsByClass('btn-submit');
                        //enableButtonsByClass('submit-btn');
                    },
                    "fieldsAvailableCallback": function () {
                        //showLabels @(Model.SourcePage)();
                    },
                    'callback': function (response) {
                        if (response.token) {
                            //return result to promise function
                            formik.setFieldValue("card_number", response.token);
                            resolvePaymentRequest(response);
                        } else {
                            //timeout
                            rejectPaymentRequest(new Error(response.error || 'Unknown error'));
                        }
                    }
                };

                if (isEcheck) {
                    config["fields"] = {
                        "checkname": {
                            "selector": "#check-name",
                            "placeholder": "Account Holder Name",
                            "title": "preventredirect"
                        },
                        "checkaba": {
                            "selector": "#check-routingnumber",
                            "placeholder": "Routing Number",
                            "title": "preventredirect"
                        },
                        "checkaccount": {
                            "selector": "#check-accountnumber",
                            "placeholder": "Account Number",
                            "title": "preventredirect"
                        }
                    };
                } else {
                    config["fields"] = {
                        "ccnumber": {
                            "selector": "#card-number",
                            "placeholder": "Card Number",
                            "title": "preventredirect"
                        },
                        "ccexp": {
                            "selector": "#card-expiry",
                            "placeholder": "MM/YY",
                            "title": "preventredirect"
                        },
                        "cvv": {
                            "selector": "#card-cvc",
                            "placeholder": "Security Code (CVV)",
                            "title": "preventredirect"
                        }
                    };
                }

                CollectJS.configure(config);

                setTimeout(function () {
                    setIsUsingCollectJsLoading(false);
                }, 1700);
            }
        }

        if (equalString(paymentProvider, 3) && toBoolean(isUsingCollectJs)) {
            if (equalString(formik?.values?.card_accountType, 1)) {
                setFieldValidity(prev => ({
                    ...prev,

                    'ccnumber': false,
                    'ccexp': false,
                    'cvv': false,

                    'checkname': true,
                    'checkaba': true,
                    'checkaccount': true,
                }));

                loadAndInitializeCollectSafeSave();

            } else if (equalString(formik?.values?.card_accountType, 2)) {

                setFieldValidity(prev => ({
                    ...prev,

                    'ccnumber': true,
                    'ccexp': true,
                    'cvv': true,

                    'checkname': false,
                    'checkaba': false,
                    'checkaccount': false,
                }));

                loadAndInitializeCollectSafeSave(true);
            }
        }
    }, [formik?.values?.card_accountType]);

    //Fortis Only!
    useEffect(() => {
        if (equalString(paymentProvider, 4)) {
            showFortisPaymentForm();
        }
    }, [fortisElementRef.current]);

    //conv fee
    useEffect(() => {
        checkConvinienceFeeDisplay(formik?.values?.card_accountType);
    }, [paymentFrequencyCost, formik?.values?.card_accountType])

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.card_accountType)){
            accountTypeChange(formik?.values?.card_accountType, true);
        }
    }, [])

    const cssCardConnect = "form{display:flex;height: 44px;}input{height: 36px;width: 100%;border-radius:8px;border: 1px solid #dfdfdf;padding-left: 12px;font-size: 14px;font-family: system-ui;outline: none;}body{margin: 0;}";
    const encodedCssCardConnect = encodeURIComponent(cssCardConnect);

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
        setInnerAccountType(selectedValue);

        if (!isInitialCall){
            if (typeof onAccountTypeChange === 'function') {
                onAccountTypeChange(selectedValue);
            }
        }

        if (equalString(paymentProvider, 4)) {
            showFortisPaymentForm();
        }
    }

    const fortisCheckIfCardIsSwiped = () => {
        return toBoolean(fortisCardSwiped);
    }

    const getSelectedMethodType = () => {
        let methodtoReturn = null;
        let methodType = innerAccountType;

        if (equalString(sourcePage, PAYMENT_FORTIS_SOURCE_POS)) {
            //todo
        }

        if (equalString(sourcePage, PAYMENT_FORTIS_SOURCE_PortalPayment)) {
            if (isNullOrEmpty(methodType)) {
                return FortisPaymentType_CreditCard;
            }
        }

        if (isNullOrEmpty(methodType)) {
            return;
        }

        if (equalString(sourcePage, PAYMENT_FORTIS_SOURCE_POS)) {
            if (equalString(methodType, FortisPaymentType_CreditCard)) {
                //methodReurn = FortisPaymentType_CreditCard;
            }
        } else {
            if (equalString(sourcePage, PAYMENT_FORTIS_SOURCE_CreatePaymentProfileAdmin) ||
                equalString(sourcePage, PAYMENT_FORTIS_SOURCE_PortalRequestAccess) ||
                equalString(sourcePage, PAYMENT_FORTIS_SOURCE_CreatePaymentProfilePortal) ||
                equalString(sourcePage, PAYMENT_FORTIS_SOURCE_CreateMember)) {
                if (toBoolean(methodType, FortisPaymentType_CreditCard)) {
                    methodtoReturn = FortisPaymentType_CreditCard;
                }
                if (toBoolean(showECheckDetails)) {
                    methodtoReturn = FortisPaymentType_Ach;
                }
            } else {
                if (equalString(methodType, TransactionPaymentTypeEnum_CreditCardSwipe)) {
                    methodtoReturn = FortisPaymentType_CreditCard;
                }
            }
        }

        return methodtoReturn;
    }

    const getFinalPaymentAmount = () => {
        if (isNullOrEmpty(calculateTotalToPay())) {
            return 0;
        }
        return calculateTotalToPay();
    }

    const showFortisPaymentForm = () => {
        if (isFortisInitialized) {
            return;
        }

        if (fortisElementRef.current) {
            fortisElementRef.current.innerHTML = '';
        }

        const selectedMethod = getSelectedMethodType();

        if (isNullOrEmpty(selectedMethod) || fortisCheckIfCardIsSwiped()) {
            return;
        }

        let saveProfile = false;
        let view = 'default';
        const elements = document.getElementsByClassName('progress-section');
        for (const element of elements) {
            element.classList.remove('hide');
        }
        let isCreateProfile = false;

        if (!equalString(sourcePage, PAYMENT_FORTIS_SOURCE_CreatePaymentProfileAdmin) &&
            !equalString(sourcePage, PAYMENT_FORTIS_SOURCE_CreateMember) &&
            !equalString(sourcePage, PAYMENT_FORTIS_SOURCE_PortalPayment) &&
            !equalString(sourcePage, PAYMENT_FORTIS_SOURCE_PortalRequestAccess)) {

            //isCreateProfile = true;
        }

        if (!equalString(sourcePage, PAYMENT_FORTIS_SOURCE_CreatePaymentProfileAdmin) &&
            !equalString(sourcePage, PAYMENT_FORTIS_SOURCE_CreateMember) &&
            !equalString(sourcePage, PAYMENT_FORTIS_SOURCE_PortalRequestAccess)) {

            if (equalString(selectedMethod, PaymentProfileAccountType_Card)) {
                view = 'card-single-field';
            }
        }

        let amount = 0;
        if (equalString(sourcePage, PAYMENT_FORTIS_SOURCE_PayTransactionAdmin) ||
            equalString(sourcePage, PAYMENT_FORTIS_SOURCE_PortalRequestAccess)) {
            amount = getFinalPaymentAmount();

            if (equalString(sourcePage, PAYMENT_FORTIS_SOURCE_PortalRequestAccess)) {
                saveProfile = true;
            }
        }

        if (equalString(sourcePage, PAYMENT_FORTIS_SOURCE_PortalPayment)) {
            amount = getFinalPaymentAmount();
            saveProfile = $(".save-profile-box").is(":checked");
        }

        if (!isFortisInitialized) {
            setIsFortisInitialized(true);
            setTimeout(function () {
                //one initialization
                setIsFortisInitialized(false);
            }, 1000)
        }

        $.ajax({
            url: `${PaymentSetup.FortisTransactionIntentUrl}&methodType=${selectedMethod}&amount=${amount}&saveAccount=${saveProfile}&joinOrgId=${joinOrgId}`,
            type: 'POST',
            success: function (data) {
                if (data.isValid) {
                    const newFortisElements = new Commerce.elements(data.client_token);
                    newFortisElements.create({
                        container: '#fortis-element-wrapper',
                        theme: 'default',
                        environment: PaymentSetup.FortisElementEvironment,
                        view: view,
                        showReceipt: false,
                        showSubmitButton: false,
                        hideAgreementCheckbox: true,
                        hideTotal: true,
                        floatingLabels: false,
                        fields: toBoolean(isCreateProfile) === true ? {
                            billing: [
                                { name: 'address', },
                                { name: 'country', value: 'US' },
                                { name: 'state', },
                                { name: 'city', },
                                { name: 'postal_code', }
                            ]
                        } : {},

                        appearance: {
                            fontSize: '14px',
                            colorButtonSelectedBackground: '#363636',
                            colorButtonSelectedText: '#ffffff',
                            colorButtonActionBackground: '#00d1b2',
                            colorButtonActionText: '#ffffff',
                            colorButtonBackground: '#ffffff',
                            colorButtonText: '#363636',
                            colorFieldBackground: '#ffffff',
                            colorFieldBorder: '#cccccc',
                            colorText: '#46545c',
                            colorLink: '#3d80ba',
                            marginSpacing: '2px',
                            borderRadius: '4px',
                            rowMarginSpacing: '2px',
                            fontFamily: 'Montserrat'
                        }
                    });
                    newFortisElements.on('ready', function (event) {
                        $('.progress-section').addClass('hide');
                        if ($('#ach_account_type')[0]) {
                            $('#ach_account_type').val('savings');
                        }
                    });

                    newFortisElements.on('done', function (event) {
                        if (newFortisElements == null)
                            return {
                                isValid: false,
                                message: 'Invalid form',
                            };

                        let eventData = event?.data;
                        let tokenId = eventData?.id;
                        if (isNullOrEmpty(tokenId)) {
                            return {
                                isValid: false,
                                message: 'Fill all required Payment Info fields.',
                            }
                        }

                        formik.setFieldValue("hiddenFortisTokenId", tokenId);
                        formik.setFieldValue("card_number", tokenId);

                        if (newFortisElements.promiseResolve) {
                            newFortisElements.promiseResolve({
                                isValid: true,
                                tokenId: tokenId,
                            });
                            newFortisElements.promiseResolve = null;
                        }
                    });

                    newFortisElements.on('error', function (event) {
                        setBtnIsLoading(false);
                    });

                    newFortisElements.on('validationError', function (event) {
                        setBtnIsLoading(false);
                    });

                    setFortisElements(newFortisElements);
                } else {
                    displayMessageModal({
                        title: "Validation error",
                        html: (onClose) => data.error,
                        type: "error",
                        buttonType: modalButtonType.DEFAULT_CLOSE,
                        onClose: () => {},
                    })

                    setBtnIsLoading(false);
                }
            },
            error: function (xhr, status, error) {
                setBtnIsLoading(false);
            }
        });
    };

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
                    {toBoolean(isUsingCollectJs) &&
                        <>
                            {toBoolean(isUsingCollectJsLoading) &&
                                <>
                                    <div className="react-form-block ">
                                        <Skeleton.Input active={true} block={true} style={{ width: '100%' }} />
                                    </div>

                                    <div className="react-form-block ">
                                        <Skeleton.Input active={true} block={true} style={{ width: '100%' }} />
                                    </div>
                                    <div className="react-form-block ">
                                        <Skeleton.Input active={true} block={true} style={{ width: '100%' }} />
                                    </div>
                                </>
                            }

                            <span style={{ opacity: (isUsingCollectJsLoading ? 0 : 1), position: (isUsingCollectJsLoading ? 'absolute' : 'initial'), top: (isUsingCollectJsLoading ? '-100vh' : '0px') }}>
                            <div className="react-form-block ">
                                <label htmlFor='checkName' className={`required-label`}>Account Holder Name</label>

                                <div className="p-relative">
                                    <div id="check-name"></div>
                                    {validationMessages.checkname && (
                                        <div className="form-invalid">{validationMessages.checkname}</div>
                                    )}
                                </div>
                            </div>
                            <div className="react-form-block ">
                                <label htmlFor='checkRoutingNumber' className={`required-label`}>Routing Number</label>

                                <div className="p-relative">
                                    <div id="check-routingnumber"></div>
                                    {validationMessages.checkaba && (
                                        <div className="form-invalid">{validationMessages.checkaba}</div>
                                    )}
                                </div>
                            </div>
                            <div className="react-form-block ">
                                <label htmlFor='checkAccountNumber' className={`required-label`}>Account Number</label>

                                <div className="p-relative">
                                    <div id="check-accountnumber"></div>
                                    {validationMessages.checkaccount && (
                                        <div className="form-invalid">{validationMessages.checkaccount}</div>
                                    )}
                                </div>
                            </div>
                        </span>
                        </>
                    }

                    {!toBoolean(isUsingCollectJs) &&
                        <>
                            <FormInput label='Routing Number'
                                       formik={formik}
                                       name='card_routingNumber'
                                       placeholder='Routing Number'
                                       required={true}
                            />

                            <FormInput label='Account Number'
                                       formik={formik}
                                       name='card_accountNumber'
                                       placeholder='Account Number'
                                       required={true}
                            />
                        </>
                    }
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
            
            {/*STRIPE*/}
            {(equalString(paymentProvider, 1) && showCardDetails) &&
                <>
                    <div className={cx(globalStyles.formBlock)}>
                        <label htmlFor='card_number' className={globalStyles.globalLabel}>
                            Card Number
                            <span style={{
                                color: token.Form.labelRequiredMarkColor,
                                marginLeft: token.Form.marginXXS
                            }}>*</span>
                        </label>

                        <iframe
                            id="tokenFrame"
                            name="tokenFrame"
                            src={`${tokenizerUrl}?invalidinputevent=true&tokenizewheninactive=true&inactivityto=2500&css=${encodedCssCardConnect}`}
                            frameBorder="0"
                            scrolling="no"
                            style={{
                                width: '100%',
                                height: '40px'
                            }}
                        />

                        {validationMessage ?
                            (<Paragraph style={{
                                color: token.Form.colorError,
                                marginLeft: token.Form.labelColonMarginInlineStart
                            }}>
                                {validationMessage}
                            </Paragraph>) :
                            (<>{cardConnectCardHasError && metaCardConnectCard && typeof metaCardConnectCard.error === 'string' ? (
                                <Paragraph style={{
                                    color: token.Form.colorError,
                                    marginLeft: token.Form.labelColonMarginInlineStart
                                }}>
                                    {metaCardConnectCard.error}
                                </Paragraph>
                            ) : null}</>)
                        }
                    </div>

                    <Flex gap={token.padding}>
                        <FormInput label='Expiry Date'
                                   formik={formik}
                                   name='card_expiryDate'
                                   placeholder='MM/YY'
                                   mask={'XX/XX'}
                                   required={true}
                                   onlyDigits={true}
                                   maxLength='5'
                                   isExpiryDate={true}
                        />

                        <FormInput label='Security Code'
                                   formik={formik}
                                   name='card_securityCode'
                                   placeholder='Security Code'
                                   required={true}
                                   onlyDigits={true}
                                   max={9999}
                        />
                    </Flex>

                    <FormSelect
                        formik={formik}
                        name='card_country'
                        label='Country'
                        options={getAllCountries()}
                        required={true}
                        propText='Name'
                        propValue='Code'/>
                </>
            }

            {(equalString(paymentProvider, 2) && showCardDetails) &&
                <>
                    <div className={`react-form-block`}>
                        <label htmlFor='card_number' className={`required-label`}>Card Number</label>
                        <span className='p-relative'>
                            <div ref={stripeCardElementRef} style={{
                                border: '1px solid #dfdfdf',
                                borderRadius: '8px',
                                paddingTop: '12px',
                                paddingLeft: '10px'
                            }}>

                            </div>
                        </span>
                        {validationMessage &&
                            <div className='form-invalid'>{validationMessage}</div>
                        }
                    </div>
                </>
            }

            {(equalString(paymentProvider, 3) && showCardDetails) &&
                <>
                    {toBoolean(isUsingCollectJs) &&
                        <>
                            {toBoolean(isUsingCollectJsLoading) &&
                                <>
                                    <Skeleton.Input active={true} block={true} style={{width: '100%'}}/>

                                    <Flex gap={token.padding}>
                                        <Skeleton.Input active={true} block={true} style={{width: '100%'}}/>
                                        <Skeleton.Input active={true} block={true} style={{width: '100%'}}/>
                                    </Flex>
                                </>
                            }

                            <span style={{
                                opacity: (isUsingCollectJsLoading ? 0 : 1),
                                position: (isUsingCollectJsLoading ? 'absolute' : 'initial'),
                                top: (isUsingCollectJsLoading ? '-100vh' : '0px')
                            }}>
                                <div className="react-form-block ">
                                    <label htmlFor='card_number' className={`required-label`}>Card Number</label>

                                    <div className="p-relative">
                                        <div id="card-number"></div>
                                        {validationMessages.ccnumber && (
                                            <div className="form-invalid">{validationMessages.ccnumber}</div>
                                        )}
                                    </div>
                                </div>

                                <div className='react-form-block-wrap-n block-of-2'>
                                    <div className="react-form-block ">
                                        <label htmlFor='cardExpiry' className={`required-label`}>Expiry Date</label>

                                        <div className="p-relative">
                                            <div id="card-expiry"></div>
                                            {validationMessages.ccexp && (
                                                <div className="form-invalid">{validationMessages.ccexp}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="react-form-block" style={{paddingRight: '1px'}}> {/*//ifmrage ios issue, should add 1px */}
                                        <label htmlFor='cardCvv' className={`required-label`}>Security Code</label>

                                        <div className="p-relative">
                                            <div id="card-cvc"></div>
                                            {validationMessages.cvv && (
                                                <div className="form-invalid">{validationMessages.cvv}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </span>

                        </>
                    }

                    {!toBoolean(isUsingCollectJs) &&
                        <>
                            <FormInput label="Card Number"
                                       formik={formik}
                                       name='card_number'
                                       placeholder='Card Number'
                                       required={true}
                                       onlyDigits={true} />

                            <Flex gap={token.padding}>
                                <FormInput label='Expiry Date'
                                           formik={formik}
                                           name='card_expiryDate'
                                           placeholder='MM/YY'
                                           maxLength={5}
                                           required={true}
                                           isExpiryDate={true}
                                />

                                <FormInput label='Security Code'
                                           formik={formik}
                                           name='card_securityCode'
                                           placeholder='Security Code (CVV)'
                                           maxLength={4}
                                           required={true}
                                           onlyDigits={true}
                                />
                            </Flex>
                        </>
                    }
                </>
            }

            {(equalString(paymentProvider, 4) && showCardDetails) &&
                <>
                    <div className='fortis-vault-section'>
                        <div className="progress hide progress-section">
                            <div className="progress-bar progress-bar-striped progress-bar-animated"
                                 role="progressbar"
                                 aria-valuenow="100"
                                 aria-valuemin="0"
                                 aria-valuemax="100"
                                 style={{ width: `100%` }}
                            />
                        </div>

                        <div ref={fortisElementRef} id='fortis-element-wrapper' className="fortis-form-section" />
                    </div>
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

export default FormPaymentProfileFortis;