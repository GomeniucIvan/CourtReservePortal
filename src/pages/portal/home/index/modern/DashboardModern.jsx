import {Button, Divider, Flex, Typography} from "antd";
import {useAuth} from "@/context/AuthProvider.jsx";
import {anyInList, equalString, toBoolean} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
const { Title } = Typography;
import DashboardAnnouncements from "@portal/home/index/modules/Dashboard.Announcements.jsx";
import DashboardLeagues from "@portal/home/index/modules/Dashboard.Leagues.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import DashboardHeader from "@portal/home/index/modules/Dashboard.Header.jsx";
import DashboardMembershipBar from "@portal/home/index/modules/Dashboard.MembershipBar.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import DashboardBookings from "@portal/home/index/modules/Dashboard.Bookings.jsx";
import {useStyles} from ".././styles.jsx";
import ButtonLinks from "@/components/navigationlinks/ButtonLinks.jsx";
import {getDashboardMainLinks} from "@/storage/AppStorage.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import CardLinks from "@/components/navigationlinks/CardLinks.jsx";

function DashboardModern({navigationItems, 
                             dashboardData, 
                             organizationList,
                             dashboardViewType }) {
    const { styles } = useStyles();
    const { token, setDynamicPages } = useApp();
    const navigate = useNavigate();
    const {orgId} = useAuth();
    const [buttons, setButtons] = useState(anyInList(getDashboardMainLinks(orgId)) ? getDashboardMainLinks(orgId) : []);
    
    return (
        <>
            <Flex vertical={true} gap={token.padding}>
                <Flex vertical={true} gap={token.paddingXXL}>
                    <PaddingBlock onlyTop={true}>
                        <DashboardHeader dashboardData={dashboardData} organizationList={organizationList} />
                    </PaddingBlock>
                    <PaddingBlock>
                        <DashboardMembershipBar dashboardData={dashboardData?.itemsData} />
                    </PaddingBlock>

                    <PaddingBlock>
                        {anyInList(buttons) &&
                            <Flex vertical={true} gap={token.paddingSM}>
                                {buttons.map((button, i) => {
                                    return (
                                        <Button type={'primary'}
                                                key={button.Item}
                                                onClick={() => {
                                                    if (anyInList(button.Childrens)) {
                                                        let route = toRoute(HomeRouteNames.NAVIGATE, 'id', orgId);
                                                        route = toRoute(route, 'nodeId', button.Item);
                                                        setPage(setDynamicPages, button.Text, route);
                                                        navigate(route);
                                                    } else {
                                                        navigate(button.Url);
                                                    }
                                                }}
                                                htmlType={'button'}
                                                block={true}>
                                            {button.Text}
                                        </Button>
                                    )
                                })}
                            </Flex>
                        }
                    </PaddingBlock>
                </Flex>

                {(toBoolean(dashboardData?.itemsData?.ShowMembershipBtn) || (anyInList(dashboardData?.itemsData?.UnpaidItems))) &&
                    <>
                        {toBoolean(dashboardData?.itemsData?.ShowMembershipBtn) &&
                            <AlertBlock
                                type={dashboardData?.itemsData?.MembershipStatusDisplay}
                                title={dashboardData?.itemsData?.MembershipText}
                                description={dashboardData?.itemsData?.MembershipDescriptionHtml}
                                buttonText={dashboardData?.itemsData?.GetMembershipButtonText}
                                onButtonClick={() => {navigate(dashboardData?.itemsData?.GetMembershipBtnUrl)}}
                            />
                        }

                        {(anyInList(dashboardData?.itemsData?.UnpaidItems)) &&
                            <>
                                <AlertBlock
                                    type={'danger'}
                                    title={'Upfront Payment Reminder'}
                                    description={'Upfront payment is pending'}
                                    buttonText={toBoolean(dashboardData?.itemsData?.AllowMembersToPayTransactionsOnPortal) ? 'Pay' : ''}
                                    onButtonClick={() => {navigate(`/Online/Payments/ProcessPayment/${orgId}`)}}
                                />
                            </>
                        }
                    </>
                }
                
                <PaddingBlock leftRight={false} onlyBottom={true}>
                    <DashboardAnnouncements dashboardData={dashboardData?.itemsData}/>
                    <DashboardBookings dashboardData={dashboardData?.itemsData}/>
                    
                    <DashboardLeagues dashboardData={dashboardData?.itemsData}/>
                </PaddingBlock>

                {anyInList(navigationItems) &&
                    <PaddingBlock onlyBottom={true}>
                        {equalString(dashboardViewType, 3) &&
                            <ButtonLinks links={navigationItems}/>
                        }
                        {equalString(dashboardViewType, 4) &&
                            <CardLinks links={navigationItems}/>
                        }
                    </PaddingBlock>
                }
            </Flex>
        </>
    )
}

export default DashboardModern
