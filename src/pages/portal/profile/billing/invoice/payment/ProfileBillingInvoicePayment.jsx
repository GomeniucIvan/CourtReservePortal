import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, notValidScroll, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, Segmented, Skeleton, Typography, Badge, Card} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import * as React from "react";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {cx} from "antd-style";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
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
import {removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useTranslation} from "react-i18next";
import FormPaymentProfile from "@/form/formpaymentprofile/FormPaymentProfile.jsx";
import {orgCardCountryCode} from "@/utils/OrganizationUtils.jsx";
const {Title} = Typography;

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
            let isValidPaymentProfile = validatePaymentProfile(t, formik, true, modelData);
            return isValidPaymentProfile;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            if (paymentProfileRef.current) {
                setIsLoading(true);

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

                let postModel = {
                    AccountType: values?.card_accountType,
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
                }

                let response = await appService.post(`/app/Online/PaymentOptions/AddPaymentOption?id=${orgId}`, postModel);
                if (toBoolean(response?.IsValid)) {
                    removeLastHistoryEntry();
                    pNotify('Payment Profile Created.')
                    navigate(response.Data.RedirectUrl);
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
            }
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
            formik.setFieldValue('card_country', orgCardCountryCode(data.PartialUiCulture));
            
            setModelData(data);

            console.log(data);
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
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    onClick={() => {
                        
                    }}>
                Pay
            </Button>
        </FooterBlock>);

        loadData();
    }, [])
    
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

            {!isFetching &&
                <FormPaymentProfile formik={formik}
                                    isPaymentProfile={true}
                                    includeCustomerDetails={true}
                                    allowToSavePaymentProfile={false}
                                    ref={paymentProfileRef}
                                    showStatesDropdown={toBoolean(modelData?.ShowStatesDropdown)}
                                    hideFields={{
                                        firstLastName: false,
                                        address2: true,
                                        phoneNumber: false,
                                        accountType: false
                                    }}
                                    paymentProviderData={{
                                        ...invoiceDetails,
                                        SelectedSegment: !toBoolean(modelData.PreventPlayersFromCreatingACreditCardPaymentProfile) ? 'Credit Card' : toBoolean(modelData.AllowMembersToCreateAchProfiles) ? 'eCheck' : '',
                                        ShowSegment: (!toBoolean(modelData.PreventPlayersFromCreatingACreditCardPaymentProfile) && toBoolean(modelData.AllowMembersToCreateAchProfiles))
                                    }}
                                    paymentTypes={modelData?.AccountTypesSelectListItems}
                />
            }
        </PaddingBlock>
    )
}

export default ProfileBillingInvoicePayment
