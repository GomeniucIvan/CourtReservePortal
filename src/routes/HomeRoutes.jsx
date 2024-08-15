import Dashboard from "../pages/home/Dashboard.jsx";

const HomeRoutes = [
    {
        path: '/dashboard/:orgId',
        element: <Dashboard />
    },
];

export default HomeRoutes;