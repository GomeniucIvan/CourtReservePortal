import LeagueList from "@portal/league/list/LeagueList.jsx";

export const LeagueRouteNames = {
    LEAGUE_LIST: '/online/leagues/list/:id'
};

const LeagueRoutes = [
    {
        path: LeagueRouteNames.LEAGUE_LIST,
        element: <LeagueList />,
        title: 'leagues',
        entityTitle: true,
    }
];

export default LeagueRoutes;