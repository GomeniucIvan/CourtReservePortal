import Login from "../pages/account/login/Login.jsx";
import LoginGetStarted from "../pages/account/login/Login.GetStarted.jsx";
import LoginAccountVerification from "../pages/account/login/Login.AccountVerification.jsx";
import LoginVerificationCode from "../pages/account/login/Login.VerificationCode.jsx";
import LoginAuthorize from "../pages/account/login/Login.Authorize.jsx";

export const AuthRouteNames = {
    LOGIN: '/login',
    LOGIN_GET_STARTED: '/login-get-started',
    LOGIN_AUTHORIZE: '/login-authorize',
    LOGIN_ACCOUNT_VERIFICATION: '/login-account-verification',
    LOGIN_VERIFICATION_CODE: '/login-verification-code',
};

const AuthRoutes = [
    {
        path: AuthRouteNames.LOGIN,
        element: <Login />,
        root: true,
        unauthorized: true,
        fullHeight: true
    },
    {
        path: AuthRouteNames.LOGIN_AUTHORIZE,
        element: <LoginAuthorize />,
        title: 'loginAuthorize',
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