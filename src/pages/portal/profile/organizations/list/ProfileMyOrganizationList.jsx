import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@/context/AuthProvider.jsx";
import React, {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import apiService from "@/api/api.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Tabs, Tag, Typography} from "antd";
import {imageSrc} from "@/utils/ImageUtils.jsx";
import {cx} from "antd-style";
import {selectedTabStorage, setTabStorage} from "@/storage/AppStorage.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useStyles} from "./styles.jsx";
import SVG from "@/components/svg/SVG.jsx";
import portalService from "@/api/portal.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";

const {Title, Text} = Typography;

function ProfileMyOrganizationList() {
    const navigate = useNavigate();
    let { orgId, spGuideId, setAuthorizationData } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const{setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, token, setIsLoading, globalStyles} = useApp();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('organizations-list', 'active'));
    const [loadingOrganization, setLoadingOrganization] = useState(null);
    const {styles} = useStyles();
    
    const [organizations, setOrganizations] = useState([]);

    const loadData = async (refresh) => {
        if (refresh) {
            setIsFetching(true);
        }
        setIsLoading(true);

        let response = await apiService.get(`/api/member-portal/my-organizations/get-list?orgId=${orgId}&spGuideId=${spGuideId}`);

        if (toBoolean(response?.IsValid)) {
            setOrganizations(response.Data);
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
        loadData();
    }, []);

    const makePrimary = async (selectedOrgId) => {
        let response = await apiService.get(`/api/member-portal/my-organizations/make-primary?orgId=${selectedOrgId}&spGuideId=${spGuideId}`);

        if (toBoolean(response?.IsValid)) {
            if (isNullOrEmpty(spGuideId)){
                pNotify('The location has been successfully updated to primary');
            } else{
                pNotify('The organization has been successfully updated to primary');
            }
        }

        loadData(true);
    }

    const addToActiveOrganizations = (selectedOrgId) => {
        
    }
    
    const changeViewingOrganization = async (selectedOrg) => {
        setIsFooterVisible(false);
        setLoadingOrganization(selectedOrg);
        
        let requestData = await portalService.requestData(navigate, selectedOrg.Id);
        if (toBoolean(requestData?.IsValid)) {
            await setAuthorizationData(requestData.OrganizationData);
            navigate(HomeRouteNames.INDEX);
        }
    }
    
    const anyHiddenOrganization = organizations?.some((organization) => toBoolean(organization.IsHidden));
    
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
                                                        <div className={styles.headerBadgesWrapper}>
                                                            {organizationTags.map((organizationTag, index) => {
                                                                return (
                                                                    <Tag key={index} color={organizationTag.Type} className={globalStyles.tag}>
                                                                        {organizationTag.Text}
                                                                    </Tag>
                                                                )
                                                            })}
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
                                                                onClick={() => {makePrimary(organization.Id)}}>
                                                            Make Primary
                                                        </Button>
                                                    }
                                                    {equalString(selectedKey, 'hidden') &&
                                                        <Button color={'primary'}
                                                                variant="text"
                                                                className={styles.primaryButton}
                                                                htmlType="button"
                                                                onClick={() => {addToActiveOrganizations(organization.Id)}}>
                                                            Add To My Organizations
                                                        </Button>
                                                    }
                                                </div>

                                                {!equalString(selectedKey, 'hidden') &&
                                                    <div>
                                                        <Flex style={{opacity: '0.7'}}>
                                                            <Flex align={'center'} justify={'end'} className={styles.footerIconFlex}>
                                                                <SVG icon={'eye-slash-regular'} size={24}  />
                                                            </Flex>
                                                            <Flex align={'center'}
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
        <>
            {(isNullOrEmpty(loadingOrganization)) &&
                <>
                    {isFetching &&
                        <PaddingBlock topBottom={true}>
                            <Skeleton.Button block active={true} style={{height : `200px`}} />
                        </PaddingBlock>
                    }


                    {!isFetching &&
                        <>
                            {anyHiddenOrganization &&
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

                            {!anyHiddenOrganization &&
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
        </>
    )
}

export default ProfileMyOrganizationList
