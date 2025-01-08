import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Divider, Flex, Typography} from "antd";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import DashboardReservations from "@portal/home/index/modules/Dashboard.Reservations.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import DashboardHeader from "@portal/home/index/modules/Dashboard.Header.jsx";
import DashboardMembershipBar from "@portal/home/index/modules/Dashboard.MembershipBar.jsx";
import ListLinks from "@/components/navigationlinks/ListLinks.jsx";
import SVG from "@/components/svg/SVG.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import {toBoolean} from "@/utils/Utils.jsx";

function DashboardClassic({navigationItems, dashboardData}) {
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
						<DashboardHeader dashboardData={dashboardData} />
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
						<ListLinks links={navigationItemsToShow} />

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
					<DashboardReservations dashboardData={dashboardData?.itemsData} isFetching={false}/>
				</PaddingBlock>
			</Flex>
		</>
	)
}

export default DashboardClassic
