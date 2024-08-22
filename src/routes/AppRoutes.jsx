import AuthRoutes from './AuthRoutes.jsx';
import HomeRoutes from './HomeRoutes.jsx';
import EventRoutes from "./EventRoutes.jsx";
import ProfileRoutes from "./ProfileRoutes.jsx";

const AppRoutes = [
    ...AuthRoutes,
    ...HomeRoutes,
    ...EventRoutes,
    ...ProfileRoutes,
];

export default AppRoutes;