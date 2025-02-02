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
    const {setIsFooterVisible} = useApp();
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
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_ICONS)}}>Icons</Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_PAYMENT_PROVIDERS)}}>Payment Providers</Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_TYPOGRAPHY)}}>Typography</Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_COLORS)}}>Colors</Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_DATE_PICKER)}}>Date & Time Pickers</Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_FORM)}}>Form</Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_MODALS)}}>Alerts & Modals</Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_CARDS)}}>Cards</Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_AGREEMENTS)}}>Disclosure/Waiver & Agreements</Flex>
                <Flex flex={1} align={'center'} style={style} onClick={() => {navigate(DevRouteNames.DEV_OTHER)}}>Other</Flex>
            </Flex>
        </PaddingBlock>
    );
}

export default Dev;