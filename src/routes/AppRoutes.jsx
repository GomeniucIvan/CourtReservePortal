import Login from "../pages/account/Login.jsx";
import LoginGetStarted from "../pages/account/Login.GetStarted.jsx";
import LoginAccountVerification from "../pages/account/Login.AccountVerification.jsx";
import LoginVerificationCode from "../pages/account/Login.VerificationCode.jsx";

const AppRoutes = [
    {
        index: true,
        path: '/',
        element: <Login />,
        root: true
    },
    {
        path: '/login-get-started',
        element: <LoginGetStarted />,
        title: 'Getting Started'
    },
    {
        path: '/login-account-verification',
        element: <LoginAccountVerification />,
        title: 'Account Verification'
    },
    {
        path: '/login-verification-code',
        element: <LoginVerificationCode />,
        title: 'Verification Code'
    },

    {
        path: '/dashboard',
        element: <LoginVerificationCode />
    },
];

export default AppRoutes;