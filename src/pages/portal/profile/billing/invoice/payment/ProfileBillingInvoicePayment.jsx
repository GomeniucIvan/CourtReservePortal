import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, notValidScroll, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, Segmented, Skeleton, Typography, Badge, Card, Divider} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import * as React from "react";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {cx} from "antd-style";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {parseSafeInt, randomNumber} from "@/utils/NumberUtils.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import * as Yup from "yup";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import {navigationClearHistory, removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useTranslation} from "react-i18next";
import FormPaymentProfile from "@/form/formpaymentprofile/FormPaymentProfile.jsx";
import {orgCardCountryCode} from "@/utils/OrganizationUtils.jsx";
import PaymentReceiptBlock from "@/components/receiptblock/PaymentReceiptBlock.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import {addSelectEmptyOption, memberPaymentProfiles} from "@/utils/SelectUtils.jsx";
import {is} from "@/components/timepicker/npm/utils/func.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import {getConfigValue, getWebConfigValue} from "@/config/WebConfig.jsx";
import {fromDateTimeStringToDateTime} from "@/utils/DateUtils.jsx";
const {Title} = Typography;

//myinvoices/payinvoice
function ProfileBillingInvoicePayment() {
    const navigate = useNavigate();
    const [modelData, setModelData] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();
    const {orgId} = useAuth();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get("invoiceId");
    const paymentProfileRef = useRef(null);
    const { t } = useTranslation('login');
    const [payWithMoneyBalance, setPayWithMoneyBalance] = useState();
    const recaptchaRef = useRef(null);
    let captchaKey = getWebConfigValue('GoogleCaptchaKey_V3');
    
    const {
        token,
        globalStyles,
        setIsFooterVisible,
        setFooterContent,
        setIsLoading,
        isLoading
    } = useApp();

    const initialValues = {
        ...CardConstants
    };

    const validationSchema = Yup.object({

    });

    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validation: () => {
            let isValidPaymentProfile = true;
            if (isNullOrEmpty(formik?.values?.card_paymentProfileId) || equalString(formik?.values?.card_paymentProfileId, 0)) {
                isValidPaymentProfile = validatePaymentProfile(t, formik, true, modelData)
            }
            return isValidPaymentProfile;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            console.log(values)
            
            if ((isNullOrEmpty(formik?.values?.card_paymentProfileId)) || equalString(formik?.values?.card_paymentProfileId, 0)) {
                // validate card
                let isValidTokenObj = await paymentProfileRef.current.submitCreateToken();
                
                if (!isValidTokenObj.isValid) {
                    setIsLoading(false);
                    displayMessageModal({
                        title: 'Error',
                        html: (onClose) => `${isValidTokenObj?.errorMessage}`,
                        type: "error",
                        buttonType: modalButtonType.DEFAULT_CLOSE,
                        onClose: () => {
                            notValidScroll();
                        },
                    })

                    return;
                }
            }

            let captchaToken = await recaptchaRef.current.executeAsync();
            let paymentProfileId = (isNullOrEmpty(values?.card_paymentProfileId)) || equalString(values?.card_paymentProfileId, 0) ? null : values?.card_paymentProfileId;
            let accountType =  (isNullOrEmpty(values?.card_paymentProfileId)) || equalString(values?.card_paymentProfileId, 0) ? null : parseSafeInt(values?.card_accountType, '');
            
            let postModel = {
                ...modelData,
                ReCaptchaToken: captchaToken,
                Profiles: [],
                Invoice: {
                    ...modelData.Invoice,
                    CreatedOn: modelData.Invoice.CreatedOnDisplay,
                    InvoiceItems: []
                },
                BillingInformation: {
                    ...modelData.BillingInformation,
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
                    OrganizationMemberId: modelData.OrganizationMemberId,
                    ZipCode: values?.card_zipCode,
                    SaveDataForFutureUse: values?.card_savePaymentProfile,
                    PaymentProvider: modelData.PaymentProvider,
                    PaymentProfileId: paymentProfileId
                },
            }

            let response = await appService.post(`/app/Online/MyInvoices/PayInvoice?id=${orgId}`, postModel);
            if (toBoolean(response?.IsValid)) {
                navigationClearHistory();
                pNotify('Invoice successfully paid.');
                let route = toRoute(ProfileRouteNames.PROFILE_BILLING_INVOICES, 'id', orgId);
                navigate(route);
            } else {
                displayMessageModal({
                    title: "Error",
                    html: (onClose) => response.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })
            }

            setIsLoading(false);
        },
    });

    const loadData = async () => {
        setIsFetching(true);

        let response = await appService.get(navigate, `/app/Online/MyInvoices/PayInvoice?id=${orgId}&invoiceId=${invoiceId}`);

        if (toBoolean(response?.IsValid)) {
            let data = response.Data;
            data = {
                ...data,
                ...data.BillingInformation
            };

            formik.setFieldValue('card_firstName', data.FirstName);
            formik.setFieldValue('card_lastName', data.LastName);
            formik.setFieldValue('card_phoneNumber', data.PhoneNumber);
            formik.setFieldValue('card_zipCode', data.ZipCode);
            formik.setFieldValue('card_city', data.City);
            formik.setFieldValue('card_state', data.State);
            formik.setFieldValue('card_streetAddress', data.Address1);
            formik.setFieldValue('card_accountType', data.BillingInformation.AccountType);
            formik.setFieldValue('card_country', orgCardCountryCode(data.PartialUiCulture));
            formik.setFieldValue('card_paymentProfileId', data.PaymentProfileId);
            setPayWithMoneyBalance(toBoolean(data.BillingInformation.PayWithMoneyBalance));
            
            setModelData(data);
        } else {
            displayMessageModal({
                title: "E",
                html: (onClose) => response.Message,
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {

                },
            })
        }

        setIsFetching(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')
        
        loadData();
    }, [])


    useEffect(() => {
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    disabled={isFetching}
                    loading={isLoading}
                    htmlType="submit"
                    onClick={() => {
                        formik.submitForm()
                    }}>
                Pay
            </Button>
        </FooterBlock>);
    }, [isFetching, isLoading]);

    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(6).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `${token.Input.controlHeight}px`}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </>
            }

            <>
                {!isFetching &&
                    <Flex vertical={true} gap={token.padding}>
                        <FormPaymentProfile formik={formik}
                                            includeCustomerDetails={true}
                                            allowToSavePaymentProfile={!toBoolean(modelData.PreventPlayersFromCreatingACreditCardPaymentProfile)}
                                            ref={paymentProfileRef}
                                            showStatesDropdown={toBoolean(modelData?.ShowStatesDropdown)}
                                            hideFields={{
                                                firstLastName: false,
                                                address2: true,
                                                phoneNumber: false,
                                                accountType: false
                                            }}
                                            paymentProviderData={{
                                                ...modelData,
                                                SelectedSegment: !toBoolean(modelData.PreventPlayersFromCreatingACreditCardPaymentProfile) ? 'Credit Card' : toBoolean(modelData.AllowMembersToCreateAchProfiles) ? 'eCheck' : '',
                                                ShowSegment: (!toBoolean(modelData.PreventPlayersFromCreatingACreditCardPaymentProfile) && toBoolean(modelData.AllowMembersToCreateAchProfiles))
                                            }}
                                            paymentTypes={anyInList(modelData?.PaymentProfilesSelectListItems) ? memberPaymentProfiles(modelData?.PaymentProfilesSelectListItems, true) : []}
                        />
                        
                        
                        {(isNullOrEmpty(formik?.values.card_paymentProfileId) || equalString(formik?.values.card_paymentProfileId, 0)) &&
                            <Divider className={globalStyles.noMargin} />
                        }
                        
                        <PaymentReceiptBlock subTotal={modelData?.Invoice?.SubTotalAmount}
                                             paymentProfiles={addSelectEmptyOption(modelData?.PaymentProfilesSelectListItems, 'New Card', '0')}
                                             payWithMoneyBalance={payWithMoneyBalance}
                                             balance={modelData?.Balance}
                                             paymentData={{
                                                 ConvenienceFeePercent: 1,
                                                 ConvenienceFeeFixedAmount: 1,
                                                 UseConvenienceFee: true,
                                                 IsUsingPackages: false,
                                             }}
                                             formik={formik}
                        />

                        <ReCAPTCHA
                            ref={recaptchaRef}
                            size="invisible"
                            sitekey={captchaKey}
                        />
                    </Flex>
                }
            </>
        </PaddingBlock>
    )
}

export default ProfileBillingInvoicePayment
