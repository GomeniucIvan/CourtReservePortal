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
import {anyInList, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {Ellipsis} from "antd-mobile";
import {setPage, toRoute} from "../../../utils/RouteUtils.jsx";
import {ProfileRouteNames} from "../../../routes/ProfileRoutes.jsx";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import {ModalDelete} from "../../../utils/ModalUtils.jsx";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import CardSkeleton, {SkeletonEnum} from "../../../components/skeleton/CardSkeleton.jsx";
import {removeTabStorage, selectedTabStorage, setTabStorage, toLocalStorage} from "../../../storage/AppStorage.jsx";
import {useTranslation} from "react-i18next";

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
    const {orgId} = useAuth();
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedDrawerMember, setSelectedDrawerMember] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const {t} = useTranslation('');
    
    const loadData = (refresh) => {
        if (isMockData) {
            const list = mockData.family_list;
            setFamilyMembers(list)
        } else {
            setIsFetching(true);

            appService.get(navigate, `/app/Online/MyFamily/GetFamilyMembers?id=${orgId}`).then(r => {
                if (r.IsValid) {
                    setFamilyMembers(r.Data);
                }

                setIsFetching(false);
            })
        }

        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')

        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block>
                {t('profile.family.addNewFamilyMember')}
            </Button>
        </PaddingBlock>)

        loadData();
    }, []);

    return (
        <>
            <PaddingBlock topBottom={true}>
                <Flex vertical gap={token.padding}>
                    {isFetching &&
                        <CardSkeleton type={SkeletonEnum.MEMBER} count={5}/>
                    }
                    {!isFetching &&
                        <>
                            {anyInList(familyMembers) &&
                                <>
                                    {familyMembers.map((familyMember, index) => {
                                        const actions = [
                                            <EditOutlined key="edit" onClick={(e) => {
                                                setTabStorage('myprofile', 'pers');
                                                let route = toRoute(ProfileRouteNames.PROFILE_FAMILY_INFO_EDIT, 'id', familyMember.MemberId);
                                                setPage(setDynamicPages, familyMember.FullName, route);
                                                navigate(route);
                                            }}/>,

                                            <InfoOutlined key="info" onClick={() => {
                                                setSelectedDrawerMember(familyMember)
                                            }}/>,

                                            <DeleteOutlined key="delete"
                                                            style={{opacity: (toBoolean(familyMember.IsCurrentLoggedMember) ? '0.4' : '1')}}
                                                            onClick={() => {
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
                                                    avatar={<Avatar
                                                        src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"/>}
                                                    title={familyMember.FullName}
                                                    description={
                                                        <>
                                                            {!isNullOrEmpty(familyMember.Email) &&
                                                                <Ellipsis direction='end'
                                                                          content={familyMember.Email}/>}
                                                            {!isNullOrEmpty(familyMember.MembershipNameDisplay) &&
                                                                <Ellipsis direction='end'
                                                                          content={familyMember.MembershipNameDisplay}/>}

                                                            {!toBoolean(familyMember.AllowChildToLoginAndUseBookingPrivileges) &&
                                                                <div><Text type="warning">Not Allowed To Log In</Text>
                                                                </div>}

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
