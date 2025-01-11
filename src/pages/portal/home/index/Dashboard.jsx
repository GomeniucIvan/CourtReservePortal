import {Button, Flex, Typography} from "antd";
import {useAuth} from "@/context/AuthProvider.jsx";
import {
    fromLocalStorage, getMemberOrgList,
    getMoreNavigationStorage,
    getNavigationStorage,
    setNavigationStorage,
    toLocalStorage
} from "@/storage/AppStorage.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import apiService from "@/api/api.jsx";
const { Title } = Typography;
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import DashboardModern from "@portal/home/index/modern/DashboardModern.jsx";
import DashboardClassic from "@portal/home/index/classic/DashboardClassic.jsx";
import DashboardCards from "@portal/home/index/cards/DashboardCards.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {cx} from "antd-style";
import {useStyles} from "./styles.jsx";
import appService from "@/api/app.jsx";
import portalService from "@/api/portal.jsx";

function Dashboard() {
    const { setIsFooterVisible, setFooterContent, shouldFetch, resetFetch, token, setIsLoading, setNavigationLinks } = useApp();
    const { orgId, authData } = useAuth();
    const [navigationItems, setNavigationItems] = useState(getNavigationStorage(orgId));
    const [organizationList, setOrganizationList] = useState(getMemberOrgList(orgId));
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const { styles } = useStyles();
    
    const loadDashboardData = async (refresh) => {
        const cachedData = fromLocalStorage(`dashboardItems_${orgId}`);
        
        if (refresh) {
            setDashboardData(null);
        } else{
            if (!isNullOrEmpty(cachedData)){
                setDashboardData(cachedData);
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

        setDashboardData(dashboardData)
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

            {dashboardData &&
                <>
                    {/*Modern Dashboard*/}
                    {(equalString(dashboardData?.mobileDashboardView, 3)) &&
                        <DashboardModern dashboardData={dashboardData}
                                         organizationList={organizationList}
                                         navigationItems={navigationItems} />
                    }

                    {/*Classic*/}
                    {(equalString(dashboardData?.mobileDashboardView, 1) ||equalString(dashboardData?.mobileDashboardView, 2) || isNullOrEmpty(dashboardData?.mobileDashboardView)) &&
                        <DashboardClassic dashboardData={dashboardData}
                                          organizationList={organizationList}
                                          navigationItems={navigationItems} />
                    }

                    {/*Cards*/}
                    {equalString(dashboardData?.mobileDashboardView, 4) &&
                        <DashboardCards dashboardData={dashboardData}/>
                    }
                </>
            }

        </div>
    )
}

export default Dashboard
