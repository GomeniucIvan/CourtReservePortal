import * as React from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useEffect, useState} from "react";
import {anyInList, isNullOrEmpty, nullToEmpty, toBoolean} from "@/utils/Utils.jsx";
import apiService from "@/api/api.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Empty, Flex, Skeleton} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import MembershipCard from "@/components/modules/membershipcard/MembershipCard.jsx";

function MembershipList() {
    const {setIsLoading, token, setIsFooterVisible, setFooterContent } = useApp();
    const {orgId} = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [memberships, setMemberships] = useState(null);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const offerId = queryParams.get("offerId");
    const offeredOnly = queryParams.get("offeredOnly");

    const loadMemberships = async () => {
        setIsFetching(true);
        setIsLoading(true);
        let response = await apiService.get(`/api/membership-member-portal/get-list?orgId=${orgId}&membershipOfferId=${nullToEmpty(offerId)}&offeredOnly=${toBoolean(offeredOnly)}&flowName=memberships`);

        if (response.IsValid) {
            setMemberships(response.MembershipsData);
        }

        setIsFetching(false);
        setIsLoading(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
        loadMemberships();
    }, []);

    const onMembershipSelect = (membership) => {

    }

    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(2).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button active={true} block style={{height: `240px`}}/>
                            </div>
                        ))}
                    </Flex>
                </>
            }
            {!isFetching &&
                <>
                    {!anyInList(memberships) &&
                        <EmptyBlock description={'No memberships found.'} />
                    }

                    {anyInList(memberships) &&
                        <Flex vertical={true} gap={token.padding}>
                            {memberships.map((membership, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <MembershipCard membership={membership} onMembershipSelect={onMembershipSelect}/>
                                    </React.Fragment>
                                )
                            })}
                        </Flex>
                    }
                </>
            }
        </PaddingBlock>
    )
}

export default MembershipList
