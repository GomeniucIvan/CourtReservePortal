import EventCategoryList from "../pages/event/categories/EventCategoryList.jsx";
import EventCalendar from "../pages/event/calendar/EventCalendar.jsx";
import EventRegistration from "../pages/event/registration/EventRegistration.jsx";
import EventDetails from "../pages/event/details/EventDetails.jsx";
import EventList from "../pages/event/list/EventList.jsx";

export const EventRouteNames = {
    EVENT_LIST: '/event/list',
    EVENT_DETAILS: '/event/details/:id',
    EVENT_SIGNUP: '/event/signup/:id',
};

const EventRoutes = [
    {
        path: EventRouteNames.EVENT_LIST,
        element: <EventList />,
        title: 'events',
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