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

const FormPaymentProfileStripe = React.forwardRef(({ stripeCardElementRef,
                                                       validationMessage,
                                                       stripeKey,
                                                       setStripeCardElement,
                                                       setStripe,
                                                       setValidationMessage}, ref) => {

    const hidePostalCode = false;
    const workingFontFamily = 'Inter'; //cshtml
    
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

        if ((stripeCardElementRef.current)) {
            //doto when value is prepopulated
            loadAndInitializeStripe();
        }
    }, [stripeKey, hidePostalCode, workingFontFamily, stripeCardElementRef.current]);
    
    return (
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
    );
})

export default FormPaymentProfileStripe;