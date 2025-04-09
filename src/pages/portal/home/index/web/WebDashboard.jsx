import {useAuth} from "@/context/AuthProvider.jsx";
import {
    fromLocalStorage, getMemberOrgList,
    getNavigationStorage,
    toLocalStorage
} from "@/storage/AppStorage.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import portalService from "@/api/portal.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";
import {Flex, Skeleton} from "antd";
import {emptyArray, isValidJson} from "@/utils/ListUtils.jsx";
import * as React from "react";
import {getGlobalDeviceId} from "@/utils/AppUtils.jsx";
import appService from "@/api/app.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";

function WebDashboard() {
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
    
    return (
        <div>
           Dashboard
        </div>
    )
}

export default WebDashboard
