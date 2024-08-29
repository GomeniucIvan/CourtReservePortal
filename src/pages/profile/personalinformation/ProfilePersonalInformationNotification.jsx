import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useFormik} from "formik";
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect} from "react";
import {equalString, isNullOrEmpty} from "../../../utils/Utils.jsx";
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";
import {Table, Typography} from "antd";
import {useStyles} from "./styles.jsx";

const {Column} = Table;
const {Text} = Typography;

function ProfilePersonalInformationNotification({selectedTab}) {
    const navigate = useNavigate();
    let {memberId} = useParams();
    const {styles} = useStyles();
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
        }
    }, [selectedTab]);

    const data = [
        {
            key: '1',
            notification: ['Stringing Jon', '', ''],
            email: 32,
            push: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            notification: ['', 'Stringing Job Completed', 'Sent stringing job completion notification to member.'],
            email: 42,
            push: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            notification: ['Leagues', '', ''],
            email: 32,
            push: 'Sydney No. 1 Lake Park',
        },
        {
            key: '4',
            notification: ['', 'League Registration', 'Sent player when is registered to new league.'],
            email: 42,
            push: 'London33',
        },
    ];

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

            <Table dataSource={data}
                   size="small"
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
                <Column title="Email"
                        className={styles.columnEmail}
                        dataIndex="email"
                        key="email"/>

                <Column title="Push" dataIndex="push" key="push" className={styles.columnPush}/>

            </Table>
        </>
    )
}

export default ProfilePersonalInformationNotification
