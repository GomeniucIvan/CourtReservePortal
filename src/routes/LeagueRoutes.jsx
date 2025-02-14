import LeagueList from "@portal/league/list/LeagueList.jsx";
import LeagueDetails from "@portal/league/details/LeagueDetails.jsx";

export const LeagueRouteNames = {
    LEAGUE_LIST: '/online/leagues/list/:id',
    LEAGUE_DETAIL: '/online/leagues/details/:id/:lsid',
};

const LeagueRoutes = [
    {
        path: LeagueRouteNames.LEAGUE_LIST,
        element: <LeagueList />,
        title: 'leagues',
    },
    {
        path: LeagueRouteNames.LEAGUE_DETAIL,
        element: <LeagueDetails />,
        title: 'leagueSessionDetails',
    }
];

export default LeagueRoutes;