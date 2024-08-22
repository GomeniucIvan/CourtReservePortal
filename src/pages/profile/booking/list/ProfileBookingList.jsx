import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Input, Segmented, Space} from "antd";
import {toBoolean} from "../../../../utils/Utils.jsx";
import {cx} from "antd-style";
import {t} from "../../../../utils/OrganizationUtils.jsx";
import {useApp} from "../../../../context/AppProvider.jsx";
import mockData from "../../../../mocks/reservation-data.json";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
const {Search} = Input;

function ProfileBookingList() {
    const navigate = useNavigate();
    const [isSearchOpened, setIsSearchOpened] = useState(false);
    const {setIsFooterVisible, setHeaderRightIcons, resetFetch, isMockData} = useApp();
    const [bookings, setBookings] = useState([]);
    
    const loadData = (refresh) => {
        if (isMockData) {
            const list = mockData.list.List;
            setBookings(list);
        } else {
            alert('todo res list')
        }

        resetFetch();
    }
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(
            <Space className={globalStyles.headerRightActions}>
                {/*//onSearch={onSearch}*/}
                <div onClick={() => {
                    if (!toBoolean(isSearchOpened)) {
                        setIsSearchOpened(true);
                    }
                }}>
                    <Search
                        rootClassName={cx(globalStyles.headerSearch, isSearchOpened && globalStyles.headerSearchOpened)}
                        placeholder={`Search for ${t('Booking')}`}
                        style={{width: 0}}/>
                </div>

            </Space>
        )

        loadData();
    }, []);
    
    return (
        <PaddingBlock>
            ProfileBookingList
        </PaddingBlock>
    )
}

export default ProfileBookingList
