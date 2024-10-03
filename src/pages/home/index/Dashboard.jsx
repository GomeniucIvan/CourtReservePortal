import {useStyles} from "./styles.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/home-data.json";
import DashboardAnnouncements from "./Dashboard.Announcements.jsx";
import DashboardReservations from "./Dashboard.Reservations.jsx";
import DashboardEvents from "./Dashboard.Events.jsx";
import DashboardLeagues from "./Dashboard.Leagues.jsx";
import DashboardOpenMatches from "./Dashboard.OpenMatches.jsx";
import CardLinks from "../../../components/cardlinks/CardLinks.jsx";
import {cx} from "antd-style";
import {Button, Typography} from "antd";
const { Title } = Typography;
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import appService from "../../../api/app.jsx";
import apiService from "../../../api/api.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {fromLocalStorage, toAuthLocalStorage, toLocalStorage} from "../../../storage/AppStorage.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {stringToJson} from "../../../utils/ListUtils.jsx";
import {string} from "yup";
import {useSafeArea} from "../../../context/SafeAreaContext.jsx";

function Dashboard() {
    const { styles } = useStyles();
    const { isMockData, setIsFooterVisible, setFooterContent, shouldFetch, resetFetch, token, setIsLoading, isLoading,globalStyles  } = useApp();
    const {orgId} = useAuth();
    const {safeAreaInsets} = useSafeArea();
    
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const navigate = useNavigate();
    
    const loadData = (refresh) => {
        if (isMockData){
            const dashboardData = mockData.dashboard.index;
            setDashboardData(dashboardData);
        } else{
            const cachedData = fromLocalStorage('dashboardData');
            
            if (refresh){
                setIsFetching(true);
            } else{
                if (!isNullOrEmpty(cachedData)){
                    setDashboardData(cachedData);
                    setIsFetching(false);
                }
            }

            apiService.post(`/api/dashboard/member-navigation-data?orgId=${orgId}&loadWeatherData=true&includeDashboardData=true`).then(
                innerResponse => {
                    if (toBoolean(innerResponse?.IsValid)) {
                        const memberResponseData = innerResponse.Data;
                        setDashboardData(memberResponseData);
                        toLocalStorage('dashboardData', memberResponseData);
                        setIsFetching(false);
                    }
                });
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
        <>
            <div className={globalStyles.safeAreaGlass}></div>
            
            <div className={cx(styles.orgArea, 'safe-area-top')}>
                <Button onClick={() => navigate(HomeRouteNames.SCHEDULER)}>Scheduler</Button>
                <Button onClick={() => navigate(HomeRouteNames.CALENDAR)}>Calendar</Button>
            </div>

            <DashboardAnnouncements dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardReservations dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardOpenMatches dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardEvents dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardLeagues dashboardData={dashboardData} isFetching={isFetching}/>

            {anyInList(stringToJson(dashboardData?.DashboardLinksJson)) &&
                <>
                    <div className={cx(styles.header)} style={{padding: `0px ${token.padding}px`}}>
                        <Title level={4}>Additional Links</Title>
                    </div>
                    <CardLinks links={stringToJson(dashboardData?.DashboardLinksJson)} isFetching={isFetching}/>
                </>
            }
        </>
    )
}

export default Dashboard
