import Dashboard from "../pages/home/index/Dashboard.jsx";
import AnnouncementDetails from "../pages/announcement/details/AnnouncementDetails.jsx";
import AnnouncementList from "../pages/announcement/list/AnnouncementList.jsx";
import LeagueList from "../pages/league/list/LeagueList.jsx";
import ExpandedScheduler from "../pages/scheduler/ExpandedScheduler.jsx";
import EventCalendar from "../pages/event/calendar/EventCalendar.jsx";
import Navigation from "../pages/navigation/Navigation.jsx";

export const HomeRouteNames = {
    INDEX: '/dashboard',
    SCHEDULER: '/scheduler',
    CALENDAR: '/calendar',
    ANNOUNCEMENT_DETAILS: `/announcement/details/:id`,
    ANNOUNCEMENT_LIST: `/announcement/list`,
    LEAGUES_LIST: `/leagues/list`,
    MORE_NAVIGATION: `/more`,
};

const HomeRoutes = [
    {
        path: HomeRouteNames.INDEX,
        element: <Dashboard />,
        root: true
    },
    {
        path: HomeRouteNames.SCHEDULER,
        element: <ExpandedScheduler />,
        title: 'Scheduler',
        disablePullDown: true
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
    {
        path: HomeRouteNames.CALENDAR,
        element: <EventCalendar />,
        title: 'Event Calendar',
        disablePullDown: true
    },
    {
        path: HomeRouteNames.MORE_NAVIGATION,
        element: <Navigation key={'more'}/>,
        title: 'More',
        disablePullDown: true
    }
];

export default HomeRoutes;