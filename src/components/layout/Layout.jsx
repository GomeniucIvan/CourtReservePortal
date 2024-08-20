import {Route, Routes, useLocation} from 'react-router-dom';
import AppRoutes from "../../routes/AppRoutes.jsx";
import "./Layout.module.less";
import Header from "../header/Header.jsx";
import {useEffect, useRef, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import Footer from "../footer/Footer.jsx";
import {useStyles} from "./styles.jsx";
import {isNullOrEmpty} from "../../utils/Utils.jsx";

function Layout() {
    const location = useLocation();
    let currentRoute = AppRoutes.find(route => route.path === location.pathname);
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const { styles } = useStyles();
    
    const [maxHeight, setMaxHeight] = useState(0);
    const { footerContent, isFooterVisible, isFooterLoading, dynamicPages, token } = useApp();
    
    if (isNullOrEmpty(currentRoute)){
        currentRoute = dynamicPages.find(route => route.path === location.pathname);
    }
    
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
            </div>
        </>
    )
}

export default Layout
