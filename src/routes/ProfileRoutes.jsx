import ProfileBookingList from "../pages/profile/booking/list/ProfileBookingList.jsx";
import ProfileBookingDetails from "../pages/reservation/details/ReservationDetails.jsx";
import ReservationRegistration from "../pages/reservation/registration/ReservationRegistration.jsx";
import ProfilePersonalInformation from "../pages/profile/personalinformation/ProfilePersonalInformation.jsx";

export const ProfileRouteNames = {
    RESERVATION_LIST: `/profile/reservation/list`,
    RESERVATION_DETAILS: `/profile/reservation/details/:id`,
    RESERVATION_CREATE: `/profile/reservation/create`,
    PROFILE_PERSONAL_INFO: `/profile/personalinfo`,
};

const ProfileRoutes = [
    {
        path: ProfileRouteNames.RESERVATION_LIST,
        element: <ProfileBookingList />,
        title: 'Booking(s)'
    },
    {
        path: ProfileRouteNames.RESERVATION_DETAILS,
        element: <ProfileBookingDetails />,
        title: 'Reservation Details',
        header: true
    },
    {
        path: ProfileRouteNames.RESERVATION_CREATE,
        element: <ReservationRegistration />,
        title: 'Create Reservation'
    },
    {
        path: ProfileRouteNames.PROFILE_PERSONAL_INFO,
        element: <ProfilePersonalInformation />,
        title: 'Profile'
    },
];

export default ProfileRoutes;