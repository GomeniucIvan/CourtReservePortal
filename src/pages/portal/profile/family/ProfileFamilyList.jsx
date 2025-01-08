import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Flex, QRCode, Typography} from "antd";
import {
    AppstoreAddOutlined,
    DeleteOutlined,
    EditOutlined, InfoOutlined, PlusCircleOutlined,
    SettingOutlined
} from "@ant-design/icons";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/personal-data.json";
import {
    anyInList,
    equalString,
    fullNameInitials,
    isNullOrEmpty,
    oneListItem,
    toBoolean
} from "@/utils/Utils.jsx";
import {Ellipsis} from "antd-mobile";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import {ModalDelete} from "@/utils/ModalUtils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import {removeTabStorage, selectedTabStorage, setTabStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import {useTranslation} from "react-i18next";
import {pNotify, pNotifyClose, pNotifyLoading} from "@/components/notification/PNotify.jsx";
import toast from "react-hot-toast";
import Modal from "@/components/modal/Modal.jsx";
import Barcode from "react-barcode";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import {AccountRouteNames} from "@/routes/AccountRoutes.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";

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
        globalStyles,
        token,
        setDynamicPages,
        setIsLoading
    } = useApp();
    
    const {orgId} = useAuth();
    const [familyMembers, setFamilyMembers] = useState([]);
    const [selectedDrawerMember, setSelectedDrawerMember] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [deleteMember, setDeleteMember] = useState(null);
    
    const {t} = useTranslation('');
    
    const loadData = (refresh) => {
        setIsLoading(true);
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
        setIsLoading(false);
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')

        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block>
                {t('profile.family.addNewFamilyMember')}
            </Button>
        </FooterBlock>)

        loadData();
    }, []);

    const deleteFamilyMember = async (incMember) => {
        setIsLoading(true);
        
        const response = await toast.promise(
            appService.get(navigate, `/app/Online/MyFamily/DeleteFamilyMember/${orgId}?memberId=${incMember.MemberId}`),
            {
                position: 'top-center',
                loading: 'Loading...',
                className: 'safe-area-top-margin',
                error: () => {},
                success: () => {}
            }
        );

        setIsLoading(false);
        
        if (toBoolean(response?.IsValid)) {
            setDeleteMember(incMember)
        } else {
            pNotify(response?.Message, 'error');
        }
    }
    
    const deleteMemberPost = async () => {
        setIsLoading(true);
        
        let postModel = {
            MemberId: deleteMember.MemberId,
            OrganizationId: deleteMember.OrganizationId,
        }
        
        let response = await appService.post(`/app/Online/MyFamily/DeleteFamilyMember/${orgId}`, postModel);
        setIsLoading(false);
        if (response.IsValid) {
            setDeleteMember(null);
            loadData(true);
            pNotify('Member Successfully Deleted.');
            setDeleteMember(null);
        } else{
            pNotify(response?.Message, 'error');
        }
    }
    
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
                                        let actions = [];
                                        
                                        if (toBoolean(familyMember.IsNotRegisteredToOrg)){
                                            actions = [
                                                <PlusCircleOutlined key="request-access" onClick={() => {
                                                    let route = toRoute(AccountRouteNames.REQUEST_ORGANIZATION, 'orgId', orgId);
                                                    route = toRoute(route, 'memberId', familyMember.MemberId);
                                                    setPage(setDynamicPages, familyMember.FullName, route);
                                                    navigate(route);
                                                }}/>
                                            ]
                                        } else if (familyMember.IsCurrentLoggedMember) {
                                            actions = [
                                                <EditOutlined key="edit" onClick={(e) => {
                                                    setTabStorage('myprofile', 'pers');
                                                    let route = toRoute(ProfileRouteNames.PROFILE_FAMILY_INFO_EDIT, 'id', familyMember.MemberId);
                                                    setPage(setDynamicPages, familyMember.FullName, route);
                                                    navigate(route);
                                                }}/>,

                                                <InfoOutlined key="info" onClick={() => {
                                                    setSelectedDrawerMember(familyMember)
                                                }}/>
                                            ];
                                        } else {
                                            actions = [
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
                                                                onClick={() => {
                                                                    ModalDelete({
                                                                        content: `Are you sure you want to delete <b>${familyMember.FullName}</b>?`,
                                                                        showIcon: false,
                                                                        onDelete: (e) => {
                                                                            deleteFamilyMember(familyMember);
                                                                        }
                                                                    })
                                                                }}/>,
                                            ];
                                        }

                                        return (
                                            <Card actions={actions} key={index} size="small">
                                                <Card.Meta
                                                    avatar={<div className={globalStyles.orgCircleMember}>{fullNameInitials(familyMember.FullName)}</div>}
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
                <PaddingBlock>
                    <Flex vertical gap={token.padding}>
                        <FormInputDisplay value={selectedDrawerMember?.Email} label={'Email'}/>
                        <FormInputDisplay value={selectedDrawerMember?.SignedUpOn} label={'Signed On'}/>

                        {!isNullOrEmpty(selectedDrawerMember?.Username) &&
                            <>
                                <FormInputDisplay value={selectedDrawerMember?.Username} label={'Username'}/>
                            </>
                        }
                        
                        {!isNullOrEmpty(selectedDrawerMember?.FamilyName) &&
                            <>
                                <FormInputDisplay value={selectedDrawerMember?.FamilyName} label={'Family'}/> 
                                <FormInputDisplay value={selectedDrawerMember?.FamilyMemberTypeDisplay} label={'Family Role'}/> 
                            </>
                        }
                        {!isNullOrEmpty(selectedDrawerMember?.Gender) &&
                            <>
                                <FormInputDisplay value={selectedDrawerMember?.Gender} label={'Gender'}/>
                            </>
                        }

                    </Flex>
                </PaddingBlock>
            </DrawerBottom>

            <Modal show={!isNullOrEmpty(deleteMember)}
                   onClose={() => {setDeleteMember(null)}}
                   onConfirm={deleteMemberPost}
                   showConfirmButton={true}
                   dangerConfirm={true}
                   confirmButtonText={'Delete'}
                   title={`Delete ${deleteMember?.FullName}`}>
                <PaddingBlock>
                    <Flex vertical gap={token.padding}>
                        <FormInputDisplay value={deleteMember?.FullName} label={'Member'}/>
                        <FormInputDisplay value={deleteMember?.OrganizationName} label={'Organization'}/>
                        
                    </Flex>
                </PaddingBlock>
            </Modal>
        </>
    )
}

export default ProfileFamilyList
