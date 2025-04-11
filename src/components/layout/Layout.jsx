import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from "../../routes/AppRoutes.jsx";
import "./Layout.module.less";
import React, {useEffect, useRef, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {equalString, isNullOrEmpty, nullToEmpty, toBoolean} from "../../utils/Utils.jsx";
import {
    fromAuthLocalStorage, getShowUnsubscribeModal
} from "../../storage/AppStorage.jsx";
import {PullToRefresh, Skeleton} from "antd-mobile";
import LayoutExtra from "./LayoutExtra.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {Flex, Skeleton as AntSkeleton, Layout as AntLayout} from "antd";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import {AuthRouteNames} from "../../routes/AuthRoutes.jsx";
import {useSafeArea} from "../../context/SafeAreaContext.jsx";
import {ErrorBoundary} from "react-error-boundary";
import {Toaster} from "react-hot-toast";
import portalService from "@/api/portal.jsx";
import {locationCurrentRoute, toRoute} from "@/utils/RouteUtils.jsx";
import {getInitialGlobalRedirectUrl} from "@/utils/AppUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {getCookie, saveCookie} from "@/utils/CookieUtils.jsx";
import {getConfigValue} from "@/config/WebConfig.jsx";
import LayoutScripts from "@/components/layout/LayoutScripts.jsx";
import {reactNativeHideSplash, reactNativeInitFireBase, reactNativeSaveBadgeCount} from "@/utils/MobileUtils.jsx";
import apiService from "@/api/api.jsx";
import {useFooter} from "@/context/FooterProvider.jsx";
import {useDevice} from "@/context/DeviceProvider.jsx";
import MobileHeader from "@/components/header/MobileHeader.jsx";
import WebHeader from "@/components/header/WebHeader.jsx";
import MobileFooter from "@/components/footer/MobileFooter.jsx";
import WebFooter from "@/components/footer/WebFooter.jsx";
import {cx} from "antd-style";
const { Content } = AntLayout;

function Layout() {
    const location = useLocation();
    let currentRoute = locationCurrentRoute(location);
    
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const {styles} = useStyles();
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [maxHeight, setMaxHeight] = useState(0);
    const [pushTokenInitialized, setPushTokenInitialized] = useState(false);
    const {isMobile} = useDevice();
    
    //used only for ios keyboard open
    const [isPrevIsFooterVisible, setIsPrevIsFooterVisible] = useState(null);
    const [iosKeyboardHeight, setIosKeyboardHeight] = useState(null);
    const {customHeader, headerTitle, headerTitleKey, setCustomHeader} = useHeader();
    
    const {
        footerContent,
        isFooterVisible,
        setIsFooterVisible,
        dynamicPages,
        token,
        refreshData,
        setAvailableHeight,
        isMockData,
        setIsLoading
    } = useApp();

    const { safeAreaInsets = { top: 0, bottom: 0 } } = useSafeArea() || {};

    const {
        memberId,
        orgId,
        shouldLoadOrgData,
        setShouldLoadOrgData,
        setOrgId,
        setAuthorizationData,
        memberData,
        newOrgId,
        setNewOrgId,
        spGuideId
    } = useAuth();

    const {setAlertsCount} = useFooter();
    
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
    
    const initializeFireBasePushToken = () => {
        if (isMobile){
            if (!pushTokenInitialized && !isNullOrEmpty(orgId)) {
                reactNativeInitFireBase();
            }
        }
    }
    
    const innerReactNativeHideSplash = () => {
        if (isMobile){
            setTimeout(() => {
                reactNativeHideSplash();
            }, 1200); 
        }
    }
    
    useEffect(() => {
        const loadPrimaryData = async () => {
            let authData = await memberData();
            const workingMemberId = authData?.MemberId || memberId;
            const workingOrgId = authData?.OrgId || orgId;
            
            let isUnsubscribeModal = !isNullOrEmpty(location.pathname) && location.pathname.includes('textmessage/optin');
            let isDisclosurePending = !isNullOrEmpty(location.pathname) && location.pathname.includes('disclosures/pending');
            let textMessageRoute = toRoute(HomeRouteNames.TEXT_MESSAGE_MODAL, 'id', workingOrgId);
            
            //not authorized
            if (isNullOrEmpty(workingMemberId)) {
                //not allowed unauthorized
                if (!toBoolean(currentRoute?.unauthorized)) {
                    if (!equalString(location.pathname, AuthRouteNames.LOGIN)) {
                        navigate(AuthRouteNames.LOGIN);
                    }
                }

                setIsFetching(false);
                innerReactNativeHideSplash();
            }
            //authorized without active orgid
            else if (!isNullOrEmpty(workingMemberId) && isNullOrEmpty(workingOrgId)) {
                //todo my clubs//allowed path
                if (!equalString(location.pathname, HomeRouteNames.MY_CLUBS)) {
                    navigate(HomeRouteNames.MY_CLUBS);
                }

                setIsFetching(false);
                initializeFireBasePushToken();
                innerReactNativeHideSplash();
            }
            
            //authorized with active orgid
            else if (!isNullOrEmpty(workingMemberId) && !isNullOrEmpty(workingOrgId)) {
                setOrgId(workingOrgId);

                //not allow to access login pages
                if (equalString(location.pathname, AuthRouteNames.LOGIN) ||
                    equalString(location.pathname, AuthRouteNames.LOGIN_FORGOT_PASSWORD)) {
                    if (toBoolean(getShowUnsubscribeModal(workingOrgId)) && !isUnsubscribeModal) {
                        navigate(textMessageRoute);
                    } else {
                        navigate(HomeRouteNames.INDEX);  
                    }
                } else if (toBoolean(getShowUnsubscribeModal(workingOrgId)) && !isUnsubscribeModal) {
                    if (!isDisclosurePending) {
                        navigate(textMessageRoute);
                    }
                }
                initializeFireBasePushToken();
                innerReactNativeHideSplash();
                //set from organization load
                //setIsFetching(false);
            }
        }

        if (equalString(location.pathname, '/MobileSso/AuthorizeAndRedirectApp') ||
            equalString(location.pathname, '/MobileSso/AuthorizeAndRedirect')) {
            //TODO
            let redirectUrl = getInitialGlobalRedirectUrl(true);
            if (!isNullOrEmpty(redirectUrl)) {
                navigate(redirectUrl);
            } else{
                navigate(HomeRouteNames.INDEX);
            }
        }

        const isDebugMode = getConfigValue('IsDebugMode');
        if (!isNullOrEmpty(location.pathname) && location.pathname.startsWith('/dev/') && !isDebugMode) {
            navigate(HomeRouteNames.NOT_FOUND);
            innerReactNativeHideSplash();
        }
        
        loadPrimaryData()
    }, [location, navigate]);
    
    const calculateMaxHeight = () => {
        if (isMobile) {
            const windowHeight = window.innerHeight;
            const headerHeight = headerRef.current ? headerRef.current.getBoundingClientRect().height : 0;
            const footerHeight = footerRef.current ? footerRef.current.getBoundingClientRect().height : 0;

            //on application keyboard open not sure why safeAreaInsets always return 0
            let safeAreaInsetsTop = safeAreaInsets?.top || 0;
            let safeAreaInsetsBottom = safeAreaInsets?.bottom || 0;

            if (safeAreaInsetsTop === 0) {
                let cookieSafeArea = getCookie('data-safe-area-data');
                if (!isNullOrEmpty(cookieSafeArea)) {
                    let cookieParsedData = JSON.parse(cookieSafeArea);
                    let cookieSafeAreaTopValue = cookieParsedData?.top;
                    if (!isNullOrEmpty(cookieSafeAreaTopValue) && parseInt(cookieSafeAreaTopValue) > 0) {
                        safeAreaInsetsTop = cookieSafeAreaTopValue;
                    }
                }
            }

            if (safeAreaInsetsBottom === 0) {
                let cookieSafeArea = getCookie('data-safe-area-data');
                if (!isNullOrEmpty(cookieSafeArea)) {
                    let cookieParsedData = JSON.parse(cookieSafeArea);
                    let cookieSafeAreaBottomValue = cookieParsedData?.bottom;
                    if (!isNullOrEmpty(cookieSafeAreaBottomValue) && parseInt(cookieSafeAreaBottomValue) > 0) {
                        safeAreaInsetsBottom = cookieSafeAreaBottomValue;
                    }
                }
            }

            let isIosKeyboardOpen = !isNullOrEmpty(iosKeyboardHeight) && parseInt(iosKeyboardHeight) > 0;

            let calculatedMaxHeight = windowHeight - headerHeight - safeAreaInsetsTop - footerHeight - safeAreaInsetsBottom;

            if (!isFetching) {
                if (toBoolean(currentRoute?.fullHeight)) {
                    calculatedMaxHeight = windowHeight - headerHeight - footerHeight;
                }
            }

            setAvailableHeight(calculatedMaxHeight);
            setMaxHeight(calculatedMaxHeight);

            if (isIosKeyboardOpen) {
                if (!equalString(isFooterVisible, isPrevIsFooterVisible)) {
                    setIsPrevIsFooterVisible(isFooterVisible)
                }

                setIsFooterVisible(false);

                //scroll into view
                //handleIphoneInputFocus();
            }

            if (equalString(iosKeyboardHeight, -1)) {
                setIsFooterVisible(true);
                setIosKeyboardHeight(null);
            }
        }
    };

    useEffect(() => {
        calculateMaxHeight();
        
        setTimeout(function () {
            //dom
            calculateMaxHeight();
        }, 500)
    }, [isFooterVisible, footerContent, footerRef.current, headerRef.current, customHeader, headerTitle, headerTitleKey, isFetching]);
    
    const handleIphoneInputFocus = () => {
        const activeElement = document.activeElement; // Get the currently focused element
        if (
            activeElement &&
            (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA")
        ) {
            const rect = activeElement.getBoundingClientRect();
            const isVisible =
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);

            if (!isVisible) {
                activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };
    
    const saveDeviceFirebaseToken = async (deviceId, token, androidDevice, innerOrgId) => {
        let orgIdToSet = orgId;
        
        if (isMobile) {
            if (isNullOrEmpty(orgIdToSet)) {
                const memberData = fromAuthLocalStorage('memberData', {});
                orgIdToSet = memberData?.OrgId;
            }

            if (!isNullOrEmpty(orgIdToSet)) {
                let postModel = {
                    deviceId: deviceId,
                    token: token,
                    androidDevice: toBoolean(androidDevice),
                    loadUnSeen: true,
                    spGuideId: nullToEmpty(spGuideId)
                }

                let response = await apiService.post(`/api/native/firebase-token?id=${orgIdToSet}`, postModel);

                if (response) {
                    reactNativeSaveBadgeCount(response?.unSeenCount);
                    setAlertsCount(response?.unSeenCount);
                    setPushTokenInitialized(true);
                    saveCookie('isInitFirebase', true, 1140);
                }
            }
        }
    }
    
    //events
    useEffect(() => {
        if (isMobile) {
            window.updateFirebaseToken = async (deviceId, token, androidDevice) => {
                await saveDeviceFirebaseToken(deviceId, token, androidDevice, orgId);
            };

            // Define the function to handle keyboard show event
            window.onReactNativeKeyboardShow = (isIOS, keyboardHeight) => {
                if (isIOS) {
                    // if (!equalString(iosKeyboardHeight, keyboardHeight)) {
                    //     setIosKeyboardHeight(keyboardHeight);
                    // }
                }
            };

            // Define the function to handle keyboard hide event
            window.onReactNativeKeyboardHide = (isIOS) => {
                // if (isIOS) {
                //     setIosKeyboardHeight(-1);
                // }
            };

            setTimeout(function(){
                innerReactNativeHideSplash();
            }, 10000)

            // Cleanup on unmount
            return () => {
                delete window.updateFirebaseToken;
                delete window.onReactNativeKeyboardShow;
                delete window.onReactNativeKeyboardHide;
            };
        }
    }, []);

    useEffect(() => {
        setTimeout(function(){
            //dom, pages like payment drawer bottom not updates height instantly
            calculateMaxHeight();
        }, 50)

        //not working on ios
        window.addEventListener('resize', calculateMaxHeight);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', calculateMaxHeight);
        }

        return () => {
            window.removeEventListener('resize', calculateMaxHeight);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', calculateMaxHeight);
            }
        };
    }, []);
    
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
            html {
                overflow: hidden;
            }
            body{
                margin: 0px;
                background-color: ${token.colorBgContainer};
                overflow: hidden;
                overscroll-behavior: none;
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

    const disablePullDownToRefresh = currentRoute?.disablePullDown || !isMobile;

    useEffect(() => {
        if (shouldLoadOrgData) {
            setIsFetching(true);
            setShouldLoadOrgData(false);

            //logged but without bearer token
            //should refresh every day?!
            loadOrganizationData();
        }
    }, [shouldLoadOrgData]);

    const loadOrganizationData = async (orgId) => {
        const memberData = fromAuthLocalStorage('memberData', {});

        if (isNullOrEmpty(orgId)){
            orgId = memberData?.OrgId;
        }

        let requestData = await portalService.requestData(navigate, orgId, isMobile);

        if (toBoolean(requestData?.IsValid)) {
            await setAuthorizationData(requestData.OrganizationData);
            setIsFetching(false);
            //innerReactNativeHideSplash();
        } if (toBoolean(requestData?.UnathorizeAccess)) {
            //validating data from backend
            navigate(AuthRouteNames.LOGIN);
            setIsFetching(false);
            //innerReactNativeHideSplash();
        } else{
            setIsFetching(false);
            //innerReactNativeHideSplash();
        }
        setIsLoading(false);
    }

    useEffect(() => {
        if (!isNullOrEmpty(newOrgId)){
            setNewOrgId(null);
            setIsFetching(true);
            setCustomHeader(null);
            loadOrganizationData(newOrgId);
        }
    }, [newOrgId]);
    
    useEffect(() => {
        if (!isNullOrEmpty(memberId) && !isNullOrEmpty(orgId)) {
            initializeFireBasePushToken();
        }
    }, [memberId, orgId])
    
    const skeletonArray = Array.from({length: 5});

    function ErrorFallback({ error }) {
        //todo implement by email
        const isDevelopment = process.env.NODE_ENV === 'development' || 1 == 1;

        return (
            <PaddingBlock topBottom={true} leftRight={true}>
                <h2>Something went wrong2:</h2>
                <div>
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
        <>
            <div className={styles.root}>
                <div ref={headerRef}>
                    {isMobile ?
                        <MobileHeader route={currentRoute}/>
                    :
                        <WebHeader route={currentRoute} isFetching={isFetching}/>
                    }
                </div>

                <div id={'page-body'}
                     className={styles.pageBody}
                     style={{height: isMobile ? `${maxHeight}px` : undefined}}>
                    <ErrorBoundary FallbackComponent={ErrorFallback} key={location.pathname}>
                        <>
                            <LayoutExtra />
                            <LayoutScripts />

                            <Toaster
                                toastOptions={{
                                    className: 'safe-area-top-margin',
                                }}
                            />

                            {toBoolean(isFetching) ? (
                                <>
                                    {isMobile &&
                                        <>
                                            {/*<div className={'safe-area-top'}></div>*/}

                                            <PaddingBlock topBottom={true}>
                                                <Flex vertical={true} gap={token.padding}>
                                                    {skeletonArray.map((_, index) => (
                                                        <Skeleton key={index} active={true} className={styles.skeleton}/>
                                                    ))}
                                                </Flex>
                                            </PaddingBlock>
                                        </>
                                    }

                                    {!isMobile &&
                                        <Content>
                                            <Flex vertical={true} gap={token.padding}>
                                                <AntSkeleton.Button active={true} block style={{height: `70px`}} />
                                                <AntSkeleton.Button active={true} block style={{height: `180px`}} />
                                                <AntSkeleton.Button active={true} block style={{height: `210px`}} />
                                            </Flex>
                                        </Content>
                                        
                                        
                                    }
                                </>
                            ) : (
                                <>
                                    {isMobile &&
                                        <>
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
                                        </>
                                    }

                                    {!isMobile &&
                                        <Content>
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
                                        </Content>
                                    }
                                </>
                            )}
                        </>
                    </ErrorBoundary>
                </div>

                <div ref={footerRef}>
                    {isMobile ?
                        <MobileFooter isFooterVisible={isFooterVisible}
                                      footerContent={footerContent}
                                      isFetching={isFetching}/>
                    :
                        <WebFooter />
                    }
                </div>
            </div>
        </>
    )
}

export default Layout
