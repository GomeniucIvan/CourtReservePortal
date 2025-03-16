import {Badge, Flex, Tag, theme, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
const { useToken } = theme;
import { cx } from 'antd-style';
import { useTranslation } from 'react-i18next';
import {Card, Ellipsis} from "antd-mobile";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
const {Text, Title} = Typography;

const EntityCardBooking = ({booking, isFullHeight}) => {
    const { token } = useToken();
    const { orgId } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation('');
    const {tagStyles} = useCombinedStyles();
    const {globalStyles, setDynamicPages} = useApp();
    const { styles } = useStyles();
    
    const bookingTemplate = (innerBooking, isUnpaid) => {
        return (
            <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                  onClick={() => {
                      let route = toRoute(ProfileRouteNames.RESERVATION_DETAILS, 'id', orgId);
                      route = toRoute(route, 'reservationId', innerBooking.ReservationId);
                      setPage(setDynamicPages, innerBooking.Title, route);
                      navigate(route);
                  }}>

                <Flex
                    vertical={true}
                    gap={12}
                    style={{paddingLeft: '8px'}}
                >
                    {innerBooking.TypeBgColor && <div className={styles.bookingLeftCardLine} style={{backgroundColor: innerBooking.TypeBgColor}}/>}
                    <Flex justify={'center'} vertical className='my-booking-header'>
                        <Title level={3}>
                            <Ellipsis direction='end' content={innerBooking.Title}/>
                        </Title>
                        <Text className={{color: token.colorSecondary, fontSize: `${token.fontSizeXS}px`}}>
						    {innerBooking.Subtitle}
						</Text>
                    </Flex>
                    <Flex vertical={true} gap={token.paddingSM} className="my-booking-calendar-info">
                        <Flex gap={token.paddingMD} align={'center'}>
                            <SVG icon={'calendar-clock-regular'} size={16} />
                            <Text style={{color: token.colorSecondary, fontSize: `${token.fontSize}px`}}>{innerBooking.StartEndDateTimeDisplay}</Text>
                        </Flex>
                        <Flex gap={token.paddingMD} align={'center'}>
                            <SVG icon={'user-regular'} size={16}  />
                            <Text style={{color: token.colorSecondary, fontSize: `${token.fontSize}px`}}>{innerBooking.FamilyRegistrantNames}</Text>
                        </Flex>
                    </Flex>
                    <Flex gap={token.paddingSM} style={{height: isFullHeight ? '24px' : 'auto', display: isFullHeight ? 'flex' : 'none'}}>
                        {innerBooking.IsUnpaid && <Tag className={tagStyles.error}>Unpaid</Tag>}
                        {innerBooking?.PinDisplay &&
                            <Tag className={tagStyles.grey}>{innerBooking.PinDisplay}</Tag>}
                        {innerBooking.Waitlisted && <Tag className={tagStyles.waitlisted}>Waitlisted</Tag>}
                        {innerBooking.SpotsAvailable && <Tag className={tagStyles.spotsAvailable}>Spots Available</Tag>}
                        {innerBooking.CourtNamesDisplay &&
                            <Tag className={tagStyles.grey}>{innerBooking.CourtNamesDisplay}</Tag>}
                    </Flex>
                </Flex>

                {/*<Flex gap={token.Custom.cardIconPadding} align={'center'}>*/}
                {/*    <div className={globalStyles?.cardIconBlock}>*/}
                {/*        <i className={globalStyles.entityTypeCircleIcon} style={{backgroundColor: innerBooking.TypeBgColor}}></i>*/}
                {/*    </div>*/}

                {/*    <div>*/}
                {/*        <Title level={1} className={cx(globalStyles.cardItemTitle, isUnpaid && globalStyles.urgentcardItemTitle, globalStyles.noBottomPadding)}>*/}
                {/*            <Ellipsis direction='end' content={innerBooking.Title}/>*/}
                {/*        </Title>*/}

                {/*        <Text><small><Ellipsis direction='end' content={innerBooking.Subtitle}/></small></Text>*/}
                {/*    </div>*/}
                {/*</Flex>*/}

                {/*<CardIconLabel icon={'calendar-time'} description={innerBooking.StartEndDateTimeDisplay} />*/}
                {/*<CardIconLabel icon={'team'} description={innerBooking.FamilyRegistrantNames} />*/}

                {/*{!isNullOrEmpty(innerBooking.CourtNamesDisplay) &&*/}
                {/*    <Tag color="default" className={globalStyles.tag}>{innerBooking.CourtNamesDisplay}</Tag>*/}
                {/*}*/}

                {/*<Tag color="default" className={globalStyles.tag}>*/}
                {/*    {innerBooking.RegistrantsCount} {!isNullOrEmpty(innerBooking.EventId) ? "Registrant(s)" : "Player(s)"}*/}
                {/*</Tag>*/}
            </Card>
        )
    }

    return (
        <>
            {toBoolean(booking.IsUnpaid) ? (
                <Badge.Ribbon text={t('unpaid')} color={'orange'} className={globalStyles.urgentRibbon}>
                    {bookingTemplate(booking, true)}
                </Badge.Ribbon>
            ) : (
                <>{bookingTemplate(booking)}</>
            )}
        </>
    )
}

export default EntityCardBooking;
