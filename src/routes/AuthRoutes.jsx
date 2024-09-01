import Login from "../pages/account/login/Login.jsx";
import LoginGetStarted from "../pages/account/login/Login.GetStarted.jsx";
import LoginAccountVerification from "../pages/account/login/Login.AccountVerification.jsx";
import LoginVerificationCode from "../pages/account/login/Login.VerificationCode.jsx";

export const AuthRouteNames = {
    LOGIN_GET_STARTED: '/login-get-started',
    LOGIN_ACCOUNT_VERIFICATION: '/login-account-verification',
    LOGIN_VERIFICATION_CODE: '/login-verification-code',
};

const AuthRoutes = [
    {
        index: true,
        path: '/',
        element: <Login />,
        root: true,
        unauthorized: true
    },
    {
        path: AuthRouteNames.LOGIN_GET_STARTED,
        element: <LoginGetStarted />,
        title: 'gettingStarted',
        unauthorized: true
    },
    {
        path: AuthRouteNames.LOGIN_ACCOUNT_VERIFICATION,
        element: <LoginAccountVerification />,
        title: 'accountVerification',
        unauthorized: true
    },
    {
        path: AuthRouteNames.LOGIN_VERIFICATION_CODE,
        element: <LoginVerificationCode />,
        title: 'verificationCode',
        unauthorized: true
    },
];

export default AuthRoutes;