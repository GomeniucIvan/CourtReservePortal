import Dashboard from "../pages/home/Dashboard.jsx";
import Scheduler from "../pages/scheduler/Scheduler.jsx";

export const HomeRouteNames = {
    INDEX: '/dashboard/:orgId',
    SCHEDULER: '/scheduler/:orgId',
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
];

export default HomeRoutes;