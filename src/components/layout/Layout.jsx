import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from "../../routes/AppRoutes.jsx";
import "./Layout.module.less";
import Header from "../header/Header.jsx";
import {useEffect, useRef, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import Footer from "../footer/Footer.jsx";
import {useStyles} from "./styles.jsx";
import {isNullOrEmpty} from "../../utils/Utils.jsx";
import {authMember} from "../../storage/AppStorage.jsx";
import {PullToRefresh} from "antd-mobile";

function Layout() {
    const location = useLocation();
    let currentRoute = AppRoutes.find(route => route.path === location.pathname);
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const { styles } = useStyles();
    const navigate = useNavigate()
    
    const [maxHeight, setMaxHeight] = useState(0);
    const { footerContent, isFooterVisible, dynamicPages, token, refreshData } = useApp();
    
    if (isNullOrEmpty(currentRoute)){
        currentRoute = dynamicPages.find(route => route.path === location.pathname);
    }
    
    useEffect(() =>{
        if (isNullOrEmpty(authMember())){
            navigate('/');
        } else{
            navigate('/dashboard');
        }
    }, [])
    
    
    const calculateMaxHeight = () => {
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const headerHeight = headerRef.current ? headerRef.current.getBoundingClientRect().height : 0;
        const footerHeight = footerRef.current ? footerRef.current.getBoundingClientRect().height : 0;
        const calculatedMaxHeight = viewportHeight - headerHeight - footerHeight;
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
                
            }
            .adm-modal-footer.adm-space {
                --gap-vertical: ${token.Custom.buttonPadding}px;
            }
            
            .adm-center-popup-body .adm-button{
                height: ${token.Button.controlHeight}px;
                padding: 0px !important;
            }
            `;
        document.head.appendChild(style);
    }, [token]);
    
    return (
        <>
            <div className={styles.root}>
                {currentRoute &&
                    <div ref={headerRef}>
                        <Header route={currentRoute}/>
                    </div>
                }

                <div style={{overflow: 'auto', height: `${maxHeight}px`, overflowX: 'hidden'}}>
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
        </>
    )
}

export default Layout
