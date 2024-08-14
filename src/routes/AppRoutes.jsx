import Login from "../pages/account/Login.jsx";
import LoginGetStarted from "../pages/account/Login.GetStarted.jsx";

const AppRoutes = [
    {
        index: true,
        path: '/',
        element: <Login />
    },
    {
        path: '/login-get-started',
        element: <LoginGetStarted />
    },
];

export default AppRoutes;