﻿import {Button, Card, Flex, Typography} from "antd";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import React, {useEffect, useRef, useState} from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {equalString, fullNameInitials, isNullOrEmpty, organizationLogoSrc, toBoolean} from "@/utils/Utils.jsx";
import {useStyles} from ".././styles.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {Ellipsis} from "antd-mobile";
import apiService from "@/api/api.jsx";
import DrawerBarcode from "@/components/drawer/DrawerBarcode.jsx";
import {stringToJson} from "@/utils/ListUtils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {cx} from "antd-style";
const { Title, Text } = Typography;

const DashboardMembershipBar = ({ dashboardData }) => {
    const{ token, globalStyles } = useApp();
    const drawerBarcodeRef = useRef(null);
    
    return (
        <>
            <Card className={cx(globalStyles.card, globalStyles.cardSMPadding)}>
                <Flex justify="space-between" align={'center'}>
                    <Flex gap={token.paddingLG}>
                        <Flex justify={'center'} align={'center'}
                              style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 50,
                                  backgroundColor: token.colorPrimary,
                                  color: token.colorOrgText,
                              }}>
                            <Title level={1} className={cx(globalStyles.noSpace)}>{fullNameInitials(dashboardData?.MemberFullName)}</Title>
                        </Flex>
                        
                        <Flex vertical gap={token.paddingXXS} justify={'center'}>
                            {!isNullOrEmpty(dashboardData?.MemberFullName) &&
                                <Title level={3}>
                                    <Ellipsis direction='end' content={dashboardData?.MemberFullName}/>
                                </Title>
                            }
                            {dashboardData?.MembershipName &&
                                <Text style={{color: token.colorSecondary}}><Ellipsis direction='end' content={dashboardData?.MembershipName}/></Text>
                            }
                        </Flex>
                    </Flex>

                    {toBoolean(dashboardData?.OrgShowBarcode) && (
                        <>
                            <Button shape="circle" icon={<SVG icon={'barcode'} onClick={() => {
                                if (drawerBarcodeRef.current) {
                                    drawerBarcodeRef.current.open();
                                }
                            }} size={20} color={token.colorPrimary} />} />
                            <DrawerBarcode ref={drawerBarcodeRef} format={dashboardData?.OrgBarcodeFormat} familyList={stringToJson(dashboardData?.FamilyMembesJson)}/>
                        </>
                    )}
                </Flex>
            </Card>
        </>
    );
};

export default DashboardMembershipBar
