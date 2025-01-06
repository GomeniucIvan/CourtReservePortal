import JoinOrganization from "@portal/account/joinorganization/JoinOrganization.jsx";

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