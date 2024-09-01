import {useEffect, useRef, useState} from "react";
import {selectedTabStorage, setTabStorage} from "../../../../storage/AppStorage.jsx";
import {useApp} from "../../../../context/AppProvider.jsx";
import mockData from "../../../../mocks/personal-data.json";
import {anyInList, equalString} from "../../../../utils/Utils.jsx";
import {Button, Flex, Segmented, Typography} from "antd";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
import {useStyles} from "../styles.jsx";
import {cx} from "antd-style";
import {Card, Ellipsis} from "antd-mobile";

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
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    const [selectedSegmentTab, setSelectedSegmentTab] = useState(selectedTabStorage('billing_packages', 'Current'));
    const [packages, setPackages] = useState([]);
    const [selectedDrawerPackage, setSelectedDrawerPackage] = useState(null);

    const {styles} = useStyles();

    const headerRef = useRef();


    const fixHeaderItems = () => {
        if (headerRef.current) {
            setBodyHeight(availableHeight - headerRef.current.offsetHeight - tabsHeight);
        }
    }

    const loadData = () => {
        if (isMockData) {
            const data = mockData.profile_my_packages;
            setPackages(data);
        } else {

        }
    }

    useEffect(() => {
        fixHeaderItems();
    }, [headerRef, availableHeight]);
    
    useEffect(() => {
        if (equalString(selectedTab, 'packages')) {
            setIsFooterVisible(true);
            setHeaderRightIcons('')

            setFooterContent(<PaddingBlock topBottom={true}>
                <Button type="primary"
                        block
                        htmlType="submit"
                        onClick={() => {

                        }}>
                    Purchase Package
                </Button>
            </PaddingBlock>)

            loadData();
        }
    }, [selectedTab]);

    return (
        <>
            <div ref={headerRef}>
                <Segmented
                    rootClassName={styles.transactionSegment}
                    options={['Current', 'Used/Expired']}
                    defaultValue={selectedSegmentTab}
                    onChange={(e) => {
                        setTabStorage('billing_packages', e, setSelectedSegmentTab)
                    }}
                    block
                    style={{margin: `${token.padding}px`, marginBottom: 0}}/>
            </div>

            <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
                <PaddingBlock topBottom={true}>
                    {anyInList(packages) &&
                        <Flex vertical={true} gap={token.padding}>
                            {packages.map((pack, index) => (
                                <Card className={cx(globalStyles.card, globalStyles.clickableCard)} key={index}>
                                    <Title level={5}
                                           className={cx(globalStyles.cardItemTitle, globalStyles.noBottomPadding)}>
                                        <Ellipsis direction='end' content={pack.Name}/>
                                    </Title>

                                    <Title level={5}
                                           className={cx(globalStyles.cardItemTitle, globalStyles.noBottomPadding)}>
                                        <Ellipsis direction='end' content={pack.Name}/>
                                    </Title>

                                    <Title level={5}
                                           className={cx(globalStyles.cardItemTitle, globalStyles.noBottomPadding)}>
                                        <Ellipsis direction='end' content={pack.Name}/>
                                    </Title>

                                    <Title level={5}
                                           className={cx(globalStyles.cardItemTitle, globalStyles.noBottomPadding)}>
                                        <Ellipsis direction='end' content={pack.Name}/>
                                    </Title>

                                    <Title level={5}
                                           className={cx(globalStyles.cardItemTitle, globalStyles.noBottomPadding)}>
                                        <Ellipsis direction='end' content={pack.Name}/>
                                    </Title>
                                </Card>
                            ))}
                        </Flex>
                    }
                </PaddingBlock>
            </div>
        </>
    )
}

export default ProfileBillingPackages
