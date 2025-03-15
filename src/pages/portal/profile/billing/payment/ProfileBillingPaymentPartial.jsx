import React, {useEffect, useRef, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, nullToEmpty, toBoolean} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Divider, Flex, Skeleton, Typography} from "antd";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {orgCardCountryCode} from "@/utils/OrganizationUtils.jsx";
import * as Yup from "yup";
import FormPaymentProfile from "@/form/formpaymentprofile/FormPaymentProfile.jsx";
import {calculateConvenienceFee, costDisplay} from "@/utils/CostUtils.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import {memberPaymentProfiles} from "@/utils/SelectUtils.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import {useTranslation} from "react-i18next";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import {getConfigValue, getWebConfigValue} from "@/config/WebConfig.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {parseSafeInt, randomNumber} from "@/utils/NumberUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import ReceiptBlock from "@/components/receiptblock/ReceiptBlock.jsx";
import {getGlobalSpGuideId} from "@/utils/AppUtils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";

const {Title, Text} = Typography;

function ProfileBillingPaymentPartial({paymentModel, setIsFetching, isFetching, organizationData}) {
    const navigate = useNavigate();
    const {setIsLoading, isLoading, token} = useApp();
    const {orgId, authData} = useAuth();
    const { t } = useTranslation('payment');
    const recaptchaRef = useRef(null);
    let captchaKey = getWebConfigValue('GoogleCaptchaKey_V3');

    const initialValues = {
        ...CardConstants,
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
            let isValidPaymentProfile = true;

            if (equalString(formik?.values?.card_paymentProfileId, 1)) {
                isValidPaymentProfile = validatePaymentProfile(t, formik, true)
            }
            
            return isValidPaymentProfile;
        },
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            let captchaToken = await recaptchaRef.current.executeAsync();
            let paymentProfileId = (isNullOrEmpty(values?.card_paymentProfileId)) || equalString(values?.card_paymentProfileId, 0) ? null : values?.card_paymentProfileId;
            let accountType =  (isNullOrEmpty(values?.card_paymentProfileId)) || equalString(values?.card_paymentProfileId, 0) ? null : parseSafeInt(values?.card_accountType, '');

            const postModel = {
                //...values,
                Items: paymentModel.Items,
                Invoice: paymentModel.Invoice,
                FirstLevelPaymentType: paymentModel.FirstLevelPaymentType,
                ReCaptchaToken: captchaToken,
                Country: values?.card_country,
                BillingInformation: {
                    ...values.BillingInformation,
                    AccountType: accountType,
                    Country: values?.card_country,
                    StripeBankAccountToken: values?.card_number,
                    CardNumber: values?.card_number,
                    FirstName: values?.card_firstName,
                    LastName: values?.card_lastName,
                    PhoneNumber: values?.card_phoneNumber,
                    Address1: values?.card_streetAddress,
                    City: values?.card_city,
                    State: values?.card_state,
                    OrganizationId: orgId,
                    AccountNumber: values?.card_accountNumber,
                    RoutingNumber: values?.card_routingNumber,
                    Cvv: values?.card_securityCode,
                    ExpiryDate: values?.card_expiryDate,
                    //OrganizationMemberId: values.OrganizationMemberId,
                    ZipCode: values?.card_zipCode,
                    SaveDataForFutureUse: values?.card_savePaymentProfile,
                    PaymentProvider: organizationData.PaymentProvider,
                    PaymentProfileId: paymentProfileId
                },
            }

            let response = await appService.post(`/app/Online/MyBalance/ProcessTransactionPayments?id=${orgId}`, postModel);
            if (toBoolean(response?.IsValid)){
                pNotify("Item(s) successfully paid.");
                setIsLoading(false);

                if (!isNullOrEmpty(response.Path)) {
                    navigate(response.Path);
                } else {
                    navigate(HomeRouteNames.INDEX);
                }
            } else{
                displayMessageModal({
                    title: "Payment Error",
                    html: (onClose) => response.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })
                setIsLoading(false);
            }
        },
    });

    const {
        setFooterContent
    } = useApp();

    useEffect(() => {
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    disabled={isFetching}
                    loading={isLoading}
                    htmlType="submit"
                    onClick={() => {
                        formik.submitForm();
                    }}>
                Pay
            </Button>
        </FooterBlock>)
    }, [isFetching, isLoading]);

    
    useEffect(() => {
        if (!isNullOrEmpty(paymentModel)){
            if (anyInList(paymentModel?.Profiles)) {
                let firstProfile = paymentModel?.Profiles[0];
                formik.setFieldValue('card_paymentProfileId', firstProfile.Id);
            } else {
                //new
                formik.setFieldValue('card_paymentProfileId', 0);
            }

            formik.setFieldValue('card_accountType', 1);
            formik.setFieldValue('card_firstName', paymentModel?.BillingInformation?.FirstName);
            formik.setFieldValue('card_lastName', paymentModel?.BillingInformation?.LastName);
            formik.setFieldValue('card_streetAddress', paymentModel?.BillingInformation?.Address1);
            formik.setFieldValue('card_city', paymentModel?.BillingInformation?.City);
            formik.setFieldValue('card_state', paymentModel?.BillingInformation?.State);
            formik.setFieldValue('card_zipCode', paymentModel?.BillingInformation?.ZipCode);
            formik.setFieldValue('card_phoneNumber', paymentModel?.BillingInformation?.PhoneNumber);
            formik.setFieldValue('card_firstPaymentType', isNullOrEmpty(paymentModel?.FirstLevelPaymentType) ? 2 : 1);
            
            setIsFetching(false);
        }
    }, [paymentModel])

    let receiptItems = [];

    if(!isNullOrEmpty(paymentModel?.CalculateTotal)) {
        receiptItems.push({
            Key: '',
            Label: 'Subtotal',
            Value: costDisplay(paymentModel?.CalculateTotal)
        })
    }

    let showConvenienceFee = false;

    if (anyInList(paymentModel?.Profiles)) {
        let selectedPaymentType = paymentModel.Profiles.find(v => equalString(v.Value, formik?.values?.card_accountType));

        if (!isNullOrEmpty(selectedPaymentType) && equalString(selectedPaymentType?.AccountType, 1)) {
            showConvenienceFee = true;
        }
    }

    let convenienceFee = null;
    let total = paymentModel?.CalculateTotal;

    if (!showConvenienceFee && equalString(formik?.values?.card_accountType, 1)) {
        showConvenienceFee = true;
    }

    if (showConvenienceFee) {
        const calculatedConvenienceFee = calculateConvenienceFee(/*total*/ total, /*org*/ organizationData, /*onlyFee*/ true);
        if (!isNullOrEmpty(calculatedConvenienceFee)) {
            convenienceFee = calculatedConvenienceFee;
            total += calculatedConvenienceFee;
        }
    }

    if(!isNullOrEmpty(organizationData?.ConvenienceFeePercent) && convenienceFee > 0) {
        receiptItems.push({
            Key: 'Text',
            Label: <Text>
                Credit Card Convenience Fee <Text style={{color: token.colorError}}>{' '} ({organizationData?.ConvenienceFeePercent}%)</Text>
            </Text>,
            Value: costDisplay(convenienceFee)
        })
    }

    receiptItems.push({
        Key: 'divider'
    })

    if(!isNullOrEmpty(paymentModel?.CalculateTotal)) {
        receiptItems.push({
            Key: '',
            Label: 'Total',
            Value: costDisplay(total)
        })
    }

    return (
        <>
            <FormPaymentProfile formik={formik}
                                includeCustomerDetails={true}
                                allowToSavePaymentProfile={true}
                                paymentProviderData={organizationData}
                                hideFields={{
                                    firstLastName: false,
                                    address2: true,
                                    phoneNumber: false,
                                    accountType: false
                                }}
                                paymentTypes={memberPaymentProfiles(paymentModel?.Profiles, true)}
            />

            <Divider style={{margin: `${token.padding}px 0px`}} />

            <PaddingBlock leftRight={false}>
                <Flex vertical={true} gap={token.paddingXXL}>
                    <Title level={3}>Payment Summary</Title>

                    <Flex vertical={true} gap={token.padding}>
                        <ReceiptBlock receiptItems={receiptItems} />
                    </Flex>
                </Flex>
            </PaddingBlock>

            <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={captchaKey}
            />
        </>
    )
}

export default ProfileBillingPaymentPartial