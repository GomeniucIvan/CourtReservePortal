import React, {useEffect, useRef, useState} from "react";
import {selectedTabStorage, setTabStorage} from "../../../../storage/AppStorage.jsx";
import {useApp} from "../../../../context/AppProvider.jsx";
import mockData from "../../../../mocks/personal-data.json";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../../utils/Utils.jsx";
import {Button, Flex, Segmented, Skeleton, Typography, Badge} from "antd";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
import {useStyles} from "../styles.jsx";
import {cx} from "antd-style";
import {Card, Ellipsis} from "antd-mobile";
import {emptyArray} from "../../../../utils/ListUtils.jsx";
import apiService from "../../../../api/api.jsx";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import CardIconLabel from "../../../../components/cardiconlabel/CardIconLabel.jsx";
import {dateTimeToFormat} from "../../../../utils/DateUtils.jsx";
import {costDisplay} from "../../../../utils/CostUtils.jsx";

const {Title} = Typography

function ProfileBillingPackages({selectedTab, tabsHeight}) {
    const {
        token,
        globalStyles,
        availableHeight,
        isMockData,
        setIsFooterVisible,
        setHeaderRightIcons,
        setFooterContent
    } = useApp();
    
    const {orgId} = useAuth();
    
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    const [selectedSegmentTab, setSelectedSegmentTab] = useState(selectedTabStorage('billing_packages', 'current'));
    const [currentPackages, setCurrentPackages] = useState(null);
    const [usedPackages, setUsedPackages] = useState(null);
    const [selectedDrawerPackage, setSelectedDrawerPackage] = useState(null);
    const [showPurchaseBtn, setShowPurchaseBtn] = useState(false);
    
    const {styles} = useStyles();

    const headerRef = useRef();
    
    const fixHeaderItems = () => {
        if (headerRef.current) {
            setBodyHeight(availableHeight - headerRef.current.offsetHeight - tabsHeight - token.padding);
        }
    }

    const loadData = async () => {
        //todo change by selected tab
        let response = await apiService.get(`/api/member-portal/packages/get-my-packages?orgId=${orgId}&isCurrentPackage=true`);

        if (toBoolean(response?.IsValid)) {
            setCurrentPackages(response.Data);
        }

        let usedResponse = await apiService.get(`/api/member-portal/packages/get-my-packages?orgId=${orgId}&isCurrentPackage=false`);
        if (toBoolean(usedResponse?.IsValid)) {
            setUsedPackages(usedResponse.Data);
        }

        let showPurchaseResponse = await apiService.get(`/api/member-portal/packages/get-number-of-available-packages?orgId=${orgId}`);
        if (toBoolean(showPurchaseResponse?.IsValid) && toBoolean(showPurchaseResponse?.Data)) {
            setShowPurchaseBtn(true);
        }
    }

    useEffect(() => {
        fixHeaderItems();
    }, [headerRef, availableHeight]);
    
    useEffect(() => {
        if (equalString(selectedTab, 'packages')) {
            setIsFooterVisible(true);
            setHeaderRightIcons('')

            if (showPurchaseBtn) {
                setFooterContent(<PaddingBlock topBottom={true}>
                    <Button type="primary"
                            block
                            htmlType="submit"
                            onClick={() => {

                            }}>
                        Purchase Package
                    </Button>
                </PaddingBlock>)
            } else{
                setFooterContent('')
            }
        }
    }, [selectedTab, showPurchaseBtn]);

    useEffect(() => {
        loadData();
    }, [])
    
    return (
        <>
            <div ref={headerRef}>
                <Segmented
                    rootClassName={styles.transactionSegment}
                    options={[
                        { value: 'current', label: 'Current' },
                        { value: 'used', label: 'Used/Expired' },
                    ]}
                    defaultValue={selectedSegmentTab}
                    onChange={(e) => {
                        setTabStorage('billing_packages', e, setSelectedSegmentTab)
                    }}
                    block
                    style={{margin: `${token.padding}px`, marginBottom: 0}}/>
            </div>

            <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
                <PaddingBlock topBottom={true}>
                    {isNullOrEmpty(currentPackages) &&
                        <Flex vertical={true} gap={token.padding}>
                            {emptyArray(5).map((innerItem, innerIndex) => (
                                <Skeleton.Input key={innerIndex}  active={true} block style={{height: '80px'}}/>
                            ))}
                        </Flex>
                    }

                    {equalString(selectedSegmentTab, 'current') &&
                        <>
                            {anyInList(currentPackages) &&
                                <Flex vertical={true} gap={token.padding}>
                                    {currentPackages.map((pack, index) => (
                                        <div key={index}>
                                            <Badge.Ribbon text={(equalString(pack.FeeStatus, 1) || equalString(pack.FeeStatus, 3)) ? 'Unpaid' : ''}
                                                          color={'orange'}
                                                          className={(equalString(pack.FeeStatus, 1) || equalString(pack.FeeStatus, 3)) ? globalStyles.urgentRibbon : globalStyles.hideRibbon}>
                                                <Card className={cx(globalStyles.card, globalStyles.clickableCard)}>
                                                    <Flex vertical={true}>
                                                        <Title level={3} className={cx(globalStyles.cardItemTitle)}>
                                                            <Ellipsis direction='end' content={pack.Name}/>
                                                        </Title>

                                                        {!isNullOrEmpty(pack.CreatedOnDisplay) &&
                                                            <CardIconLabel icon={'clock'} description={`Purchased On ${pack.CreatedOnDisplay}`}/>
                                                        }

                                                        {!isNullOrEmpty(pack.Price) &&
                                                            <CardIconLabel icon={'money'} description={`${costDisplay(pack.Price)} ${(isNullOrEmpty(!pack.TaxPercent) ? `+${pack.TaxPercent}% Tax` : '')}`} />
                                                        }

                                                        {!isNullOrEmpty(pack.Assignment) &&
                                                            <CardIconLabel icon={'team'} description={pack.Assignment} />
                                                        }

                                                        {!isNullOrEmpty(pack.PunchesValueDisplay) &&
                                                            <CardIconLabel icon={'ticket'} description={`${pack.UsedPunchesDisplay} of ${pack.PunchesValueDisplay} punches used`} preventFill={true} preventStroke={false} />
                                                        }
                                                    </Flex>

                                                    TODO BAR USED
                                                </Card>
                                            </Badge.Ribbon>
                                        </div>
                                    ))}
                                </Flex>
                            }
                        </>
                    }

                    {equalString(selectedSegmentTab, 'used') &&
                        <>
                            {anyInList(usedPackages) &&
                                <Flex vertical={true} gap={token.padding}>
                                    {usedPackages.map((pack, index) => (
                                        <div key={index}>
                                            <Badge.Ribbon text={(equalString(pack.FeeStatus, 1) || equalString(pack.FeeStatus, 3)) ? 'Unpaid' : ''}
                                                          color={'orange'} 
                                                          className={(equalString(pack.FeeStatus, 1) || equalString(pack.FeeStatus, 3)) ? globalStyles.urgentRibbon : globalStyles.hideRibbon}>
                                                <Card className={cx(globalStyles.card, globalStyles.clickableCard)}>
                                                    <Flex vertical={true}>
                                                        <Title level={3} className={cx(globalStyles.cardItemTitle)}>
                                                            <Ellipsis direction='end' content={pack.Name}/>
                                                        </Title>

                                                        {!isNullOrEmpty(pack.CreatedOnDisplay) &&
                                                            <CardIconLabel icon={'clock'} description={`Purchased On ${pack.CreatedOnDisplay}`}/>
                                                        }

                                                        {!isNullOrEmpty(pack.Price) &&
                                                            <CardIconLabel icon={'money'} description={`${costDisplay(pack.Price)} ${(isNullOrEmpty(!pack.TaxPercent) ? `+${pack.TaxPercent}% Tax` : '')}`} />
                                                        }

                                                        {!isNullOrEmpty(pack.Assignment) &&
                                                            <CardIconLabel icon={'team'} description={pack.Assignment} />
                                                        }

                                                        {!isNullOrEmpty(pack.PunchesValueDisplay) &&
                                                            <CardIconLabel icon={'ticket'} description={`${pack.UsedPunchesDisplay} of ${pack.PunchesValueDisplay} punches used`} preventFill={true} preventStroke={false} />
                                                        }
                                                    </Flex>

                                                    TODO BAR USED
                                                </Card>
                                            </Badge.Ribbon>
                                        </div>
                                        
                                    ))}
                                </Flex>
                            }
                        </>
                    }
                </PaddingBlock>
            </div>
        </>
    )
}

export default ProfileBillingPackages
