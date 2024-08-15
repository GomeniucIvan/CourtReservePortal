import AuthRoutes from './AuthRoutes.js';
import HomeRoutes from './HomeRoutes.js';
import EventRoutes from './EventRoutes.js';

const AppRoutes = [
    ...AuthRoutes,
    ...HomeRoutes,
    ...EventRoutes,
];

export default AppRoutes;