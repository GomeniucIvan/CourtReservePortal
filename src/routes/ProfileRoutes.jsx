import ProfileBookingDetails from "@portal/reservation/details/ReservationDetails.jsx";
import ReservationRegistration from "@portal/reservation/registration/ReservationRegistration.jsx";
import ProfileFamilyList from "@portal/profile/family/ProfileFamilyList.jsx";
import ProfileCalendarFeed from "@portal/profile/calendar/ProfileCalendarFeed.jsx";
import ProfileMembershipDetails from "@portal/profile/membership/details/ProfileMembershipDetails.jsx";
import ProfileBilling from "@portal/profile/billing/list/ProfileBilling.jsx";
import MyProfile from "@portal/profile/myprofile/MyProfile.jsx";
import ProfileStringingList from "@portal/profile/stringing/list/ProfileStringingList.jsx";
import ProfileStringingDetails from "@portal/profile/stringing/details/ProfileStringingDetails.jsx";
import ProfilePaymentProfileList from "@portal/profile/paymentprofile/list/ProfilePaymentProfileList.jsx";
import ProfileBillingPayment from "@portal/profile/billing/payment/ProfileBillingPayment.jsx";
import ProfileBookingList from "@portal/profile/booking/list/ProfileBookingList.jsx";

export const ProfileRouteNames = {
    BOOKING_LIST: `/online/bookings/list/:id`, //navigation-data
    RESERVATION_DETAILS: `/profile/reservation/details/:id`,
    RESERVATION_EDIT: `/profile/reservation/edit/:id`,
    RESERVATION_CREATE: `/online/profile/reservation/create`,
    PROFILE_PERSONAL_INFO: `/online/myprofile/myprofile/:id`,
    PROFILE_FAMILY_INFO_EDIT: `/profile/member/:id`,
    PROFILE_FAMILY_LIST: `/online/myfamily/index/:id`,
    PROFILE_CALENDAR_FEED: `/online/myprofile/mycalendar/:id`,
    PROFILE_MEMBERSHIP: `/online/myprofile/mymembership/:id`,
    PROFILE_BILLING: `/online/mybalance/index/:id`,
    PROFILE_BILLING_INVOICES: `/online/myinvoices/index/:id`,
    PROFILE_STRINGING_LIST: `/online/stringingjob/index/:id`,
    PROFILE_STRINGING_DETAILS: `/online/stringingjob/details/:id`,
    PROFILE_PAYMENT_PROFILE_LIST: `/online/paymentoptions/index/:id`,
    
    //why is different routes?!
    PROCESS_PAYMENT: `/online/payments/processpayment/:id`,
    PROCESS_TRANSACTION_PAYMENT: `/online/payments/processtransactionpayments/:id`,
};

const ProfileRoutes = [
    {
        path: ProfileRouteNames.BOOKING_LIST,
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
        path: ProfileRouteNames.PROFILE_BILLING_INVOICES,
        element: <ProfileBilling tabKey={'invoices'} />,
        title: 'billing',
        disablePullDown: true
    },
    {
        path: ProfileRouteNames.PROCESS_PAYMENT,
        element: <ProfileBillingPayment />,
        title: 'billingPayment',
        disablePullDown: true
    },
    {
        path: ProfileRouteNames.PROCESS_TRANSACTION_PAYMENT,
        element: <ProfileBillingPayment />,
        title: 'billingPayment',
        disablePullDown: true
    },
    {
        path: ProfileRouteNames.PROFILE_STRINGING_DETAILS,
        element: <ProfileStringingDetails />,
        title: 'stringingDetails'
    },
    {
        path: ProfileRouteNames.PROFILE_STRINGING_LIST,
        element: <ProfileStringingList />,
        title: 'stringing'
    },
    {
        path: ProfileRouteNames.PROFILE_PAYMENT_PROFILE_LIST,
        element: <ProfilePaymentProfileList />,
        title: 'paymentProfiles'
    }
];

export default ProfileRoutes;