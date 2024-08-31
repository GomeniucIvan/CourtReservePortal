import ProfileBookingList from "../pages/profile/booking/list/ProfileBookingList.jsx";
import ProfileBookingDetails from "../pages/reservation/details/ReservationDetails.jsx";
import ReservationRegistration from "../pages/reservation/registration/ReservationRegistration.jsx";
import ProfilePersonalInformation from "../pages/profile/personalinformation/ProfilePersonalInformation.jsx";
import ProfileFamilyList from "../pages/profile/family/ProfileFamilyList.jsx";
import ProfileCalendarFeed from "../pages/profile/calendar/ProfileCalendarFeed.jsx";

export const ProfileRouteNames = {
    RESERVATION_LIST: `/profile/reservation/list`, //navigation-data
    RESERVATION_DETAILS: `/profile/reservation/details/:id`,
    RESERVATION_CREATE: `/profile/reservation/create`,
    PROFILE_PERSONAL_INFO: `/profile/personalinfo`,
    PROFILE_FAMILY_INFO_EDIT: `/profile/member/:id`,
    PROFILE_FAMILY_LIST: `/profile/family`,
    PROFILE_CALENDAR_FEED: `/profile/calendar`,
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
    {
        path: ProfileRouteNames.PROFILE_FAMILY_INFO_EDIT,
        element: <ProfilePersonalInformation />,
        title: 'Edit',
        header: true
    },
    {
        path: ProfileRouteNames.PROFILE_FAMILY_LIST,
        element: <ProfileFamilyList />,
        title: 'My Family'
    },
    {
        path: ProfileRouteNames.PROFILE_CALENDAR_FEED,
        element: <ProfileCalendarFeed />,
        title: 'Calendar Feed'
    }
];

export default ProfileRoutes;