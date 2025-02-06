import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@/context/AuthProvider.jsx";
import React, {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, nullToEmpty, toBoolean} from "@/utils/Utils.jsx";
import apiService from "@/api/api.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Tabs, Tag, Typography} from "antd";
import {cx} from "antd-style";
import {selectedTabStorage, setTabStorage} from "@/storage/AppStorage.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useStyles} from "./styles.jsx";
import SVG from "@/components/svg/SVG.jsx";
import portalService from "@/api/portal.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import CenterModal from "@/components/modal/CenterModal.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {AccountRouteNames} from "@/routes/AccountRoutes.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";

const {Title, Text} = Typography;

function ProfileMyOrganizationList() {
    const navigate = useNavigate();
    let { orgId, spGuideId, setAuthorizationData, authData } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();
    
    const{setIsFooterVisible, shouldFetch, resetFetch, token, setIsLoading, globalStyles, setFooterContent} = useApp();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('organizations-list', 'active'));
    const [loadingOrganization, setLoadingOrganization] = useState(null);
    const [primaryOrganizationDataModal, setPrimaryOrganizationDataModal] = useState(null);
    const [hideOrganizationDataModal, setHideOrganizationDataModal] = useState(null);
    const [tabKey, setTabKey] = useState(1);
    const [showOrganizationDataModal, setShowOrganizationDataModal] = useState(null);
    
    const {styles} = useStyles();

    const [organizations, setOrganizations] = useState([]);

    const loadData = async (refresh) => {
        if (refresh) {
            setIsFetching(true);
        }
        setIsLoading(true);

        let response = await apiService.get(`/api/member-portal/my-organizations/get-list?orgId=${orgId}&spGuideId=${nullToEmpty(spGuideId)}`);

        if (toBoolean(response?.IsValid)) {
            let incOrganizations = response?.Data;
            setOrganizations(incOrganizations);
            
            if (!incOrganizations?.some((organization) => toBoolean(organization.IsHidden))) {
                setTabStorage('organizations-list', 'active', setSelectedTab);
            }
        }

        setIsFetching(false);
        setIsLoading(false);
        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);

        if (toBoolean(authData?.HideJoinOrganization)) {
            setFooterContent('');
        } else {
            setFooterContent(<FooterBlock topBottom={true}>
                <Button type="primary" block onClick={() => {
                    let route = toRoute(AccountRouteNames.REQUEST_ORGANIZATION, 'id', orgId);
                    navigate(route)
                }}>
                    {isNullOrEmpty(nullToEmpty(spGuideId)) ? 'Add Organization' : 'Add Location'}
                </Button>
            </FooterBlock>);
        }
        
        loadData();
    }, []);
    
    const changeViewingOrganization = async (selectedOrg) => {
        setIsFooterVisible(false);
        setLoadingOrganization(selectedOrg);

        let requestData = await portalService.requestData(navigate, selectedOrg.Id);
        if (toBoolean(requestData?.IsValid)) {
            await setAuthorizationData(requestData.OrganizationData);
            navigate(HomeRouteNames.INDEX);
        }
    }

    const makePrimary = async (selectedOrgId) => {
        setPrimaryOrganizationDataModal(null);
        let response = await apiService.post(`/api/member-portal/my-organizations/make-primary?orgId=${orgId}&spGuideId=${nullToEmpty(spGuideId)}&selectedOrgId=${selectedOrgId}`);

        if (toBoolean(response?.IsValid)) {
            if (!isNullOrEmpty(nullToEmpty(spGuideId))){
                pNotify('The location has been successfully updated to primary');
            } else{
                pNotify('The organization has been successfully updated to primary');
            }
        }

        loadData(true);
    }

    const addToActiveOrganizations = async (selectedOrgId) => {
        setShowOrganizationDataModal(null);
        let response = await apiService.post(`/api/member-portal/my-organizations/change-visibility?orgId=${orgId}&spGuideId=${nullToEmpty(spGuideId)}&selectedOrgId=${selectedOrgId}&isHidden=false`);

        if (toBoolean(response?.IsValid)) {
            const updateOrganizations = organizations.map((item) => {
                if (equalString(selectedOrgId, item.Id)) {
                    return {
                        ...item,
                        IsHidden: false,
                    }
                } else {
                    return item;
                }
            })

            setOrganizations(updateOrganizations);
            setTabKey((prevKey) => prevKey + 1);
            
            if (!isNullOrEmpty(nullToEmpty(spGuideId))){
                pNotify('The location has been added back to your list successfully');
            } else{
                pNotify('The organization has been added back to your list successfully');
            }
        }
    }
    
    const hideOrganization = async (selectedOrgId) => {
        setHideOrganizationDataModal(null);
        let response = await apiService.post(`/api/member-portal/my-organizations/change-visibility?orgId=${orgId}&spGuideId=${nullToEmpty(spGuideId)}&selectedOrgId=${selectedOrgId}&isHidden=true`);

        if (toBoolean(response?.IsValid)) {

            const updateOrganizations = organizations.map((item) => {
                if (equalString(selectedOrgId, item.Id)) {
                    return {
                        ...item,
                        IsHidden: true,
                    }
                } else {
                    return item;
                }
            })
            
            setOrganizations(updateOrganizations);
            setTabKey((prevKey) => prevKey + 1);
            if (!isNullOrEmpty(nullToEmpty(spGuideId))){
                pNotify('The location has been hidden successfully');
            } else{
                pNotify('The organization has been hidden successfully');
            }
        }
    }
    
    const organizationList = (selectedKey) => {
        let organizationsToDisplay = [];
        if (anyInList(organizations)){
            if (equalString(selectedKey, 'hidden')){
                organizationsToDisplay = organizations?.filter((organization) => toBoolean(organization.IsHidden));
            } else if (equalString(selectedKey, 'active')){
                organizationsToDisplay = organizations?.filter((organization) => !toBoolean(organization.IsHidden));
            }
        }

        return (
            <PaddingBlock topBottom={true}>
                <Flex vertical={true} gap={token.padding}>
                    {(!isFetching && anyInList(organizationsToDisplay)) &&
                        <>
                            {organizationsToDisplay.map((organization) => {

                                let organizationTags = [];
                                if (toBoolean(organization.IsViewingNow)) {
                                    organizationTags.push({
                                        Text: 'Viewing Now',
                                        Type: 'success'
                                    });
                                }

                                if (toBoolean(organization.IsPrimary) && toBoolean(organization.IsApproved)) {
                                    organizationTags.push({
                                        Text: 'Primary',
                                        Type: 'processing'
                                    });
                                }

                                if (isNullOrEmpty(organization.IsApproved)) {
                                    organizationTags.push({
                                        Text: 'Pending Approval',
                                        Type: 'orange',
                                        Color: '#f0f0f0',
                                        BackgroundColor: '#535457',
                                    });
                                }

                                return (
                                    <Card className={cx(globalStyles.card, globalStyles.cardNoPadding)}
                                          key={organization.Id}
                                          onClick={() => {

                                          }}>
                                        <PaddingBlock topBottom={true}>
                                            <Flex vertical={true} gap={token.paddingLG}>
                                                <Flex justify="space-between">
                                                    <img src={organization?.LogoUrl} alt={organization.Name} className={styles.orgCardLogo}/>

                                                    {anyInList(organizationTags) &&
                                                       <div>
                                                           <Flex gap={token.paddingXS} className={styles.headerBadgesWrapper}>
                                                               {organizationTags.map((organizationTag, index) => {
                                                                   return (
                                                                       <Tag key={index} color={organizationTag.Type} className={globalStyles.tag}>
                                                                           {organizationTag.Text}
                                                                       </Tag>
                                                                   )
                                                               })}
                                                           </Flex>
                                                       </div>
                                                    }
                                                </Flex>

                                                <Flex vertical={true}>
                                                    <Title level={3}>{organization?.Name}</Title>
                                                    <Text style={{color: token.colorSecondary}}>{organization?.Address}</Text>
                                                </Flex>
                                            </Flex>
                                        </PaddingBlock>

                                        <Divider className={globalStyles.noMargin} />

                                        <PaddingBlock>
                                            <Flex justify="space-between" align={'center'} style={{padding: `${token.paddingSM}px 0px`}}>

                                                <div>
                                                    {(!toBoolean(organization?.IsPrimary) && !equalString(selectedKey, 'hidden')) &&
                                                        <Button color={'primary'}
                                                                variant="text"
                                                                className={styles.primaryButton}
                                                                htmlType="button"
                                                                onClick={() => {setPrimaryOrganizationDataModal(organization)}}>
                                                            Make Primary
                                                        </Button>
                                                    }
                                                    {equalString(selectedKey, 'hidden') &&
                                                        <Button color={'primary'}
                                                                variant="text"
                                                                className={styles.primaryButton}
                                                                htmlType="button"
                                                                onClick={() => {setShowOrganizationDataModal(organization)}}>
                                                            Add To My Organizations
                                                        </Button>
                                                    }
                                                </div>

                                                {!equalString(selectedKey, 'hidden') &&
                                                    <div>
                                                        <Flex style={{opacity: '0.7'}}>
                                                            <Flex align={'center'}
                                                                  justify={'end'} 
                                                                  onClick={() => {setHideOrganizationDataModal(organization)}}
                                                                  className={styles.footerIconFlex}>
                                                                <SVG icon={'eye-slash-regular'} size={24}  />
                                                            </Flex>
                                                            <Flex align=
                                                                      {'center'}
                                                                  justify={'end'}
                                                                  onClick={() => {changeViewingOrganization(organization)}}
                                                                  className={styles.footerIconFlex}>
                                                                <SVG icon={'rotate-location-regular'} size={24} />
                                                            </Flex>
                                                        </Flex>
                                                    </div>
                                                }
                                            </Flex>
                                        </PaddingBlock>
                                    </Card>
                                )
                            })}
                        </>
                    }
                </Flex>
            </PaddingBlock>
        )
    }
    
    return (
        <div key={tabKey}>
            {(isNullOrEmpty(loadingOrganization)) &&
                <>
                    {isFetching &&
                        <PaddingBlock topBottom={true}>
                            <Flex vertical={true} gap={token.padding}>
                                {emptyArray(8).map((item, index) => (
                                    <div key={index}>
                                        <Skeleton.Button block active={true} style={{height : `200px`}} />
                                    </div>
                                ))}
                            </Flex>
                        </PaddingBlock>
                    }


                    {!isFetching &&
                        <>
                            {organizations?.some((organization) => toBoolean(organization.IsHidden)) &&
                                <Tabs
                                    rootClassName={cx(globalStyles.tabs)}
                                    onChange={(e) => {setTabStorage('organizations-list', e, setSelectedTab)}}
                                    defaultActiveKey={selectedTab}
                                    items={[
                                        {
                                            key: 'active',
                                            label: 'Active',
                                            children: organizationList('active'),
                                        },
                                        {
                                            key: 'hidden',
                                            label: 'Hidden',
                                            children: organizationList('hidden'),
                                        }
                                    ]}
                                />
                            }

                            {!organizations?.some((organization) => toBoolean(organization.IsHidden)) &&
                                <>{organizationList('active')}</>
                            }
                        </>
                    }
                </>
            }

            {(!isNullOrEmpty(loadingOrganization)) &&
                <PaddingBlock topBottom={true}>
                    <Flex justify={'center'} gap={token.padding}  vertical={true} align={'center'}>
                        <img src={loadingOrganization?.LogoUrl} alt={loadingOrganization?.Name} className={styles.orgLoadingLogo}/>

                        <Title level={3}>{loadingOrganization?.Name}</Title>

                        <Skeleton.Button block active={true} style={{height : `450px`}} />
                    </Flex>
                </PaddingBlock>
            }

            <CenterModal show={!isNullOrEmpty(primaryOrganizationDataModal)}
                         hideFooter={true}
                         onClose={() => {setPrimaryOrganizationDataModal(null)}}
                         title={isNullOrEmpty(nullToEmpty(spGuideId)) ? 'Make Primary Organization' : 'Make Primary Location'}>
                <Flex vertical={true} gap={token.paddingXXL}>
                    <Flex vertical={true} gap={token.paddingLG}>
                        <Text style={{color: token.colorSecondary}}>Are you sure you want to make this your Primary {isNullOrEmpty(nullToEmpty(spGuideId)) ? 'Organization' : 'Location'}</Text>

                        <Flex gap={token.paddingLG} className={styles.orgModalOrgInfo}>
                            <img src={primaryOrganizationDataModal?.LogoUrl} alt={loadingOrganization?.Name} className={styles.orgModalLogo}/>

                            <Flex vertical={true} align={'start'}>
                                <Title level={3}>{primaryOrganizationDataModal?.Name}</Title>
                                <Text>{primaryOrganizationDataModal?.Address}</Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Flex vertical={true} gap={token.paddingSM}>
                        <Button type={'primary'} block={true} onClick={() => {makePrimary(primaryOrganizationDataModal.Id)}}>Yes</Button>
                        <Button block={true} onClick={() => {setPrimaryOrganizationDataModal(null)}}>No</Button>
                    </Flex>
                </Flex>
            </CenterModal>

            <CenterModal show={!isNullOrEmpty(hideOrganizationDataModal)}
                         hideFooter={true}
                         onClose={() => {setHideOrganizationDataModal(null)}}
                         title={isNullOrEmpty(nullToEmpty(spGuideId)) ? 'Hide Organization' : 'Hide Location'}>
                <Flex vertical={true} gap={token.paddingXXL}>
                    <Flex vertical={true} gap={token.paddingLG}>
                        <Text style={{color: token.colorSecondary}}>Are you sure you want to make this your Primary {isNullOrEmpty(nullToEmpty(spGuideId)) ? 'Organization' : 'Location'}</Text>

                        <Flex gap={token.paddingLG} className={styles.orgModalOrgInfo}>
                            <img src={hideOrganizationDataModal?.LogoUrl} alt={hideOrganizationDataModal?.Name} className={styles.orgModalLogo}/>

                            <Flex vertical={true} align={'start'}>
                                <Title level={3}>{hideOrganizationDataModal?.Name}</Title>
                                <Text>{hideOrganizationDataModal?.Address}</Text>
                            </Flex>
                        </Flex>

                        <Text><b>Note:</b> This will not cancel your membership or remove your record. Please contact the {isNullOrEmpty(nullToEmpty(spGuideId)) ? 'organization' : 'location'} directly to request further action.</Text>
                    </Flex>

                    <Flex vertical={true} gap={token.paddingSM}>
                        <Button type={'primary'} danger={true} block={true} onClick={() => {hideOrganization(hideOrganizationDataModal.Id)}}>Yes</Button>
                        <Button block={true} onClick={() => {setHideOrganizationDataModal(null)}}>No</Button>
                    </Flex>
                </Flex>
            </CenterModal>

            <CenterModal show={!isNullOrEmpty(showOrganizationDataModal)}
                         hideFooter={true}
                         onClose={() => {setShowOrganizationDataModal(null)}}
                         title={isNullOrEmpty(nullToEmpty(spGuideId)) ? 'Add To My Organizations' : 'Add To My Locations'}>
                <Flex vertical={true} gap={token.paddingXXL}>
                    <Flex vertical={true} gap={token.paddingLG}>
                        <Text style={{color: token.colorSecondary}}>Are you sure you would like to add this {isNullOrEmpty(nullToEmpty(spGuideId)) ? 'Organization' : 'Location'} back to your {isNullOrEmpty(spGuideId) ? 'Organization' : 'Location'} list?</Text>

                        <Flex gap={token.paddingLG} className={styles.orgModalOrgInfo}>
                            <img src={showOrganizationDataModal?.LogoUrl} alt={showOrganizationDataModal?.Name} className={styles.orgModalLogo}/>

                            <Flex vertical={true} align={'start'}>
                                <Title level={3}>{showOrganizationDataModal?.Name}</Title>
                                <Text>{showOrganizationDataModal?.Address}</Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    <Flex vertical={true} gap={token.paddingSM}>
                        <Button type={'primary'} block={true} onClick={() => {addToActiveOrganizations(showOrganizationDataModal.Id)}}>Yes</Button>
                        <Button block={true} onClick={() => {setShowOrganizationDataModal(null)}}>No</Button>
                    </Flex>
                </Flex>
            </CenterModal>
        </div>
    )
}

export default ProfileMyOrganizationList
