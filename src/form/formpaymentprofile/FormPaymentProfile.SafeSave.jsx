import React, {useRef, useState, useEffect} from 'react';
import {Flex, Skeleton, Typography} from 'antd';
import {isNullOrEmpty, equalString, toBoolean} from "../../utils/Utils.jsx";
import FormInput from "../input/FormInput.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
const { Paragraph } = Typography;

const FormPaymentProfileSafeSave = React.forwardRef(({ formik,
                                                         isUsingCollectJs,
                                                         stripeKey,
                                                         validationMessages,
                                                         setFieldValidity,
                                                         setValidationMessages,
                                                         resolvePaymentRequest,
                                                         rejectPaymentRequest,
                                                         isEcheck,
                                                         setIsUsingCollectJsLoading,
                                                         isUsingCollectJsLoading
                                                     }, ref) => {

    const {token} = useApp();
    
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

        if (toBoolean(isUsingCollectJs)) {
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

    return (
        <>
            {toBoolean(isUsingCollectJs) &&
                <>
                    {toBoolean(isUsingCollectJsLoading) &&
                        <>
                            <Flex vertical={true} gap={8}>
                                <Skeleton.Button active={true} block style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                            </Flex>

                            <Flex gap={token.padding}>
                                <Flex vertical={true} gap={8} flex={1}>
                                    <Skeleton.Button active={true} block style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                                </Flex>
                                <Flex vertical={true} gap={8} flex={1}>
                                    <Skeleton.Button active={true} block style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                                </Flex>
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
    );
})

export default FormPaymentProfileSafeSave;