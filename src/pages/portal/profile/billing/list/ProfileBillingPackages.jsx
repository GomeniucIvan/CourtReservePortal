import React, {useEffect, useRef, useState} from "react";
import {selectedTabStorage, setTabStorage} from "@/storage/AppStorage.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {Button, Flex, Segmented, Skeleton, Typography, Badge} from "antd";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useStyles} from "../styles.jsx";
import {cx} from "antd-style";
import {Card, Ellipsis} from "antd-mobile";
import {emptyArray} from "@/utils/ListUtils.jsx";
import apiService from "@/api/api.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import PackagePartialDetails from "@portal/profile/billing/packages/modules/PackagePartialDetails.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {useNavigate} from "react-router-dom";
import HomeRoutes, {HomeRouteNames} from "@/routes/HomeRoutes.jsx";

const {Title} = Typography

function ProfileBillingPackages({selectedTab, tabsHeight}) {
    const {
        token,
        globalStyles,
        availableHeight,
        isMockData,
        setIsFooterVisible,
        setFooterContent
    } = useApp();

    const {orgId} = useAuth();
    const {setHeaderRightIcons} = useHeader();
    const navigate = useNavigate();
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    const [selectedSegmentTab, setSelectedSegmentTab] = useState(selectedTabStorage('billing_packages', 'current'));
    const [currentPackages, setCurrentPackages] = useState(null);
    const [usedPackages, setUsedPackages] = useState(null);
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
                setFooterContent(<FooterBlock topBottom={true}>
                    <Button type="primary"
                            block
                            htmlType="submit"
                            onClick={() => {
                                let route = toRoute(HomeRouteNames.PACKAGE_LIST, 'id', orgId);
                                navigate(route);
                            }}>
                        Purchase Package
                    </Button>
                </FooterBlock>)
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
                                                <Card className={cx(globalStyles.card, globalStyles.clickableCard)}onClick={() => {
                                                    let route = toRoute(ProfileRouteNames.PROFILE_PACKAGE_DETAILS, 'id', orgId);
                                                    navigate(`${route}?packageId=${pack.Id}&packageSaleId=${pack.PackageSaleId}`);
                                                }}>
                                                    <Flex vertical={true}>
                                                        <PackagePartialDetails pack={pack}/>
                                                    </Flex>
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
                                                <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                                                      onClick={() => {
                                                          let route = toRoute(ProfileRouteNames.PROFILE_PACKAGE_DETAILS, 'id', orgId);
                                                          navigate(`${route}?packageId=${pack.Id}&packageSaleId=${pack.PackageSaleId}`);
                                                      }}>
                                                    <Flex vertical={true}>
                                                        <PackagePartialDetails pack={pack}/>
                                                    </Flex>
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
