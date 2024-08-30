import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useFormik} from "formik";
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import {anyInList, equalString, isNullOrEmpty} from "../../../utils/Utils.jsx";
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";
import {Table, Typography, Checkbox} from "antd";
import {useStyles} from "./styles.jsx";
import mockData from "../../../mocks/personal-data.json";

const {Column} = Table;
const {Text} = Typography;

function ProfilePersonalInformationNotification({selectedTab}) {
    const navigate = useNavigate();
    let {memberId} = useParams();
    const {styles} = useStyles();
    const [notifications, setNotifications] = useState(null);
    const [indeterminateEmail, setIndeterminateEmail] = useState(false);
    const [indeterminatePush, setIndeterminatePush] = useState(false);
    const [indeterminateText, setIndeterminateText] = useState(false);

    const {
        setIsLoading,
        isMockData,
        setIsFooterVisible,
        setHeaderRightIcons,
        setFooterContent,
        isLoading,
        token
    } = useApp();

    const initialValues = {
        dateOfBirthString: '',
    };

    const validationSchema = Yup.object({});

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            if (isMockData) {

            } else {
                //todo
                alert('todo verification')
            }
        },
    });

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
                                sms: false,
                                push: false,
                            });

                            relatedNotifications.forEach(notification => {
                                notificationItems.push({
                                    key: `${notification.Id}`,
                                    notification: ['', notification.Name, notification.Description],
                                    email: notification.IsSubscribed,
                                    sms: notification.IsTextSubscribed,
                                    push: notification.IsPushNotificationSubscribed,
                                });
                            });
                        }
                    });
                }
                
                setNotifications(notificationItems);
            }
        }
    }, [selectedTab]);

    return (
        <>
            <PaddingBlock>
                <FormSwitch label={'Unsubscribe From Organizations Marketing Text Alerts'}
                            form={formik}
                            rows={2}
                            name={'UnsubscribeFromMarketingTextAlerts'}/>

                <FormSwitch label={'Unsubscribe From Organization Text Alerts (Confirmations, Cancellations, etc)'}
                            form={formik}
                            rows={2}
                            name={'UnsubscribeFromOrganizationTextAlerts'}/>
            </PaddingBlock>

            {anyInList(notifications) &&
                <Table dataSource={notifications}
                       size="small"
                       bordered
                       borderColor={token.colorBorder}
                       className={styles.table}
                       pagination={{position: ['none', 'none']}}>

                    <Column title="Notification"
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
                    <Column className={styles.columnEmail}
                            title={
                                <Checkbox
                                    indeterminate={indeterminateEmail}
                                    // onChange={(e) => handleSelectAllChange(e.target.checked)}
                                >
                                    Email
                                </Checkbox>
                            }
                            dataIndex="email"
                            key="email"
                            render={(text, record) => {
                                return (
                                    <Checkbox

                                        // onChange={(e) => handleSmsSelectionChange(record.key, e.target.checked)}
                                    >

                                    </Checkbox>
                                );
                            }}/>

                    <Column dataIndex="push"
                            title={
                                <Checkbox
                                    // onChange={(e) => handleSelectAllChange(e.target.checked)}
                                >
                                    Push
                                </Checkbox>
                            }
                            key="push"
                            className={styles.columnPush}
                            render={(text, record) => (
                                <Checkbox
                                    
                                    // onChange={(e) => handleSmsSelectionChange(record.key, e.target.checked)}
                                >

                                </Checkbox>
                            )}/>

                    <Column key="text"
                            title={
                                <Checkbox
                                    // onChange={(e) => handleSelectAllChange(e.target.checked)}
                                >
                                    Text
                                </Checkbox>
                            }
                            className={styles.columnPush}
                            render={(text, record) => (
                                <Checkbox
                                    
                                    // onChange={(e) => handleSmsSelectionChange(record.key, e.target.checked)}
                                >
                                    
                                </Checkbox>
                            )}
                    />

                </Table>
            }
        </>
    )
}

export default ProfilePersonalInformationNotification
