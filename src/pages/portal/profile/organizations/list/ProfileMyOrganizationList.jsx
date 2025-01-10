import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@/context/AuthProvider.jsx";
import React, {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import apiService from "@/api/api.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import {imageSrc} from "@/utils/ImageUtils.jsx";
import {cx} from "antd-style";

const {Title} = Typography;

function ProfileMyOrganizationList() {
    const navigate = useNavigate();
    let { orgId, spGuideId } = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [organizations, setOrganizations] = useState([]);
    const{setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, token, setIsLoading} = useApp();

    const loadData = async (refresh) => {
        if (refresh) {
            setIsFetching(true);
        }
        setIsLoading(true);

        let response = await apiService.get(`/api/member-portal/my-organizations/get-list?orgId=${orgId}&spGuideId=${spGuideId}`);
        console.log(response)
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
    
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                {isFetching &&
                    <Skeleton.Button block active={true} style={{height : `200px`}} />
                }

                {(!isFetching && anyInList(organizations)) &&
                    <>
                        {organizations.map((organization) => {
                            return (
                                <Card className={cx(globalStyles.card, globalStyles.clickableCard, globalStyles.cardSMPadding)}
                                      key={organization.Id}
                                      onClick={() => {
                                         
                                      }}>
                                   <Flex vertical={true} gap={token.paddingLG}>
                                       <Flex justify="space-between">
                                           <img src={imageSrc(organization?.ImageUrl, orgId)}  alt={organization.Name}/>

                                           //badges
                                       </Flex>

                                      <Flex vertical={true}>
                                          <Title level={3}>{organization?.Name}</Title>
                                          <Text style={{color: token.colorSecondary}}>{organization?.Description}</Text>
                                      </Flex>
                                       
                                   </Flex>
                                    
                                    <Divider />
                                    
                                    <Flex justify="space-between" align={'center'}>
                                        <Button color="default" variant="text" htmlType="button">
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

export default ProfileMyOrganizationList
