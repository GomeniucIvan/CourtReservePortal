import AuthRoutes from './AuthRoutes.jsx';
import HomeRoutes from './HomeRoutes.jsx';
import EventRoutes from "./EventRoutes.jsx";

const AppRoutes = [
    ...AuthRoutes,
    ...HomeRoutes,
    ...EventRoutes,
];

export default AppRoutes;