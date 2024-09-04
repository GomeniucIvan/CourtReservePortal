import {anyInList, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {SlickSlider} from "../../../components/slickslider/SlickSlider.jsx";
import EntityCard from "../../../components/entitycard/EntityCard.jsx";
import {e} from "../../../utils/OrganizationUtils.jsx";
import {Badge, Button, Flex, Tag, Typography} from "antd";
import {Card, Ellipsis, ErrorBlock} from "antd-mobile";
import {cx} from "antd-style";
const { Text, Title } = Typography;
import {useStyles} from "./styles.jsx";
import CardIconLabel from "../../../components/cardiconlabel/CardIconLabel.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
import {setPage, toRoute} from "../../../utils/RouteUtils.jsx";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import {ProfileRouteNames} from "../../../routes/ProfileRoutes.jsx";
import {useNavigate} from "react-router-dom";
import {stringToJson} from "../../../utils/ListUtils.jsx";

const DashboardReservations = ({dashboardData, isFetching}) => {
    let bookings = stringToJson(dashboardData?.BookingsJson);
    let showMyBookings = toBoolean(dashboardData?.ShowMyBookings) && anyInList(bookings);
    const {globalStyles, token, setDynamicPages} = useApp();
    const navigate = useNavigate();
    
    if (!toBoolean(showMyBookings)) {
        return '';
    }

    const bookingTemplate = (booking, isUnpaid) => {
        return (
            <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                  onClick={() => {
                      let route = toRoute(ProfileRouteNames.RESERVATION_DETAILS, 'id', booking.ReservationId);
                      setPage(setDynamicPages, booking.Title, route);
                      navigate(route);
                  }}>
                <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                    <div className={globalStyles?.cardIconBlock}>
                        <i className={globalStyles.entityTypeCircleIcon} style={{backgroundColor: booking.TypeBgColor}}></i>
                    </div>

                    <div>
                        <Title level={5} className={cx(globalStyles.cardItemTitle, isUnpaid && globalStyles.urgentcardItemTitle, globalStyles.noBottomPadding)}>
                            <Ellipsis direction='end' content={booking.Title}/>
                        </Title>

                        <Text><small><Ellipsis direction='end' content={booking.Subtitle}/></small></Text>
                    </div>
                </Flex>

                <CardIconLabel icon={'calendar-time'} description={booking.StartEndDateTimeDisplay} />
                <CardIconLabel icon={'team'} description={booking.FamilyRegistrantNames} />

                {!isNullOrEmpty(booking.CourtNamesDisplay) &&
                    <Tag color="default">{booking.CourtNamesDisplay}</Tag>
                }
                
                <Tag color="default">
                    {booking.RegistrantsCount} {!isNullOrEmpty(booking.EventId) ? "Registrant(s)" : "Player(s)"}
                </Tag>
            </Card>
        )
    }
    
    return (
        <EntityCard title={e('Reservations')} link={ProfileRouteNames.RESERVATION_LIST} isFetching={isFetching} addPadding={true}>
            {anyInList(bookings) ? (
                <SlickSlider>
                    {bookings.map((booking, index) => (
                        <div key={index}>
                            {toBoolean(booking.IsUnpaid) ? (
                                <Badge.Ribbon text='Unpaid' color={'orange'} className={globalStyles.urgentRibbon}>
                                    {bookingTemplate(booking, true)}
                                </Badge.Ribbon>
                            ) : (
                                <>{bookingTemplate(booking)}</>
                            )}
                        </div>
                    ))}
                </SlickSlider>
            ) : (
                <ErrorBlock status='empty' title='You dont signup to any reservation' description={''} />
            )}
        </EntityCard>
    );
};

export default DashboardReservations
