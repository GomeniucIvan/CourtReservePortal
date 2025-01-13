import Login from "@portal/account/login/Login.jsx";
import LoginForgotPassword from "@portal/account/login/Login.ForgotPassword.jsx";

export const AuthRouteNames = {
    LOGIN: '/account/login',
    LOGIN_FORGOT_PASSWORD: '/account/forgot-password',
};

const AuthRoutes = [
    {
        path: AuthRouteNames.LOGIN,
        element: <Login />,
        unauthorized: true,
        fullHeight: true
    },
    {
        path: AuthRouteNames.LOGIN_FORGOT_PASSWORD,
        element: <LoginForgotPassword />,
        title: 'loginForgotPassword',
        unauthorized: true
    },
];

export default AuthRoutes;