import {useStyles} from ".././styles.jsx";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import CardLinks from "@/components/navigationlinks/CardLinks.jsx";
import {cx} from "antd-style";
import {Button, Flex, Typography} from "antd";
const { Title } = Typography;
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import apiService from "@/api/api.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {fromLocalStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {stringToJson} from "@/utils/ListUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import DrawerBarcode from "@/components/drawer/DrawerBarcode.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import DashboardAnnouncements from "@portal/home/index/modules/Dashboard.Announcements.jsx";
import DashboardReservations from "@portal/home/index/modules/Dashboard.Reservations.jsx";
import DashboardOpenMatches from "@portal/home/index/modules/Dashboard.OpenMatches.jsx";
import DashboardEvents from "@portal/home/index/modules/Dashboard.Events.jsx";
import DashboardLeagues from "@portal/home/index/modules/Dashboard.Leagues.jsx";

function DashboardCards() {
    const { styles } = useStyles();
    const { isMockData, setIsFooterVisible, setFooterContent, shouldFetch, resetFetch, token, setIsLoading, isLoading,globalStyles  } = useApp();
    const {orgId, setAuthorizationData} = useAuth();
    
    return (
        <>
            {/*<div className={globalStyles.safeAreaGlass}></div>*/}

            {/*<DashboardAnnouncements dashboardData={dashboardData} isFetching={isFetching}/>*/}
            {/*<DashboardReservations dashboardData={dashboardData} isFetching={isFetching}/>*/}
            {/*<DashboardOpenMatches dashboardData={dashboardData} isFetching={isFetching}/>*/}
            {/*<DashboardEvents dashboardData={dashboardData} isFetching={isFetching}/>*/}
            {/*<DashboardLeagues dashboardData={dashboardData} isFetching={isFetching}/>*/}
            
            {/*{anyInList(stringToJson(dashboardData?.DashboardLinksJson)) &&*/}
            {/*    <>*/}
            {/*        <div className={cx(styles.header)} style={{padding: `0px ${token.padding}px`}}>*/}
            {/*            <Title level={3}>Additional Links</Title>*/}
            {/*        </div>*/}
            {/*        <CardLinks links={stringToJson(dashboardData?.DashboardLinksJson)} isFetching={isFetching}/>*/}
            {/*    </>*/}
            {/*}*/}
        </>
    )
}

export default DashboardCards
