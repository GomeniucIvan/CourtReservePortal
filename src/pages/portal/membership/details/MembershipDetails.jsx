﻿import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import * as React from "react";
import {anyInList} from "@/utils/Utils.jsx";
import {useEffect, useState} from "react";
import apiService from "@/api/api.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {Button, Flex, Skeleton} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import MembershipDetailedDetails from "@/components/modules/membership/MembershipDetailedDetails.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";

function MembershipDetails() {
    const navigate = useNavigate();
    const {setIsLoading, token, setIsFooterVisible, setFooterContent,isLoading } = useApp();
    const {orgId} = useAuth();
    const {setHeaderRightIcons} = useHeader();
    const [isFetching, setIsFetching] = useState(true);
    const [membership, setMembership] = useState(null);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const membershipId = queryParams.get("membershipId");
    
    useEffect(() => {
        loadMembership();
    }, []);

    const loadMembership = async () => {
        setIsFetching(true);
        setIsLoading(true);
        let response = await apiService.get(`/api/membership-member-portal/get-list?orgId=${orgId}&membershipId=${membershipId}&flowName=membership-details-page`);

        if (anyInList(response?.MembershipsData)) {
            setMembership(response?.MembershipsData[0]);
        }

        setIsFetching(false);
        setIsLoading(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('');
        
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    disabled={isFetching}
                    onClick={() => {
                        let route = toRoute(HomeRouteNames.MEMBERSHIP_REVIEW, 'id', orgId);
                        navigate(`${route}?membershipId=${membershipId}`);
                    }}>
                Review & Finalize
            </Button>
        </FooterBlock>);
    }, [isFetching, isLoading]);
    
    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <>
                    {emptyArray(12).map((item, index) => (
                        <div key={index} style={{padding: `${token.padding}px`}}>
                            <Flex vertical={true} gap={8}>
                                <Skeleton.Button active={true} block
                                                 style={{ height: `23px`, width: `${randomNumber(25, 50)}%` }} />
                                <Skeleton.Button active={true} block style={{ height: `40px` }} />
                            </Flex>
                        </div>
                    ))}
                </>
            }

            {!isFetching &&
                <MembershipDetailedDetails membership={membership} />
            }
        </PaddingBlock>
    )
}

export default MembershipDetails
