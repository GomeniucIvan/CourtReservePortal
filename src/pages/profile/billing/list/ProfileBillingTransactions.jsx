import {selectedTabStorage, setTabStorage, toLocalStorage} from "../../../../storage/AppStorage.jsx";
import {Badge, Button, Empty, Flex, Segmented, Skeleton, Space, Tabs, Tag, Typography} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useApp} from "../../../../context/AppProvider.jsx";
import {useStyles} from "../styles.jsx";
import {cx} from "antd-style";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../../utils/Utils.jsx";
const {Title, Text} = Typography;
import mockData from "../../../../mocks/personal-data.json";
import {Card, Ellipsis} from "antd-mobile";
import CardIconLabel from "../../../../components/cardiconlabel/CardIconLabel.jsx";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
import DrawerBottom from "../../../../components/drawer/DrawerBottom.jsx";
import {FilterOutlined} from "@ant-design/icons";
import appService, {apiRoutes} from "../../../../api/app.jsx";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import {emptyArray} from "../../../../utils/ListUtils.jsx";
import {parseSafeInt} from "../../../../utils/NumberUtils.jsx";
import {costDisplay} from "../../../../utils/CostUtils.jsx";

function ProfileBillingTransactions({selectedTab, tabsHeight}) {
    const {token, globalStyles, availableHeight, isMockData, setIsFooterVisible, setHeaderRightIcons, setFooterContent} = useApp();
    const {orgId} = useAuth();

    const [selectedSegmentTab, setSelectedSegmentTab] = useState(selectedTabStorage('billing_transaction', 'Unpaid'));
    const {styles} = useStyles();
    const [unpaidFees, setUnpaidFees] = useState(null);
    const [paidFees, setPaidFees] = useState(null);
    const [paymentsFees, setPaymentsFees] = useState(null);
    const [adjustmentsFees, setAdjustmentsFees] = useState(null);
    const [allFees, setAllFees] = useState(null);
    const headerRef = useRef();
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    const [selectedDrawerFee, setSelectedDrawerFee] = useState(null);
    const [isFilterOpened, setIsFilterOpened] = useState(false);
    const [transactionHeaderData, setTransactionHeaderData] = useState(null);

    useEffect(() => {
        const loadTransactionData = async () => {
            if (isNullOrEmpty(transactionHeaderData)){
                let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/Details?id=${orgId}`);
                if (toBoolean(response?.IsValid)){
                    let respData = response.Data;

                    let balance = toBoolean(respData.MemberFamilyId) ?
                        parseSafeInt(respData.FamilyBalance)  :
                        parseSafeInt(respData.MemberBalance);
                    let credit = null;
                    let paymentTitle = `Balance`;

                    if (!isNullOrEmpty(respData?.BalanceData)){
                        balance = respData.BalanceData?.Balance;
                        credit = respData.BalanceData?.Credit;
                    }

                    if (!isNullOrEmpty(respData?.BalanceData)){
                        if (toBoolean(respData.ExcludeFutureBookingsFromMemberBalance)){
                            paymentTitle = `Current Balance`;
                        } else {
                            paymentTitle = `Balance`;
                        }
                    }

                    setTransactionHeaderData({
                        Balance: balance,
                        Credit: credit,
                        PaymentTitle: paymentTitle,
                        ShowPay: toBoolean(respData.MemberFamilyId) ?
                            (toBoolean(respData.AllowPayOnline) && parseSafeInt(respData.FamilyBalance)  < 0) :
                            (toBoolean(respData.AllowPayOnline) && parseSafeInt(respData.MemberBalance) < 0)
                    });
                }
            }
        }

        loadTransactionData();
    }, []);

    const fixHeaderItems = () => {
        if (headerRef.current) {
            setBodyHeight(availableHeight - headerRef.current.offsetHeight - tabsHeight);
        } else{
            //setBodyHeight(availableHeight - tabsHeight);
        }
    }

    const loadData = async () => {
        if (isMockData){
            const fees = mockData.profile_transactions_unpaid;
            setUnpaidFees(fees);
        } else{
            if (isNullOrEmpty(unpaidFees) && equalString(selectedSegmentTab, 'Unpaid')){
                let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetUnPaidTransactions?id=${orgId}`);
                if (isNullOrEmpty(response?.Errors)){
                    setUnpaidFees(response.Data);
                }
            }
            if (isNullOrEmpty(paidFees) && equalString(selectedSegmentTab, 'Paid')){
                let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetPaidTransactions?id=${orgId}`);
                if (isNullOrEmpty(response?.Errors)){
                    setPaidFees(response.Data);
                }
            }
            if (isNullOrEmpty(paymentsFees) && equalString(selectedSegmentTab, 'Payments')){
                let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetPayments?id=${orgId}`);
                if (isNullOrEmpty(response?.Errors)){
                    setPaymentsFees(response.Data);
                }
            }
            if (isNullOrEmpty(adjustmentsFees) && equalString(selectedSegmentTab, 'Adjustments')){
                let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetBalanceAdjustments?id=${orgId}`);
                if (isNullOrEmpty(response?.Errors)){
                    setAdjustmentsFees(response.Data);
                }
            }
            if (isNullOrEmpty(allFees) && equalString(selectedSegmentTab, 'All')){
                let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetAllTransactions?id=${orgId}`);
                if (isNullOrEmpty(response?.Errors)){
                    setAllFees(response.Data);
                }
            }
        }
    }

    useEffect(() => {
        loadData();
    }, [selectedSegmentTab]);

    useEffect(() => {
        if (equalString(selectedTab, 'transactions')){
            setIsFooterVisible(true);
            setHeaderRightIcons(
                <Space className={globalStyles.headerRightActions}>
                    <Button type="default"
                            icon={<FilterOutlined/>}
                            size={'medium'}
                            onClick={() => setIsFilterOpened(true)}/>
                </Space>
            )
            setFooterContent('')
        }
    }, [selectedTab]);

    useEffect(() => {
        fixHeaderItems();
    }, [headerRef, availableHeight, tabsHeight]);

    let isDataLoading = () => {
        if (equalString(selectedSegmentTab, 'unpaid') && isNullOrEmpty(unpaidFees))
            return true;
        if (equalString(selectedSegmentTab, 'Paid') && isNullOrEmpty(paidFees))
            return true;
        if (equalString(selectedSegmentTab, 'Payments') && isNullOrEmpty(paymentsFees))
            return true;
        if (equalString(selectedSegmentTab, 'Adjustments') && isNullOrEmpty(adjustmentsFees))
            return true;
        if (equalString(selectedSegmentTab, 'All') && isNullOrEmpty(allFees))
            return true;

        return false;
    }

    const displayItems = (items, selectedSegmentTab) => {
        if (!anyInList(items)){
            return (
                <Empty />
            )
        }

        return (
            <PaddingBlock topBottom={true}>
                <Flex vertical={true} gap={token.padding}>
                    {items.map((fee, index) => {
                        return (
                            <div key={index}>
                                <Badge.Ribbon text={equalString(selectedSegmentTab, 'unpaid') ? 'Unpaid' : ''}
                                              color={'orange'} className={globalStyles.urgentRibbon}>
                                    <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                                          onClick={() => {
                                              setSelectedDrawerFee(fee);
                                          }}>

                                        {!isNullOrEmpty(fee.ReservationType) &&
                                            <Title level={5}
                                                   className={cx(globalStyles.cardItemTitle, globalStyles.urgentcardItemTitle, globalStyles.noBottomPadding)}>
                                                <Ellipsis direction='end' content={fee.ReservationType}/>
                                            </Title>
                                        }

                                        <CardIconLabel icon={'calendar-time'} description={fee.FeeDateTimeDisplay}/>
                                        <CardIconLabel icon={'team'} description={fee.MemberDisplay}/>
                                        <CardIconLabel icon={'money'} description={fee.UnpaidAmountDisplay}/>
                                    </Card>
                                </Badge.Ribbon>
                            </div>
                        )
                    })}
                </Flex>
            </PaddingBlock>
        )
    }

    return (
        <>
            <div ref={headerRef}>
                {isNullOrEmpty(transactionHeaderData) ?
                    (<PaddingBlock onlyBottom={true}>
                            <Skeleton.Input active={true} block style={{height: '46px'}}/>
                        </PaddingBlock>
                    ) :
                    (<PaddingBlock onlyBottom={true}>
                        <Flex justify={'space-between'} align={'center'}>
                            {isNullOrEmpty(transactionHeaderData?.Credit) ?
                                (
                                <Flex vertical={true}>
                                    <Title level={5} className={cx(globalStyles.noSpace)}>{transactionHeaderData.PaymentTitle}</Title>
                                    <Text>{costDisplay(transactionHeaderData.Balance, true)}</Text>
                                </Flex>
                            ) : (
                                    <Flex vertical={true}>
                                        <Flex gap={token.paddingSM}>
                                            <Title level={5} className={cx(globalStyles.noSpace)}>Balance</Title>
                                            <Text>{costDisplay(transactionHeaderData.Balance, true)}</Text>
                                        </Flex>
                                        <Flex gap={token.paddingSM}>
                                            <Title level={5} className={cx(globalStyles.noSpace)}>Credit</Title>
                                            <Text>{costDisplay(transactionHeaderData.Credit, true)}</Text>
                                        </Flex>
                                    </Flex>
                                )
                            }
                            {toBoolean(transactionHeaderData.ShowPay) &&
                                <Button size={'small'} type={'primary'} className={globalStyles.stickyButton}>
                                    Pay All
                                </Button>
                            }
                        </Flex>
                    </PaddingBlock>)}

                <Segmented
                    rootClassName={styles.transactionSegment}
                    options={['Unpaid', 'Paid', 'Payments', 'Adjustments', 'All']}
                    defaultValue={isNullOrEmpty(selectedSegmentTab) ? 'unpaid' : selectedSegmentTab}
                    onChange={(e) => {
                        setTabStorage('billing_transaction', e, setSelectedSegmentTab)
                    }}
                    block
                    style={{margin: `${token.padding}px`, marginBottom: 0}}/>
            </div>

            <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
                {isDataLoading() &&
                    <PaddingBlock topBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            {emptyArray(5).map((innerItem, innerIndex) => (
                                <Skeleton.Input key={innerIndex}  active={true} block style={{height: '137px'}}/>
                            ))}
                        </Flex>
                    </PaddingBlock>
                }

                {(!isNullOrEmpty(unpaidFees) && equalString(selectedSegmentTab, 'unpaid')) &&
                    <>
                        {displayItems(unpaidFees, selectedSegmentTab)}
                    </>
                }
                {(!isNullOrEmpty(paidFees) && equalString(selectedSegmentTab, 'paid')) &&
                    <>
                        {displayItems(paidFees, selectedSegmentTab)}
                    </>
                }
                {(!isNullOrEmpty(paymentsFees) && equalString(selectedSegmentTab, 'payments')) &&
                    <>
                        {displayItems(paymentsFees, selectedSegmentTab)}
                    </>
                }
                {(!isNullOrEmpty(adjustmentsFees) && equalString(selectedSegmentTab, 'adjustments')) &&
                    <>
                        {displayItems(adjustmentsFees, selectedSegmentTab)}
                    </>
                }
                {(!isNullOrEmpty(allFees) && equalString(selectedSegmentTab, 'all')) &&
                    <>
                        {displayItems(allFees, selectedSegmentTab)}
                    </>
                }
            </div>

            <DrawerBottom
                showDrawer={!isNullOrEmpty(selectedDrawerFee)}
                closeDrawer={() => {setSelectedDrawerFee(null)}}
                label={selectedDrawerFee?.ReservationType}
                showButton={true}
                confirmButtonText={'Pay'}
                onConfirmButtonClick={() => {

                }}
            >
                <Text>Fee details</Text>
            </DrawerBottom>

            <DrawerBottom
                showDrawer={isFilterOpened}
                closeDrawer={() => {setIsFilterOpened(false)}}
                label={'Filter'}
                showButton={true}
                confirmButtonText={'Filter'}
                onConfirmButtonClick={() => {
                    setIsFilterOpened(false);
                }}
            >
                <Text>Transaction filter</Text>
            </DrawerBottom>
        </>
    )
}

export default ProfileBillingTransactions
