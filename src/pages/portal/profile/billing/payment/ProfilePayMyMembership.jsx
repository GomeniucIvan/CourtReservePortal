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
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import ProfileBillingPaymentPartial from "@portal/profile/billing/payment/ProfileBillingPaymentPartial.jsx";
import {removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";

function ProfilePayMyMembership({}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const {setIsLoading, isLoading, token, setIsFooterVisible, setFooterContent} = useApp();
    const {orgId} = useAuth();
    const {setHeaderRightIcons} = useHeader();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    //url params
    const membershipId = queryParams.get("membershipId");

    const loadData = async (refresh) => {
        setIsFetching(true);
        setIsLoading(true);
        let paymentsResponse = await appService.get(navigate, `/app/Online/MyBalance/PayMyMembershipFees?id=${orgId}&membershipId=${membershipId}`);

        if (!isNullOrEmpty(paymentsResponse?.Path)){
            removeLastHistoryEntry();
            navigate(paymentsResponse?.Path);
            setIsFetching(false);
        } 
        setIsLoading(false);
    }

    useEffect(() => {
        loadData();
        setHeaderRightIcons('');
        setFooterContent('');
        setIsFooterVisible(true);
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
        </PaddingBlock>
    )
}

export default ProfilePayMyMembership