import EventCategoryList from "@portal/event/categories/EventCategoryList.jsx";
import EventCalendar from "@portal/event/calendar/EventCalendar.jsx";
import EventDetails from "@portal/event/details/EventDetails.jsx";
import EventList from "@portal/event/list/EventList.jsx";
import EventSignUp from "@portal/event/registration/EventSignUp.jsx";
import EventChangeSignUp from "@portal/event/registration/EventChangeSignUp.jsx";
import EventWithdraw from "@portal/event/withdraw/EventWithdraw.jsx";
import EventJoinWaitlist from "@portal/event/waitlist/join/EventJoinWaitlist.jsx";

export const EventRouteNames = {
    EVENT_LIST: '/online/events/list/:id',
    EVENT_CATEGORIES: '/online/events/categories/:id',
    EVENT_CALENDAR: '/online/calendar/events/:id', //EventCalendar
    EVENT_FILTER: '/online/events/list/:id/:filterKey',
    EVENT_DETAILS: '/online/events/details/:id/:number',
    EVENT_SIGNUP: '/online/events/signuptoevent/:id',
    EVENT_CHANGE_SIGNUP: '/online/events/changesignup/:id',
    EVENT_WITHDRAWN: '/online/events/withdraw/:id',
    EVENT_JOIN_WAITLIST: '/online/events/joinwaitlist/:id',
};

const EventRoutes = [
    {
        path: EventRouteNames.EVENT_LIST,
        element: <EventList />,
        title: 'events',
        entityTitle: true,
    },
    {
        path: EventRouteNames.EVENT_FILTER,
        element: <EventList filter={true}/>,
        title: 'events',
        header: true,
        entityTitle: true,
    },
    {
        path: EventRouteNames.EVENT_CATEGORIES,
        element: <EventCategoryList />,
        title: 'eventCategories',
        entityTitle: true,
    },
    {
        path: EventRouteNames.EVENT_DETAILS,
        element: <EventDetails />,
        title: 'eventDetails',
        header: true,
        entityTitle: true,
    },
    {
        path: EventRouteNames.EVENT_SIGNUP,
        element: <EventSignUp />,
        title: 'eventSignup',
        entityTitle: true,
        header: true,
    },
    {
        path: EventRouteNames.EVENT_CHANGE_SIGNUP,
        element: <EventChangeSignUp />,
        title: 'eventChangeSignup',
        entityTitle: true,
        header: true,
    },
    {
        path: EventRouteNames.EVENT_CATEGORIES,
        title: 'eventCategories',
        entityTitle: true,
        header: true,
        element: <EventCategoryList />
    },
    {
        path: EventRouteNames.EVENT_CALENDAR,
        element: <EventCalendar />,
        title: 'eventCalendar',
        entityTitle: true,
        disablePullDown: true
    },
    {
        path: EventRouteNames.EVENT_WITHDRAWN,
        element: <EventWithdraw />,
        title: 'eventWithdraw',
        entityTitle: true,
        disablePullDown: true
    },
    {
        path: EventRouteNames.EVENT_JOIN_WAITLIST,
        element: <EventJoinWaitlist />,
        title: 'eventWaitlist',
        entityTitle: true
    }
];

export default EventRoutes;