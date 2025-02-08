import {useLocation, useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import apiService from "@/api/api.jsx";
import {cx} from "antd-style";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import PackagePartialDetails from "@portal/profile/billing/packages/modules/PackagePartialDetails.jsx";
import PublicPackageDetails from "@portal/package/modules/PublicPackageDetails.jsx";
import ExpanderBlock from "@/components/expanderblock/ExpanderBlock.jsx";
import SVG from "@/components/svg/SVG.jsx";
import PublicPackageEligibleItems from "@portal/package/modules/PublicPackageEligibleItems.jsx";

const {Title, Text}  = Typography ;

function PackageDetails() {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();
    const{setIsFooterVisible, shouldFetch, resetFetch, token, setIsLoading, globalStyles, setFooterContent} = useApp();
    const [pack, setPack] = useState(null);
    const {orgId} = useAuth();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const packageId = queryParams.get("packageId");
    const guid = queryParams.get("guid");
    
    const loadData = async () => {
        setIsFetching(true);
        let response = await apiService.get(`/api/member-portal/packages/get-package-details?id=${orgId}&packageId=${packageId}&guid=${guid}`);

        if (toBoolean(response?.IsValid)) {
            setPack(response.Data);
        }
        
        setIsFetching(false);
    }
    
    useEffect(() => {
        setHeaderRightIcons('');
        setIsFooterVisible(true);
        loadData();
    }, []);

    useEffect(() => {
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    onClick={() => {
                        let route =toRoute(HomeRouteNames.PACKAGE_PURCHASE, 'id', orgId);
                        navigate(`${route}?packageId=${packageId}&guid=${guid}`);
                    }}>
                Select Package
            </Button>
        </FooterBlock>);
    }, [isFetching]);
    
    return (
        <PaddingBlock topBottom={true}>
            {isFetching && 
                <>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(6).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button active={true} block style={{height: `${token.Input.controlHeight}px`}}/>
                            </div>
                        ))}
                    </Flex>
                </>
            }

            {!isFetching &&
                <>
                    <Flex vertical={true} gap={token.padding}>
                        <Flex vertical={true} gap={token.paddingMD}>
                            <PublicPackageDetails pack={pack} page={'details'} />
                        </Flex>

                        <PublicPackageEligibleItems pack={pack} page={'details'} />
                    </Flex>
                </>
            }
        </PaddingBlock>
    )
}

export default PackageDetails
