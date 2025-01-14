import AuthRoutes from './AuthRoutes.jsx';
import HomeRoutes from './HomeRoutes.jsx';
import EventRoutes from "./EventRoutes.jsx";
import ProfileRoutes from "./ProfileRoutes.jsx";
import AccountRoutes from "./AccountRoutes.jsx";
import LeagueRoutes from "@/routes/LeagueRoutes.jsx";
import DevRoutes from "@/routes/DevRoutes.jsx";

const AppRoutes = [
    ...AccountRoutes,
    ...AuthRoutes,
    ...HomeRoutes,
    ...EventRoutes,
    ...ProfileRoutes,
    ...LeagueRoutes,
    ...DevRoutes,
];

export default AppRoutes;