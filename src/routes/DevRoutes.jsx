import EventCategoryList from "@portal/event/categories/EventCategoryList.jsx";
import EventCalendar from "@portal/event/calendar/EventCalendar.jsx";
import EventRegistration from "@portal/event/registration/EventRegistration.jsx";
import EventDetails from "@portal/event/details/EventDetails.jsx";
import EventList from "@portal/event/list/EventList.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import DevIcons from "@/pages/dev/DevIcons.jsx";

export const DevRouteNames = {
    DEV_ICONS: '/dev/icons'
};

const DevRoutes = [
    {
        path: DevRouteNames.DEV_ICONS,
        element: <DevIcons />,
        title: 'Icons',
        unauthorized: true,
    }
    
];

export default DevRoutes;