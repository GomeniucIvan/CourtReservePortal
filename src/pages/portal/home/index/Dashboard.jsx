﻿import {useAuth} from "@/context/AuthProvider.jsx";
import {
    fromLocalStorage, getMemberOrgList,
    getNavigationStorage,
    toLocalStorage
} from "@/storage/AppStorage.jsx";
import {equalString, isNullOrEmpty} from "@/utils/Utils.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import DashboardModern from "@portal/home/index/modern/DashboardModern.jsx";
import DashboardClassic from "@portal/home/index/classic/DashboardClassic.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {cx} from "antd-style";
import {useStyles} from "./styles.jsx";
import portalService from "@/api/portal.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";
import {Flex, Skeleton} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import * as React from "react";
import DashboardHeader from "@portal/home/index/modules/Dashboard.Header.jsx";

function Dashboard() {
    const { setIsFooterVisible, setFooterContent, shouldFetch, resetFetch, token, setIsLoading, setNavigationLinks } = useApp();
    const { orgId, authData } = useAuth();
    const [navigationItems, setNavigationItems] = useState(getNavigationStorage(orgId));
    const [organizationList, setOrganizationList] = useState(getMemberOrgList(orgId));
    const [announcementsCount, setAnnouncementsCount] = useState(0);
    const [dashboardViewType, setDashboardViewType] = useState(2);
    const [isFetching, setIsFetching] = useState(true);
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const { styles } = useStyles();
    
    const loadDashboardData = async (refresh) => {
        const cachedData = fromLocalStorage(`dashboardItems_${orgId}`);
        
        if (refresh) {
            setIsFetching(true);
        } else{
            if (!isNullOrEmpty(cachedData)){
                setDashboardData(JSON.parse(cachedData));
                setIsFetching(false);
            }
        }
        
        const deviceId = reactDeviceId;
        
        let dashboardData = await portalService.dashboardData(orgId,
            authData.CostTypeId,
            authData.IsFamilyLevel,
            authData.IsUsingCourtWaitlisting,
            authData.UiCulture,
            true, //authData.checkAnnouncements
            deviceId,
            authData.ShowLeaguesBlock,
            authData.OrgMemberId,
            authData.OrgMemberFamilyId,
            null);

        let navigationType = getCookie("dashboard_navigationType");
        
        let dashboardViewTypeToSet = dashboardData?.mobileDashboardView;
        if (!isNullOrEmpty(navigationType)) {
            dashboardViewTypeToSet = navigationType;
        }
        setDashboardViewType(dashboardViewTypeToSet);
            
        setDashboardData(dashboardData);
        setAnnouncementsCount(dashboardData?.NewGlobalAnnouncementsCount || 0);
        toLocalStorage(`dashboardItems_${orgId}`, JSON.stringify(dashboardData));
        setIsFetching(false);
    }
    
    useEffect(() => {
        if (shouldFetch) {
            const fetchData = () => {
                loadDashboardData(true);
                resetFetch();
            };
            fetchData();
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
    }, []);
    
    useEffect(() => {
        if (!isNullOrEmpty(authData)) {
            loadDashboardData();     
        }
    }, [authData]);
    
    return (
        <div className={cx(styles.orgArea, 'safe-area-top')}>
            {/*<div className={globalStyles.safeAreaGlass}></div>*/}

            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        <DashboardHeader dashboardData={dashboardData}
                                         isReloadFetching={true}
                                         organizationList={[]} />
                        
                        <Skeleton.Button active={true} block style={{height: `60px`}}/>
                        <Skeleton.Button active={true} block style={{height: `80px`}}/>
                        <Skeleton.Button active={true} block style={{height: `160px`}}/>
                        <Skeleton.Button active={true} block style={{height: `80px`}}/>
                        <Skeleton.Button active={true} block style={{height: `70px`}}/>
                        <Skeleton.Button active={true} block style={{height: `95px`}}/>
                    </Flex>
                </PaddingBlock>
            }
            
            {(dashboardData && !isFetching) &&
                <>
                    {/*Modern Dashboard*/}
                    {(equalString(dashboardViewType, 3) || equalString(dashboardViewType, 4)) &&
                        <DashboardModern dashboardData={dashboardData}
                                         organizationList={organizationList}
                                         dashboardViewType={dashboardViewType}
                                         navigationItems={navigationItems} />
                    }

                    {/*Classic*/}
                    {(equalString(dashboardViewType, 1) ||equalString(dashboardViewType, 2) || isNullOrEmpty(dashboardViewType)) &&
                        <DashboardClassic dashboardData={dashboardData}
                                          organizationList={organizationList}
                                          announcementsCount={announcementsCount}
                                          navigationItems={navigationItems} />
                    }
                </>
            }

        </div>
    )
}

export default Dashboard
