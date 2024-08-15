import Login from "../pages/account/login/Login.jsx";
import LoginGetStarted from "../pages/account/login/Login.GetStarted.jsx";
import LoginAccountVerification from "../pages/account/login/Login.AccountVerification.jsx";
import LoginVerificationCode from "../pages/account/login/Login.VerificationCode.jsx";

const AuthRoutes = [
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
];

export default AuthRoutes;