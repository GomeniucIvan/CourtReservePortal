import JoinOrganization from "@portal/account/joinorganization/JoinOrganization.jsx";

export const AccountRouteNames = {
    REQUEST_ORGANIZATION: `/online/myprofile/joinclub/:id`,
};

const AccountRoutes = [
    {
        path: AccountRouteNames.REQUEST_ORGANIZATION,
        element: <JoinOrganization />,
        title: 'joinOrganization',
        useHeaderKeys: true,
        disablePullDown: true,
    }
];

export default AccountRoutes;