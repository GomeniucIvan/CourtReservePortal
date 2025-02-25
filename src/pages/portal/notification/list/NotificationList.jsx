import * as React from "react";
import {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {Card, Flex, Segmented, Skeleton, Space, Typography} from "antd";
import HeaderSearch from "@/components/header/HeaderSearch.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {anyInList, filterList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {cx} from "antd-style";
import {imageSrc} from "@/utils/ImageUtils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
const {Title, Text} = Typography;
import {useStyles} from "./styles.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";

function NotificationList({}) {
    const [searchText, setSearchText] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const {setHeaderRightIcons} = useHeader();
    const{setIsFooterVisible, shouldFetch, resetFetch, token, setIsLoading, globalStyles, setDynamicPages} = useApp();
    const {orgId} = useAuth();
    const navigate = useNavigate();
    const {styles} = useStyles();

    const loadData = async (refresh) => {
        setIsLoading(true);
        setIsFetching(true);

        let response = await appService.get(navigate, `/app/Online/Notification/GetPushNotifications?id=${orgId}`);
        if (toBoolean(response?.IsValid)) {
            setNotifications(response?.Data);
        }

        setIsLoading(false);
        setIsFetching(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(
            <Space className={globalStyles.headerRightActions}>
                <HeaderSearch setText={setSearchText}/>
            </Space>
        )
        loadData();
    }, []);

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);


    useEffect(() => {
        if (isNullOrEmpty(searchText) ||!anyInList(notifications)) {
            setFilteredNotifications(notifications);
        } else {
            setFilteredNotifications(filterList(['Title','Subject'], notifications, searchText));
        }
    }, [searchText, notifications]);

    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                {isFetching &&
                    <>
                        {emptyArray(8).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button block active={true} style={{height : `160px`}} />
                            </div>
                        ))}
                    </>
                }

                {(!isFetching) &&
                    <>
                        {anyInList(filteredNotifications) &&
                            <>
                                {filteredNotifications.map((notification) => {
                                    return (
                                        <Card className={cx(globalStyles.card, globalStyles.clickableCard, globalStyles.cardSMPadding, isNullOrEmpty(notification.ViewedOnUtc) && styles.unreadNotification)}
                                              key={notification.Id}
                                              onClick={() => {
                                                  let route = toRoute(HomeRouteNames.NOTIFICATION_DETAILS, 'id', orgId);
                                                  route = `${route}?pushNotificationHistoryId=${notification.Id}`;
                                                  setPage(setDynamicPages, notification.Title, route);
                                                  navigate(route);
                                              }}>
                                            <Flex gap={token.padding}>
                                                {!isNullOrEmpty(notification.PushNotificationLogoUrl) &&
                                                    <img src={imageSrc(notification?.PushNotificationLogoUrl, orgId)}
                                                         className={styles.image}
                                                         alt={notification.Subject}/>
                                                }
                                                <Flex vertical={true}>
                                                    <Title level={3}>{notification.Title}</Title>
                                                    {!isNullOrEmpty(notification.Subject) &&
                                                        <>
                                                            <Text>{notification.Subject}</Text>
                                                            <Text>{notification.DifferentIntervalDisplay}</Text>
                                                        </>
                                                    }
                                                </Flex>
                                            </Flex>
                                        </Card>
                                    )
                                })}
                            </>
                        }

                        {!anyInList(filteredNotifications) &&
                            <EmptyBlock description={isNullOrEmpty(searchText)  ? `No notifications found.` : `No notifications found by filter.`} removePadding={true} />
                        }
                    </>
                }
            </Flex>
        </PaddingBlock>
    )
}

export default NotificationList
