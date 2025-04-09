import {useStyles} from "./mStyles.jsx";
import {useLocation, useNavigate} from 'react-router-dom';
import {Skeleton} from "antd-mobile";
import React, {useEffect, useRef, useState} from "react";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import {Flex, Typography} from "antd";
import {useApp} from "../../context/AppProvider.jsx";
import SVG from "@/components/svg/SVG.jsx";
import { cx } from 'antd-style';
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import ListLinks from "@/components/navigationlinks/ListLinks.jsx";
import {getDashboardMainLinks, getNavigationStorage} from "@/storage/AppStorage.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";

const {Text} = Typography;
const MobileFooter = ({isFooterVisible, footerContent, isFetching}) => {
    const {styles} = useStyles();
    const navigate = useNavigate();
    const {token, globalStyles} = useApp();
    const {orgId, authData} = useAuth();
    const [activeKey, setActiveKey] = useState('home');
    const footerRef = useRef(null);
    const location = useLocation();
    const [footerHeight, setFooterHeight] = useState(0);
    const [showReserveDrawer, setShowReserveDrawer] = useState(false);
    const [drawerLInks, setDrawerLinks] = useState(null);
    
    useEffect(() => {
        if (!toBoolean(isFooterVisible)) {
            setFooterHeight(0);
        } else if (footerRef.current){
            setFooterHeight(footerRef.current.getBoundingClientRect().height);
        }
    }, [footerRef, isFooterVisible, footerContent]);

    useEffect(() => {
        let cacheLinks = getDashboardMainLinks(orgId);
        setDrawerLinks(anyInList(cacheLinks) ? cacheLinks : []);
    }, [showReserveDrawer])

    useEffect(() => {
        if (showReserveDrawer) {
            setShowReserveDrawer(false);         
        }
        
        let currentLocation = location.pathname;

        if (isNullOrEmpty(currentLocation) || equalString(currentLocation, HomeRouteNames.INDEX)) {
            setActiveKey('home');
        } else if (!isNullOrEmpty(currentLocation)) {
            if (currentLocation.toLowerCase().includes('calendar/events')) {
                setActiveKey('calendar');
            } else if (currentLocation.toLowerCase().includes('notification/list')) {
                setActiveKey('alerts');
            } else if (currentLocation.toLowerCase().includes('portal/navigate')) {
                setActiveKey('more');
            }
        }
    }, [location]);
    
    useEffect(() => {
        let currentLocation = location.pathname;
        
        if (!isNullOrEmpty(currentLocation)) {
            if (currentLocation.toLowerCase().includes('calendar/events')) {
                setActiveKey('calendar');
            } else if (currentLocation.toLowerCase().includes('notification/list')) {
                setActiveKey('alerts');
            } else if (currentLocation.toLowerCase().includes('portal/navigate')) {
                setActiveKey('more');
            }
        }
    }, [])
    
    const onTabBarChange = (key) => {
        if (isFetching){
            return;
        }
        
        let hideEventsCalendar = toBoolean(authData?.HideEventsCalendar);
        
        if (hideEventsCalendar && equalString(key, 'calendar')){
            //skip set for active key
        } else if (!equalString(key, 'reserve')) {
            setActiveKey(key);
        }
        
        if (equalString(key, 'home')){
            navigate(HomeRouteNames.INDEX);
        } else if(equalString(key, 'more')){
            let route = toRoute(HomeRouteNames.NAVIGATE, 'id', orgId);
            route = toRoute(route, 'nodeId', 19); //19 more menu nodeId
            navigate(route);
        } else if(equalString(key, 'calendar')){
            if (hideEventsCalendar) {
                displayMessageModal({
                    title: "No access",
                    html: (onClose) => 'The organization does not provide access to this feature.',
                    type: "info",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })
            } else {
                let route = toRoute(EventRouteNames.EVENT_CALENDAR, 'id', orgId);
                navigate(route);
            }
        } else if(equalString(key, 'alerts')) {
            let route = toRoute(HomeRouteNames.NOTIFICATION_LIST, 'id', orgId);
            navigate(route);
        }
    }
    
    const tabs = [
        {
            key: 'home',
            title: 'Home'
        },
        {
            key: 'calendar',
            title: 'Calendar'
        },
        {
            key: 'reserve',
            title: 'Reserve'
        },
        {
            key: 'alerts',
            title: 'Alerts'
        },
        {
            key: 'more',
            title: 'More'
        },
    ]

    if (!toBoolean(isFooterVisible)){
        return <></>
    }
    
    if (!isNullOrEmpty(footerContent)){
        return (<>{footerContent}</>)
    }

    
    const footerComponent = () => {
        return (
            <>
                <Flex align="center" justify="space-around" className={styles.footer}>
                    {tabs.map((tab, index) => {
                        if (equalString(tab.key, 'reserve')){
                            return (
                                <Flex key={tab.key} align="center"
                                      onClick={() => {setShowReserveDrawer(true)}}
                                      className={cx(styles.plusIconWrapper, styles.minWidth)}>
                                    <div className={styles.plusIcon}>
                                        <SVG icon={`navigation/portal/footer/footer-${tab.key}`}
                                             size={56}
                                             preventFill={true}
                                             replaceColor={true}
                                             preventRects={false}
                                             preventPaths={false}
                                             pathFillColor={token.colorOrgText}
                                             elementAttributes={{
                                                 path: {
                                                     fill: token.colorOrgText,
                                                 },
                                                 rect: {
                                                    
                                                 },
                                                 circle: {
                                                    
                                                 }
                                             }}
                                        />
                                    </div>
                                </Flex>
                            )
                        }
                        
                        return (
                            <div key={tab.key}>
                                <Flex align="center" justify={'center'} className={cx(styles.minWidth)} onClick={() => onTabBarChange(tab.key)}>
                                    <Flex vertical={true} gap={token.paddingXS} align={'center'}>
                                        <SVG icon={`navigation/portal/footer/footer-${tab.key}${equalString(tab.key, activeKey) ? '-selected' : ''}`}
                                             size={20} color={equalString(tab.key, activeKey) ? token.colorPrimary : undefined} />
                                        <Text style={{fontSize: `${token.fontSizeXS}px`, lineHeight: '10px', color: (equalString(tab.key, activeKey) ? token.colorPrimary : undefined)}}>{tab.title}</Text>
                                    </Flex>
                                </Flex>
                            </div>
                        )
                    })}
                </Flex>
            </>
        )
    }
    
    if (isFetching) {
        
        let skeletonSafeAreaBottom = 0;
        let cookieSafeArea = getCookie('data-safe-area-data');
        if (!isNullOrEmpty(cookieSafeArea)) {
            let cookieData = JSON.parse(cookieSafeArea);
            if (!isNullOrEmpty(cookieData)) {
                skeletonSafeAreaBottom = cookieData?.bottom || 0;
            }
        }
        
        return (
            <>
                <Flex style={{height: `${footerHeight}px`, paddingBottom: `${skeletonSafeAreaBottom}px`}} 
                      gap={token.padding}
                      className={cx(styles.footer, styles.footerSkeletonWrapper)}
                      align="center" 
                      justify="space-around">
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                </Flex>

                {/*required for consistent padding*/}
                <div className={styles.footer} style={{opacity: 0, position: 'absolute', top: '-100vh'}} ref={footerRef}>
                    {footerComponent()}
                </div>
            </>
        );
    }

    return (
       <>
           {footerComponent()}

           <DrawerBottom
               showDrawer={showReserveDrawer}
               closeDrawer={() => {setShowReserveDrawer(false)}}
               label={'Select Action'}
               showButton={false}
           >
              <PaddingBlock onlyBottom={true} leftRight={false}>
                  <ListLinks links={drawerLInks} hideChevron={true} classNameLi={globalStyles.drawerCustomListItem} />
              </PaddingBlock>
           </DrawerBottom>
       </>
    )
}

export default MobileFooter;
