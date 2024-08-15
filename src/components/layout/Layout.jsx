import {Route, Routes, useLocation} from 'react-router-dom';
import AppRoutes from "../../routes/AppRoutes.jsx";
import {NavBar, SafeArea, TabBar} from "antd-mobile";
import styles from "./Layout.module.less";
import Header from "../header/Header.jsx";
import {useEffect, useRef, useState} from "react";
import {useFooter} from "../../context/FooterProvider.jsx";
import Footer from "../footer/Footer.jsx";

function Layout() {
    const location = useLocation();
    const currentRoute = AppRoutes.find(route => route.path === location.pathname);
    const headerRef = useRef(null);
    const footerRef = useRef(null);

    const [maxHeight, setMaxHeight] = useState(0);
    const { footerContent, isFooterVisible } = useFooter();
    
    // Function to calculate and set the max height for the content area
    const calculateMaxHeight = () => {
        const windowHeight = window.innerHeight;
        const headerHeight = headerRef.current ? headerRef.current.getBoundingClientRect().height : 0;
        const footerHeight = footerRef.current ? footerRef.current.getBoundingClientRect().height : 0;
        const calculatedMaxHeight = windowHeight - headerHeight - footerHeight;
        setMaxHeight(calculatedMaxHeight);
    };

    useEffect(() => {
        calculateMaxHeight();

        window.addEventListener('resize', calculateMaxHeight);
        return () => window.removeEventListener('resize', calculateMaxHeight);
    }, [isFooterVisible, footerContent]);
    
    useEffect(() => {
        calculateMaxHeight();
    }, [location]);
    
    return (
        <div className={styles.app}>
            <div style={{background: '#ace0ff'}}>
                <SafeArea position='top'/>
            </div>
            {(currentRoute && currentRoute.title) &&
                <div className={styles.top} ref={headerRef}>
                    <Header route={currentRoute}/>
                </div>
            }

            <div className={styles.body} style={{ height: `${maxHeight}px` }}>
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

            <div ref={footerRef}>
                {isFooterVisible && (
                    <> {footerContent ? footerContent : <Footer/>} </>
                )}
            </div>

            <div style={{background: '#ffffff'}}>
                <SafeArea position='bottom'/>
            </div>
        </div>
    )
}

export default Layout
