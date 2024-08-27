import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from "../../routes/AppRoutes.jsx";
import "./Layout.module.less";
import Header from "../header/Header.jsx";
import {useEffect, useRef, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import Footer from "../footer/Footer.jsx";
import {useStyles} from "./styles.jsx";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {authMember} from "../../storage/AppStorage.jsx";
import {PullToRefresh} from "antd-mobile";
import LayoutExtra from "./LayoutExtra.jsx";

function Layout() {
    const location = useLocation();
    let currentRoute = AppRoutes.find(route => route.path === location.pathname);
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const { styles } = useStyles();
    const navigate = useNavigate()
    
    const [maxHeight, setMaxHeight] = useState(0);
    const { footerContent, isFooterVisible, dynamicPages, token, refreshData, setAvailableHeight } = useApp();
    
    if (isNullOrEmpty(currentRoute)){
        currentRoute = dynamicPages.find(route => route.path === location.pathname);
    }

    if (isNullOrEmpty(currentRoute)){
        const pathParts = location.pathname.split('/').filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1];
        const isNumberRegex = /^\d+$/.test(lastPart);
        
        if (isNumberRegex){
            const replacePath = location.pathname.replace(lastPart, ':id');
            currentRoute = AppRoutes.find(route => route.path === replacePath);
        }
    }
    
    useEffect(() => {
        if (isNullOrEmpty(authMember())) {
            navigate('/');
        } else {
            if (location.pathname === '/') {
                navigate('/dashboard');
            }
        }
    }, []);


    const calculateMaxHeight = () => {
        const windowHeight = window.innerHeight;
        const headerHeight = headerRef.current ? headerRef.current.getBoundingClientRect().height : 0;
        const footerHeight = footerRef.current ? footerRef.current.getBoundingClientRect().height : 0;
        const calculatedMaxHeight = windowHeight - headerHeight - footerHeight;
        setAvailableHeight(calculatedMaxHeight);
        setMaxHeight(calculatedMaxHeight);
    };

    useEffect(() => {
        calculateMaxHeight();

        window.addEventListener('resize', calculateMaxHeight);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', calculateMaxHeight);
            window.visualViewport.addEventListener('scroll', calculateMaxHeight);
        }

        return () => {
            window.removeEventListener('resize', calculateMaxHeight);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', calculateMaxHeight);
                window.visualViewport.removeEventListener('scroll', calculateMaxHeight);
            }
        };
    }, [isFooterVisible, footerContent]);
    
    useEffect(() => {
        calculateMaxHeight();
    }, [location]);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --adm-color-primary: ${token.colorPrimary};
                --adm-color-background: ${token.colorBgContainer};
                --adm-color-weak: ${token.colorText};
                --adm-color-border: ${token.colorBorder};
                --adm-color-text: ${token.colorText};
            }
            .adm-modal-footer.adm-space {
                --gap-vertical: ${token.Custom.buttonPadding}px;
            }
            .adm-list {
                --padding-left: ${token.padding}px;
                --padding-right: ${token.padding}px;
            }
            
            .adm-center-popup-body .adm-button{
                height: ${token.Button.controlHeight}px;
                padding: 0px !important;
            }
            .adm-pull-to-refresh-head {
                background-color: ${token.colorBgContainer};
            }
            
            .ant-app {
                background-color: ${token.colorBgContainer};
            }
            `;
        document.head.appendChild(style);
    }, [token]);
    
    return (
        <div className={styles.root}>
            {currentRoute &&
                <div ref={headerRef}>
                    <Header route={currentRoute}/>
                </div>
            }

            <div style={{overflow: 'auto', height: `${maxHeight}px`, overflowX: 'hidden'}}>
                <LayoutExtra />
                
                <PullToRefresh onRefresh={refreshData}
                               pullingText={'Pull down to refresh.'}
                               refreshingText={'Loading...'}
                               completeText={'Refresh successful.'}
                               canReleaseText={'Release to refresh immediately.'}>
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
                </PullToRefresh>
            </div>

            <div ref={footerRef}>
                {isFooterVisible && (
                    <> {footerContent ? footerContent : <Footer/>} </>
                )}
            </div>
        </div>
    )
}

export default Layout
