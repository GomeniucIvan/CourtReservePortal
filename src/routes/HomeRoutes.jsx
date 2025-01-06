import Dashboard from "@portal/home/index/Dashboard.jsx";
import AnnouncementDetails from "@portal/announcement/details/AnnouncementDetails.jsx";
import AnnouncementList from "@portal/announcement/list/AnnouncementList.jsx";
import LeagueList from "@portal/league/list/LeagueList.jsx";
import ExpandedScheduler from "@portal/scheduler/ExpandedScheduler.jsx";
import EventCalendar from "@portal/event/calendar/EventCalendar.jsx";
import Navigation from "@portal/navigation/Navigation.jsx";
import DisclosurePending from "@portal/home/disclosure/DisclosurePending.jsx";
import MemberGroupDetails from "@portal/membergroup/details/MemberGroupDetails.jsx";

export const HomeRouteNames = {
    CR_STARTUP_URL: `/mobilesso/newmobile`,
    INDEX: '/',
    SCHEDULER: '/scheduler/',
    CALENDAR: '/calendar',
    ANNOUNCEMENT_DETAILS: `/announcement/details/:id`,
    ANNOUNCEMENT_LIST: `/announcement/list`,
    LEAGUES_LIST: `/leagues/list`,
    MORE_NAVIGATION: `/more`,
    DISCLOSURE_PENDING_LOGIN: `/disclosure/pending-login`,
    MY_CLUBS: `/myclubs`,
    MEMBER_GROUP: `/membergroup/:id`,
    MEMBERSHIPS: `/memberships`
};

const HomeRoutes = [
    {
        index: true,
        path: HomeRouteNames.INDEX,
        element: <Dashboard />,
        root: true,
        fullHeight: true
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
    },
    {
        path: HomeRouteNames.DISCLOSURE_PENDING_LOGIN,
        element: <DisclosurePending scope={2}/>,
        title: 'waivers'
    },
    {
        path: HomeRouteNames.MEMBER_GROUP,
        element: <MemberGroupDetails scope={2}/>,
        title: 'memberGroup',
        entityTitle: true,
    }
];

export default HomeRoutes;