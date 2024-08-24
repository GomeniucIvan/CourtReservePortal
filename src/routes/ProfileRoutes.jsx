import ProfileBookingList from "../pages/profile/booking/list/ProfileBookingList.jsx";
import ProfileBookingDetails from "../pages/profile/booking/details/ProfileBookingDetails.jsx";
import ReservationRegistration from "../pages/reservation/ReservationRegistration.jsx";

export const ProfileRouteNames = {
    RESERVATION_LIST: `/profile/reservation/list`,
    RESERVATION_DETAILS: `/profile/reservation/details/:id`,
    RESERVATION_CREATE: `/profile/reservation/create`,
};

const ProfileRoutes = [
    {
        path: ProfileRouteNames.RESERVATION_LIST,
        element: <ProfileBookingList />,
        title: 'Booking(s)'
    },
    {
        path: ProfileRouteNames.RESERVATION_DETAILS,
        element: <ProfileBookingDetails />
    },
    {
        path: ProfileRouteNames.RESERVATION_CREATE,
        element: <ReservationRegistration />,
        title: 'Create Reservation'
    },
];

export default ProfileRoutes;