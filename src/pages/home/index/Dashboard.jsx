import {useStyles} from "./styles.jsx";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/home-data.json";
import DashboardOrganizations from "./Dashboard.Organizations.jsx";
import DashboardAnnouncements from "./Dashboard.Announcements.jsx";
import DashboardReservations from "./Dashboard.Reservations.jsx";
import DashboardEvents from "./Dashboard.Events.jsx";
import DashboardLeagues from "./Dashboard.Leagues.jsx";
import DashboardOpenMatches from "./Dashboard.OpenMatches.jsx";

function Dashboard() {
    const navigate = useNavigate();
    let { orgId } = useParams();
    const { styles } = useStyles();
    const { isLoading, setIsLoading, isMockData, setIsFooterVisible } = useApp();
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        
        if (isMockData){
            const dashboardData = mockData.dashboard.index;
            setDashboardData(dashboardData);
        } else{
            alert('todo home index')
        }
    }, []);
    
    return (
        <>
            <div className={styles.orgArea}>
                {/*<DashboardOrganizations setSelectedOrganization={setSelectedOrganization} selectedOrganization={selectedOrganization} />*/}
            </div>

            <DashboardAnnouncements dashboardData={dashboardData} isFetching={isFetching} />
            <DashboardReservations dashboardData={dashboardData} isFetching={isFetching} />
            <DashboardOpenMatches dashboardData={dashboardData} isFetching={isFetching} />
            <DashboardEvents dashboardData={dashboardData} isFetching={isFetching} />
            <DashboardLeagues dashboardData={dashboardData} isFetching={isFetching} />
        </>
    )
}

export default Dashboard
