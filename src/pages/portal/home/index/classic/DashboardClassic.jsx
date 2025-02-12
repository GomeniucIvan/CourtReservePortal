import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Divider, Flex, Typography} from "antd";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import DashboardHeader from "@portal/home/index/modules/Dashboard.Header.jsx";
import DashboardMembershipBar from "@portal/home/index/modules/Dashboard.MembershipBar.jsx";
import ListLinks from "@/components/navigationlinks/ListLinks.jsx";
import SVG from "@/components/svg/SVG.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import {toBoolean} from "@/utils/Utils.jsx";
import DashboardBookings from "@portal/home/index/modules/Dashboard.Bookings.jsx";
import DashboardSaveMyPlay from "@portal/home/index/modules/Dashboard.SaveMyPlay.jsx";
import DashboardPourMyBev from "@portal/home/index/modules/Dashboard.PourMyBev.jsx";

function DashboardClassic({navigationItems, dashboardData, organizationList, announcementsCount}) {
	const [showAll, setShowAll] = useState(false);
	const [navItems, setNavItems] = useState([]);
	const {token} = useApp();
	const navigate = useNavigate();
	const navigationItemsToShow = showAll ? navItems : navItems.slice(0, 6);
	
	useEffect(() => {
		setNavItems(navigationItems || []);	
	}, [navigationItems])
	
	return (
		<>
			<Flex vertical={true} gap={token.padding}>
				<Flex vertical={true} gap={token.paddingXXL}>
					<PaddingBlock onlyTop={true}>
						<DashboardHeader dashboardData={dashboardData} organizationList={organizationList} />
					</PaddingBlock>
					<Flex vertical={true}>
						<PaddingBlock>
							<DashboardMembershipBar dashboardData={dashboardData?.itemsData} />
						</PaddingBlock>

						{toBoolean(dashboardData?.itemsModel?.ShowMembershipBtn) &&
							<AlertBlock
								type={dashboardData?.itemsModel.MembershipStatusDisplay}
								title={dashboardData?.itemsModel?.MembershipText}
								description={dashboardData?.itemsModel?.MembershipDescriptionHtml}
								buttonText={dashboardData?.itemsModel?.GetMembershipButtonText}
								onButtonClick={() => {navigate(dashboardData?.itemsModel?.GetMembershipBtnUrl)}}
							/>
						}
					</Flex>
				</Flex>

				<PaddingBlock>
					<Flex vertical={true} gap={token.paddingSM}>
						<ListLinks links={navigationItemsToShow} 
								   announcementsCount={announcementsCount} />

						{navItems.length > 6 &&
							<Divider>
								<Flex gap={token.paddingSM} align={'center'} onClick={() => setShowAll((prev) => !prev)}>
									{`Show ${showAll ? 'Less' : 'More'}`}
									<SVG icon={showAll ? 'chevron-up-regular' : 'chevron-down-regular'} size={token.fontSize} />
								</Flex>
							</Divider>
						}
					</Flex>
				</PaddingBlock>

				<PaddingBlock leftRight={false} onlyBottom={true}>
					<Flex vertical={true} gap={token.padding}>
						<DashboardBookings dashboardData={dashboardData?.itemsData} isFetching={false}/>
						
						<PaddingBlock>
							<Flex vertical={true} gap={token.padding}>
								<DashboardSaveMyPlay dashboardData={dashboardData?.itemsData}/>
								<DashboardPourMyBev dashboardData={dashboardData?.itemsData}/>
							</Flex>
						</PaddingBlock>
					</Flex>
				</PaddingBlock>
			</Flex>
		</>
	)
}

export default DashboardClassic
