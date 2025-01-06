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
import {ProfileRouteNames} from "../../../../routes/ProfileRoutes.jsx";
import {useNavigate} from "react-router-dom";
import SGV from "../../../../components/svg/SVG.jsx";
import FormInputsDateInterval from "../../../../form/input/FormInputsDateInterval.jsx";
import useCustomFormik from "../../../../components/formik/CustomFormik.jsx";
import {validatePersonalInformation} from "../../../../utils/ValidationUtils.jsx";
import {pNotify} from "../../../../components/notification/PNotify.jsx";
import {subtractDateDays} from "../../../../utils/DateUtils.jsx";
import FormInputDisplay from "../../../../form/input/FormInputDisplay.jsx";

function ProfileBillingTransactions({selectedTab, tabsHeight}) {
    const {token, globalStyles, availableHeight, isMockData, setIsFooterVisible, setHeaderRightIcons, setFooterContent} = useApp();
    const {orgId} = useAuth();
    const navigate = useNavigate();
    
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

    const initialValues = {
        PaidStartDate: '',
        PaidEndDate: '',
        PaymentsStartDate: '',
        PaymentsEndDate: '',
        AdjustmentsStartDate: '',
        AdjustmentsEndDate: '',
        AllStartDate: '',
        AllEndDate: '',
        CurrentDate: '',
    }

    const formik = useCustomFormik({
        initialValues: initialValues,
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        },
    });
    
    useEffect(() => {
        const loadTransactionData = async () => {
            if (isNullOrEmpty(transactionHeaderData)){
                let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalance/Details?id=${orgId}`);
                
                if (toBoolean(response?.IsValid)){
                    let respData = response.Data;

                    formik.setValues({
                        PaidStartDate: subtractDateDays(respData.CurrentDateString, 30),
                        PaidEndDate: respData.CurrentDateString,
                        PaymentsStartDate: subtractDateDays(respData.CurrentDateString, 30),
                        PaymentsEndDate: respData.CurrentDateString,
                        AdjustmentsStartDate: subtractDateDays(respData.CurrentDateString, 30),
                        AdjustmentsEndDate: respData.CurrentDateString,
                        AllStartDate: subtractDateDays(respData.CurrentDateString, 30),
                        AllEndDate: respData.CurrentDateString,
                        CurrentDate: respData.CurrentDateString,
                    })
                    
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
            setBodyHeight(availableHeight - headerRef.current.offsetHeight - tabsHeight - token.padding);
        } else{
            //setBodyHeight(availableHeight - tabsHeight);
        }
    }

    const loadData = async (isFilterChange) => {
        if ((isNullOrEmpty(unpaidFees) || isFilterChange) && equalString(selectedSegmentTab, 'Unpaid')){
            setUnpaidFees(null);
            let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetUnPaidTransactions?id=${orgId}`);

            if (toBoolean(response?.IsValid)) {
                setUnpaidFees(response.Data);
            } else{
                setUnpaidFees([]);
            }
        }
        if ((isNullOrEmpty(paidFees) || isFilterChange) && equalString(selectedSegmentTab, 'Paid')){
            setPaidFees(null);
            let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetPaidTransactions?id=${orgId}&startDate=${formik.values?.PaidStartDate}&endDate=${formik.values?.PaidEndDate}`);
            if (toBoolean(response?.IsValid)) {
                setPaidFees(response.Data);
            } else{
                setPaidFees([]);
            }
        }
        if ((isNullOrEmpty(paymentsFees) || isFilterChange) && equalString(selectedSegmentTab, 'Payments')){
            setPaymentsFees(null);
            let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetPayments?id=${orgId}&startDate=${formik.values?.PaymentsStartDate}&endDate=${formik.values?.PaymentsEndDate}`);
            if (toBoolean(response?.IsValid)) {
                setPaymentsFees(response.Data);
            } else{
                setPaymentsFees([]);
            }
        }
        if ((isNullOrEmpty(adjustmentsFees) || isFilterChange) && equalString(selectedSegmentTab, 'Adjustments')){
            setAdjustmentsFees(null);
            
            let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetBalanceAdjustments?id=${orgId}&startDate=${formik.values?.AdjustmentsStartDate}&endDate=${formik.values?.AdjustmentsEndDate}`);
            if (toBoolean(response?.IsValid)) {
                setAdjustmentsFees(response.Data);
            } else{
                setAdjustmentsFees([]);
            }
        }
        if ((isNullOrEmpty(allFees) || isFilterChange) && equalString(selectedSegmentTab, 'All')){
            setAllFees(null);
            let response = await appService.getRoute(apiRoutes.MemberTransactionsUrl, `/app/Online/MyBalanceApi/GetAllTransactions?id=${orgId}&startDate=${formik.values?.AllStartDate}&endDate=${formik.values?.AllEndDate}`);
            if (toBoolean(response?.IsValid)) {
                setAllFees(response.Data);
            } else{
                setAllFees([]);
            }
        }
    }

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.CurrentDate) && !isFilterOpened) {
            loadData();
        }
    }, [selectedSegmentTab, formik?.values]);

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.CurrentDate) && !isFilterOpened) {
            loadData(true);
        }
    }, [isFilterOpened]);
    
    useEffect(() => {
        if (equalString(selectedTab, 'transactions')){
            setIsFooterVisible(true);
            if (equalString(selectedSegmentTab, 'paid') ||
                equalString(selectedSegmentTab, 'payments') ||
                equalString(selectedSegmentTab, 'adjustments') ||
                equalString(selectedSegmentTab, 'all')) {
                setHeaderRightIcons(
                    <Space className={globalStyles.headerRightActions}>
                        <Button type="default"
                                icon={<FilterOutlined/>}
                                size={'medium'}
                                onClick={() => setIsFilterOpened(true)}/>
                    </Space>
                )
            } else{
                setHeaderRightIcons('')
            }
            
            setFooterContent('')
        }
    }, [selectedTab, selectedSegmentTab]);

    useEffect(() => {
        fixHeaderItems();
    }, [headerRef, availableHeight, tabsHeight]);

    let isDataLoading = () => {
        if (equalString(selectedSegmentTab, 'unpaid') && isNullOrEmpty(unpaidFees))
            return true;
        else if (equalString(selectedSegmentTab, 'Paid') && isNullOrEmpty(paidFees))
            return true;
        else if (equalString(selectedSegmentTab, 'Payments') && isNullOrEmpty(paymentsFees))
            return true;
        else if (equalString(selectedSegmentTab, 'Adjustments') && isNullOrEmpty(adjustmentsFees))
            return true;
        else if (equalString(selectedSegmentTab, 'All') && isNullOrEmpty(allFees))
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
                                              color={'orange'} className={equalString(selectedSegmentTab, 'unpaid') ? globalStyles.urgentRibbon : globalStyles.hideRibbon}>
                                    <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                                          onClick={() => {
                                              setSelectedDrawerFee(fee);
                                          }}>

                                        {!isNullOrEmpty(fee.ReservationType) &&
                                            <Title level={1}
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
                            <Flex vertical={true} gap={token.paddingXS}>
                                <Flex gap={token.paddingSM} align={'center'}>
                                    <SGV icon={'bank-note'} preventFill={true} size={'20'}/>
                                    <Text className={cx(globalStyles.noSpace)}
                                          style={{fontSize: `${token.fontSizeLG}px`}}>
                                        Balance: <strong style={{
                                        color: transactionHeaderData.Balance > 0 ? token.colorError : token.colorTextTertiary
                                    }}>{costDisplay(transactionHeaderData.Balance, true)}</strong>
                                    </Text>
                                </Flex>
                                <Flex gap={token.paddingSM} align={'center'}>
                                    <SGV icon={'account-wallet'} preventFill={true} size={'20'} />
                                    <Text className={cx(globalStyles.noSpace)}
                                          style={{fontSize: `${token.fontSizeLG}px`}}>
                                        Account Credit: <strong style={{
                                        color: (transactionHeaderData.Credit * -1) ? token.colorInfoText : token.colorTextTertiary
                                    }}>{costDisplay((transactionHeaderData.Credit * -1), true)}</strong>
                                    </Text>
                                </Flex>
                            </Flex> 
                            
                            {toBoolean(transactionHeaderData.ShowPay) &&
                                <Button size={'small'} type={'primary'}
                                        className={globalStyles.stickyButton}
                                        onClick={() =>{
                                    navigate(ProfileRouteNames.PROFILE_BILLING_PAYMENTS);
                                }}>
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
                showButton={!toBoolean(selectedDrawerFee?.IsPaid) ? true : false}
                confirmButtonText={!toBoolean(selectedDrawerFee?.IsPaid) ? 'Pay' : ''}
                onConfirmButtonClick={() => {

                }}
            >
                <PaddingBlock onlyBottom={true}>
                   <Flex vertical={true} gap={token.padding}>
                       {!isNullOrEmpty(selectedDrawerFee?.MemberFullName) &&
                           <FormInputDisplay value={selectedDrawerFee?.MemberFullName} label={'Member'} />
                       }
                       {!isNullOrEmpty(selectedDrawerFee?.ShowTrAmount) &&
                           <FormInputDisplay value={selectedDrawerFee?.ShowTrAmount} label={'Amount'} />
                       }
                       {!isNullOrEmpty(selectedDrawerFee?.PaidDateTimeDisplay) &&
                           <FormInputDisplay value={selectedDrawerFee?.PaidDateTimeDisplay} label={'Paid On'} />
                       }
                       {!isNullOrEmpty(selectedDrawerFee?.PaymentTypeDisplayGrid) &&
                           <FormInputDisplay value={selectedDrawerFee?.PaymentTypeDisplayGrid} label={'Payment Type'} />
                       }
                       {!isNullOrEmpty(selectedDrawerFee?.TransactionItemName) &&
                           <FormInputDisplay value={selectedDrawerFee?.TransactionItemName} label={'Item'} />
                       }
                   </Flex>
                    
                </PaddingBlock>
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
                <PaddingBlock>
                    <Flex vertical={true} gap={token.padding}>
                        
                        {(!isNullOrEmpty(paidFees) && equalString(selectedSegmentTab, 'paid')) &&
                            <FormInputsDateInterval formik={formik}
                                                    labelStart={'Start Date'}
                                                    labelEnd={'End Date'}
                                                    nameStart={'PaidStartDate'}
                                                    nameEnd={'PaidEndDate'}
                                                    maxDate={formik?.values?.CurrentDate}
                            />
                        }
                        {(!isNullOrEmpty(paymentsFees) && equalString(selectedSegmentTab, 'payments')) &&
                            <FormInputsDateInterval formik={formik}
                                                    labelStart={'Start Date'}
                                                    labelEnd={'End Date'}
                                                    nameStart={'PaymentsStartDate'}
                                                    nameEnd={'PaymentsEndDate'}
                                                    maxDate={formik?.values?.CurrentDate}
                            />
                        }
                        {(!isNullOrEmpty(adjustmentsFees) && equalString(selectedSegmentTab, 'adjustments')) &&
                            <FormInputsDateInterval formik={formik}
                                                    labelStart={'Start Date'}
                                                    labelEnd={'End Date'}
                                                    nameStart={'AdjustmentsStartDate'}
                                                    nameEnd={'AdjustmentsEndDate'}
                                                    maxDate={formik?.values?.CurrentDate}
                            />
                        }
                        {(!isNullOrEmpty(allFees) && equalString(selectedSegmentTab, 'all')) &&
                            <FormInputsDateInterval formik={formik}
                                                    labelStart={'Start Date'}
                                                    labelEnd={'End Date'}
                                                    nameStart={'AllStartDate'}
                                                    nameEnd={'AllEndDate'}
                                                    maxDate={formik?.values?.CurrentDate}
                            />
                        }
                    </Flex>
                    

                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default ProfileBillingTransactions
