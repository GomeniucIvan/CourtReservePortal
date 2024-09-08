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
    authMember,
    clearAllLocalStorage,
    fromAuthLocalStorage, fromLocalStorage,
    toAuthLocalStorage,
    toLocalStorage
} from "../../storage/AppStorage.jsx";
import {PullToRefresh} from "antd-mobile";
import LayoutExtra from "./LayoutExtra.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {Flex} from "antd";
import {Skeleton} from 'antd-mobile'
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import appService from "../../api/app.jsx";
import {setClientUiCulture} from "../../utils/DateUtils.jsx";
import {useAntd} from "../../context/AntdProvider.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import {AuthRouteNames} from "../../routes/AuthRoutes.jsx";
import apiService, {getBearerToken, setBearerToken, setRequestData} from "../../api/api.jsx";
import {stringToJson} from "../../utils/ListUtils.jsx";

function Layout() {
    const location = useLocation();
    let currentRoute = AppRoutes.find(route => route.path === location.pathname);
    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const {styles} = useStyles();
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);

    const [maxHeight, setMaxHeight] = useState(0);
    const {footerContent, isFooterVisible, dynamicPages, token, refreshData, setAvailableHeight, isMockData, setIsLoading, setNavigationLinks} = useApp();
    
    const {
        memberId,
        orgId,
        setAuthData,
        shouldLoadOrgData,
        setShouldLoadOrgData,
        setOrgId,
        setMemberId
    } = useAuth();
    
    const {setPrimaryColor} = useAntd();

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
        const memberData = fromAuthLocalStorage('memberData', {});
        const workingMemberId = memberData?.memberId || memberId;
        const workingOrgId = memberData?.orgId || orgId;

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
            if (!equalString(location.pathname, '/myclubs')) {
                navigate('/myclubs');
            }

            setIsFetching(false);
        }

        //authorized with active orgid
        else if (!isNullOrEmpty(workingMemberId) && !isNullOrEmpty(workingOrgId)) {
            //not allow to access login pages
            if (equalString(location.pathname, AuthRouteNames.LOGIN) ||
                equalString(location.pathname, AuthRouteNames.LOGIN_GET_STARTED) ||
                equalString(location.pathname, AuthRouteNames.LOGIN_ACCOUNT_VERIFICATION) ||
                equalString(location.pathname, AuthRouteNames.LOGIN_VERIFICATION_CODE)) {
                navigate(HomeRouteNames.INDEX);
            }

            setOrgId(workingOrgId);
            
            //set from organization load
            //setIsFetching(false);
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
                --ant-notification-colorbg: ${token.colorBgBase};
                --ant-notification-colortext: ${token.colorText};
                
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
            .adm-mask {
                background: ${token?.Custom?.workingTheme == 'dark' ? 'rgb(77 77 77 / 67%) !important' : 'initial'}
            }
            .ant-app {
                background-color: ${token.colorBgContainer};
            }
            .magic-dots.slick-dots li.slick-active button::before{
                color: ${token.colorPrimary} !important;
            }
            `;
        document.head.appendChild(style);
    }, [token]);

    const disablePullDownToRefresh = currentRoute?.disablePullDown;

    useEffect(() => {
        if (isMockData) {
            setIsFetching(false);
        } else {
            if (!isNullOrEmpty(orgId) && shouldLoadOrgData) {
                setIsFetching(true);
                setShouldLoadOrgData(false);
                
                //logged but without bearer token
                //should refresh every day?!
                if (isNullOrEmpty(getBearerToken())) {
                    appService.post('/app/MobileSso/ValidateAndCreateToken').then(r => {
                        if (toBoolean(r?.IsValid)) {
                            setBearerToken(r.Token);
                            loadOrganizationData(orgId);
                        }
                    })
                } else {
                    loadOrganizationData(orgId);
                }
            }
        }
    }, [orgId, shouldLoadOrgData]);

    const loadOrganizationData = (orgId) => {
        const memberData = fromAuthLocalStorage('memberData', {});
        const memberId = memberData?.memberId;
        
        appService.get(`/app/Online/Account/RequestData?id=${orgId}&memberId=${memberId}`).then(response => {
            if (response.IsValid) {
                const responseData = response.Data;
                setRequestData(responseData.RequestData);

                apiService.post(`/api/dashboard/member-navigation-data?orgId=${orgId}`).then(
                    innerResponse => {
                        if (toBoolean(innerResponse?.IsValid)) {
                            const memberResponseData = innerResponse.Data;

                            setMemberId(memberResponseData.MemberId);
                            setNavigationLinks(stringToJson(memberResponseData.NavigationLinksJson));
                            
                            setAuthData({
                                orgId: memberResponseData.OrganizationId,
                                timezone: memberResponseData.TimeZone,
                                uiCulture: memberResponseData.UiCulture,
                                primaryColor: memberResponseData.DashboardButtonBgColor,
                                memberId: memberResponseData.MemberId,
                                hasActiveInstructors: memberResponseData.HasActiveInstructors,
                                isUsingCourtWaitlisting: memberResponseData.IsUsingCourtWaitlisting,
                                myAccountHideMyEvents: memberResponseData.MyAccountHideMyEvents,
                                myAccountHideWaitingList: memberResponseData.MyAccountHideWaitingList,
                                useOrganizedPlay: memberResponseData.UseOrganizedPlay,
                                isUsingPushNotifications: memberResponseData.IsUsingPushNotifications,
                            });

                            if (!isNullOrEmpty(memberResponseData.DashboardButtonBgColor)) {
                                setPrimaryColor(memberResponseData.DashboardButtonBgColor);
                            }
                            //todo change to use effect
                            toAuthLocalStorage('memberData', {
                                orgId: memberResponseData.OrganizationId,
                                timezone: memberResponseData.TimeZone,
                                uiCulture: memberResponseData.UiCulture,
                                primaryColor: memberResponseData.DashboardButtonBgColor,
                                memberId: memberResponseData.MemberId,
                                hasActiveInstructors: memberResponseData.HasActiveInstructors,
                                isUsingCourtWaitlisting: memberResponseData.IsUsingCourtWaitlisting,
                                myAccountHideMyEvents: memberResponseData.MyAccountHideMyEvents,
                                myAccountHideWaitingList: memberResponseData.MyAccountHideWaitingList,
                                useOrganizedPlay: memberResponseData.UseOrganizedPlay,
                                isUsingPushNotifications: memberResponseData.IsUsingPushNotifications,
                            });
                            
                            setIsFetching(false);
                        }
                    });
            }

            setIsLoading(false);
        });
    }

    const skeletonArray = Array.from({length: 5});

    return (
        <div className={styles.root}>
            {(currentRoute && !toBoolean(isFetching)) &&
                <div ref={headerRef}>
                    <Header route={currentRoute}/>
                </div>
            }

            <div style={{overflow: 'auto', height: `${maxHeight}px`, overflowX: 'hidden'}}>
                <LayoutExtra/>

                {toBoolean(isFetching) ? (
                    <PaddingBlock topBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            {skeletonArray.map((_, index) => (
                                <Skeleton key={index} animated className={styles.skeleton}/>
                            ))}
                        </Flex>
                    </PaddingBlock>

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
            </div>

            <div ref={footerRef}>
                <Footer isFooterVisible={isFooterVisible} footerContent={footerContent} isFetching={isFetching}/>
            </div>
        </div>
    )
}

export default Layout
