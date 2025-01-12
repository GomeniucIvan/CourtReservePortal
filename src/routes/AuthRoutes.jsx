import Login from "@portal/account/login/Login.jsx";
import LoginGetStarted from "@portal/account/login/Login.GetStarted.jsx";
// import LoginAccountVerification from "../pages/account/login/Login.AccountVerification.jsx";
import LoginVerificationCode from "@portal/account/login/Login.VerificationCode.jsx";
import LoginAuthorize from "@portal/account/login/Login.Authorize.jsx";
import LoginCreateAccount from "@portal/account/login/Login.CreateAccount.jsx";
import LoginSearchOrganization from "@portal/account/login/Login.SearchOrganization.jsx";
import LoginAdditionalInfo from "@portal/account/login/Login.AdditionalInfo.jsx";
import LoginMemberships from "@portal/account/login/Login.Memberships.jsx";
import LoginReview from "@portal/account/login/Login.Review.jsx";
import LoginRequestCode from "@portal/account/login/Login.RequestCode.jsx";
import LoginUpdatePassword from "@portal/account/login/Login.UpdatePassword.jsx";
import LoginForgotPassword from "@portal/account/login/Login.ForgotPassword.jsx";

export const AuthRouteNames = {
    LOGIN: '/account/login',
    LOGIN_GET_STARTED: '/login-get-started',
    LOGIN_AUTHORIZE: '/login-authorize',
    LOGIN_CREATE_ACCOUNT: '/login-create',
    LOGIN_ORGANIZATION: '/login-organization',
    LOGIN_ADDITIONAL_INFO: '/login-info',
    //LOGIN_ACCOUNT_VERIFICATION: '/login-account-verification',
    LOGIN_VERIFICATION_CODE: '/login-verification-code',
    LOGIN_MEMBERSHIP: '/login-membership',
    LOGIN_REVIEW: '/login-review',
    LOGIN_REQUEST_CODE: '/login-request-code',
    LOGIN_UPDATE_PASSWORD: '/login-update-password',
    LOGIN_FORGOT_PASSWORD: '/login-forgot-password',
};

const AuthRoutes = [
    {
        path: AuthRouteNames.LOGIN,
        element: <Login />,
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
        path: AuthRouteNames.LOGIN_REQUEST_CODE,
        element: <LoginRequestCode />,
        title: 'loginRequestCode',
        unauthorized: true
    },
    {
        path: AuthRouteNames.LOGIN_UPDATE_PASSWORD,
        element: <LoginUpdatePassword />,
        title: 'loginUpdatePassword',
        unauthorized: true
    },
    {
        path: AuthRouteNames.LOGIN_FORGOT_PASSWORD,
        element: <LoginForgotPassword />,
        title: 'loginForgotPassword',
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
        path: AuthRouteNames.LOGIN_REVIEW,
        element: <LoginReview />,
        title: 'loginReview',
        unauthorized: true
    },
    {
        path: AuthRouteNames.LOGIN_GET_STARTED,
        element: <LoginGetStarted />,
        title: 'gettingStarted',
        unauthorized: true
    },
    // {
    //     path: AuthRouteNames.LOGIN_ACCOUNT_VERIFICATION,
    //     element: <LoginAccountVerification />,
    //     title: 'accountVerification',
    //     unauthorized: true
    // },
    {
        path: AuthRouteNames.LOGIN_VERIFICATION_CODE,
        element: <LoginVerificationCode />,
        title: 'verificationCode',
        unauthorized: true
    },
];

export default AuthRoutes;