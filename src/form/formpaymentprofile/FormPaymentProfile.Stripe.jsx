import React, {useRef, useState, forwardRef, useImperativeHandle, useEffect} from 'react';
import {Typography} from 'antd';
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {addCypressTag} from "@/utils/TestUtils.jsx";
const { Paragraph } = Typography;

const FormPaymentProfileStripe = React.forwardRef(({ stripeCardElementRef,
                                                       validationMessage,
                                                       stripeKey,
                                                       setStripeCardElement,
                                                       setStripe,
                                                       setValidationMessage}, ref) => {

    const hidePostalCode = false;
    const workingFontFamily = 'Inter'; //cshtml
    const {token, globalStyles} = useApp();
    
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
                            color: token.Form.colorError,
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
                <label htmlFor='card_number' className={globalStyles.globalLabel}>
                    Card Number
                    <span style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>
                </label>
                <span className='p-relative'>
                            <div ref={stripeCardElementRef} style={{
                                border: '1px solid #dfdfdf',
                                borderRadius: '8px',
                                paddingTop: '12px',
                                paddingLeft: '10px',
                                height: '26px'
                            }}>

                            </div>
                        </span>
                {validationMessage &&
                    <Paragraph {...addCypressTag(`error-${name}`)} className={cx(globalStyles.formError, 'ant-input-status-error')}>
                        {validationMessage}
                    </Paragraph>
                }
            </div>
        </>
    );
})

export default FormPaymentProfileStripe;