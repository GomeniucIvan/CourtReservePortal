import Login from "../pages/account/login/Login.jsx";
import LoginGetStarted from "../pages/account/login/Login.GetStarted.jsx";
import LoginAccountVerification from "../pages/account/login/Login.AccountVerification.jsx";
import LoginVerificationCode from "../pages/account/login/Login.VerificationCode.jsx";
import LoginAuthorize from "../pages/account/login/Login.Authorize.jsx";
import LoginCreateAccount from "../pages/account/login/Login.CreateAccount.jsx";
import LoginSearchOrganization from "../pages/account/login/Login.SearchOrganization.jsx";
import LoginAdditionalInfo from "../pages/account/login/Login.AdditionalInfo.jsx";
import LoginMemberships from "../pages/account/login/Login.Memberships.jsx";

export const AuthRouteNames = {
    LOGIN: '/login',
    LOGIN_GET_STARTED: '/login-get-started',
    LOGIN_AUTHORIZE: '/login-authorize',
    LOGIN_CREATE_ACCOUNT: '/login-create',
    LOGIN_ORGANIZATION: '/login-organization',
    LOGIN_ADDITIONAL_INFO: '/login-info',
    LOGIN_ACCOUNT_VERIFICATION: '/login-account-verification',
    LOGIN_VERIFICATION_CODE: '/login-verification-code',
    LOGIN_MEMBERSHIP: '/login-membership',
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
        path: AuthRouteNames.LOGIN_CREATE_ACCOUNT,
        element: <LoginCreateAccount />,
        title: 'loginCreateAccount',
        unauthorized: true
    },
    {
        path: AuthRouteNames.LOGIN_ORGANIZATION,
        element: <LoginSearchOrganization />,
        title: 'loginOrganization',
        unauthorized: true
    },
    {
        path: AuthRouteNames.LOGIN_ADDITIONAL_INFO,
        element: <LoginAdditionalInfo />,
        title: 'loginAdditionalInfo',
        unauthorized: true
    },
    {
        path: AuthRouteNames.LOGIN_MEMBERSHIP,
        element: <LoginMemberships />,
        title: 'loginMembership',
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