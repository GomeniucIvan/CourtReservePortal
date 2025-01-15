import CardLinks from "@/components/navigationlinks/CardLinks.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/navigation-data.json";
import ListLinks from "@/components/navigationlinks/ListLinks.jsx";
import {useParams} from "react-router-dom";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {getDashboardAllLists, getMoreNavigationStorage, getNavigationStorage} from "@/storage/AppStorage.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {Flex, Skeleton} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {Swiper} from "antd-mobile";
import SVG from "@/components/svg/SVG.jsx";
import * as React from "react";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";

function Navigation() {
    const { nodeId } = useParams();
    const key = equalString(nodeId, 19) ? 'more' : '';
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const {setIsFooterVisible, setFooterContent, token} = useApp();
    const {orgId, authData} = useAuth();
    const [isFetching, setIsFetching] = useState(false);
    const [links, setLinks] = useState(equalString(key, 'more') ? getMoreNavigationStorage(orgId) : getDashboardAllLists(orgId));

    const loadMyLeagues = async () => {
        let response =await appService.getRoute(apiRoutes.API4, `/app/Online/Utils/Member_GetRegisteredLeagues?orgId=${orgId}&memberId=${authData?.MemberId}`);
        if (toBoolean(response?.IsValid)) {
            const data = response.Data;
            
            let myLeagues = data.map((league) => {
                return {
                    IconClass: 'trophy',
                    Text: league.Name,
                    Url: `/Online/Leagues/Details/${league.Id}`
                }
            });

            setLinks(myLeagues);
            setIsFetching(false);
        }
    }
    
    useEffect(() => {
        if (isNullOrEmpty(key)){
            if (!isNullOrEmpty(nodeId)) {
                //TODO LOGOUT
                //TODO ADmin NAV

                if (equalString(nodeId, 50)) {
                    //my leagues
                    setIsFetching(true);
                    setHeaderTitle('My Leagues');
                    loadMyLeagues();
                } else if (equalString(nodeId, 28)) {
                    //billing
                    let cacheLinks = getMoreNavigationStorage(orgId);
                    const parentNode = cacheLinks.find((link) => equalString(link.Item, nodeId));
                    if (parentNode){
                        setLinks(parentNode.Childrens);
                        setHeaderTitle(parentNode.Text)
                    }
                    setIsFetching(false);
                } else {
                    //3rd level not update new links
                    //we should reset links
                    let cacheLinks = getDashboardAllLists(orgId);
                    const parentNode = cacheLinks.find((link) => equalString(link.Item, nodeId));
                    
                    if (parentNode) {
                        setLinks(parentNode.Childrens);
                        setHeaderTitle(parentNode.Text)
                    }
                    setIsFetching(false);
                }
            }
        } else if (equalString(key, 'more')){
            setHeaderTitle('More');
            let cacheLinks = getMoreNavigationStorage(orgId);
            setLinks(cacheLinks);
        }
    }, [nodeId]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent('');
    }, []);
    
    return (
        <>
            {toBoolean(isFetching) &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.paddingSM}>
                        {emptyArray(6).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button active={true} block style={{height: `48px`}}/>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <PaddingBlock>
                    <ListLinks links={links}/>
                </PaddingBlock>
            }
        </>
    )
}

export default Navigation
