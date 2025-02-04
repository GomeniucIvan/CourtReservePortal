import EventCategoryList from "@portal/event/categories/EventCategoryList.jsx";
import EventCalendar from "@portal/event/calendar/EventCalendar.jsx";
import EventRegistration from "@portal/event/registration/EventRegistration.jsx";
import EventDetails from "@portal/event/details/EventDetails.jsx";
import EventList from "@portal/event/list/EventList.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";

export const EventRouteNames = {
    EVENT_LIST: '/online/events/list/:id',
    EVENT_CATEGORIES: '/online/events/categories/:id',
    EVENT_CALENDAR: '/online/calendar/events/:id',
    EVENT_FILTER: '/online/events/list/:id/:filterKey',
    EVENT_DETAILS: '/online/event/details/:id/:number',
    EVENT_SIGNUP: '/online/event/signuptoevent/:id',
    EVENT_FULL_SIGNUP: '/online/event/full-signup/:eventId/:reservationId',
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
        header: true,
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
        element: <EventRegistration />,
        title: 'eventSignup',
        entityTitle: true,
        header: true,
    },
    {
        path: EventRouteNames.EVENT_FULL_SIGNUP,
        element: <EventRegistration fullRegistration={true}/>,
        title: 'eventSignup',
        entityTitle: true,
        header: true,
    },
    {
        path: '/event-category-list/:orgId',
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
        path: '/event-registration/:orgId/:resId',
        element: <EventRegistration />
    },
];

export default EventRoutes;