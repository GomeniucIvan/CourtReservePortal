import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Flex, Input, Tabs, Typography} from "antd";
import {useApp} from "../../../../context/AppProvider.jsx";
import mockData from "../../../../mocks/reservation-data.json";
import {ProfileRouteNames} from "../../../../routes/ProfileRoutes.jsx";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
import CardIconLabel from "../../../../components/cardiconlabel/CardIconLabel.jsx";
import InlineBlock from "../../../../components/inlineblock/InlineBlock.jsx";
import {ModalRemove} from "../../../../utils/ModalUtils.jsx";
import {cx} from "antd-style";

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
    
    const tabContent = (key) => {
        
        return(
            <PaddingBlock>
                {key}
            </PaddingBlock>
        )
    }
    
    return (
       <>
           <PaddingBlock>
               <div style={{marginBottom: `${token.padding}px`}}>
                   <Title level={4} style={{marginBottom: 0}}>
                       {booking?.ReservationTypeName}
                   </Title>
                   <Text type="secondary">Reservation</Text>
               </div>

               <Flex vertical gap={4}>
                   <CardIconLabel icon={'calendar'} description={booking?.ReservationStartDateTime} />
                   <CardIconLabel icon={'clock'} description={booking?.ReservationStartDateTime} />
                   <CardIconLabel icon={'courts'} description={booking?.ReservationStartDateTime} preventFill={true} preventStroke={false} />
                   <CardIconLabel icon={'pincode'} description={'2344#'} />
               </Flex>

               <PaddingBlock topBottom={true} leftRight={false}>
                   <InlineBlock>
                       <Button type="primary"
                               danger
                               block
                               ghost
                               htmlType={'button'}
                               onClick={() => {

                               }}>
                           Cancel
                       </Button>

                       <Button type="primary"
                               block
                               htmlType={'button'}>
                           Edit
                       </Button>
                   </InlineBlock>
               </PaddingBlock>
               <div>
                   <Button onClick={()=> navigate(ProfileRouteNames.RESERVATION_CREATE)}>Create res</Button>
               </div>
           </PaddingBlock>

           <Tabs
               rootClassName={cx(globalStyles.tabs)}
               defaultActiveKey="1"
               items={[
                   {
                       label: 'Players (3)',
                       key: 'players',
                       children: tabContent('players')
                   },
                   {
                       label: 'Match Details',
                       key: 'matchdetails',
                       children: tabContent('matchdetails')
                   },
                   {
                       label: 'Misc. Items',
                       key: 'misc',
                       children: tabContent('misc')
                   },
                   {
                       label: 'Additional',
                       key: 'additional',
                       children: tabContent('additional')
                   },
               ]}
           />
       </>
    )
}

export default ProfileBookingDetails
