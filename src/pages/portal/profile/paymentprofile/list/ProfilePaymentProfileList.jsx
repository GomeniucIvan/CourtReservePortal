import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Badge, Button, Card, Divider, Flex, Skeleton, Tag, Typography} from "antd";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useTranslation} from "react-i18next";
import {useApp} from "@/context/AppProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
const {Title, Text} = Typography;

function ProfilePaymentProfileList() {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [paymentProfiles, setPaymentProfiles] = useState([]);
    const {setHeaderRightIcons} = useHeader();
    const{isLoading, setIsFooterVisible, shouldFetch, resetFetch, setIsLoading, token, setFooterContent, globalStyles} = useApp();
    const {orgId} = useAuth();
    const {t} = useTranslation('');
    const {styles} = useStyles();
    
    const loadData = (refresh) => {
        setIsFetching(true);

        appService.get(navigate, `/app/Online/PaymentOptions/Index?id=${orgId}`).then(r => {
            if (r.IsValid){
                setPaymentProfiles(r.Data);
                setIsFetching(false);
                setIsLoading(false);
            }
        })

        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);

        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    loading={isLoading}>
                {t('paymentProfile.addPaymentProfile')}
            </Button>
        </FooterBlock>);
    }, [isFetching, isLoading]);

    const paymentProfileTemplate = (paymentProfile) => {
        return (
            <Card className={cx(globalStyles.card, globalStyles.clickableCard, styles.creditCardBlock)}
                  onClick={() => {

                  }}>
                <Flex justify={'space-between'} align={'center'}>
                    <Flex gap={token.padding / 2}>
                        <div className={styles.creditCardIcon}>

                        </div>

                        <Flex vertical={true} justify={'center'}>
                            <Title level={1} className={globalStyles.noMargin}>{paymentProfile.AccountTypeDisplay} ending with {paymentProfile.Last4Digits}</Title>
                            <Text>Added On: {paymentProfile.CreatedOnDisplay}</Text>
                        </Flex>
                    </Flex>

                    {/*<Button type="primary" icon={<DeleteOutlined/>} danger/>*/}
                </Flex>
            </Card>
        )
    }
    
    return (
        <PaddingBlock topBottom={true} leftRight={false}>
            <Flex vertical={true} gap={token.padding} style={{overflow: 'auto'}}>
                {isFetching &&
                    <>
                        {emptyArray(8).map((item, index) => (
                            <div key={index}>
                                <PaddingBlock>
                                    <Skeleton.Button active={true} block style={{height: `80px`}}/>
                                </PaddingBlock>
                            </div>
                        ))}
                    </>
                }

                {!isFetching &&
                    <>
                        {paymentProfiles.map((paymentProfile, index) => (
                            <div key={index} className={styles.paymentProfileWrapper}>
                                {toBoolean(paymentProfile.IsPaymentDeclined) &&
                                    <Badge.Ribbon text={t('paymentProfile.paymentDecline')} color={'red'} className={globalStyles.urgentRibbon}>
                                        {paymentProfileTemplate(paymentProfile)}
                                    </Badge.Ribbon>
                                }
                                {!toBoolean(paymentProfile.IsPaymentDeclined) &&
                                    <>
                                        {paymentProfileTemplate(paymentProfile)}
                                    </>
                                }
                            </div>
                        ))}
                    </>
                }
            </Flex>

        </PaddingBlock>
    )
}

export default ProfilePaymentProfileList
