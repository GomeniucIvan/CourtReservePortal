import Login from "../pages/account/Login.jsx";
import LoginGetStarted from "../pages/account/Login.GetStarted.jsx";
import LoginAccountVerification from "../pages/account/Login.AccountVerification.jsx";
import LoginVerificationCode from "../pages/account/Login.VerificationCode.jsx";
import Dashboard from "../pages/home/Dashboard.jsx";
import EventList from "../pages/event/list/EventList.jsx";
import EventCategoryList from "../pages/event/categories/EventCategoryList.jsx";
import EventCalendar from "../pages/event/calendar/EventCalendar.jsx";
import EventRegistration from "../pages/event/registration/EventRegistration.jsx";

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
        path: '/dashboard/:orgId',
        element: <Dashboard />
    },
    {
        path: '/event-list/:orgId',
        element: <EventList />
    },
    {
        path: '/event-category-list/:orgId',
        element: <EventCategoryList />
    },
    {
        path: '/event-calendar/:orgId',
        element: <EventCalendar />
    },
    {
        path: '/event-registration/:orgId/:resId',
        element: <EventRegistration />
    },
];

export default AppRoutes;