import {Button, Flex, Typography} from "antd";
import {useAuth} from "@/context/AuthProvider.jsx";
import {fromLocalStorage, setNavigationStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
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

function Dashboard() {
    const { setIsFooterVisible, setFooterContent, shouldFetch, resetFetch, token, setIsLoading, setNavigationLinks } = useApp();
    const {orgId, setAuthorizationData} = useAuth();
    const [isFetching, setIsFetching] = useState(false);
    const [backendIsFetching, setBackendIsFetching] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();
    const drawerBarcodeRef = useRef();
    const { styles } = useStyles();
    
    const loadData = async (refresh) => {
        const cachedData = fromLocalStorage(`dashboardData_${orgId}`);
        if (refresh){
            setIsFetching(true);
        } else{
            if (!isNullOrEmpty(cachedData)){
                setDashboardData(cachedData);
                setIsFetching(false);
            }
        }

        let dashboardData = await appService.get(navigate, `/app/Online/AuthData/NavigationData?id=${orgId}`);
        
        if (toBoolean(dashboardData?.IsValid)) {

            //setAuthorizationData(authResponse.Data);
            setDashboardData(dashboardData.Data);
            setNavigationStorage(orgId, dashboardData.Data.menu);
            
            //todo delete setNavigationLinks
            //setNavigationLinks(dashboardData.Data.menu);
            
            toLocalStorage(`dashboardData_${orgId}`, dashboardData.Data);
            setIsFetching(false);
        }
        
        setIsLoading(false);
    }
    
    useEffect(() => {
        if (shouldFetch) {
            const fetchData = () => {
                loadData(true);
                resetFetch();
            };
            fetchData();
        }
    }, [shouldFetch, resetFetch]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
        loadData();
    }, []);
    
    return (
        <div className={cx(styles.orgArea, 'safe-area-top')}>
            {/*<div className={globalStyles.safeAreaGlass}></div>*/}

            {dashboardData &&
                <>
                    {/*Modern Dashboard*/}
                    {(equalString(dashboardData?.mobileDashboardView, 3)) &&
                        <DashboardModern dashboardData={dashboardData} />
                    }

                    {/*Classic*/}
                    {(equalString(dashboardData?.mobileDashboardView, 1) ||equalString(dashboardData?.mobileDashboardView, 2) || isNullOrEmpty(dashboardData?.mobileDashboardView)) &&
                        <DashboardClassic dashboardData={dashboardData}/>
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
