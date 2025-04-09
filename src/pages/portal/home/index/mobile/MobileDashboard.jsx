﻿import {useAuth} from "@/context/AuthProvider.jsx";
import {
    fromLocalStorage, getMemberOrgList,
    getNavigationStorage,
    toLocalStorage
} from "@/storage/AppStorage.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import DashboardModern from "@portal/home/index/mobile/modern/DashboardModern.jsx";
import DashboardClassic from "@portal/home/index/mobile/classic/DashboardClassic.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import portalService from "@/api/portal.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";
import {Flex, Skeleton} from "antd";
import {emptyArray, isValidJson} from "@/utils/ListUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import * as React from "react";
import DashboardHeader from "@portal/home/index/mobile/modules/Dashboard.Header.jsx";
import {getGlobalDeviceId} from "@/utils/AppUtils.jsx";
import appService from "@/api/app.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";

function MobileDashboard() {
    const { setIsFooterVisible, setFooterContent, shouldFetch, resetFetch, token, setIsLoading, setNavigationLinks } = useApp();
    const { orgId, authData } = useAuth();
    const [navigationItems, setNavigationItems] = useState(getNavigationStorage(orgId));
    const [organizationList, setOrganizationList] = useState(getMemberOrgList(orgId));
    const [announcementsCount, setAnnouncementsCount] = useState(0);
    const [dashboardViewType, setDashboardViewType] = useState(2);
    const [isFetching, setIsFetching] = useState(true);
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    
    const loadDashboardData = async (refresh) => {
        const cachedData = fromLocalStorage(`dashboarditems_${orgId}`);
        let navigationType = getCookie("dashboard_navigationType");

        if (refresh) {
            setIsFetching(true);
        } else{
            
            if (isValidJson(cachedData)){
                const parsedJsonData = JSON.parse(cachedData);
                
                setDashboardData(parsedJsonData);
                let dashboardViewTypeToSet = parsedJsonData?.mobileDashboardView;
                if (!isNullOrEmpty(navigationType)) {
                    dashboardViewTypeToSet = navigationType;
                }
                setDashboardViewType(dashboardViewTypeToSet);
                setIsFetching(false);
            }
        }
        
        const deviceId = getGlobalDeviceId();
        
        //should ping to check if is no any disclosures on home page
        let response = await appService.get(navigate, `/app/Online/AuthData/Ping?id=${orgId}`);
        if (toBoolean(response?.Logout)) {
            navigate(AuthRouteNames.LOGIN)
            setIsFetching(false);
            return;
        }
        
        
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

        if (isNullOrEmpty(navigationType)) {
            //if we already set from cookie no need to reset
            setDashboardViewType(dashboardData?.mobileDashboardView);
        }
        setDashboardData(dashboardData);
        setAnnouncementsCount(dashboardData?.NewGlobalAnnouncementsCount || 0);
        toLocalStorage(`dashboarditems_${orgId}`, JSON.stringify(dashboardData));
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
        <div>
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

export default MobileDashboard
