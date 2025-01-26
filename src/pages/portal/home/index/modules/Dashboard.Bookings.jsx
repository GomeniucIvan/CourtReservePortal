import {anyInList, isNullOrEmpty, oneListItem, toBoolean} from "@/utils/Utils.jsx";
import {SlickSlider} from "@/components/slickslider/SlickSlider.jsx";
import EntityCardWrapper from "@/components/entitycard/EntityCardWrapper.jsx";
import {Tag, Typography} from "antd";
import {Card, Ellipsis, ErrorBlock} from "antd-mobile";
import {cx} from "antd-style";
const { Text, Title } = Typography;
import {useApp} from "@/context/AppProvider.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {countListItems, stringToJson} from "@/utils/ListUtils.jsx";
import {useTranslation} from "react-i18next";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import { Swiper } from 'antd-mobile'
import SwiperSlider from "@/components/swiperslider/SwiperSlider.jsx";
import EntityCardBooking from "@/components/entitycard/EntityCard.Booking.jsx";
import EntityEmptyBlock from "@/components/entitycard/EntityEmptyBlock.jsx";

const DashboardBookings = ({dashboardData, isFetching}) => {
    let bookings = stringToJson(dashboardData?.BookingsJson);
    let showMyBookings = toBoolean(dashboardData?.ShowMyBookings) || isFetching;
    const {globalStyles} = useApp();
    const { t } = useTranslation('');
    
    if (!toBoolean(showMyBookings)) {
        return '';
    }

    const hasAnyTagInArray = (bookings) => {
        if (!Array.isArray(bookings)) return false;

        return bookings.some((booking) => {
            if (booking && typeof booking === 'object') {
                const { IsUnpaid, PinDisplay, Waitlisted, SpotsAvailable, CourtNamesDisplay } = booking;

                return !!(IsUnpaid || PinDisplay || Waitlisted || SpotsAvailable || CourtNamesDisplay);
            }
            return false;
        });
    };

    const isFullHeight = hasAnyTagInArray(bookings);
    
    return (
        <EntityCardWrapper title={t('booking.myBookings')} link={ProfileRouteNames.BOOKING_LIST} isFetching={isFetching} addPadding={true}>
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
                                       <EntityCardBooking booking={booking} isFullHeight={isFullHeight}/>
                                    </>
                                </Swiper.Item>
                            )
                        })}
                    </SwiperSlider>
            ) : (
                <EntityEmptyBlock text='You have no upcoming bookings' height={136} />
            )}
        </EntityCardWrapper>
    );
};

export default DashboardBookings
