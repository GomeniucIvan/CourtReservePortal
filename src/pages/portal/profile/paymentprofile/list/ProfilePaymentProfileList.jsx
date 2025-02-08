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
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import FormTextarea from "@/form/formtextarea/FormTextArea.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
const {Title, Text} = Typography;

function ProfilePaymentProfileList() {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [paymentProfiles, setPaymentProfiles] = useState([]);
    const {setHeaderRightIcons} = useHeader();
    const {isLoading, setIsFooterVisible, shouldFetch, resetFetch, setIsLoading, token, setFooterContent, globalStyles} = useApp();
    const [selectedPaymentProfile, setSelectedPaymentProfile] = useState(null);
    const {orgId} = useAuth();
    const {t} = useTranslation('');
    const {styles} = useStyles();

    const loadData = async (refresh) => {
        setIsFetching(true);

        let response = await appService.get(navigate, `/app/Online/PaymentOptions/Index?id=${orgId}`);

        if (response.IsValid){
            setPaymentProfiles(response.Data);
        }
        setIsLoading(false);
        setIsFetching(false);
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
                    onClick={() => {
                        let route = toRoute(ProfileRouteNames.PROFILE_CREATE_PAYMENT_PROFILE, 'id', orgId);
                        navigate(route)
                    }}
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
                      setSelectedPaymentProfile(paymentProfile);
                  }}>
                <Flex justify={'space-between'} align={'center'}>
                    <Flex gap={token.padding / 2}>
                        <div className={styles.creditCardIcon}>

                        </div>

                        <Flex vertical={true} justify={'center'}>
                            <Title level={3} className={globalStyles.noMargin}>{paymentProfile.AccountTypeDisplay} ending with {paymentProfile.Last4Digits}</Title>
                            <Text>Added On: {paymentProfile.CreatedOnDisplay}</Text>
                        </Flex>
                    </Flex>

                    {/*<Button type="primary" icon={<DeleteOutlined/>} danger/>*/}
                </Flex>
            </Card>
        )
    }

    const deleteMemberProfilePost = async (selectedProfile) => {
        setIsFetching(true);
        let response = await appService.post(`/app/Online/PaymentOptions/DeleteProfile?id=${orgId}&profileId=${selectedProfile.Id}`);

        if (response.IsValid) {
            pNotify(`${selectedProfile.AccountTypeDisplay} successfully deleted.`);
            loadData();
        } else {
            displayMessageModal({
                title: "Error",
                html: (onClose) => response?.Message,
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {},
            })
            setIsLoading(false);
            setIsFetching(true);
        }
    }
    
    const deleteMemberProfile = (selectedProfile) => {
        displayMessageModal({
            title: `${selectedProfile.AccountTypeDisplay} Delete`,
            html: (onClose) => <Flex vertical={true} gap={token.padding * 2}>
                <Text>{`You are about to delete ${selectedProfile.AccountTypeDisplay}. Confirm ${selectedProfile.AccountTypeDisplay} deletion.`}</Text>

                <Flex vertical={true} gap={token.padding}>
                    <Button block={true} onClick={() => {
                        onClose();
                    }}>
                        Cancel
                    </Button>

                    <Button block={true} type={'primary'} danger={true} onClick={() => {
                        setSelectedPaymentProfile(null);
                        deleteMemberProfilePost(selectedProfile);
                        onClose();
                    }}>
                        Delete
                    </Button>
                </Flex>
            </Flex>,
            type: "warning",
            onClose: () => {},
        })
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

            <DrawerBottom showDrawer={selectedPaymentProfile}
                          closeDrawer={() => setSelectedPaymentProfile(null)}
                          showButton={true}
                          customFooter={<Flex gap={token.padding}>
                              <Button block onClick={() => {setSelectedPaymentProfile(null)}}>
                                  Close
                              </Button>

                              <Button type={'primary'} danger={true} block onClick={() => {
                                  deleteMemberProfile(selectedPaymentProfile)
                              }}>
                                  Delete
                              </Button>
                          </Flex>}
                          label={`${selectedPaymentProfile?.AccountTypeDisplay} Details`}>
                <PaddingBlock>
                    <Flex vertical={true} gap={token.padding}>
                        <FormInputDisplay value={selectedPaymentProfile?.CreatedByFullName} label={'Created By'} />
                        <FormInputDisplay value={selectedPaymentProfile?.CreatedOnDisplay} label={'Created On'} />
                        <FormInputDisplay value={selectedPaymentProfile?.AccountTypeDisplay} label={'Type'} />
                        <FormInputDisplay value={selectedPaymentProfile?.Last4Digits} label={'Last 4 Digits'} />
                    </Flex>
                </PaddingBlock>
            </DrawerBottom>

        </PaddingBlock>
    )
}

export default ProfilePaymentProfileList
