import {Route, Routes, useLocation} from 'react-router-dom';
import AppRoutes from "../../routes/AppRoutes.jsx";
import {NavBar, SafeArea, TabBar} from "antd-mobile";
import styles from "./Layout.module.less";
import Header from "../header/Header.jsx";

function Layout() {
    const location = useLocation();
    const currentRoute = AppRoutes.find(route => route.path === location.pathname);

    const tabs = [
        {
            key: '/home',
            title: 'Home',
        },
        {
            key: '/todo',
            title: 'Todo',
        },
        {
            key: '/message',
            title: 'Message',
        },
        {
            key: '/me',
            title: 'Me'
        },
    ]

    const Bottom = () => {
        return (
            <TabBar>
                {tabs.map(item => (
                    <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                ))}
            </TabBar>
        )
    }
    
    return (
        <div className={styles.app}>
            <div style={{background: '#ace0ff'}}>
                <SafeArea position='top'/>
            </div>
            {(currentRoute && currentRoute.title) &&
                <div className={styles.top}>
                    <Header route={currentRoute}/>
                </div>
            }

            <div className={styles.body}>
                <Routes>
                    {AppRoutes.map((route, index) => {
                        const {element, path, ...rest} = route;

                        return <Route
                            onUpdate={() => window.scrollTo(0, 0)}
                            key={index}
                            path={path}
                            {...rest}
                            element={element}/>;
                    })}
                </Routes>
            </div>

            <div className={styles.bottom}>
                <Bottom/>
            </div>

            <div style={{background: '#ffffff'}}>
                <SafeArea position='bottom'/>
            </div>
        </div>
    )
}

export default Layout
