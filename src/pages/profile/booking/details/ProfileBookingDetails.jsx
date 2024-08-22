import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Input, Typography} from "antd";
import {useApp} from "../../../../context/AppProvider.jsx";
import mockData from "../../../../mocks/reservation-data.json";

const {Search} = Input;
const {Title, Text} = Typography;

function ProfileBookingDetails() {
    const navigate = useNavigate();
    let { id } = useParams();
    
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
    const [booking, setBooking] = useState(null);
    const [isFilterOpened, setIsFilterOpened] = useState(false);

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
           res details {id}
        </>
    )
}

export default ProfileBookingDetails
