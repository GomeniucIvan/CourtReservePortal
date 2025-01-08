import {Button, Card, Flex, Typography} from "antd";
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
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {useNavigate} from "react-router-dom";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
const { Title, Text } = Typography;

const DashboardMembershipBar = ({dashboardData}) => {
    const{ token, globalStyles } = useApp();
    const{ authData } = useAuth();
    const drawerBarcodeRef = useRef(null);
    const navigate = useNavigate();
    
    return (
        <>
            <Card className={cx(globalStyles.card, globalStyles.cardSMPadding)}>
                <Flex justify="space-between" align={'center'}>
                    <Flex gap={token.paddingLG} flex={1} onClick={() => {
                        let route = toRoute(ProfileRouteNames.PROFILE_PERSONAL_INFO, 'id', orgId);
                        navigate(route);
                    }}>
                        <Flex justify={'center'} align={'center'}
                              style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 50,
                                  backgroundColor: token.colorPrimary,
                                  color: token.colorOrgText,
                              }}>
                            <Title level={1} className={cx(globalStyles.noSpace)}>{fullNameInitials(authData?.MemberFullName)}</Title>
                        </Flex>
                        
                        <Flex vertical gap={token.paddingXXS} justify={'center'}>
                            {!isNullOrEmpty(authData?.MemberFullName) &&
                                <Title level={3}>
                                    <Ellipsis direction='end' content={authData?.MemberFullName}/>
                                </Title>
                            }
                            {dashboardData?.MembershipName &&
                                <Text style={{color: token.colorSecondary}}><Ellipsis direction='end' content={dashboardData?.MembershipName}/></Text>
                            }
                        </Flex>
                    </Flex>

                    {toBoolean(authData?.OrgShowBarcode) && (
                        <>
                            <Button shape="circle" icon={<SVG icon={'barcode'} size={20} color={token.colorPrimary} />} onClick={() => {
                                if (drawerBarcodeRef.current) {
                                    drawerBarcodeRef.current.open();
                                }
                            }} />
                            <DrawerBarcode ref={drawerBarcodeRef} format={authData?.OrgBarcodeFormat} familyList={stringToJson(authData?.FamilyMembesJson)}/>
                        </>
                    )}
                </Flex>
            </Card>
        </>
    );
};

export default DashboardMembershipBar
