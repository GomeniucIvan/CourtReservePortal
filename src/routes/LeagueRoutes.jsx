import LeagueList from "../pages/league/list/LeagueList.jsx";

export const LeagueRouteNames = {
    LEAGUE_LIST: '/event/list'
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