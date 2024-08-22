import ProfileBookingList from "../pages/profile/booking/list/ProfileBookingList.jsx";

export const ProfileRouteNames = {
    RESERVATION_DETAILS: `/reservation/details/:id`,
};

const ProfileRoutes = [
    {
        path: ProfileRouteNames.RESERVATION_DETAILS,
        element: <ProfileBookingList />
    }
];

export default ProfileRoutes;