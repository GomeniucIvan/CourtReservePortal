import {Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import React from "react";
import {anyInList, isNullOrEmpty} from "@/utils/Utils.jsx";
import ExpanderBlock from "@/components/expanderblock/ExpanderBlock.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {useApp} from "@/context/AppProvider.jsx";

const {Title, Text}  = Typography ;

function PublicPackageEligibleItems({pack, page}) {

    const { token } = useApp();
    
    return (
        <>
            {anyInList(pack?.EligibleItems) &&
                <ExpanderBlock title='Eligible Items'>
                    <Flex vertical={true} gap={token.paddingXS}>
                        {pack.EligibleItems?.map((usagePackage, index) => {
                            let isLastItem = index === pack.EligibleItems.length - 1;

                            return (
                                <React.Fragment key={index}>
                                    <Flex justify="space-between" align={'center'}>
                                        <Flex vertical={true} gap={token.paddingXS}>
                                            <Title level={4}>{usagePackage.ItemTypeToDisplay}</Title>
                                            {!isNullOrEmpty(usagePackage.EligibleType) &&
                                                <Text>{usagePackage.EligibleType}</Text>
                                            }
                                            {!isNullOrEmpty(usagePackage.PackageDetailsDisplay) &&
                                                <Text>{usagePackage.PackageDetailsDisplay}</Text>
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
        </>
    )
}

export default PublicPackageEligibleItems
