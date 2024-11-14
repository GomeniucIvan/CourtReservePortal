import React, {useEffect, useState} from "react";
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

function ProfileBillingPayment({}) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [paymentModel, setPaymentModel] = useState(null);
    const {setIsLoading, isLoading} = useApp();
    const {orgId, authData} = useAuth();

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
        disclosureAgree: false,
        hiddenFortisTokenId: '',
    };

    const validationSchema = Yup.object({
      
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

           
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
                    loading={isSubmitting}
                    htmlType="submit"
                    onClick={() => {

                    }}>
                {isFetching ? 'Pay' : `Pay ${costDisplay(paymentModel.CalculateTotal)}`}
            </Button>
        </PaddingBlock>)
    }, [isFetching, isSubmitting]);

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
                
                console.log(paymentsModel)
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
                                <Skeleton.Button active={true} block style={{height: `40px`}}/>
                            </Flex>
                        </div>
                    ))}
                </Flex>
            }
            
            {!isFetching &&
                <>
                    <FormPaymentProfile form={formik}
                                        includeCustomerDetails={true}
                                        allowToSavePaymentProfile={true}
                                        paymentTypes={memberPaymentProfiles(paymentModel.Profiles, true)}
                    />

                    <Divider />
                    
                    <FormInputDisplay label={'Subtotal'} value={costDisplay(paymentModel.CalculateTotal)}/>
                    <FormInputDisplay label={'Total Due'} value={costDisplay(paymentModel.CalculateTotal)}/>
                </>
            }
        </PaddingBlock>
    )
}

export default ProfileBillingPayment