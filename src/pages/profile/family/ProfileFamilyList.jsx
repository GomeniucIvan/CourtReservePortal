import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Avatar, Button, Card, Flex, Typography} from "antd";
import {
    DeleteOutlined,
    EditOutlined, InfoOutlined,
    SettingOutlined
} from "@ant-design/icons";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/personal-data.json";
import {useFormik} from "formik";
import * as Yup from "yup";
import {anyInList, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {Ellipsis} from "antd-mobile";
import {setPage, toRoute} from "../../../utils/RouteUtils.jsx";
import {ProfileRouteNames} from "../../../routes/ProfileRoutes.jsx";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import {ModalDelete, ModalRemove} from "../../../utils/ModalUtils.jsx";

const {Text} = Typography;

function ProfileFamilyList() {
    const navigate = useNavigate();
    const {
        setIsFooterVisible,
        setHeaderRightIcons,
        setFooterContent,
        shouldFetch,
        resetFetch,
        isMockData,
        isLoading,
        token,
        setDynamicPages
    } = useApp();
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedDrawerMember, setSelectedDrawerMember] = useState(null);

    const loadData = (refresh) => {
        if (isMockData) {
            const list = mockData.family_list;
            setFamilyMembers(list)
        } else {
            alert('todo res registation')
        }

        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    const initialValues = {};

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
        setIsFooterVisible(true);
        setHeaderRightIcons('')

        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                Add New Family Member
            </Button>
        </PaddingBlock>)

        loadData();
    }, []);

    return (
        <>
            <PaddingBlock topBottom={true}>
                <Flex vertical gap={token.padding}>
                    {anyInList(familyMembers) &&
                        <>
                            {familyMembers.map((familyMember, index) => {
                                const actions = [
                                    <EditOutlined key="edit" onClick={(e) => {
                                        let route = toRoute(ProfileRouteNames.PROFILE_FAMILY_INFO_EDIT, 'id', familyMember.MemberId);
                                        setPage(setDynamicPages, familyMember.FullName, route);
                                        navigate(route);
                                    }}/>,
                                    
                                    <InfoOutlined key="info" onClick={() => {
                                        setSelectedDrawerMember(familyMember)
                                    }}/>,
                                    
                                    <DeleteOutlined key="delete" style={{opacity: (toBoolean(familyMember.IsCurrentLoggedMember) ? '0.4' : '1')}} onClick={() => {
                                        if (!toBoolean(familyMember.IsCurrentLoggedMember)) {
                                            ModalDelete({
                                                content: `Are you sure you want to delete <b>${familyMember.FullName}</b>?`,
                                                showIcon: false,
                                                onDelete: (e) => {
                                                    console.log(e)

                                                }
                                            })
                                        }
                                    }}/>,
                                ];

                                return (
                                    <Card actions={actions} key={index} size="small">
                                        <Card.Meta
                                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"/>}
                                            title={familyMember.FullName}
                                            description={
                                                <>
                                                    {!isNullOrEmpty(familyMember.Email) &&
                                                        <Ellipsis direction='end' content={familyMember.Email}/>}
                                                    {!isNullOrEmpty(familyMember.MembershipNameDisplay) &&
                                                        <Ellipsis direction='end'
                                                                  content={familyMember.MembershipNameDisplay}/>}

                                                    {!toBoolean(familyMember.AllowChildToLoginAndUseBookingPrivileges) &&
                                                        <div><Text type="warning">Not Allowed To Log In</Text></div>}
                                                    
                                                    {toBoolean(familyMember.IsNotRegisteredToOrg) &&
                                                        <div><Text type="danger">No Access</Text></div>}
                                                    
                                                </>
                                            }
                                        />
                                    </Card>
                                )
                            })}
                        </>
                    }
                </Flex>

            </PaddingBlock>

            <DrawerBottom showDrawer={!isNullOrEmpty(selectedDrawerMember)}
                          closeDrawer={() => setSelectedDrawerMember(null)}
                          showButton={true}
                          confirmButtonText={'Close'}
                          label={selectedDrawerMember?.FullName}
                          onConfirmButtonClick={() => {
                              setSelectedDrawerMember(null);
                          }}>
                <div>test</div>
            </DrawerBottom>
        </>
    )
}

export default ProfileFamilyList
