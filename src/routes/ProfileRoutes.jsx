import ProfileBookingList from "../pages/profile/booking/list/ProfileBookingList.jsx";

export const ProfileRouteNames = {
    RESERVATION_LIST: `/profile/reservation/list`,
    RESERVATION_DETAILS: `/profile/reservation/details/:id`,
};

const ProfileRoutes = [
    {
        path: ProfileRouteNames.RESERVATION_LIST,
        element: <ProfileBookingList />,
        title: 'Booking(s)'
    },
    {
        path: ProfileRouteNames.RESERVATION_DETAILS,
        element: <ProfileBookingList />
    },
];

export default ProfileRoutes;