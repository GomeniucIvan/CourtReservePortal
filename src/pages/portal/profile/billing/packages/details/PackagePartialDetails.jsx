import React, {useEffect, useRef, useState} from "react";
import {anyInList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {Divider, Flex, Skeleton, Typography} from "antd";
import {useApp} from "@/context/AppProvider.jsx";
import PackagePartialDetails from "@portal/profile/billing/packages/modules/PackagePartialDetails.jsx";
import {useLocation} from "react-router-dom";
import apiService from "@/api/api.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import ExpanderBlock from "@/components/expanderblock/ExpanderBlock.jsx";
import SVG from "@/components/svg/SVG.jsx";

const {Title, Text} = Typography

function PackageDetails({pack}) {

    const {
        globalStyles,
        token
    } = useApp();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const packageId = queryParams.get("packageId");
    const packageSaleId = queryParams.get("packageSaleId");
    const {orgId} = useAuth();
    const [modelData, setModelData] = useState(null)
    const [isFetching, setIsFetching] = useState(true);
    
    const loadData = async () => {
        setIsFetching(true);
        //todo change by selected tab
        let response = await apiService.get(`/api/member-portal/packages/my-package-punch-details-mobile?orgId=${orgId}&packageId=${packageId}&packageSaleId=${packageSaleId}`);
        if (toBoolean(response?.IsValid)) {
            setModelData(response?.Data);
        }

        setIsFetching(false);
    }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <PaddingBlock topBottom={true}>
            {isFetching && 
               <Flex vertical={true} gap={token.padding}>
                   {emptyArray(6).map((item, index) => (
                       <div key={index}>
                           <Skeleton.Button active={true} block style={{height: `${token.Input.controlHeight}px`}}/>
                       </div>
                   ))}
               </Flex>
            }
            {(!isFetching && !isNullOrEmpty(modelData)) &&
                <Flex vertical={true} gap={token.padding}>
                    <Flex vertical={true}>
                        <PackagePartialDetails pack={modelData}/>
                    </Flex>

                    {anyInList(modelData.GetUsage) &&
                        <ExpanderBlock title='Usage History'>
                            <Flex vertical={true} gap={token.paddingXS}>
                                {modelData.GetUsage?.map((usagePackage, index) => {
                                    let isLastItem = index === modelData.GetUsage.length - 1;
                                    
                                    return (
                                        <React.Fragment key={index}>
                                            <Flex justify="space-between" align={'center'}>
                                                <Flex vertical={true} gap={token.paddingXS}>
                                                    <Title level={4}>{usagePackage.Type}</Title>
                                                    <Text>{usagePackage.DateDisplay}</Text>
                                                    <Text>{usagePackage.TimeDisplay}</Text>
                                                    <Text>{usagePackage.PunchesDisplay}</Text>
                                                </Flex>
                                                <Flex gap={token.paddingXS}>
                                                    <Text>{usagePackage.PunchesDisplay}</Text>
                                                    <SVG icon={'ticket'} size={20} preventPaths={true} preventFill={true}/>
                                                </Flex>
                                            </Flex>

                                            {!isLastItem &&
                                                <Divider className={globalStyles.noMargin}/>
                                            }
                                        </React.Fragment>
                                    )
                                })}
                            </Flex>
                        </ExpanderBlock>
                    }

                    {anyInList(modelData.PackageItems) &&
                        <ExpanderBlock title='Eligible Items'>
                            <Flex vertical={true} gap={token.paddingXS}>
                                {modelData.PackageItems?.map((usagePackage, index) => {
                                    let isLastItem = index === modelData.PackageItems.length - 1;
                                    
                                    return (
                                        <React.Fragment key={index}>
                                            <Flex justify="space-between" align={'center'}>
                                                <Flex vertical={true} gap={token.paddingXS}>
                                                    <Title level={4}>{usagePackage.ItemTypeToDisplay}</Title>
                                                    {!isNullOrEmpty(usagePackage.DurationToDisplay) &&
                                                        <Text>{usagePackage.DurationToDisplay}</Text>
                                                    }
                                                    {!isNullOrEmpty(usagePackage.InstructorsToDisplay) &&
                                                        <Text>{usagePackage.InstructorsToDisplay}</Text>
                                                    }
                                                </Flex>
                                                <Flex gap={token.paddingXS}>
                                                    <Text>{usagePackage.PunchesValue}</Text>
                                                    <SVG icon={'ticket'} size={20} preventPaths={true} preventFill={true}/>
                                                </Flex>
                                            </Flex>

                                            {!isLastItem &&
                                                <Divider className={globalStyles.noMargin}/>
                                            }
                                        </React.Fragment>
                                    )
                                })}
                            </Flex>
                        </ExpanderBlock>
                    }
                </Flex>
            }
        </PaddingBlock>
    )
}

export default PackageDetails