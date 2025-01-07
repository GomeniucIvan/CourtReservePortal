import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Divider, Flex, Typography} from "antd";
import {useAuth} from "@/context/AuthProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
const { Title } = Typography;
import DashboardReservations from "@portal/home/index/modules/Dashboard.Reservations.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import DashboardHeader from "@portal/home/index/modules/Dashboard.Header.jsx";
import DashboardMembershipBar from "@portal/home/index/modules/Dashboard.MembershipBar.jsx";
import ListLinks from "@/components/navigationlinks/ListLinks.jsx";
import SVG from "@/components/svg/SVG.jsx";

function DashboardClassic({dashboardData}) {
	const {orgId, setAuthorizationData} = useAuth();
	const [showAll, setShowAll] = useState(false);
	const [navigationItems, setNavigationItems] = useState([]);
	const navigate = useNavigate();
	const {token} = useApp();
	const navigationItemsToShow = showAll ? navigationItems : navigationItems.slice(0, 6);
	
	useEffect(() => {
		setNavigationItems(dashboardData?.menu || []);	
	}, [dashboardData])
	
	return (
		<>
			<Flex vertical={true} gap={token.padding}>
				<PaddingBlock onlyTop={true}>
					<DashboardHeader dashboardData={dashboardData} />
				</PaddingBlock>
				<PaddingBlock>
					<DashboardMembershipBar dashboardData={dashboardData} />
				</PaddingBlock>
				
				//alert

				<PaddingBlock>
					<Flex vertical={true} gap={token.paddingSM}>
						<ListLinks links={navigationItemsToShow} />

						{navigationItems.length > 6 &&
							<Divider>
								<Flex gap={token.paddingSM} align={'center'} onClick={() => setShowAll((prev) => !prev)}>
									{`Show ${showAll ? 'Less' : 'More'}`}
									<SVG icon={showAll ? 'chevron-up-regular' : 'chevron-down-regular'} size={token.fontSize} />
								</Flex>
							</Divider>
						}
					</Flex>
				</PaddingBlock>
				
				<PaddingBlock onlyBottom={true}>
					<DashboardReservations dashboardData={dashboardData}/>
				</PaddingBlock>
			</Flex>
		</>
	)
}

export default DashboardClassic
