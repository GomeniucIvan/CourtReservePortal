import {anyInList, isNullOrEmpty, oneListItem, toBoolean} from "@/utils/Utils.jsx";
import {SlickSlider} from "@/components/slickslider/SlickSlider.jsx";
import EntityCard from "@/components/entitycard/EntityCard.jsx";
import {Badge, Button, Flex, Tag, Typography} from "antd";
import {Card, Ellipsis, ErrorBlock} from "antd-mobile";
import {cx} from "antd-style";
const { Text, Title } = Typography;
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {useNavigate} from "react-router-dom";
import {countListItems, stringToJson} from "@/utils/ListUtils.jsx";
import {useTranslation} from "react-i18next";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import { Swiper } from 'antd-mobile'
import SwiperSlider from "@/components/swiperslider/SwiperSlider.jsx";

const DashboardBookings = ({dashboardData, isFetching}) => {
    let bookings = stringToJson(dashboardData?.BookingsJson);
    let showMyBookings = toBoolean(dashboardData?.ShowMyBookings) || isFetching;
    const {globalStyles, token, setDynamicPages} = useApp();
    const navigate = useNavigate();
    const { t } = useTranslation('');
    
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
                        <Title level={1} className={cx(globalStyles.cardItemTitle, isUnpaid && globalStyles.urgentcardItemTitle, globalStyles.noBottomPadding)}>
                            <Ellipsis direction='end' content={booking.Title}/>
                        </Title>

                        <Text><small><Ellipsis direction='end' content={booking.Subtitle}/></small></Text>
                    </div>
                </Flex>

                <CardIconLabel icon={'calendar-time'} description={booking.StartEndDateTimeDisplay} />
                <CardIconLabel icon={'team'} description={booking.FamilyRegistrantNames} />

                {!isNullOrEmpty(booking.CourtNamesDisplay) &&
                    <Tag color="default" className={globalStyles.tag}>{booking.CourtNamesDisplay}</Tag>
                }
                
                <Tag color="default" className={globalStyles.tag}>
                    {booking.RegistrantsCount} {!isNullOrEmpty(booking.EventId) ? "Registrant(s)" : "Player(s)"}
                </Tag>
            </Card>
        )
    }
    
    return (
        <EntityCard title={t('booking.myBookings')} link={ProfileRouteNames.BOOKING_LIST} isFetching={isFetching} addPadding={true}>
            {isFetching &&
                <SlickSlider>
                    <CardSkeleton type={SkeletonEnum.RESERVATION} count={1} marginBottom={true}/>
                </SlickSlider>
            }

            {(!isFetching && anyInList(bookings)) ? (
                    <SwiperSlider count={countListItems(bookings)}>
                        {bookings.map((booking, index) => {
                            const isLastItem = index === bookings.length - 1;
                            const isOneItem = oneListItem(bookings);
                            
                            return (
                                <Swiper.Item key={index} 
                                             className={cx((!isOneItem && !isLastItem) && globalStyles.swiperItem, (!isOneItem && isLastItem) && globalStyles.swiperLastItem)}>
                                    <>
                                        {toBoolean(booking.IsUnpaid) ? (
                                            <Badge.Ribbon text={t('unpaid')} color={'orange'} className={globalStyles.urgentRibbon}>
                                                {bookingTemplate(booking, true)}
                                            </Badge.Ribbon>
                                        ) : (
                                            <>{bookingTemplate(booking)}</>
                                        )}
                                    </>
                                </Swiper.Item>
                            )
                        })}
                    </SwiperSlider>
            ) : (
                <ErrorBlock status='empty' title='You dont signup to any reservation' description={''} />
            )}
        </EntityCard>
    );
};

export default DashboardBookings
