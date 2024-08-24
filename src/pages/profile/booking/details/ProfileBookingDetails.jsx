import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Input, Typography} from "antd";
import {useApp} from "../../../../context/AppProvider.jsx";
import mockData from "../../../../mocks/reservation-data.json";
import {ProfileRouteNames} from "../../../../routes/ProfileRoutes.jsx";

const {Search} = Input;
const {Title, Text} = Typography;

function ProfileBookingDetails() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [isFilterOpened, setIsFilterOpened] = useState(false);
    
    const {
        setIsFooterVisible,
        setHeaderRightIcons,
        setFooterContent,
        resetFetch,
        isMockData,
        globalStyles,
        setDynamicPages,
        token
    } = useApp();

    
    const loadData = (refresh) => {
        if (isMockData) {
            const details = mockData.details;
            setBooking(details);
        } else {
            alert('todo res list')
        }

        resetFetch();
    }
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent('');

        loadData();        
    }, []);
    
    return (
        <>
           <Button onClick={()=> navigate(ProfileRouteNames.RESERVATION_CREATE)}>Create res</Button>
        </>
    )
}

export default ProfileBookingDetails
