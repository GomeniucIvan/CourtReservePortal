import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Flex, Skeleton, Typography} from "antd";
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
import PublicPackageDetails from "@portal/package/modules/PublicPackageDetails.jsx";

const {Title, Text}  = Typography ;

function PackageList() {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();
    const{setIsFooterVisible, shouldFetch, resetFetch, token, setIsLoading, globalStyles, setFooterContent} = useApp();
    const [packages, setPackages] = useState([]);
    const {orgId} = useAuth();

    const loadData = async (refresh) => {
        if (refresh) {
            setIsFetching(true);
        }
        setIsLoading(true);

        let response = await apiService.get(`/api/member-portal/packages/get-available-packages-to-be-sold-online?id=${orgId}`);
        if (toBoolean(response?.IsValid)) {
            setPackages(response.Data);
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
        setFooterContent('');
        loadData();
    }, []);

    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <Flex vertical={true} gap={token.padding}>
                    {emptyArray(15).map((item, index) => (
                        <div key={index}>
                            <Skeleton.Button active={true} block style={{height: `150px`}}/>
                        </div>
                    ))}
                </Flex>
            }

            {(!isFetching && anyInList(packages)) &&
                <>
                    <Flex vertical={true} gap={token.padding}>
                        {packages.map((pack, index) => {
                            return (
                                <Card key={index} className={cx(globalStyles.card, globalStyles.clickableCard, globalStyles.cardButton)}>
                                    <Flex vertical={true} gap={token.padding}>
                                        <Flex vertical={true} gap={token.paddingXS} onClick={() => {
                                            let route = toRoute(HomeRouteNames.PACKAGE_DETAILS, 'id', orgId);
                                            navigate(`${route}?packageId=${pack.Id}&guid=${pack.Guid}`);
                                        }}>
                                            <PublicPackageDetails pack={pack} />
                                        </Flex>
                                        <Button type={'primary'} block={true} onClick={() => {
                                            let route =toRoute(HomeRouteNames.PACKAGE_PURCHASE, 'id', orgId);
                                            navigate(`${route}?packageId=${pack.Id}&guid=${pack.Guid}`);
                                        }}>
                                            Purchase Package
                                        </Button>
                                    </Flex>

                                </Card>
                            )
                        })}
                    </Flex>
                </>
            }
        </PaddingBlock>
    )
}

export default PackageList
