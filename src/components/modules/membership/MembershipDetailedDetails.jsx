import {Button, Divider, Flex, Tag, theme, Typography} from "antd";
import {useApp} from "@/context/AppProvider.jsx";
import {useStyles} from "./../styles.jsx";
import {anyInList, isNullOrEmpty, moreThanOneInList} from "@/utils/Utils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import * as React from "react";
import ExpanderBlock from "@/components/expanderblock/ExpanderBlock.jsx";
const {Text,Title} = Typography;

const MembershipDetailedDetails = ({membership}) => {
    const {globalStyles, token} = useApp();
    const { styles } = useStyles();

    return (
        <>
            <Flex vertical={true} gap={token.padding}>
                <Flex vertical={true} gap={token.paddingLG}>
                    {anyInList(membership?.Badges) &&
                        <Flex gap={4}>
                            {membership.Badges.map((badge, index) => {
                                return (
                                    <Tag key={index}
                                         className={globalStyles.tag}
                                         style={{
                                             backgroundColor: badge.BackgroundColor,
                                             borderColor: badge.BackgroundColor,
                                             color: badge.TextColor }}>
                                        {badge.BadgeName}
                                    </Tag>
                                )
                            })}
                        </Flex>
                    }

                    <Flex vertical={true} gap={token.paddingXS}>
                        <Title level={3}>{membership?.Name}</Title>
                        {!isNullOrEmpty(membership?.EffectiveDatesDisplay) &&
                            <Text className={token.colorTextSecondary}>{membership?.EffectiveDatesDisplay}</Text>
                        }
                    </Flex>
                </Flex>

                <Divider className={globalStyles.noMargin} />

                <Flex vertical={true} gap={token.paddingSM}>
                    <Title level={4}>Pricing Option(s)</Title>

                    <Flex vertical={true} gap={token.paddingXS}>
                        {!isNullOrEmpty(membership?.InitiationFeePriceDisplay) &&
                            <Text>{membership?.InitiationFeePriceDisplay} Initiation Fee</Text>
                        }

                        {anyInList(membership?.Prices) ?
                            (<>
                                {membership?.Prices.map((price, index) => {
                                    return (
                                        <Flex key={index} gap={4} align={'center'}>
                                            <Flex align={'end'}>
                                                <Title level={1}>{price?.PriceDisplay}</Title>
                                                <Text>{' '} / {price?.FrequencyDisplay}</Text>
                                            </Flex>
                                        </Flex>
                                    )
                                })}
                            </>) : (<Title level={1}>Free</Title>)
                        }
                    </Flex>
                </Flex>

                {((!isNullOrEmpty(membership?.Description) || anyInList(membership?.Features)) || anyInList(membership?.AdditionalFeatures))&&
                    <Divider className={globalStyles.noMargin} />
                }

                {(!isNullOrEmpty(membership?.Description) || anyInList(membership?.Features)) &&
                    <Flex vertical={true} gap={token.paddingSM}>
                        <Title level={4}>General</Title>

                        <Flex vertical={true} gap={token.paddingLG}>
                            {!isNullOrEmpty(membership?.Description) &&
                                <Text>
                                    {membership?.Description}
                                </Text>
                            }

                            {anyInList(membership?.Features) && (
                                <Flex vertical={true} gap={token.paddingSM}>
                                    {membership.Features?.map((feature, index) => (
                                        <Flex key={index} gap={8} align={'center'}>
                                            <SVG icon="circle-check-regular" size={16} replaceColor={true} />
                                            <span>{feature.FeatureDescription}</span>
                                        </Flex>
                                    ))}
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                }

                {anyInList(membership?.AdditionalFeatures) &&
                    <ExpanderBlock title='Additional Benefits'>
                        <Flex vertical={true} gap={token.paddingSM}>
                            {membership.AdditionalFeatures?.map((feature, index) => (
                                <Flex key={index} gap={8} align={'center'}>
                                    <SVG icon="circle-check-regular" size={16} replaceColor={true} />
                                    <span>{feature.FeatureDescription}</span>
                                </Flex>
                            ))}
                        </Flex>
                    </ExpanderBlock>
                }
            </Flex>
        </>
    )
}

export default MembershipDetailedDetails;
