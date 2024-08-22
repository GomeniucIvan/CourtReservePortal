import {useStyles} from "./styles.jsx";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/home-data.json";
import DashboardAnnouncements from "./Dashboard.Announcements.jsx";
import DashboardReservations from "./Dashboard.Reservations.jsx";
import DashboardEvents from "./Dashboard.Events.jsx";
import DashboardLeagues from "./Dashboard.Leagues.jsx";
import DashboardOpenMatches from "./Dashboard.OpenMatches.jsx";
import CardLinks from "../../../components/cardlinks/CardLinks.jsx";
import {cx} from "antd-style";
import {Typography} from "antd";
const { Title } = Typography;
import { sleep } from 'antd-mobile/es/utils/sleep'

function Dashboard() {
    const {token} = useApp();
    const navigate = useNavigate();
    const { styles } = useStyles();
    const { isLoading, setIsLoading, isMockData, setIsFooterVisible, setFooterContent, shouldFetch, resetFetch } = useApp();
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [organizations, setOrganizations] = useState([]);

    const loadData = async () => {
        if (isMockData){
            const dashboardData = mockData.dashboard.index;
            setDashboardData(dashboardData);
        } else{
            alert('todo home index')
        }
    }
    
    useEffect(() => {
        if (shouldFetch) {
            const fetchData = async () => {
                await sleep(1000);
                await loadData();
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
            <div className={styles.orgArea}>
                {/*<DashboardOrganizations setSelectedOrganization={setSelectedOrganization} selectedOrganization={selectedOrganization} />*/}
            </div>

            <DashboardAnnouncements dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardReservations dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardOpenMatches dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardEvents dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardLeagues dashboardData={dashboardData} isFetching={isFetching}/>

            <div className={cx(styles.header)} style={{padding: `0px ${token.padding}px`}}>
                <Title level={4}>Additional Links</Title>
            </div>
            <CardLinks links={dashboardData?.Links} isFetching={isFetching}/>

        </>
    )
}

export default Dashboard
