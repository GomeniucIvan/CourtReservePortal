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
import ProfileBillingPayment from "../pages/profile/billing/payment/ProfileBillingPayment.jsx";
import JoinOrganization from "../pages/account/joinorganization/JoinOrganization.jsx";

export const AccountRouteNames = {
    REQUEST_ORGANIZATION: `/signup/:orgId/:memberId`, // http://localhost:2129/Online/Portal/SignUp/6969?famMemberId=725917
};

const AccountRoutes = [
    {
        path: AccountRouteNames.REQUEST_ORGANIZATION,
        element: <JoinOrganization request={true} />,
        title: 'requestAccess',
        entityTitle: true,
        disablePullDown: true
    }
];

export default AccountRoutes;