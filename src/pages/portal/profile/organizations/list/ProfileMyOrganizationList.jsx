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

const {Title, Text} = Typography;

function ProfileMyOrganizationList() {
    const navigate = useNavigate();
    let { orgId, spGuideId } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const{setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, token, setIsLoading, globalStyles} = useApp();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('organizations-list', 'active'));

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
        let response = await apiService.get(`/api/member-portal/my-organizations/make-primary?orgId=${orgId}&spGuideId=${spGuideId}`);

        if (toBoolean(response?.IsValid)) {
            if (isNullOrEmpty(spGuideId)){
                pNotify('The location has been successfully updated to primary');
            } else{
                pNotify('The organization has been successfully updated to primary');
            }
        }

        loadData(true);
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
                    {isFetching &&
                        <Skeleton.Button block active={true} style={{height : `200px`}} />
                    }

                    {(!isFetching && anyInList(organizationsToDisplay)) &&
                        <>
                            {organizationsToDisplay.map((organization) => {

                                let organizationTags = [];
                                if (toBoolean(organization.IsViewingNow)) {
                                    organizationTags.push({
                                        Text: 'Viewing Now',
                                        Color: '#237804',
                                        BackgroundColor: '#D9F7BE',
                                    });
                                }

                                if (toBoolean(organization.IsPrimary) && toBoolean(organization.IsApproved)) {
                                    organizationTags.push({
                                        Text: 'Primary',
                                        Color: '#10239E',
                                        BackgroundColor: '#284B73',
                                    });
                                }

                                if (isNullOrEmpty(organization.IsApproved)) {
                                    organizationTags.push({
                                        Text: 'Pending Approval',
                                        Color: '#f0f0f0',
                                        BackgroundColor: '#535457',
                                    });
                                }

                                return (
                                    <Card className={cx(globalStyles.card, globalStyles.clickableCard, globalStyles.cardSMPadding)}
                                          key={organization.Id}
                                          onClick={() => {

                                          }}>
                                        <Flex vertical={true} gap={token.paddingLG}>
                                            <Flex justify="space-between">
                                                <img src={imageSrc(organization?.ImageUrl, orgId)}  alt={organization.Name}/>

                                                {anyInList(organizationTags) &&
                                                    <Flex gap={token.paddingSM}>
                                                        {organizationTags.map((organizationTag, index) => {
                                                            return (
                                                                <Tag key={index} color={organizationTag.Color} style={{ backgroundColor: organizationTag.BackgroundColor }}>{organizationTag.Text}</Tag>
                                                            )
                                                        })}
                                                    </Flex>
                                                }
                                            </Flex>

                                            <Flex vertical={true}>
                                                <Title level={3}>{organization?.Name}</Title>
                                                <Text style={{color: token.colorSecondary}}>{organization?.Address}</Text>
                                            </Flex>

                                        </Flex>

                                        <Divider />

                                        <Flex justify="space-between" align={'center'}>
                                            <Button color="default" variant="text" htmlType="button" onClick={() => {makePrimary(organization.Id)}}>
                                                Make Primary
                                            </Button>

                                            <Flex gap={token.paddingXS}>
                                                <Button type={'button'}>
                                                    Icons
                                                </Button>
                                            </Flex>
                                        </Flex>
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
        </>
    )
}

export default ProfileMyOrganizationList
