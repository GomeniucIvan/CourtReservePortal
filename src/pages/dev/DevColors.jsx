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

function DevColors() {
    const {token} = useApp();

    const style = {
        minHeight: "150px",
    }

    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} justify={'center'} gap={16}>
                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorBgBase,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>Base</Text>
                        <Text>token.colorBgBase</Text>
                    </Flex>
                </Flex>
                
                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorBgContainer,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>Base layout</Text>
                        <Text>token.colorBgContainer</Text>
                    </Flex>
                </Flex>
                
                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorBgContainerDisabled,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>Shadow background</Text>
                        <Text>token.colorBgContainerDisabled</Text>
                    </Flex>
                </Flex>

                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorBgContainer,
                    boxShadow: token.boxShadow,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>Box effect</Text>
                        <Text>token.boxShadow</Text>
                    </Flex>
                </Flex>
                
                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorBorder,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>Border</Text>
                        <Text>token.colorBorder</Text>
                    </Flex>
                </Flex>

                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorError,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>Error</Text>
                        <Text>token.colorError</Text>
                    </Flex>
                </Flex>

                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorCourtReserve,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>CourtReserve</Text>
                        <Text>token.colorCourtReserve</Text>
                    </Flex>
                </Flex>

                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorSuccess,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>Success</Text>
                        <Text>token.colorSuccess</Text>
                    </Flex>
                </Flex>

                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorInfoText,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>Info</Text>
                        <Text>token.colorInfoText</Text>
                    </Flex>
                </Flex>

                <Flex style={{
                    minHeight: '70px',
                    backgroundColor: token.colorSecondary,
                    border: `1px solid ${token.colorBorder}`}}
                      flex={1}
                      align={'center'}
                      justify={'center'} st>
                    <Flex vertical={true} gap={4} align={'center'} justify={'center'}>
                        <Text>Secondary</Text>
                        <Text>token.colorSecondary</Text>
                    </Flex>
                </Flex>
            </Flex>
        </PaddingBlock>
    );
}

export default DevColors;