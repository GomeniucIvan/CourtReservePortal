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
import {useNavigate} from "react-router-dom";
import {useRef} from "react";

function DashboardModern() {
    const { styles } = useStyles();
    const { setIsFooterVisible, setFooterContent, shouldFetch, resetFetch, token, setIsLoading, isLoading,globalStyles  } = useApp();
    const {orgId, setAuthorizationData} = useAuth();
    const navigate = useNavigate();
    const drawerBarcodeRef = useRef(null);
    
    return (
        <>
            <div className={cx(styles.orgArea, 'safe-area-top')}>
               <PaddingBlock topBottom={true}>
                   <Flex vertical={true} gap={token.paddingSM} >
                       <Button block onClick={() => navigate(HomeRouteNames.SCHEDULER)}>Scheduler</Button>
                       <Button block onClick={() => navigate(EventRouteNames.EVENT_CALENDAR)}>Calendar</Button>
                       <Button block onClick={() => navigate(EventRouteNames.EVENT_LIST)}>Event List</Button>
                       <Button block onClick={() => navigate('/membergroup/21072')}>Member Group</Button>

                       {toBoolean(dashboardData?.OrgShowBarcode) &&
                           <>
                               <Button block onClick={() => {
                                   if (drawerBarcodeRef.current) {
                                       drawerBarcodeRef.current.open();
                                   }
                               }}>
                                   Barcode
                               </Button>

                               <DrawerBarcode ref={drawerBarcodeRef} format={dashboardData?.OrgBarcodeFormat} familyList={stringToJson(dashboardData?.FamilyMembesJson)}/>
                           </>
                       }
                   </Flex>
               </PaddingBlock>
            </div>

            <DashboardAnnouncements dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardReservations dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardOpenMatches dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardEvents dashboardData={dashboardData} isFetching={isFetching}/>
            <DashboardLeagues dashboardData={dashboardData} isFetching={isFetching}/>

            {anyInList(stringToJson(dashboardData?.DashboardLinksJson)) &&
                <>
                    <div className={cx(styles.header)} style={{padding: `0px ${token.padding}px`}}>
                        <Title level={3}>Additional Links</Title>
                    </div>
                    <CardLinks links={stringToJson(dashboardData?.DashboardLinksJson)} isFetching={isFetching}/>
                </>
            }
        </>
    )
}

export default DashboardModern
