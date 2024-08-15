import Dashboard from "../pages/home/Dashboard.jsx";
import Scheduler from "../pages/scheduler/Scheduler.jsx";

const HomeRoutes = [
    {
        path: '/dashboard/:orgId',
        element: <Dashboard />
    },
    {
        path: '/scheduler/:orgId',
        element: <Scheduler />
    },
];

export default HomeRoutes;