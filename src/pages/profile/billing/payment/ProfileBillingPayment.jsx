import React, {useEffect, useRef, useState} from "react";
import {useApp} from "../../../../context/AppProvider.jsx";
import {equalString, randomNumber, toBoolean} from "../../../../utils/Utils.jsx";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
import {Button, Divider, Flex, Skeleton} from "antd";
import appService from "../../../../api/app.jsx";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {orgCardCountryCode} from "../../../../utils/OrganizationUtils.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import FormPaymentProfile from "../../../../form/formpaymentprofile/FormPaymentProfile.jsx";
import {costDisplay} from "../../../../utils/CostUtils.jsx";
import FormInputDisplay from "../../../../form/input/FormInputDisplay.jsx";
import {memberPaymentProfiles} from "../../../../utils/SelectUtils.jsx";
import {emptyArray} from "../../../../utils/ListUtils.jsx";
import {validatePaymentProfile} from "../../../../utils/ValidationUtils.jsx";
import {useTranslation} from "react-i18next";
import useCustomFormik from "../../../../components/formik/CustomFormik.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import {getConfigValue} from "../../../../config/WebConfig.jsx";

function ProfileBillingPayment({}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [paymentModel, setPaymentModel] = useState(null);
    const {setIsLoading, isLoading, token} = useApp();
    const {orgId, authData} = useAuth();
    const { t } = useTranslation('payment');
    const recaptchaRef = useRef();
    let captchaKey = getConfigValue('GoogleCaptchaKey_V3');
    
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
        card_accountType: 1,
        card_routingNumber: '',
        card_accountNumber: '',
        card_savePaymentProfile: false,
        card_country: orgCardCountryCode(authData?.UiCulture),
        
        paymentFrequency: '',
        hiddenFortisTokenId: '',
    };

    const validationSchema = Yup.object({
      
    });

    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validate: () => {
            let isValidPaymentProfile = validatePaymentProfile(t, formik, true);
            return isValidPaymentProfile;
        },
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            
           let postModel = values;
           postModel.ReCaptchaToken = await recaptchaRef.current.executeAsync();
           
           let response = await appService.post(`/app/Online/ProcessPayment?id=${orgId}`, postModel);
           if (toBoolean(response?.IsValid)){
               
           } else{
               
           }
           
        },
    });
    
    const {
        setIsFooterVisible,
        setHeaderRightIcons,
        setFooterContent,
        shouldFetch,
        resetFetch,
    } = useApp();

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')

        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    disabled={isFetching}
                    loading={isLoading}
                    htmlType="submit"
                    onClick={() => {
                        formik.submitForm();
                    }}>
                {isFetching ? 'Pay' : `Pay ${costDisplay(paymentModel?.CalculateTotal)}`}
            </Button>
        </PaddingBlock>)
    }, [isFetching, isLoading]);

    const loadData = async (refresh) => {
        setIsFetching(true);
        let response = await appService.get(navigate, `/app/Online/MyBalance/PayMyBalance?id=${orgId}`);
        if (toBoolean(response?.IsValid)){
            let payments = response.Data.payments;
            
            let paymentsResponse = await appService.get(navigate,`/app/Online/MyBalance/ProcessTransactionPayments?id=${orgId}&payments=${payments}` );
            if (toBoolean(paymentsResponse?.IsValid)){
                let paymentsModel = paymentsResponse.Data;
                setPaymentModel(paymentsModel);
                setIsFetching(false);
            }
        }
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);
    
    useEffect(() => {
        loadData();
    }, []);
    
    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <Flex vertical={true} gap={16}>
                    {emptyArray(6).map((item, index) => (
                        <div key={index}>
                            <Flex vertical={true} gap={8}>
                                <Skeleton.Button active={true} block
                                                 style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                <Skeleton.Button active={true} block style={{height: `${token.Input.controlHeight}px`}}/>
                            </Flex>
                        </div>
                    ))}
                </Flex>
            }
            
            {!isFetching &&
                <>
                    <FormPaymentProfile formik={formik}
                                        includeCustomerDetails={true}
                                        allowToSavePaymentProfile={true}
                                        paymentTypes={memberPaymentProfiles(paymentModel.Profiles, true)}
                    />

                    <Divider />
                    
                    <FormInputDisplay label={'Subtotal'} value={costDisplay(paymentModel.CalculateTotal)}/>
                    <FormInputDisplay label={'Total Due'} value={costDisplay(paymentModel.CalculateTotal)}/>

                    <ReCAPTCHA
                        ref={recaptchaRef}
                        size="invisible"
                        sitekey={captchaKey}
                    />
                </>
            }
        </PaddingBlock>
    )
}

export default ProfileBillingPayment