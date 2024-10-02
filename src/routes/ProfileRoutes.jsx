import ProfileBookingList from "../pages/profile/booking/list/ProfileBookingList.jsx";
import ProfileBookingDetails from "../pages/reservation/details/ReservationDetails.jsx";
import ReservationRegistration from "../pages/reservation/registration/ReservationRegistration.jsx";
import ProfileFamilyList from "../pages/profile/family/ProfileFamilyList.jsx";
import ProfileCalendarFeed from "../pages/profile/calendar/ProfileCalendarFeed.jsx";
import ProfileMembershipDetails from "../pages/profile/membership/details/ProfileMembershipDetails.jsx";
import ProfileBilling from "../pages/profile/billing/list/ProfileBilling.jsx";
import MyProfile from "../pages/profile/myprofile/MyProfile.jsx";
import ProfileStringingList from "../pages/profile/stringing/list/ProfileStringingList.jsx";
import ProfileStringingDetails from "../pages/profile/stringing/details/ProfileStringingDetails.jsx";
import ProfilePaymentProfileList from "../pages/profile/paymentprofile/list/ProfilePaymentProfileList.jsx";

export const ProfileRouteNames = {
    RESERVATION_LIST: `/profile/reservation/list`, //navigation-data
    RESERVATION_DETAILS: `/profile/reservation/details/:id`,
    RESERVATION_CREATE: `/profile/reservation/create`,
    PROFILE_PERSONAL_INFO: `/profile/personalinfo`,
    PROFILE_FAMILY_INFO_EDIT: `/profile/member/:id`,
    PROFILE_FAMILY_LIST: `/profile/family`,
    PROFILE_CALENDAR_FEED: `/profile/calendar`,
    PROFILE_MEMBERSHIP: `/profile/membership`,
    PROFILE_BILLING: `/profile/billing`,
    PROFILE_STRINGING: `/profile/stringing`,
    PROFILE_STRINGING_DETAILS: `/profile/stringing/:id`,
    PROFILE_PAYMENT_PROFILE_LIST: `/profile/payment-profiles`
};

const ProfileRoutes = [
    {
        path: ProfileRouteNames.RESERVATION_LIST,
        element: <ProfileBookingList />,
        title: 'bookings'
    },
    {
        path: ProfileRouteNames.RESERVATION_DETAILS,
        element: <ProfileBookingDetails />,
        title: 'reservationDetails',
        header: true
    },
    {
        path: ProfileRouteNames.RESERVATION_CREATE,
        element: <ReservationRegistration />,
        title: 'createReservation'
    },
    {
        path: ProfileRouteNames.PROFILE_PERSONAL_INFO,
        element:  <MyProfile />,
        title: 'profile'
    },
    {
        path: ProfileRouteNames.PROFILE_FAMILY_INFO_EDIT,
        element: <MyProfile />,
        title: 'editProfile',
        header: true
    },
    {
        path: ProfileRouteNames.PROFILE_FAMILY_LIST,
        element: <ProfileFamilyList />,
        title: 'myFamily'
    },
    {
        path: ProfileRouteNames.PROFILE_CALENDAR_FEED,
        element: <ProfileCalendarFeed />,
        title: 'calendarFeed',
        disablePullDown: true
    },
    {
        path: ProfileRouteNames.PROFILE_MEMBERSHIP,
        element: <ProfileMembershipDetails />,
        title: 'myMembership'
    },
    {
        path: ProfileRouteNames.PROFILE_BILLING,
        element: <ProfileBilling />,
        title: 'billing',
        disablePullDown: true
    },
    {
        path: ProfileRouteNames.PROFILE_STRINGING_DETAILS,
        element: <ProfileStringingDetails />,
        title: 'stringingDetails'
    },
    {
        path: ProfileRouteNames.PROFILE_STRINGING,
        element: <ProfileStringingList />,
        title: 'stringing'
    },
    {
        path: ProfileRouteNames.PROFILE_PAYMENT_PROFILE_LIST,
        element: <ProfilePaymentProfileList />,
        title: 'paymentProfiles'
    },
];

export default ProfileRoutes;