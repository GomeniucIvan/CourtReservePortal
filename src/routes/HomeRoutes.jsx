import Dashboard from "@portal/home/index/Dashboard.jsx";
import AnnouncementDetails from "@portal/announcement/details/AnnouncementDetails.jsx";
import AnnouncementList from "@portal/announcement/list/AnnouncementList.jsx";
import ExpandedScheduler from "@portal/scheduler/ExpandedScheduler.jsx";
import Navigation from "@portal/navigation/Navigation.jsx";
import DisclosurePending from "@portal/home/disclosure/DisclosurePending.jsx";
import MemberGroupDetails from "@portal/membergroup/details/MemberGroupDetails.jsx";
import NotificationList from "@portal/notification/list/NotificationList.jsx";
import NewsList from "@portal/news/list/NewsList.jsx";
import NewsDetails from "@portal/news/details/NewsDetails.jsx";
import ProfileMyOrganizationList from "@portal/profile/organizations/list/ProfileMyOrganizationList.jsx";
import NotificationDetails from "@portal/notification/details/NotificationDetails.jsx";
import NotFoundPage from "@portal/home/403/NotFoundPage.jsx";
import SmsAlertModal from "@portal/home/smsalert/SmsAlertModal.jsx";
import PackageList from "@portal/package/list/PackageList.jsx";
import PackageDetails from "@portal/package/details/PackageDetails.jsx";
import PackagePurchase from "@portal/package/purchase/PackagePurchase.jsx";
import MembershipList from "@portal/membership/list/MembershipList.jsx";
import MembershipDetails from "@portal/membership/details/MembershipDetails.jsx";
import MembershipReview from "@portal/membership/review/MembershipReview.jsx";
import SaveMyPlaySessionRecording from "@portal/savemyplay/sessionrecording/SaveMyPlaySessionRecording.jsx";
import PourMyBevCode from "@portal/pourmybev/pourmybevcode/PourMyBevCode.jsx";
import PourMyBevCart from "@portal/pourmybev/pourmybevcart/PourMyBevCart.jsx";

export const HomeRouteNames = {
    CR_STARTUP_URL: `/mobilesso/newmobile`,
    INDEX: '/',
    PORTAL_INDEX: '/online/portal/index/:id',
    NOT_FOUND: '/403',
    SCHEDULER: '/online/reservations/bookings/:id',
    SCHEDULER_INDEX: '/online/reservations/index/:id',  //ExpandedScheduler
    SCHEDULER_RESOURCES: '/online/reservations/resources/:id',  //ExpandedScheduler
    ANNOUNCEMENT_DETAILS: `/announcement/details/:id`,
    ANNOUNCEMENT_LIST: `/online/announcement/index/:id`,
    NOTIFICATION_LIST: `/online/notification/list/:id`,
    NOTIFICATION_DETAILS: `/online/notification/pushnotificationdetails/:id`,
    ORGANIZATION_LIST: `/online/myprofile/myclubs/:id`, //ProfileMyOrganizationList
    MY_CLUBS: `/online/myprofile/myclubs`, //ProfileMyOrganizationList
    NEWS_LIST: `/online/news/list/:id`,
    NEWS_DETAILS: `/online/news/details/:id`,
    NAVIGATE: `/online/portal/navigate/:id/:nodeId`,
    DISCLOSURE_PENDING_LOGIN: `/online/disclosures/pending/:id`,
    MEMBER_GROUP: `/online/publicmembergroup/MemberGroup/:id`,
    TEXT_MESSAGE_MODAL: `/online/textmessage/optin/:id`, //textmessage/optin is bindned to check current page
    PACKAGE_LIST: `/online/packages/list/:id`,
    PACKAGE_DETAILS: `/online/packages/details/:id`,
    PACKAGE_PURCHASE: `/online/packages/purchasepackages/:id`,
    MEMBERSHIPS: `/online/memberships/index`,
    MEMBERSHIP_DETAILS: `/online/memberships/viewmembership/:id`,
    MEMBERSHIP_REVIEW: `/online/memberships/review/:id`, //MembershipReview
    SAVE_MY_PLAY: `/online/savemyplay/index/:id`, //SaveMyPlaySessionRecording
    POUR_MY_BEV_CODE: `/online/pourmybev/code/:id`,
    POUR_MY_BEV_CART: `/online/pourmybev/cart/:id`,
};

