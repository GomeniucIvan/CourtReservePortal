import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {useEffect, useState} from "react";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";
import {Table, Typography, Checkbox, Flex, Skeleton} from "antd";
import {useStyles} from "./styles.jsx";
import appService from "@/api/app.jsx";
import {useTranslation} from "react-i18next";
import {useAuth} from "@/context/AuthProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useNavigate} from "react-router-dom";
import * as React from "react";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";

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
    const navigate = useNavigate();
    
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

    const initialValues = {
        UnsubscribeFromMarketingTextAlerts: false,
        UnsubscribeFromOrganizationTextAlerts: false,
        IsUsingSmsAlerts: false,
        MemberId: null,
        OrgMemberId: null,
        IsTwilioAlertsStopped: false,
        RefreshKey: '' //not fire for initial call
    };

    const formik = useCustomFormik({
        initialValues: initialValues,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            let newKey = `${values.UnsubscribeFromMarketingTextAlerts}_${values.UnsubscribeFromOrganizationTextAlerts}`;


            if (!equalString(values?.RefreshKey, newKey)) {
                formik.setFieldValue("RefreshKey", newKey);

                let postModel = {
                    isSubscribeTextAlertMarketing: toBoolean(values?.UnsubscribeFromMarketingTextAlerts) == false,
                    isSubscribeToOrganizationTextAlerts: toBoolean(values?.UnsubscribeFromOrganizationTextAlerts) == false,
                    MemberId: values?.MemberId,
                    OrgMemberId: values?.OrgMemberId,
                };
                
                let response = await appService.post(`/app/Online/MyProfile/SetTextAlertOptInData?id=${orgId}`, postModel);
            }

            setIsLoading(false);
        },
    });
    
    const loadData = async () => {
        if (isNullOrEmpty(notifications)) {
            let notificationItems = [];

            let response = await appService.get(navigate, `/app/Online/MyProfile/NotificationTab?id=${orgId}`);

            if (toBoolean(response?.IsValid)) {
                const data = response.Data;
                const categoryData = data.DistinctNotificationCategories;
                const notificationData = data.Notifications;

                setShowText(data.IsUsingSmsAlerts);
                setShowPush(data.IsUsingPushNotifications);
                
                formik.setValues({
                    UnsubscribeFromMarketingTextAlerts: data.UnsubscribeFromMarketingTextAlerts,
                    UnsubscribeFromOrganizationTextAlerts: data.UnsubscribeFromOrganizationTextAlerts,
                    MemberId: data.MemberId,
                    OrgMemberId: data.OrgMemberId,
                    IsUsingSmsAlerts: data.IsUsingSmsAlerts,
                    RefreshKey: `${data.UnsubscribeFromMarketingTextAlerts}_${data.UnsubscribeFromOrganizationTextAlerts}`,
                    IsTwilioAlertsStopped: data.IsTwilioAlertsStopped
                });
                
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
                                id: notification.Id
                            });
                        });
                    }
                });

                updateIndeterminateStates(notificationItems);
                setNotifications(notificationItems);
                setIsFetching(false);
            }
        }
    }
    
    useEffect(() => {
        if (equalString(selectedTab, 'notifications')) {
            setIsFooterVisible(false);
            setHeaderRightIcons(null);
            setFooterContent('');
            loadData();
        }
    }, [selectedTab]);

    useEffect(() => {
        if (!isNullOrEmpty(formik.values?.RefreshKey)){
            const submitOnChange = async () => {
                await formik.submitForm();
            };

            submitOnChange(); 
        }
    }, [formik.values]);
    
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

    const handleSelectAllChange = async (type, isChecked) => {
        setNotifications((prevNotifications) => {
            const newNotifications = prevNotifications.map((notification) => ({
                ...notification,
                [type]: isChecked,
            }));
            updateIndeterminateStates(newNotifications);
            return newNotifications;
        });
        
        //types push, email, text
        let postModel = {
            
        };

        if (equalString(type, 'email')) {
            postModel = {
                IsSubscribed: isChecked,
                OrganizationId: orgId,
                CheckboxType: 2,
                NotificationIdsString: notifications
                    .filter(v => !isNullOrEmpty(v.id)) // Filter out items with null id
                    .map(v => v.id) // Map to extract the id
                    .join(',')
            };
        } else if (equalString(type, 'push')) {
            postModel = {
                IsPushNotificationSubscribed: isChecked,
                OrganizationId: orgId,
                CheckboxType: 2,
                IsPushNotification: true,
                NotificationIdsString: notifications
                    .filter(v => !isNullOrEmpty(v.id)) // Filter out items with null id
                    .map(v => v.id) // Map to extract the id
                    .join(',')
            };
        } else if (equalString(type, 'text')) {
            postModel = {
                IsTextSubscribed: isChecked,
                OrganizationId: orgId,
                CheckboxType: 2,
                IsTextMessage: true,
                NotificationIdsString: notifications
                    .filter(v => !isNullOrEmpty(v.id)) // Filter out items with null id
                    .map(v => v.id) // Map to extract the id
                    .join(',')
            };
        }
        
        let response = await appService.post(`/app/Online/MyProfile/AjaxUpdateNotificationSetting?id=${orgId}`, postModel);
        
    };

    const handleSelectionChange = async (type, record, isChecked) => {
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

            const categoryNotifications = notifications.filter(
                (notification) =>
                    equalString(notification.itemCategoryId, record.categoryId)
            );
            
            let postModel = {
                IsSubscribed:  isChecked,
                OrganizationId: orgId,
                CheckboxType: 2,
                IsTextSubscribed: equalString(type, 'text') ? isChecked : false,
                IsTextMessage: equalString(type, 'text'),
                IsPushNotificationSubscribed: equalString(type, 'push') ? isChecked : false,
                IsPushNotification: equalString(type, 'push'),
                NotificationIdsString: categoryNotifications
                    .filter(v => !isNullOrEmpty(v.id)) // Filter out items with null id
                    .map(v => v.id) // Map to extract the id
                    .join(',')
            };

            console.log(postModel)
            
            let response = await appService.post(`/app/Online/MyProfile/AjaxUpdateNotificationSetting?id=${orgId}`, postModel);
        } else {
            //single update
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

            let postModel = {
                NotificationId: record.id,
                IsSubscribed: isChecked,
                OrganizationId: orgId,
                IsTextSubscribed: equalString(type, 'text') ? isChecked : false,
                IsTextMessage: equalString(type, 'text'),
                IsPushNotificationSubscribed: equalString(type, 'push') ? isChecked : false,
                IsPushNotification: equalString(type, 'push'),
            };

            let response = await appService.post(`/app/Online/MyProfile/AjaxUpdateNotificationSetting?id=${orgId}`, postModel);
        }
    };
    
    return (
        <>
            {toBoolean(formik?.values?.IsUsingSmsAlerts) &&
                <PaddingBlock onlyBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        {isFetching &&
                            <>
                                {emptyArray(2).map((item, index) => (
                                    <div key={index}>
                                        <Skeleton.Button active={true} block style={{height: `44px`}}/>
                                    </div>
                                ))}
                            </>
                        }

                        {!isFetching && (
                            <>
                                <FormSwitch label={'Unsubscribe From Organizations Marketing Text Alerts'}
                                            rows={2}
                                            disabled={toBoolean(formik.values?.IsTwilioAlertsStopped)}
                                            formik={formik}
                                            tooltip={toBoolean(formik.values?.IsTwilioAlertsStopped) ? 'Text alerts are stopped' : ''}
                                            name={'UnsubscribeFromMarketingTextAlerts'}/>

                                <FormSwitch label={'Unsubscribe From Organization Text Alerts (Confirmations, Cancellations, etc)'}
                                            rows={2}
                                            formik={formik}
                                            tooltip={toBoolean(formik.values?.IsTwilioAlertsStopped) ? 'Text alerts are stopped' : ''}
                                            disabled={toBoolean(formik.values?.IsTwilioAlertsStopped)}
                                            name={'UnsubscribeFromOrganizationTextAlerts'}/>
                            </>
                        )}
                    </Flex>
                </PaddingBlock>
            }

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
                                    <Checkbox indeterminate={indeterminateEmail} checked={notifications.every(v => toBoolean(v.email))}
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
                                    <Checkbox indeterminate={indeterminatePush} checked={notifications.every(v => toBoolean(v.push))}
                                              onClick={(e) => {
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
                                    <Checkbox indeterminate={indeterminateText} checked={notifications.every(v => toBoolean(v.text))}
                                              
                                              onClick={(e) => {
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
