import {useDevice} from "@/context/DeviceProvider.jsx";
import MobileDashboard from "@portal/home/index/mobile/MobileDashboard.jsx";
import WebDashboard from "@portal/home/index/web/WebDashboard.jsx";

function Dashboard() {
    const {isMobile} = useDevice();
    
    return (
        <>
            {isMobile ? <MobileDashboard /> : <WebDashboard/> }
        </>
    )
}

export default Dashboard
