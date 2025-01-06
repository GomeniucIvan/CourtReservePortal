import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {cx} from "antd-style";
import {Button, Flex, Typography} from "antd";
import {useAuth} from "@/context/AuthProvider.jsx";
import {fromLocalStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import apiService from "@/api/api.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import DrawerBarcode from "@/components/drawer/DrawerBarcode.jsx";
const { Title } = Typography;
import DashboardAnnouncements from "@portal/home/index/modules/Dashboard.Announcements.jsx";
import DashboardReservations from "@portal/home/index/modules/Dashboard.Reservations.jsx";
import DashboardOpenMatches from "@portal/home/index/modules/Dashboard.OpenMatches.jsx";
import DashboardEvents from "@portal/home/index/modules/Dashboard.Events.jsx";
import DashboardLeagues from "@portal/home/index/modules/Dashboard.Leagues.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import DashboardHeader from "@portal/home/index/modules/Dashboard.Header.jsx";
import DashboardMembershipBar from "@portal/home/index/modules/Dashboard.MembershipBar.jsx";

function DashboardClassic({dashboardData}) {
	const {orgId, setAuthorizationData} = useAuth();
	const [showAll, setShowAll] = useState(false);
	const [navigationItems, setNavigationItems] = useState([]);
	const navigate = useNavigate();
	const {token} = useApp();
	const showAllMenuList = showAll ? navigationItems : navigationItems.slice(0, 6);

	return (
		<>
			<PaddingBlock topBottom={true}>
				<Flex vertical={true} gap={token.padding}>
					<DashboardHeader dashboardData={dashboardData} />
					<DashboardMembershipBar dashboardData={dashboardData}  />
				</Flex>
			</PaddingBlock>
		</>
	)
}

export default DashboardClassic
