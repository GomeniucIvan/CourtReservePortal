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
import {getConfigValue} from "@/config/WebConfig.jsx";
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

function ProfileBillingPayment({}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [paymentModel, setPaymentModel] = useState(null);
    const [organizationData, setOrganizationData] = useState(null);
    const {setIsLoading, isLoading, token} = useApp();
    const {orgId, authData} = useAuth();
    const { t } = useTranslation('payment');
    const recaptchaRef = useRef(null);
    let captchaKey = getConfigValue('GoogleCaptchaKey_V3');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    //url params
    const payments = queryParams.get("payments");
    const reservationId = queryParams.get("reservationId");
    const resMemberId = queryParams.get("resMemberId");
    const sessionId = queryParams.get("sessionId");

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

    const {setHeaderRightIcons} = useHeader();

    const {
        setIsFooterVisible,
        setFooterContent,
        shouldFetch,
        resetFetch,
    } = useApp();

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')

        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    disabled={isFetching}
                    loading={isLoading}
                    htmlType="submit"
                    onClick={() => {
                        formik.submitForm();
                    }}>
                {(isFetching || 1 == 1) ? 'Pay' : `Pay ${costDisplay(paymentModel?.CalculateTotal)}`}
            </Button>
        </FooterBlock>)
    }, [isFetching, isLoading]);

    const loadData = async (refresh) => {
        setIsFetching(true);
        let innerPayments = payments;

        if (isNullOrEmpty(innerPayments)){
            let response = await appService.get(navigate, `/app/Online/MyBalance/PayMyBalance?id=${orgId}&reservationId=${nullToEmpty(reservationId)}&resMemberId=${nullToEmpty(resMemberId)}&sessionId=${nullToEmpty(sessionId)}`);
            if (toBoolean(response?.IsValid)) {
                innerPayments = response.Data.payments;
            }
        }

        let paymentsResponse = await appService.get(navigate,`/app/Online/MyBalance/ProcessTransactionPayments?id=${orgId}&payments=${innerPayments}` );
        if (toBoolean(paymentsResponse?.IsValid)){
            let paymentsData = paymentsResponse.Data;
            let paymentsModel = paymentsData.Model;
            setPaymentModel(paymentsModel);
            setOrganizationData(paymentsData.OrganizationData);

            if (anyInList(paymentsModel?.Profiles)) {
                let firstProfile = paymentsModel?.Profiles[0];
                formik.setFieldValue('card_paymentProfileId', firstProfile.Id);
                formik.setFieldValue('card_accountType', 1);
            }

            formik.setFieldValue('card_firstName', paymentsModel?.BillingInformation?.FirstName);
            formik.setFieldValue('card_lastName', paymentsModel?.BillingInformation?.LastName);
            formik.setFieldValue('card_streetAddress', paymentsModel?.BillingInformation?.Address1);
            formik.setFieldValue('card_city', paymentsModel?.BillingInformation?.City);
            formik.setFieldValue('card_state', paymentsModel?.BillingInformation?.State);
            formik.setFieldValue('card_zipCode', paymentsModel?.BillingInformation?.ZipCode);
            formik.setFieldValue('card_phoneNumber', paymentsModel?.BillingInformation?.PhoneNumber);

            setIsFetching(false);
        } else {
            if (isNullOrEmpty(response?.Message)){
                if (!isNullOrEmpty(response?.Data?.RedirectUrl)){
                    navigate(response?.Data?.RedirectUrl);
                }
            } else {
                displayMessageModal({
                    title: 'Error',
                    html: (onClose) => `${response?.Message}.`,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {
                        if (!isNullOrEmpty(response?.Data?.RedirectUrl)){
                            navigate(response?.Data?.RedirectUrl);
                        }
                    },
                })
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
                                        paymentProviderData={organizationData}
                                        paymentTypes={memberPaymentProfiles(paymentModel.Profiles, true)}
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
            }
        </PaddingBlock>
    )
}

export default ProfileBillingPayment