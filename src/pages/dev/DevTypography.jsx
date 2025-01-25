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

function DevTypography() {
    const {token} = useApp();
    
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} justify={'center'} gap={16}>
                <Title level={1}>Title level=1 - 20px</Title>
                <Title level={2}>Title level=2 - 18px</Title>
                <Title level={3}>Title level=3 - 16px</Title>
                <Title level={4}>Title level=4 - 14px</Title>
                <Title level={5}>Title level=5 - 12px</Title>
                
                <Text>Text</Text>
                <Text style={{fontSize: `${token.fontSizeXS}px`}}>Text token.fontSizeXS - 10px</Text>
                <Text style={{fontSize: `${token.fontSizeSM}px`}}>Text token.fontSizeSM - 12px</Text>
                <Text style={{fontSize: `${token.fontSize}px`}}>Text token.fontSize - 14px</Text>
                <Text style={{fontSize: `${token.fontSizeLG}px`}}>Text token.fontSizeLG - 16px</Text>
                <Text style={{fontSize: `${token.fontSizeXL}px`}}>Text token.fontSizeXL - 20px</Text>


                <Text style={{fontSize: `${token.fontSizeXL}px`, color: token.colorSecondary}}>Text token.colorSecondary - style</Text>
                <Text style={{fontSize: `${token.fontSizeXL}px`, color: token.colorError}}>Text token.colorSecondary - style</Text>
                <Text style={{fontSize: `${token.fontSizeXL}px`, color: token.colorTextDisabled}}>Text token.colorTextDisabled - style</Text>
                <Text style={{fontSize: `${token.fontSizeXL}px`, color: token.colorTextTertiary}}>Text token.colorTextTertiary - style</Text>
                <Text style={{fontSize: `${token.fontSizeXL}px`, color: token.colorInfoText}}>Text token.colorInfoText - style</Text>
            </Flex>
        </PaddingBlock>
    );
}

export default DevTypography;