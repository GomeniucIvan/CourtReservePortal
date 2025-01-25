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
import {cx} from "antd-style";

const { Text, Title } = Typography;

function DevCards() {
    const {token, globalStyles} = useApp();
    
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} justify={'center'} gap={16}>
                <Card className={cx(globalStyles.card)}>
                    <Flex align={'center'} justify={'center'}>
                        Card globalStyles.card padding 12px
                    </Flex>
                </Card>

                <Card className={cx(globalStyles.card, globalStyles.clickableCard)}>
                    <Flex align={'center'} justify={'center'}>
                        Clickable Card padding 12px
                        <br/>
                        globalStyles.card, globalStyles.clickableCard
                    </Flex>
                </Card>

                <Card className={cx(globalStyles.card, globalStyles.cardSMPadding)}>
                    <Flex align={'center'} justify={'center'}>
                        Clickable SM Padding padding 14px
                        <br/>
                        globalStyles.card,globalStyles.cardSMPadding
                    </Flex>
                </Card>
            </Flex>
        </PaddingBlock>
    );
}

export default DevCards;