const HomeRoutes = [
    {
        path: HomeRouteNames.NOT_FOUND,
        element: <NotFoundPage />,
        title: 'notFound',
        header: true,
        unauthorized: true
    },
    {
        index: true,
        path: HomeRouteNames.INDEX,
        element: <Dashboard />,
        root: true
    },
    {
        path: HomeRouteNames.PORTAL_INDEX,
        element: <Dashboard />,
        root: true
    },
    {
        path: HomeRouteNames.SCHEDULER,
        element: <ExpandedScheduler />,
        title: '',
        disablePullDown: true,
        header: true
    },
    {
        path: HomeRouteNames.SCHEDULER_INDEX,
        element: <ExpandedScheduler index={true} />,
        title: '',
        disablePullDown: true,
        header: true
    },
    {
        path: HomeRouteNames.SCHEDULER_RESOURCES,
        element: <ExpandedScheduler resource={true} />,
        title: '',
        disablePullDown: true,
        header: true
    },
    {
        path: HomeRouteNames.ANNOUNCEMENT_LIST,
        element: <AnnouncementList />,
        title: 'announcements'
    },
    {
        path: HomeRouteNames.ANNOUNCEMENT_DETAILS,
        element: <AnnouncementDetails />,
        title: 'announcementDetails',
        header: true
    },
    {
        path: HomeRouteNames.NAVIGATE,
        element: <Navigation />,
        header: true,
        disablePullDown: true
    },
    {
        path: HomeRouteNames.DISCLOSURE_PENDING_LOGIN,
        element: <DisclosurePending scope={2}/>,
        title: 'waivers'
    },
    {
        path: HomeRouteNames.MEMBER_GROUP,
        element: <MemberGroupDetails scope={2}/>,
        title: 'memberGroup',
        entityTitle: true,
    },
    {
        path: HomeRouteNames.NOTIFICATION_LIST,
        element: <NotificationList/>,
        title: 'notifications'
    },
    {
        path: HomeRouteNames.NOTIFICATION_DETAILS,
        element: <NotificationDetails />,
        title: 'notificationDetails',
        header: true
    },
    {
        path: HomeRouteNames.NEWS_LIST,
        element: <NewsList />,
        title: 'news',
        header: true
    },
    {
        path: HomeRouteNames.NEWS_DETAILS,
        element: <NewsDetails />,
        title: 'newsDetails',
        header: true
    },
    {
        path: HomeRouteNames.MY_CLUBS,
        element: <ProfileMyOrganizationList />,
        title: 'organizationList',
        header: true
    },
    {
        path: HomeRouteNames.ORGANIZATION_LIST,
        element: <ProfileMyOrganizationList />,
        title: 'organizationList',
        header: true
    },
    {
        path: HomeRouteNames.TEXT_MESSAGE_MODAL,
        element: <SmsAlertModal />,
        title: 'textMessageOptIn',
        header: true
    },
    {
        path: HomeRouteNames.PACKAGE_LIST,
        element: <PackageList />,
        title: 'packages',
        header: true
    },
    {
        path: HomeRouteNames.PACKAGE_DETAILS,
        element: <PackageDetails />,
        title: 'packageDetails',
        header: true
    },
    {
        path: HomeRouteNames.PACKAGE_PURCHASE,
        element: <PackagePurchase />,
        title: 'packagePurchase',
        header: true
    },
    {
        path: HomeRouteNames.MEMBERSHIPS,
        element: <MembershipList />,
        title: 'membershipList',
        header: true
    },
    {
        path: HomeRouteNames.MEMBERSHIP_DETAILS,
        element: <MembershipDetails />,
        title: 'membershipDetails',
        header: true
    },
    {
        path: HomeRouteNames.MEMBERSHIP_REVIEW,
        element: <MembershipReview />,
        title: 'membershipReview',
        header: true
    },
    {
        path: HomeRouteNames.SAVE_MY_PLAY,
        element: <SaveMyPlaySessionRecording />,
        title: 'saveMyPlaySessions',
        header: true
    },
    {
        path: HomeRouteNames.POUR_MY_BEV_CODE,
        element: <PourMyBevCode />,
        title: 'pourMyBevCode',
        header: true
    },
    {
        path: HomeRouteNames.POUR_MY_BEV_CART,
        element: <PourMyBevCart />,
        title: 'pourMyBevCart',
        header: true
    }
];

export default HomeRoutes;