import Dashboard from "../pages/home/index/Dashboard.jsx";
import AnnouncementDetails from "../pages/announcement/details/AnnouncementDetails.jsx";
import AnnouncementList from "../pages/announcement/list/AnnouncementList.jsx";
import LeagueList from "../pages/league/list/LeagueList.jsx";
import ExpandedScheduler from "../pages/scheduler/ExpandedScheduler.jsx";
import EventCalendar from "../pages/event/calendar/EventCalendar.jsx";
import Navigation from "../pages/navigation/Navigation.jsx";
import {useTranslation} from "react-i18next";

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
        title: 'scheduler',
        disablePullDown: true
    },
    {
        path: HomeRouteNames.ANNOUNCEMENT_LIST,
        element: <AnnouncementList />,
        title: 'announcements'
    },
    {
        path: HomeRouteNames.ANNOUNCEMENT_DETAILS,
        element: <AnnouncementDetails />,
        title: 'announcementDetails',
        header: true
    },
    {
        path: HomeRouteNames.LEAGUES_LIST,
        element: <LeagueList />,
        title: 'leagues'
    },
    {
        path: HomeRouteNames.CALENDAR,
        element: <EventCalendar />,
        title: 'eventCalendar',
        entityTitle: true,
        disablePullDown: true
    },
    {
        path: HomeRouteNames.MORE_NAVIGATION,
        element: <Navigation key={'more'}/>,
        title: 'more',
        disablePullDown: true
    }
];

export default HomeRoutes;