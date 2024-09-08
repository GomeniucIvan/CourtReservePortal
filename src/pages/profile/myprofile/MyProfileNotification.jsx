import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
import {useEffect, useState} from "react";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";
import {Table, Typography, Checkbox, Flex, Skeleton} from "antd";
import {useStyles} from "./styles.jsx";
import mockData from "../../../mocks/personal-data.json";
import appService from "../../../api/app.jsx";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {emptyArray} from "../../../utils/ListUtils.jsx";

const {Column} = Table;
const {Text} = Typography;

function MyProfileNotification({selectedTab}) {
    const {styles} = useStyles();
    const [notifications, setNotifications] = useState(null);
    const [indeterminateEmail, setIndeterminateEmail] = useState(false);
    const [indeterminatePush, setIndeterminatePush] = useState(false);
    const [indeterminateText, setIndeterminateText] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [showEmail, setShowEmail] = useState(true);
    const [showPush, setShowPush] = useState(true);
    const [showText, setShowText] = useState(false);
    const {t} = useTranslation('');

    const {
        setIsLoading,
        isMockData,
        setIsFooterVisible,
        setHeaderRightIcons,
        setFooterContent,
        isLoading,
        token,
        globalStyles
    } = useApp();

    const {orgId} = useAuth();

    useEffect(() => {
        if (equalString(selectedTab, 'notifications')) {
            setIsFooterVisible(false);
            setHeaderRightIcons(null);
            setFooterContent('');

            if (isNullOrEmpty(notifications)) {
                let notificationItems = [];

                if (isMockData) {
                    const categoryData = mockData.notificationDistinctCategoriesTable;
                    const notificationData = mockData.notificationsTable;

                    categoryData.forEach((category, index) => {
                        const relatedNotifications = notificationData.filter(notification =>
                            equalString(notification.NotificationCategory, category.NotificationCategory)
                        );

                        if (anyInList(relatedNotifications)) {
                            notificationItems.push({
                                key: `${category.Id}${index}`,
                                notification: [category.NotificationCategory, '', ''],
                                email: false, //todo
                                text: false,
                                push: false,
                            });

                            relatedNotifications.forEach(notification => {
                                notificationItems.push({
                                    key: `${notification.Id}`,
                                    notification: ['', notification.Name, notification.Description],
                                    email: notification.IsSubscribed,
                                    text: notification.IsTextSubscribed,
                                    push: notification.IsPushNotificationSubscribed,
                                });
                            });
                        }
                    });
                    setNotifications(notificationItems);
                    setIsFetching(false);
                } else {
                    appService.get(`/app/Online/MyProfile/NotificationTab?id=${orgId}`).then(r => {
                        if (toBoolean(r?.IsValid)) {
                            const categoryData = r.Data.DistinctNotificationCategories;
                            const notificationData = r.Data.Notifications;

                            categoryData.forEach((category, index) => {
                                const relatedNotifications = notificationData.filter(notification =>
                                    equalString(notification.NotificationCategory, category.NotificationCategory)
                                );

                                if (anyInList(relatedNotifications)) {
                                    const allEmailChecked = relatedNotifications.every(n => n.IsSubscribed);
                                    const allTextChecked = relatedNotifications.every(n => n.IsTextSubscribed);
                                    const allPushChecked = relatedNotifications.every(n => n.IsPushNotificationSubscribed);

                                    notificationItems.push({
                                        key: `${category.Id}${index}_${category.NotificationCategory}`,
                                        notification: [category.NotificationCategoryName, '', ''],
                                        categoryId: `${category.NotificationCategory}`,
                                        email: toBoolean(allEmailChecked),
                                        text: toBoolean(allTextChecked),
                                        push: toBoolean(allPushChecked),
                                    });

                                    relatedNotifications.forEach(notification => {
                                        notificationItems.push({
                                            key: `${notification.Id}`,
                                            notification: ['', notification.Name, notification.Description],
                                            email: notification.IsSubscribed,
                                            itemCategoryId: `${category.NotificationCategory}`,
                                            text: notification.IsTextSubscribed,
                                            push: notification.IsPushNotificationSubscribed,
                                        });
                                    });
                                }
                            });

                            updateIndeterminateStates(notificationItems);
                            setNotifications(notificationItems);
                            setIsFetching(false);
                        }
                    })
                }
            }
        }
    }, [selectedTab]);

    const updateIndeterminateStates = (notificationData) => {
        const allEmailChecked = notificationData.every(n => n.email);
        const allEmailUnchecked = notificationData.every(n => !n.email);
        setIndeterminateEmail(!allEmailChecked && !allEmailUnchecked);

        const allPushChecked = notificationData.every(n => n.push);
        const allPushUnchecked = notificationData.every(n => !n.push);
        setIndeterminatePush(!allPushChecked && !allPushUnchecked);

        const allTextChecked = notificationData.every(n => n.text);
        const allTextUnchecked = notificationData.every(n => !n.text);
        setIndeterminateText(!allTextChecked && !allTextUnchecked);

        //update category checkboxes
        const groupedByCategory = notificationData.reduce((acc, notification) => {
            if (notification.itemCategoryId) {
                if (!acc[notification.itemCategoryId]) {
                    acc[notification.itemCategoryId] = [];
                }
                acc[notification.itemCategoryId].push(notification);
            }
            return acc;
        }, {});

        Object.keys(groupedByCategory).forEach((categoryId) => {
            const group = groupedByCategory[categoryId];
            const allEmailChecked = group.every(n => n.email);
            const allEmailUnchecked = group.every(n => !n.email);

            const allPushChecked = group.every(n => n.push);
            const allPushUnchecked = group.every(n => !n.push);

            const allTextChecked = group.every(n => n.text);
            const allTextUnchecked = group.every(n => !n.text);

            // Find the parent notification with the matching categoryId
            notificationData = notificationData.map(notification => {
                if (notification.categoryId === categoryId) {
                    // Update parent notification's email status
                    if (allEmailChecked) {
                        notification.email = true;
                    } else if (allEmailUnchecked) {
                        notification.email = false;
                    }

                    // Update parent notification's push status
                    if (allPushChecked) {
                        notification.push = true;
                    } else if (allPushUnchecked) {
                        notification.push = false;
                    }

                    // Update parent notification's text status
                    if (allTextChecked) {
                        notification.text = true;
                    } else if (allTextUnchecked) {
                        notification.text = false;
                    }
                }
                return notification;
            });
        });
    };

    const handleSelectAllChange = (type, isChecked) => {
        setNotifications((prevNotifications) => {
            const newNotifications = prevNotifications.map((notification) => ({
                ...notification,
                [type]: isChecked,
            }));
            updateIndeterminateStates(newNotifications);
            return newNotifications;
        });
    };

    const handleSelectionChange = (type, record, isChecked) => {
        if (!isNullOrEmpty(record.categoryId)) {
            setNotifications((prevNotifications) => {
                const updatedNotifications = prevNotifications.map((notification) => {
                    if (equalString(notification.itemCategoryId, record.categoryId) || equalString(notification.categoryId, record.categoryId)) {
                        return {
                            ...notification,
                            [type]: isChecked,
                        };
                    }
                    return notification;
                });
                updateIndeterminateStates(updatedNotifications);
                return updatedNotifications;
            });
        } else {
            const selectedKeyId = record.key;
            setNotifications((prevNotifications) => {
                const updatedNotifications = prevNotifications.map((notification) => {
                    if (equalString(notification.key, selectedKeyId)) {
                        return {
                            ...notification,
                            [type]: isChecked,
                        };
                    }
                    return notification;
                });


                updateIndeterminateStates(updatedNotifications);
                return updatedNotifications;
            });
        }
    };

    return (
        <>
            <PaddingBlock>
                <FormSwitch label={'Unsubscribe From Organizations Marketing Text Alerts'}
                            onChange={(e) => {
                                console.log(e)
                            }}
                            loading={isFetching}
                            rows={2}
                            name={'UnsubscribeFromMarketingTextAlerts'}/>

                <FormSwitch label={'Unsubscribe From Organization Text Alerts (Confirmations, Cancellations, etc)'}
                            onChange={(e) => {
                                console.log(e)
                            }}
                            loading={isFetching}
                            rows={2}
                            name={'UnsubscribeFromOrganizationTextAlerts'}/>
            </PaddingBlock>

            {toBoolean(isFetching) &&
                <PaddingBlock>
                    <Flex vertical={true} gap={2}>
                        <>
                            {emptyArray().map((item, index) => (
                                <div key={index} className={globalStyles.skeletonTable}>
                                    <Flex gap={1}>
                                        <Skeleton.Button active={true} block/>
                                        <div className={'cb-cell'}>
                                            <Skeleton.Button active={true} block/>
                                        </div>
                                        <div className={'cb-cell'}>
                                            <Skeleton.Button active={true} block/>
                                        </div>
                                    </Flex>
                                </div>
                            ))}
                        </>
                    </Flex>
                </PaddingBlock>
            }

            {(anyInList(notifications) && !toBoolean(isFetching)) &&
                <Table dataSource={notifications}
                       size="small"
                       bordered
                       rowHoverable={false}
                       borderColor={token.colorBorder}
                       className={styles.table}
                       pagination={{position: ['none', 'none'], pageSize: 200}}>

                    <Column title={t('profile.notification.title')}
                            dataIndex="notification"
                            className={styles.columnNotification}
                            render={(notification) => {
                                const groupTitle = notification[0];
                                const text = notification[1];
                                const smallText = notification[2];

                                if (!isNullOrEmpty(groupTitle)) {
                                    return (<Text><strong>{groupTitle}</strong></Text>);
                                }

                                if (!isNullOrEmpty(text)) {
                                    return (
                                        <Text>
                                            <Text>{text}</Text>
                                            {!isNullOrEmpty(smallText) &&
                                                <div>
                                                    <Text type="secondary"><small>{text}</small></Text>
                                                </div>
                                            }
                                        </Text>
                                    );
                                }
                            }}
                            key="notification"
                    />

                    {showEmail &&
                        <Column className={styles.columnEmail}
                                title={
                                    <Checkbox indeterminate={indeterminateEmail}
                                              onClick={(e) => {
                                                  handleSelectAllChange('email', e.target.checked)
                                              }}>
                                        {t('profile.notification.email')}
                                    </Checkbox>
                                }
                                dataIndex="email"
                                key="email"
                                render={(text, record) => {
                                    return (
                                        <Checkbox checked={record.email} onClick={(e) => {
                                            handleSelectionChange('email', record, e.target.checked)
                                        }}/>
                                    );
                                }}/>
                    }

                    {showPush &&
                        <Column dataIndex="push"
                                title={
                                    <Checkbox indeterminate={indeterminatePush} onClick={(e) => {
                                        handleSelectAllChange('push', e.target.checked)
                                    }}>
                                        {t('profile.notification.push')}
                                    </Checkbox>
                                }
                                key="push"
                                className={styles.columnPush}
                                render={(text, record) => (
                                    <Checkbox checked={record.push} onClick={(e) => {
                                        handleSelectionChange('push', record, e.target.checked)
                                    }}/>
                                )}/>

                    }

                    {showText &&
                        <Column key="text"
                                title={
                                    <Checkbox indeterminate={indeterminateText} onClick={(e) => {
                                        handleSelectAllChange('text', e.target.checked)
                                    }}>
                                        {t('profile.notification.text')}
                                    </Checkbox>
                                }
                                className={styles.columnPush}
                                render={(text, record) => (
                                    <Checkbox checked={record.text} onClick={(e) => {
                                        handleSelectionChange('text', record, e.target.checked)
                                    }}/>
                                )}
                        />
                    }
                </Table>
            }
        </>
    )
}

export default MyProfileNotification
