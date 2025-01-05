import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from "../../routes/AppRoutes.jsx";
import "./Layout.module.less";
import Header from "../header/Header.jsx";
import {useEffect, useRef, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import Footer from "../footer/Footer.jsx";
import {useStyles} from "./styles.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {
    fromAuthLocalStorage
} from "../../storage/AppStorage.jsx";
import {PullToRefresh} from "antd-mobile";
import LayoutExtra from "./LayoutExtra.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {Flex} from "antd";
import {Skeleton} from 'antd-mobile'
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import appService from "../../api/app.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import {AuthRouteNames} from "../../routes/AuthRoutes.jsx";
import apiService, {setRequestData} from "../../api/api.jsx";
import {useSafeArea} from "../../context/SafeAreaContext.jsx";
import {match} from "path-to-regexp";
import {ErrorBoundary} from "react-error-boundary";
import {Toaster} from "react-hot-toast";

function Layout() {
    const location = useLocation();
    let currentRoute = AppRoutes.find(route => {
        const matcher = match(route.path, { decode: decodeURIComponent });
        return matcher(location.pathname);
    });
    
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const {styles} = useStyles();
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [maxHeight, setMaxHeight] = useState(0);
    
    const {
        footerContent,
        isFooterVisible,
        dynamicPages,
        token,
        refreshData,
        setAvailableHeight,
        isMockData,
        setIsLoading
    } = useApp();

    const {safeAreaInsets} = useSafeArea();

    const {
        memberId,
        orgId,
        shouldLoadOrgData,
        setShouldLoadOrgData,
        setOrgId,
        setAuthorizationData,
        memberData
    } = useAuth();

    if (isNullOrEmpty(currentRoute)) {
        currentRoute = dynamicPages.find(route => equalString(route.path, location.pathname));
    }

    if (isNullOrEmpty(currentRoute)) {
        const pathParts = location.pathname.split('/').filter(Boolean);
        const lastPart = pathParts[pathParts.length - 1];
        const isNumberRegex = /^\d+$/.test(lastPart);

        if (isNumberRegex) {
            const replacePath = location.pathname.replace(lastPart, ':id');
            currentRoute = AppRoutes.find(route => route.path === replacePath);
        }
    }

    useEffect(() => {
        const loadPrimaryData = async () => {
            let authData = await memberData();
            const workingMemberId = authData?.MemberId || memberId;
            const workingOrgId = authData?.OrgId || orgId;

            //not authorized
            if (isNullOrEmpty(workingMemberId)) {
                //not allowed unauthorized
                if (!toBoolean(currentRoute?.unauthorized)) {
                    if (!equalString(location.pathname, AuthRouteNames.LOGIN)) {
                        navigate(AuthRouteNames.LOGIN);
                    }
                }

                setIsFetching(false);
            }

            //authorized without active orgid
            else if (!isNullOrEmpty(workingMemberId) && isNullOrEmpty(workingOrgId)) {
                //todo my clubs//allowed path
                if (!equalString(location.pathname, HomeRouteNames.MY_CLUBS)) {
                    navigate(HomeRouteNames.MY_CLUBS);
                }

                setIsFetching(false);
            }

            //authorized with active orgid
            else if (!isNullOrEmpty(workingMemberId) && !isNullOrEmpty(workingOrgId)) {
                setOrgId(workingOrgId);

                //not allow to access login pages
                if (equalString(location.pathname, AuthRouteNames.LOGIN) ||
                    equalString(location.pathname, AuthRouteNames.LOGIN_GET_STARTED) ||
                    //equalString(location.pathname, AuthRouteNames.LOGIN_ACCOUNT_VERIFICATION) ||
                    equalString(location.pathname, HomeRouteNames.CR_STARTUP_URL) ||
                    equalString(location.pathname, AuthRouteNames.LOGIN_VERIFICATION_CODE)) {
                    navigate(HomeRouteNames.INDEX);
                }

                //set from organization load
                //setIsFetching(false);
            }
        }

        loadPrimaryData()
    }, [location, navigate]);

    const calculateMaxHeight = () => {
        const windowHeight = window.innerHeight;
        const headerHeight = headerRef.current ? headerRef.current.getBoundingClientRect().height : 0;
        const footerHeight = footerRef.current ? footerRef.current.getBoundingClientRect().height : 0;
        let calculatedMaxHeight = windowHeight - headerHeight - footerHeight - (safeAreaInsets?.top || 0) - (safeAreaInsets?.bottom || 0);

        if (toBoolean(currentRoute?.fullHeight)) {
            calculatedMaxHeight = windowHeight - headerHeight - footerHeight;
        }

        setAvailableHeight(calculatedMaxHeight);
        setMaxHeight(calculatedMaxHeight);
    };

    useEffect(() => {
        calculateMaxHeight();

        setTimeout(function(){
            //dom, pages like payment drawer bottom not updates height instantly
            calculateMaxHeight();
        }, 50)
        
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
    }, [isFooterVisible, footerContent, footerRef.current]);

    useEffect(() => {
        calculateMaxHeight();
    }, [location]);

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --ant-notification-colorbg: ${token.colorBgBase};
                --ant-notification-colortext: ${token.colorText};
                
                --adm-color-primary: ${token.colorPrimary};
                --adm-color-background: ${token.colorBgContainer};
                --adm-color-weak: ${token.colorText};
                --adm-color-border: ${token.colorBorder};
                --adm-color-text: ${token.colorText};
                background-color: ${token.colorBgContainer};
            }
            body{
                margin: 0px;
            }
           
           .adm-nav-bar-back {
                padding: 0px;
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
            .adm-mask {
                background: ${token?.Custom?.workingTheme == 'dark' ? 'rgb(77 77 77 / 67%) !important' : 'initial'}
            }
            .ant-app {
                background-color: ${token.colorBgContainer};
            }
            .magic-dots.slick-dots li.slick-active button::before{
                color: ${token.colorPrimary} !important;
            }
            h1, h2, h3, h4, h5 {
                margin-block-start: 0;
                margin-block-end: 0;
            }
            `;
        document.head.appendChild(style);
    }, [token]);

    const disablePullDownToRefresh = currentRoute?.disablePullDown;

    useEffect(() => {
        if (isMockData) {
            setIsFetching(false);
        } else {
            if (shouldLoadOrgData) {

                setIsFetching(true);
                setShouldLoadOrgData(false);

                //logged but without bearer token
                //should refresh every day?!
                loadOrganizationData();
            }
        }
    }, [shouldLoadOrgData]);

    const loadOrganizationData = async (orgId) => {
        const memberData = fromAuthLocalStorage('memberData', {});
        const memberId = memberData?.MemberId;

        if (isNullOrEmpty(orgId)){
            orgId = memberData?.OrgId;
        }
        
        let requestData = await appService.get(navigate, `/app/Online/Account/RequestData?id=${orgId}&memberId=${memberId}`);

        if (requestData.IsValid) {
            const responseData = requestData.Data;
            setRequestData(responseData.RequestData);

            let authResponse = await apiService.authData(orgId);

            if (toBoolean(authResponse?.IsValid)) {
                await setAuthorizationData(authResponse.Data);
                setIsFetching(false);
            }
        }

        setIsLoading(false);
    }

    const skeletonArray = Array.from({length: 5});

    function ErrorFallback({ error }) {
        //todo implement by email
        const isDevelopment = process.env.NODE_ENV === 'development' || 1 == 1;

        return (
            <PaddingBlock topBottom={true}>
                <h2>Something went wrong:</h2>
                <div style={{maxWidth: '80vw'}}>
                    <p><strong>Error Message:</strong> {error.message}</p>
                    
                    {isDevelopment && (
                        <div style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>
                            {error.stack}
                        </div>
                    )}
                </div>
            </PaddingBlock>
        );
    }
    
    return (
        <div className={styles.root}>
            {(currentRoute && !toBoolean(isFetching)) &&
                <div ref={headerRef}>
                    <Header route={currentRoute}/>
                </div>
            }

            <div id={'page-body'} style={{overflow: 'auto', height: `${maxHeight}px`, overflowX: 'hidden'}}>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <>
                        <LayoutExtra/>

                        <Toaster />
                        
                        {toBoolean(isFetching) ? (
                            <>
                                <div className={'safe-area-top'}></div>

                                <PaddingBlock topBottom={true}>
                                    <Flex vertical={true} gap={token.padding}>
                                        {skeletonArray.map((_, index) => (
                                            <Skeleton key={index} animated className={styles.skeleton}/>
                                        ))}
                                    </Flex>
                                </PaddingBlock>
                            </>
                        ) : (
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
                    </>
                </ErrorBoundary>
            </div>

            <div ref={footerRef}>
                <Footer isFooterVisible={isFooterVisible} footerContent={footerContent} isFetching={isFetching}/>
            </div>
        </div>
    )
}

export default Layout
