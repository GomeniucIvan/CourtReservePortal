import EventList from "../pages/event/list/EventList.jsx";
import EventCategoryList from "../pages/event/categories/EventCategoryList.jsx";
import EventCalendar from "../pages/event/calendar/EventCalendar.jsx";
import EventRegistration from "../pages/event/registration/EventRegistration.jsx";

const EventRoutes = [
    {
        path: '/event-list/:orgId',
        element: <EventList />
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