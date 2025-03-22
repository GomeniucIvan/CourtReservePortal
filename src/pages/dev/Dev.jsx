import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Row, Col, Card, Typography, message, Flex, Divider} from "antd";
import {anyInList, isNullOrEmpty} from "@/utils/Utils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {Ellipsis} from "antd-mobile";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {DevRouteNames} from "@/routes/DevRoutes.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";

const { Text, Title } = Typography;

function Dev() {
    const {setIsFooterVisible, token} = useApp();
    const navigate = useNavigate();
    
    useEffect(() => {
        setIsFooterVisible(false);
    }, []);
    
    const style = {
        minHeight: "30px",
        fontSize: "16px",
        fontWeight: 500,
    }
    
    return (
        <PaddingBlock topBottom={true}> 
            <Flex vertical={true} gap={16}>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_ICONS)}}><Text>Icons</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_PAYMENT_PROVIDERS)}}><Text>Payment Providers</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_TYPOGRAPHY)}}><Text>Typography</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_COLORS)}}><Text>Colors</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_DATE_PICKER)}}><Text>Date & Time Pickers</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_FORM)}}><Text>Form</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_MODALS)}}><Text>Alerts & Modals</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_CARDS)}}><Text>Cards</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_BUTTONS)}}><Text>Buttons</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_ALERT_BLOCKS)}}><Text>Alert Blocks</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_AGREEMENTS)}}><Text>Disclosure/Waiver & Agreements</Text></Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_OTHER)}}><Text>Other</Text></Flex>
            </Flex>
        </PaddingBlock>
    );
}

export default Dev;