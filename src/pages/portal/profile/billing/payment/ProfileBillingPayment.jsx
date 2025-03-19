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
import ProfileBillingPaymentPartial from "@portal/profile/billing/payment/ProfileBillingPaymentPartial.jsx";

const {Title, Text} = Typography;

function ProfileBillingPayment({isProcessTransaction}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [paymentModel, setPaymentModel] = useState(null);
    const [organizationData, setOrganizationData] = useState(null);
    const {setIsLoading, isLoading, token} = useApp();
    const {orgId, authData} = useAuth();
    const { t } = useTranslation('payment');
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const {setHeaderRightIcons} = useHeader();

    //url params
    const payments = queryParams.get("payments");
    const reservationId = queryParams.get("reservationId");
    const resMemberId = queryParams.get("resMemberId");
    const sessionId = queryParams.get("sessionId");

    const {
        setIsFooterVisible,
        shouldFetch,
        resetFetch,
    } = useApp();

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')
    }, [isFetching, isLoading]);

    const loadData = async (refresh) => {
        setIsFetching(true);
        let innerPayments = payments;
        let paymentsResponse = null;
        
        if (toBoolean(isProcessTransaction)) {
            paymentsResponse = await appService.get(navigate, `/app/Online/Payments/ProcessPayment?id=${orgId}&loadHtmlContent=true`);
        } else {
            if (isNullOrEmpty(innerPayments)){
                let response = await appService.get(navigate, `/app/Online/MyBalance/PayMyBalance?id=${orgId}&reservationId=${nullToEmpty(reservationId)}&resMemberId=${nullToEmpty(resMemberId)}&sessionId=${nullToEmpty(sessionId)}`);
                if (toBoolean(response?.IsValid)) {
                    innerPayments = response.Data.payments;
                }
            }

            paymentsResponse = await appService.get(navigate,`/app/Online/MyBalance/ProcessTransactionPayments?id=${orgId}&payments=${innerPayments}` );
        }

        if (!isNullOrEmpty(paymentsResponse?.Path)){
            navigate(paymentsResponse?.Path);
        } else if (toBoolean(paymentsResponse?.IsValid)){
            let paymentsData = paymentsResponse.Data;
            let paymentsModel =  paymentsData.Model;
            setPaymentModel(paymentsModel);
            setOrganizationData(paymentsData.OrganizationData);

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
                    <ProfileBillingPaymentPartial paymentModel={paymentModel} 
                                                  isFetching={isFetching} 
                                                  organizationData={organizationData}
                                                  setIsFetching={setIsFetching} />
                </>
            }
        </PaddingBlock>
    )
}

export default ProfileBillingPayment