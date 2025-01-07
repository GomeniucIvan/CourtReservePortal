import CardLinks from "@/components/navigationlinks/CardLinks.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/navigation-data.json";
import ListLinks from "@/components/navigationlinks/ListLinks.jsx";
import {useParams} from "react-router-dom";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {getNavigationStorage} from "@/storage/AppStorage.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {Flex, Skeleton} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {Swiper} from "antd-mobile";
import SVG from "@/components/svg/SVG.jsx";
import * as React from "react";

function Navigation({key}) {
    const { nodeId } = useParams();
    const {setIsFooterVisible, setHeaderRightIcons, setFooterContent, setHeaderTitle, token} = useApp();
    const {orgId} = useAuth();
    const [isFetching, setIsFetching] = useState(false);
    const [links, setLinks] = useState(getNavigationStorage(orgId));

    useEffect(() => {
        if (equalString(key, 'more')) {
            
        }
    }, [key]);

    console.log(nodeId)
    useEffect(() => {
        if (!isNullOrEmpty(nodeId)) {
            //TODO LOGOUT
            //TODO ADmin NAV
            
            if (equalString(nodeId, 50)) {
                //my leagues
                setIsFetching(true);
                setHeaderTitle('My Leagues');
            } else {
                //3rd level not update new links
                //we should reset links
                
                let cacheLinks = getNavigationStorage(orgId);
                setLinks(cacheLinks)
                setIsFetching(false);
                const parentNode = cacheLinks.find((link) => equalString(link.Item, nodeId));
                if (parentNode){
                    setLinks(parentNode.Childrens);
                    setHeaderTitle(parentNode.Text)
                }
            }
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
