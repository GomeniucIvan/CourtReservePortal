import {useEffect, useState} from "react";
import {Button, Divider, Flex, Skeleton, Tag, Typography} from 'antd';
import * as React from "react";
import {anyInList, isNullOrEmpty, nullToEmpty} from "@/utils/Utils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import ExpanderBlock from "@/components/expanderblock/ExpanderBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import apiService from "@/api/api.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useTranslation} from "react-i18next";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
const {Text, Title} = Typography;

function LoginMembershipDetails({ mainFormik, isLastStep, onNext }) {
    const [isFetching, setIsFetching] = useState(true);
    const [membership, setMembership] = useState(null);
    const {isLoading, globalStyles, token, setIsFooterVisible, setFooterContent } = useApp();
    const {setHeaderTitleKey} = useHeader();
    const {t} = useTranslation('login');

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    onClick={onNext}>
                {isLastStep ? 'Create Account' : 'Review'}
            </Button>
        </FooterBlock>);
        setHeaderTitleKey('loginMembershipDetails');
    }, [isFetching, isLoading]);

    const loadMembershipData = async () => {
        const response = await apiService.get(`/api/membership-member-portal/get-list?orgId=${nullToEmpty(mainFormik?.values?.selectedOrgId)}&membershipId=${mainFormik?.values?.selectedMembershipId}&flowName=review-and-finalize`);

        if (response.IsValid) {
            setMembership(response.MembershipsData[0]);

            let mData = response.MembershipsData[0];
            mData.AllowCreditCard = response.AllowCreditCard;
            mData.AllowECheck = response.AllowECheck;
            mData.AllowSaveCreditCardProfile = response.AllowSaveCreditCardProfile;

            //update agreements data
            mainFormik.setFieldValue('selectedMembership', mData);
        } else {
            //setError(response.Message);
        }

        setIsFetching(false);
    }

    useEffect(() => {
        loadMembershipData();
    }, [])

    return (
        <>
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
                <PaddingBlock topBottom={true}>
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

                </PaddingBlock>
            }
        </>
    )
}

export default LoginMembershipDetails
