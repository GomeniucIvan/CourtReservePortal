import LeagueList from "@portal/league/list/LeagueList.jsx";
import LeagueDetails from "@portal/league/details/LeagueDetails.jsx";
import LeagueRegistration from "@portal/league/registration/LeagueRegistration.jsx";
import LeagueWithdrawn from "@portal/league/withdrawn/LeagueWithdrawn.jsx";

export const LeagueRouteNames = {
    LEAGUE_LIST: '/online/leagues/list/:id',
    LEAGUE_DETAIL: '/online/leagues/details/:id/:lsid',
    LEAGUE_REGISTRATION: '/online/leagues/registeroredit/:id',
    LEAGUE_WITHDRAWN: '/online/leagues/withdrawn/:id',
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
    },
    {
        path: LeagueRouteNames.LEAGUE_REGISTRATION,
        element: <LeagueRegistration />,
        title: 'leagueRegistration',
    },
    {
        path: LeagueRouteNames.LEAGUE_WITHDRAWN,
        element: <LeagueWithdrawn />,
        title: 'leagueWithdrawn',
    }
];

export default LeagueRoutes;