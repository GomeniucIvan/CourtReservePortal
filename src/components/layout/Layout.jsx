import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from "../../routes/AppRoutes.jsx";
import "./Layout.module.less";
import Header from "../header/Header.jsx";
import {useEffect, useRef, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import Footer from "../footer/Footer.jsx";
import {useStyles} from "./styles.jsx";
import {equalString, isNullOrEmpty, nullToEmpty, toBoolean} from "../../utils/Utils.jsx";
import {authMember} from "../../storage/AppStorage.jsx";
import {PullToRefresh} from "antd-mobile";
import LayoutExtra from "./LayoutExtra.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {Flex} from "antd";
import { Skeleton } from 'antd-mobile'
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import appService from "../../api/app.jsx";
import {setClientUiCulture} from "../../utils/DateUtils.jsx";

function Layout() {
    const location = useLocation();
    let currentRoute = AppRoutes.find(route => route.path === location.pathname);
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const { styles } = useStyles();
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    
    const [maxHeight, setMaxHeight] = useState(0);
    const { footerContent, isFooterVisible, dynamicPages, token, refreshData, setAvailableHeight, isMockData } = useApp();
    const {orgId, setAuthData} = useAuth();
    
    if (isNullOrEmpty(currentRoute)){
        currentRoute = dynamicPages.find(route => equalString(route.path, location.pathname));
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
            if (!toBoolean(currentRoute?.unauthorized)){
                navigate('/');
            }
        } else {
            if (location.pathname === '/') {
                navigate('/dashboard');
            }
        }
    }, [location, navigate]);


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
                background-color: ${token.colorBgContainer};
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
    
    const disablePullDownToRefresh = currentRoute?.disablePullDown;

    useEffect(() => {
        if (isMockData){
            setIsFetching(false);  
        } else{
            if (orgId){
                setIsFetching(true);

                appService.get('/app/Online/Account/OrganizationData').then(r => {
                    if (toBoolean(r?.IsValid)){
                        const data = r.Data;

                        setAuthData({
                            timezone: data.Timezone,
                            uiCulture: data.UiCulture,
                            currency: data.Currency,
                            primaryColor: data.PrimaryColor
                        })

                        //easier access
                        setClientUiCulture(r.UiCulture);
                    } else{
                        //logout?
                    }
                    
                    setIsFetching(false);
                })
            }
        }
    }, [orgId]);

    const skeletonArray = Array.from({ length: 5 });
    
    return (
        <div className={styles.root}>
            {(currentRoute && !toBoolean(isFetching)) &&
                <div ref={headerRef}>
                    <Header route={currentRoute}/>
                </div>
            }

            <div style={{overflow: 'auto', height: `${maxHeight}px`, overflowX: 'hidden'}}>
                <LayoutExtra />

                {toBoolean(isFetching) ? (
                    <PaddingBlock topBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            {skeletonArray.map((_, index) => (
                                <Skeleton key={index} animated className={styles.skeleton} />
                            ))}
                        </Flex>
                    </PaddingBlock>
                    
                ):(
                    <PullToRefresh onRefresh={refreshData}
                                   disabled={toBoolean(disablePullDownToRefresh)}
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
                )}
            </div>

            <div ref={footerRef}>
                <Footer isFooterVisible={isFooterVisible} footerContent={footerContent} isFetching={isFetching}/>
            </div>
        </div>
    )
}

export default Layout
