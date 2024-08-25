import EventCategoryList from "../pages/event/categories/EventCategoryList.jsx";
import EventCalendar from "../pages/event/calendar/EventCalendar.jsx";
import EventRegistration from "../pages/event/registration/EventRegistration.jsx";
import EventDetails from "../pages/event/details/EventDetails.jsx";
import EventList from "../pages/event/list/EventList.jsx";

export const EventRouteNames = {
    EVENT_LIST: '/event/list',
    EVENT_DETAILS: '/event/details/:id',
};

const EventRoutes = [
    {
        path: EventRouteNames.EVENT_LIST,
        element: <EventList />,
        title: 'Events'
    },
    {
        path: EventRouteNames.EVENT_DETAILS,
        element: <EventDetails />,
        title: 'Event Details',
        header: true
    },
    {
        path: '/event-category-list/:orgId',
        element: <EventCategoryList />
    },
    {
        path: '/event-calendar/:orgId',
        element: <EventCalendar />
    },
    {
        path: '/event-registration/:orgId/:resId',
        element: <EventRegistration />
    },
];

export default EventRoutes;