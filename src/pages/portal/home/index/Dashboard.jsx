import {Button, Flex, Typography} from "antd";
import {useAuth} from "@/context/AuthProvider.jsx";
import {fromLocalStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import apiService from "@/api/api.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import DrawerBarcode from "@/components/drawer/DrawerBarcode.jsx";
const { Title } = Typography;
import DashboardAnnouncements from "@portal/home/index/modules/Dashboard.Announcements.jsx";
import DashboardReservations from "@portal/home/index/modules/Dashboard.Reservations.jsx";
import DashboardOpenMatches from "@portal/home/index/modules/Dashboard.OpenMatches.jsx";
import DashboardEvents from "@portal/home/index/modules/Dashboard.Events.jsx";
import DashboardLeagues from "@portal/home/index/modules/Dashboard.Leagues.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import DashboardModern from "@portal/home/index/modern/DashboardModern.jsx";
import DashboardClassic from "@portal/home/index/classic/DashboardClassic.js";
import DashboardCards from "@portal/home/index/cards/DashboardCards.jsx";

function Dashboard() {
    const { styles } = useStyles();
    const { setIsFooterVisible, setFooterContent, shouldFetch, resetFetch, token, setIsLoading } = useApp();
    const {orgId, setAuthorizationData} = useAuth();
    const [isFetching, setIsFetching] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();
    const drawerBarcodeRef = useRef();
    
    const loadData = async (refresh) => {
        const cachedData = fromLocalStorage('dashboardData');

        if (refresh){
            setIsFetching(true);
        } else{
            if (!isNullOrEmpty(cachedData)){
                setDashboardData(cachedData);
                setIsFetching(false);
            }
        }

        let authResponse = await apiService.authData(orgId,{loadWeatherData:true,includeDashboardData:true});

        if (toBoolean(authResponse?.IsValid)) {
            setAuthorizationData(authResponse.Data);
            setDashboardData(authResponse.Data);
            toLocalStorage('dashboardData', authResponse.Data);
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

            {/*Modern Dashboard*/}
            {(equalString(dashboardData?.MobileDashboardView, 3) || isNullOrEmpty(dashboardData?.MobileDashboardView)) &&
                <DashboardModern dashboardData />
            }

            {/*Classic*/}
            {equalString(dashboardData?.MobileDashboardView, 2) &&
                <DashboardClassic dashboardData/>
            }

            {/*Cards*/}
            {equalString(dashboardData?.MobileDashboardView, 4) &&
                <DashboardCards dashboardData/>
            }
        </div>
    )
}

export default Dashboard
