import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Row, Col, Card, Typography, message, Flex, Segmented} from "antd";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {Ellipsis} from "antd-mobile";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import FormPaymentProfileCardConnect from "@/form/formpaymentprofile/FormPaymentProfile.CardConnect.jsx";
import FormPaymentProfileStripe from "@/form/formpaymentprofile/FormPaymentProfile.Stripe.jsx";
import FormPaymentProfileSafeSave from "@/form/formpaymentprofile/FormPaymentProfile.SafeSave.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {membershipRequirePayment} from "@/utils/CostUtils.jsx";
import {setFormikError, validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import {getConfigValue} from "@/config/WebConfig.jsx";
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";

const { Text, Title } = Typography;

let resolvePaymentRequest, rejectPaymentRequest;

function DevPaymentProviders() {
    const {setIsFooterVisible} = useApp();
    const [selectedPaymentProvider, setSelectedPaymentProvider] = useState(1);
    const [stripeCardElement, setStripeCardElement] = useState(null);
    const stripeCardElementRef = useRef(null);
    const [stripe, setStripe] = useState(null);
    const [validationMessages, setValidationMessages] = useState({});
    const [isUsingCollectJsLoading, setIsUsingCollectJsLoading] = useState(true);
    const [validationMessage, setValidationMessage] = useState('');
    const [fieldValidity, setFieldValidity] = useState({
        ccnumber: false,
        ccexp: false,
        cvv: false,
        checkname: false,
        checkaba: false,
        checkaccount: false,
    });
    
    useEffect(() => {
        setIsFooterVisible(false);
    }, []);

    const formik = useCustomFormik({
        initialValues: {
            ...CardConstants,
            IsECheck: false,
            IsUsingCollectJs: false,
            card_accountType: '1',
        },
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
         
        },
    });
    
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={16}>
                <Segmented
                    value={selectedPaymentProvider}
                    block={true}
                    onChange={(e) => {
                        setSelectedPaymentProvider(e);
                    }}
                    options={[
                        {value: 1, label: 'Card Connect'},
                        {value: 2, label: 'Stripe'},
                        {value: 3, label: 'SafeSave'},
                    ]}
                />

                <>
                    {(equalString(selectedPaymentProvider, 1)) &&
                            <FormPaymentProfileCardConnect formik={formik} />
                    }
                    {(equalString(selectedPaymentProvider, 2)) &&
                        <FormPaymentProfileStripe stripeCardElementRef={stripeCardElementRef}
                                                  stripeKey={'pk_test_P5jkSmxRajZFzVzqehqvbbMl00irsLzIR1'}
                                                  setStripeCardElement={setStripeCardElement}
                                                  setStripe={setStripe}
                                                  setValidationMessage={setValidationMessage}
                                                  validationMessage={validationMessage} />
                    }
                    {(equalString(selectedPaymentProvider, 3)) &&
                        <>
                            <Flex vertical={true} gap={16}>
                                <FormSwitch formik={formik} name={'IsECheck'} label={'ECheck'} />
                                <FormSwitch formik={formik} name={'IsUsingCollectJs'} label={'Use Collect Js'} />

                                <FormPaymentProfileSafeSave formik={formik}
                                                            isUsingCollectJs={toBoolean(formik?.values?.IsUsingCollectJs)}
                                                            stripeKey={'pk_test_P5jkSmxRajZFzVzqehqvbbMl00irsLzIR1'}
                                                            validationMessages={validationMessages}
                                                            setFieldValidity={setFieldValidity}
                                                            setValidationMessages={setValidationMessages}
                                                            resolvePaymentRequest={resolvePaymentRequest}
                                                            rejectPaymentRequest={rejectPaymentRequest}
                                                            setIsUsingCollectJsLoading={setIsUsingCollectJsLoading}
                                                            isUsingCollectJsLoading={isUsingCollectJsLoading}
                                                            isEcheck={toBoolean(formik?.values?.IsECheck)}
                                />
                            </Flex>
                        </>
                    }
                </>
            </Flex>
        </PaddingBlock>
    );
}

export default DevPaymentProviders;