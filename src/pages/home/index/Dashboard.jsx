import styles from './Dashboard.module.less'
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "antd";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/home-data.json";
import DashboardOrganizations from "./Dashboard.Organizations.jsx";
import DashboardAnnouncements from "./Dashboard.Announcements.jsx";
import DashboardReservations from "./Dashboard.Reservations.jsx";
import DashboardEvents from "./Dashboard.Events.jsx";

function Dashboard() {
    const navigate = useNavigate();
    let { orgId } = useParams();
    const { isLoading, setIsLoading, isMockData, setIsFooterVisible } = useApp();
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);
    
    const [events, setEvents] = useState([]);

    const [showBookings, setShowBookings] = useState(true);
    const [bookings, setBookings] = useState([]);

    const [showLeagues, setShowLeagues] = useState(true);
    const [leagues, setLeagues] = useState([]);
    
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
        <div>
            <div className={styles.orgArea}>
                <DashboardOrganizations setSelectedOrganization={setSelectedOrganization} selectedOrganization={selectedOrganization} />
            </div>

            <DashboardAnnouncements dashboardData={dashboardData} isFetching={isFetching} />
            <DashboardReservations dashboardData={dashboardData} isFetching={isFetching} />
            <DashboardEvents dashboardData={dashboardData} isFetching={isFetching} />
            <DashboardEvents dashboardData={dashboardData} isFetching={isFetching} />
            
            
            <Button block color='primary' size='large' onClick={() => navigate(`/event-list/${orgId}`)}>
                Events
            </Button>
            <Button block color='primary' size='large' onClick={() => navigate(`/scheduler/${orgId}`)}>
                Scheduler
            </Button>
        </div>
    )
}

export default Dashboard
