import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import * as React from "react";
import {anyInList, equalString, isNullOrEmpty, moreThanOneInList, oneListItem, toBoolean} from "@/utils/Utils.jsx";
import {useEffect, useRef, useState} from "react";
import apiService from "@/api/api.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {Button, Divider, Flex, Skeleton, Typography} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import MembershipDetailedDetails from "@/components/modules/membership/MembershipDetailedDetails.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import FormPaymentProfile from "@/form/formpaymentprofile/FormPaymentProfile.jsx";
import MembershipReceiptBlock from "@/components/receiptblock/MembershipReceiptBlock.jsx";
import FormDisclosures from "@/form/formdisclosures/FormDisclosures.jsx";

const {Title, Text} = Typography;

function MembershipReview() {
    const navigate = useNavigate();
    const {setIsLoading, token, setIsFooterVisible, setFooterContent,isLoading } = useApp();
    const {orgId} = useAuth();
    const {setHeaderRightIcons} = useHeader();
    const [isFetching, setIsFetching] = useState(true);
    const [membership, setMembership] = useState(null);
    const [signupData, setSignupData] = useState(null);
    const [selectedMembershipRequirePayment, setSelectedMembershipRequirePayment] = useState(false);
    const paymentProfileRef = useRef(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const membershipId = queryParams.get("membershipId");
    const [showReceipt, setShowReceipt] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    
    
    useEffect(() => {
        loadMembership();
    }, []);

    const loadMembership = async () => {
        setIsFetching(true);
        setIsLoading(true);
        let response = await apiService.get(`/api/membership-member-portal/get-list?orgId=${orgId}&membershipId=${membershipId}&flowName=review-and-finalize`);

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
                       
                    }}>
                Review & Finalize
            </Button>
        </FooterBlock>);
    }, [isFetching, isLoading]);
    
    return (
        <>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={16}>
                        {emptyArray(15).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <>
                   
                </>
            }
        </>
    )
}

export default MembershipReview
