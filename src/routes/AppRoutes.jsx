import Login from "../pages/account/Login.jsx";
import LoginGetStarted from "../pages/account/Login.GetStarted.jsx";
import LoginAccountVerification from "../pages/account/Login.AccountVerification.jsx";
import LoginVerificationCode from "../pages/account/Login.VerificationCode.jsx";

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
    {
        path: '/login-account-verification',
        element: <LoginAccountVerification />
    },
    {
        path: '/login-verification-code',
        element: <LoginVerificationCode />
    },
];

export default AppRoutes;