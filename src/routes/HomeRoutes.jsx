import Dashboard from "../pages/home/index/Dashboard.jsx";
import Scheduler from "../pages/scheduler/Scheduler.jsx";
import AnnouncementDetails from "../pages/announcement/details/AnnouncementDetails.jsx";
import AnnouncementList from "../pages/announcement/list/AnnouncementList.jsx";

export const HomeRouteNames = {
    INDEX: '/dashboard',
    SCHEDULER: '/scheduler/:orgId',
    ANNOUNCEMENT_DETAILS: `/announcement/details/:id`,
    ANNOUNCEMENT_LIST: `/announcement/list`
};

const HomeRoutes = [
    {
        path: HomeRouteNames.INDEX,
        element: <Dashboard />
    },
    {
        path: HomeRouteNames.SCHEDULER,
        element: <Scheduler />,
        title: 'Scheduler'
    },
    {
        path: HomeRouteNames.ANNOUNCEMENT_LIST,
        element: <AnnouncementList />,
        title: 'AnnouncementList'
    },
    {
        path: HomeRouteNames.ANNOUNCEMENT_DETAILS,
        element: <AnnouncementDetails />,
        title: 'Announcement'
    },
];

export default HomeRoutes;