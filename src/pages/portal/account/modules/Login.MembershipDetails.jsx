import {useEffect, useState} from "react";
import {Flex, Skeleton, Tag, Typography} from 'antd';
import * as React from "react";
import {anyInList, isNullOrEmpty} from "@/utils/Utils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import ExpanderBlock from "@/components/expanderblock/ExpanderBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import apiService from "@/api/api.jsx";
const {Text, Title} = Typography;

function LoginMembershipDetails({ mainFormik }) {
const [isFetching, setIsFetching] = useState(true);
const [membership, setMembership] = useState(null);
    const {token, globalStyles} = useApp();

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
                <div>
                    <div>
                        <div>
                            {anyInList(membership?.Badges) &&
                                <Flex gap="4px 0" wrap>
                                    {membership.Badges.map((badge, index) => {
                                        return (
                                            <Tag key={index}
                                                 className={globalStyles.tag}
                                                 style={{
                                                     backgroundColor: badge.BackgroundColor,
                                                     borderColor: badge.BackgroundColor,
                                                     color: badge.TextColor
                                                 }}>{badge.BadgeName}</Tag>
                                        )
                                    })}
                                </Flex>
                            }

                            <Flex vertical={true} gap={4}>
                                <Text>{membership?.Name}</Text>
                                <Text className={token.colorTextSecondary}>{membership?.EffectiveDatesDisplay}</Text>
                            </Flex>
                        </div>
                    </div>

                    {(!isNullOrEmpty(membership?.Description) || anyInList(membership?.Features)) &&
                        <div>
                            <div>
                                General
                            </div>

                            <Flex vertical={true} gap={12}>
                                {!isNullOrEmpty(membership?.Description) &&
                                    <div>
                                        {membership?.Description}
                                    </div>
                                }

                                {anyInList(membership?.Features) && (
                                    <Flex vertical={true} gap={8}>
                                        {membership.Features?.map((feature, index) => (
                                            <Flex key={index} gap={12}>
                                                <SVG icon="checked-icon" size={16} replaceColor={true}/>
                                                <span>{feature.FeatureDescription}</span>
                                            </Flex>
                                        ))}
                                    </Flex>
                                )}
                            </Flex>
                        </div>
                    }

                    {anyInList(membership?.AdditionalFeatures) &&
                        <ExpanderBlock title='Additional Benefits'>
                            <Flex vertical={true} gap={12}>
                                {anyInList(membership?.AdditionalFeatures) && (
                                    <Flex vertical={true} gap={8}>
                                        {membership.AdditionalFeatures?.map((feature, index) => (
                                            <Flex key={index} gap={12}>
                                                <SVG icon="checked-icon" size={16} replaceColor={true}/>
                                                <span>{feature.FeatureDescription}</span>
                                            </Flex>
                                        ))}
                                    </Flex>
                                )}
                            </Flex>
                        </ExpanderBlock>
                    }

                    <div>
                        <div>
                            Pricing Option(s)
                        </div>

                        {!isNullOrEmpty(membership?.InitiationFeePriceDisplay) &&
                            <Text>{membership?.InitiationFeePriceDisplay} Initiation Fee</Text>
                        }

                        {anyInList(membership?.Prices) ? (
                            <>
                                {membership?.Prices.map((price, index) => {
                                    return (
                                        <Flex key={index} gap={5} align={'center'}>
                                            <Title level={1}>{price?.PriceDisplay}</Title>
                                            <Text>{' '} / {price?.FrequencyDisplay}</Text>
                                        </Flex>
                                    )
                                })}
                            </>
                        ) : (
                            <Text level={1}>Free</Text>
                        )}
                    </div>
                </div>
            }
        </>
    )
}

export default LoginMembershipDetails
