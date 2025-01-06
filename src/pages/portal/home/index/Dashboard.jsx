﻿import {Button, Flex, Typography} from "antd";
import {useAuth} from "@/context/AuthProvider.jsx";
import {fromLocalStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
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

function Dashboard() {
    const { setIsFooterVisible, setFooterContent, shouldFetch, resetFetch, token, setIsLoading } = useApp();
    const {orgId, setAuthorizationData} = useAuth();
    const [isFetching, setIsFetching] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const navigate = useNavigate();
    const drawerBarcodeRef = useRef();
    const { styles } = useStyles();
    
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
            {(equalString(dashboardData?.MobileDashboardView, 3)) &&
                <DashboardModern dashboardData={dashboardData} />
            }

            {/*Classic*/}
            {(equalString(dashboardData?.MobileDashboardView, 2) || isNullOrEmpty(dashboardData?.MobileDashboardView)) &&
                <DashboardClassic dashboardData={dashboardData}/>
            }

            {/*Cards*/}
            {equalString(dashboardData?.MobileDashboardView, 4) &&
                <DashboardCards dashboardData={dashboardData}/>
            }
        </div>
    )
}

export default Dashboard
