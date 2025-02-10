import {Button, Divider, Flex, Tag, theme, Typography} from "antd";
import { cx } from 'antd-style';
import {Card, Ellipsis} from "antd-mobile";
import {useApp} from "@/context/AppProvider.jsx";
import {useStyles} from "./../styles.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {anyInList, isNullOrEmpty, moreThanOneInList} from "@/utils/Utils.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import SVG from "@/components/svg/SVG.jsx";
import * as React from "react";
const {Text,Title} = Typography;

const MembershipCard = ({membership, onMembershipSelect}) => {
    const {globalStyles, token} = useApp();
    const { styles } = useStyles();

    const pricingOptionModalHtml = (membership, onClose) => {
        return(
            <Flex vertical={true} gap={24}>
                <Flex vertical={true} gap={12}>
                    {!isNullOrEmpty(membership.Name) &&
                        <Text style={{color: token.colorSecondary}}>{membership?.Name}</Text>
                    }

                    {!isNullOrEmpty(membership?.InitiationFeePriceDisplay) &&
                        <Text level={3}>{membership?.InitiationFeePriceDisplay} Initiation Fee</Text>
                    }

                    {anyInList(membership?.Prices) &&
                        <>
                            {membership?.Prices.map((price, index) => {
                                return (
                                    <Flex key={index}>
                                        <Title level={3}>{price.PriceDisplay}{' '}</Title>
                                        <Text>/ {price.FrequencyDisplay}</Text>
                                    </Flex>
                                )
                            })}
                        </>
                    }
                </Flex>
                <Flex vertical={true} gap={8}>
                    <Button type='primary'
                            block={true}
                            onClick={() => {
                                onMembershipSelect(membership);
                                onClose();
                            }}>
                        {membership.ButtonName}
                    </Button>

                    <Button block={true} onClick={onClose}>
                        Close
                    </Button>
                </Flex>
            </Flex>
        )
    }
    
    return (
        <>
            <Card
                className={cx(globalStyles.card,
                    globalStyles.noPadding,
                    styles.membershipCard)}>

                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.paddingLG}>
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

                        {anyInList(membership?.Prices) ?
                            (<Flex gap={4} align={'end'}>
                                <Title level={1}>{membership?.Prices?.[0]?.PriceDisplay}</Title>
                                <Text>{' '} / {membership?.Prices?.[0]?.FrequencyDisplay}</Text>
                            </Flex>) : (<Title level={1}>Free</Title>)
                        }

                        {moreThanOneInList(membership?.Prices) &&
                            <>
                                <Button color="default"
                                        onClick={() => {displayMessageModal({
                                            title: "Pricing Option(s)",
                                            html: (onClose) => pricingOptionModalHtml(membership, onClose),
                                            onClose: () => {},
                                        })}}
                                        className={styles.pricingButton}
                                        variant="filled">
                                    +{membership?.Prices?.length - 1} Pricing Option(s)
                                </Button>
                            </>
                        }

                        {(!isNullOrEmpty(membership?.Description) || anyInList(membership?.Features)) &&
                            <>
                                <Divider className={globalStyles.noMargin} />

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
                            </>
                        }

                        <Button type='primary'
                                block={true}
                                onClick={() => {
                                    onMembershipSelect(membership)
                                }}>
                            {membership.ButtonName}
                        </Button>
                    </Flex>
                </PaddingBlock>
            </Card>
        </>
    )
}

export default MembershipCard;
