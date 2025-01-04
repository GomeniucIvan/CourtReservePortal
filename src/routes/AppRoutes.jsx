import AuthRoutes from './AuthRoutes.jsx';
import HomeRoutes from './HomeRoutes.jsx';
import EventRoutes from "./EventRoutes.jsx";
import ProfileRoutes from "./ProfileRoutes.jsx";
import AccountRoutes from "./AccountRoutes.jsx";

const AppRoutes = [
    ...AccountRoutes,
    ...AuthRoutes,
    ...HomeRoutes,
    ...EventRoutes,
    ...ProfileRoutes,
];

export default AppRoutes;