import {useFormik} from 'formik';
import {useApp} from "@/context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import {Button, Descriptions, Divider, Empty, Flex, Input, Skeleton, Tag, Typography} from 'antd';
import {anyInList, isNullOrEmpty, moreThanOneInList, nullToEmpty, toBoolean} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import apiService from "@/api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {cx} from "antd-style";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {Card} from "antd-mobile";
import {useStyles} from "./../styles.jsx";
import * as React from "react";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import LoginCreateAccountReviewModal from "./Login.CreateAccountReviewModal.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";

const {Text, Title, Link} = Typography;

function LoginMemberships({ mainFormik, onMembershipSelect, onSkip }) {
    const {setHeaderTitleKey} = useHeader();
    const {setIsLoading, globalStyles, token, setIsFooterVisible, setFooterContent } = useApp();
    const {spGuideId} = useAuth();
    const {t} = useTranslation('login');
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [memberships, setMemberships] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(null);

    useEffect(() => {
        setIsFooterVisible(false);
        setFooterContent('');
        setHeaderTitleKey('loginMembership');
    }, []);
    
    const { styles } = useStyles();

    useEffect(() => {
        loadMemberships();
    }, []);

    const loadMemberships = async () => {
        if (isNullOrEmpty(memberships)) {
            setIsFetching(true);
            setIsLoading(true);
            const response = await apiService.get(`/api/membership-member-portal/get-list?orgId=${nullToEmpty(mainFormik?.values?.selectedOrgId)}&spGuideId=${nullToEmpty(spGuideId)}&checkHasWaiverToSign=true&flowName=mobile-create-account`);

            if (response.IsValid) {
                setMemberships(response.MembershipsData);
            }

            setIsFetching(false);
            setIsLoading(false);
        }
    }

    const validationSchema = Yup.object({
       
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            let costType = values.selectedMembership;

            onSkip(values);
            
            // if (costType && costType.OneFreePaymentOption && toBoolean(skipReview)) {
            //     formik.setFieldValue('selectedMembershipId', costType.CostTypeId)
            //     formik.setFieldValue('reviewModalTitle', `You are going to join the <b>${getMembershipText(costType?.Name)}</b> and create an account. Review the information provided and confirm before creating your account.` )
            //     setShowReviewModal(true);
            // } else {
            //    
            // }
        },
    });

    const princingOptionModalHtml = (membership, onClose) => {
        
        
        return(
            <Flex vertical={true} gap={24}>
                <Flex vertical={true} gap={12}>
                    {!isNullOrEmpty(membership.Name) && 
                        <Text style={{color: token.colorSecondary}}>{membership.Name}</Text>
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
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(2).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button active={true} block style={{height: `180px`}}/>
                            </div>
                        ))}
                    </Flex>
                </>
            }

            {!isFetching &&
                <>
                    {!anyInList(memberships) ? (
                        <Empty />
                    ) : (
                        <Flex vertical={true} gap={token.padding}>
                            {memberships.map((membership, index) => {
                                return (
                                    <Card key={index}
                                          className={cx(globalStyles.card,
                                              globalStyles.noPadding,
                                              styles.membershipCard)}>

                                        <PaddingBlock topBottom={true}>
                                            <Flex vertical={true} gap={token.paddingLG}>
                                                <Flex vertical={true} gap={token.paddingLG}>
                                                    {anyInList(membership?.Badges) &&
                                                        <Flex gap="4px 0" wrap>
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
                                                                    html: (onClose) => princingOptionModalHtml(membership, onClose),
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
                                )
                            })}
                        </Flex>
                    )}
                </>
            }

            <LoginCreateAccountReviewModal formik={formik} show={showReviewModal} setShow={setShowReviewModal}/>
        </PaddingBlock>
    )
}

export default LoginMemberships
