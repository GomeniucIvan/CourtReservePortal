import { Route, Routes } from 'react-router-dom';
import AppRoutes from "../../routes/AppRoutes.jsx";
import './Layout.module.less';

function Layout() {
    return (
        <Routes>
            {AppRoutes.map((route, index) => {
                const { element, path, ...rest } = route;

                return <Route
                    onUpdate={() => window.scrollTo(0, 0)}
                    key={index}
                    path={path}
                    {...rest}
                    element={element} />;
            })}
        </Routes>
    )
}

export default Layout
