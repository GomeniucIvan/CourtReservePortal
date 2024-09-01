import {selectedTabStorage, setTabStorage, toLocalStorage} from "../../../../storage/AppStorage.jsx";
import {Badge, Button, Flex, Segmented, Space, Tabs, Tag, Typography} from "antd";
import {useEffect, useRef, useState} from "react";
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

function ProfileBillingTransactions({selectedTab, tabsHeight}) {
    const {token, globalStyles, availableHeight, isMockData, setIsFooterVisible, setHeaderRightIcons, setFooterContent} = useApp();
    const [selectedSegmentTab, setSelectedSegmentTab] = useState(selectedTabStorage('billing_transaction', 'Unpaid'));
    const {styles} = useStyles();
    const [unpaidFees, setUnpaidFees] = useState([]);
    const headerRef = useRef();
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    const [selectedDrawerFee, setSelectedDrawerFee] = useState(null);
    const [isFilterOpened, setIsFilterOpened] = useState(false);
    
    const fixHeaderItems = () => {
        if (headerRef.current) {
            setBodyHeight(availableHeight - headerRef.current.offsetHeight - tabsHeight);
        } else{
            //setBodyHeight(availableHeight - tabsHeight);
        }
    }

    const loadData = () => {
        if (isMockData){
            const fees = mockData.profile_transactions_unpaid;
            setUnpaidFees(fees);
        } else{

        }
    }
    
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
            setFooterContent(null)

            loadData();
        }
    }, [selectedTab]);

    useEffect(() => {
        fixHeaderItems();
    }, [headerRef, availableHeight]);
    
    return (
        <>
            <div ref={headerRef}>
                <PaddingBlock onlyBottom={true}>
                    <Flex justify={'space-between'} align={'center'}>
                        <Flex vertical={true}>
                            <Title level={5} className={cx(globalStyles.noSpace)}>Balance</Title>
                            <Text>$381.00</Text>
                        </Flex>                        
                        <Button size={'small'} type={'primary'} className={globalStyles.stickyButton}>
                            Pay All
                        </Button>
                    </Flex>
                </PaddingBlock>
                
                <Segmented
                    rootClassName={styles.transactionSegment}
                    options={['Unpaid', 'Paid', 'Payments', 'Adjustments', 'All']}
                    defaultValue={selectedSegmentTab}
                    onChange={(e) => {
                        setTabStorage('billing_transaction', e, setSelectedSegmentTab)
                    }}
                    block
                    style={{margin: `${token.padding}px`, marginBottom: 0}}/>
            </div>

            <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
                {anyInList(unpaidFees) &&
                    <PaddingBlock topBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            {unpaidFees.map((fee, index) => (
                                <div key={index}>
                                    <Badge.Ribbon text='Unpaid' color={'orange'} className={globalStyles.urgentRibbon}>
                                        <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                                              onClick={() => {
                                                  setSelectedDrawerFee(fee);
                                              }}>

                                            <Title level={5} className={cx(globalStyles.cardItemTitle, globalStyles.urgentcardItemTitle, globalStyles.noBottomPadding)}>
                                                <Ellipsis direction='end' content={fee.ReservationType}/>
                                            </Title>

                                            <CardIconLabel icon={'calendar-time'} description={fee.FeeDateTimeDisplay} />
                                            <CardIconLabel icon={'team'} description={fee.MemberDisplay} />
                                            <CardIconLabel icon={'money'} description={fee.UnpaidAmountDisplay} />
                                        </Card>
                                    </Badge.Ribbon>
                                </div>
                            ))}
                        </Flex>
                    </PaddingBlock>
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
