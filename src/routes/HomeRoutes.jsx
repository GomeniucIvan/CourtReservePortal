import Dashboard from "../pages/home/index/Dashboard.jsx";
import Scheduler from "../pages/scheduler/Scheduler.jsx";
import AnnouncementDetails from "../pages/announcement/details/AnnouncementDetails.jsx";
import AnnouncementList from "../pages/announcement/list/AnnouncementList.jsx";
import LeagueList from "../pages/league/list/LeagueList.jsx";

export const HomeRouteNames = {
    INDEX: '/dashboard',
    SCHEDULER: '/scheduler',
    ANNOUNCEMENT_DETAILS: `/announcement/details/:id`,
    ANNOUNCEMENT_LIST: `/announcement/list`,
    LEAGUES_LIST: `/leagues/list`,
};

const HomeRoutes = [
    {
        path: HomeRouteNames.INDEX,
        element: <Dashboard />,
        root: true
    },
    {
        path: HomeRouteNames.SCHEDULER,
        element: <Scheduler />,
        title: 'Scheduler'
    },
    {
        path: HomeRouteNames.ANNOUNCEMENT_LIST,
        element: <AnnouncementList />,
        title: 'Announcements'
    },
    {
        path: HomeRouteNames.ANNOUNCEMENT_DETAILS,
        element: <AnnouncementDetails />,
        title: 'Details',
        header: true
    },
    {
        path: HomeRouteNames.LEAGUES_LIST,
        element: <LeagueList />,
        title: 'Leagues'
    },
];

export default HomeRoutes;