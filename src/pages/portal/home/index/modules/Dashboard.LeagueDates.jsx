import {anyInList, getValueOrDefault, isNullOrEmpty, oneListItem, toBoolean} from "@/utils/Utils.jsx";
import {SlickSlider} from "@/components/slickslider/SlickSlider.jsx";
import {Button, Flex, Skeleton, Tag, Typography} from "antd";
import {Card, Swiper} from "antd-mobile";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {cx} from "antd-style";
import {useStyles} from ".././styles.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";
import SwiperSlider from "@/components/swiperslider/SwiperSlider.jsx";
import {countListItems} from "@/utils/ListUtils.jsx";
import EntityCardBooking from "@/components/entitycard/EntityCard.Booking.jsx";
import appService from "@/api/app.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
const { Title } = Typography;

const ModernDashboardLeaguesDates = ({ leaguesDates, isFetching }) => {
    const {globalStyles} = useApp();
    const {orgId} = useAuth();
    const { styles } = useStyles();
    const {tagStyles} = useCombinedStyles();
    const [isOptInLoading, setIsOptInLoading] = useState(false);
    const [innerLeaguesDates, setInnerLeaguesDates] = useState(leaguesDates);
    const [inProgressStatus, setInProgressStatus] = useState(false);
    
    if (!anyInList(leaguesDates)){
        return '';
    }

    const buildDashboardOptInButton = () => {
        return '';
    }

    useEffect(() => {
        setInnerLeaguesDates(leaguesDates);
        setInProgressStatus(leaguesDates?.InProgress);
    }, [leaguesDates])
    
    const optInAjax = async (data, isFree) => {
        let leagueId = data.LeagueId;
        let isDisabled = !data.AllowToOptIn;
        let orgMemberId = data.OrgMemberId;
        let leagueSessionRegistrationId = data.LeagueSessionRegistrationId;
        let reservationId = data.ReservationId;
        let leagueSessionId = data.LeagueSessionId;

        let isFreeLeaguePrice = true;// getValueOrDefault(data.PriceToPay, 0) || toBoolean(data.FamilyRegisteredMembersCount <= 1);

        if (isFreeLeaguePrice) {
            let optInResponse = await appService.post(`/Online/Leagues/OptinFree?id=${orgId}&sessionId=${leagueSessionId}&resId=${reservationId}&orgMemberId=${orgMemberId}&leagueId=${leagueId}&registrationId=${leagueSessionRegistrationId}`)
            if (toBoolean(optInResponse?.isValid)) {
                let respData = optInResponse?.Data;

                if (toBoolean(respData?.RequireUpfrontPayment) && getValueOrDefault(data.PriceToPay, 0) > 0) {
                    window.location.href = `/Online/Payments/ProcessPayment?id=${orgId}`;
                } else {
                    setInnerLeaguesDates(prevDates =>
                        prevDates.map(date =>
                            date.LeagueSessionRegistrationId === leagueSessionRegistrationId
                                ? { ...date, IsOptIn: true, PlayingDisplay: optInResponse?.Data?.PlayingDisplay, IsUnpaid: optInResponse?.Data?.IsUnpaid }
                                : date
                        )
                    );
                    setIsOptInLoading(false);
                }
            } else {
                displayMessageModal({
                    title: 'Opt-In Error',
                    description: optInResponse?.Message,
                    type: "error",
                    size: "s"
                })
                setIsOptInLoading(false);
            }
        }
    }

    const optOutAjax = async (data, isFree) => {
        let leagueId = data.LeagueId;
        let isDisabled = !data.AllowToOptIn;
        let orgMemberId = data.OrgMemberId;
        let leagueSessionRegistrationId = data.LeagueSessionRegistrationId;
        let reservationId = data.ReservationId;
        let leagueSessionId = data.LeagueSessionId;
        let resId = data.ReservationId;
        isFree = true;

        if (isFree) {
            displayMessageModal({
                title: 'Opt-Out',
                description: 'Are you sure you want to Opt-Out?',
                type: "info",
                size: "s",
                submitButtonText: 'Yes, Opt-Out',
                onSubmit: async () => {
                    await new Promise(async (resolve) => {
                        setIsOptInLoading(true);

                        let optInResponse = await appService.post(`/app/Online/Leagues/OptOutOrgMemberPost?id=${orgId}&leagueId=${leagueId}&sessionId=${leagueSessionId}&resId=${reservationId}&orgMemberId=${orgMemberId}&orgMemberRegistrationId=${leagueSessionRegistrationId}&resId=${resId}&isAjaxCall=true`)
                        setIsOptInLoading(false);
                        resolve(true);

                        if (toBoolean(optInResponse?.isValid)) {
                            let respData = optInResponse?.Data?.Data;

                            setInnerLeaguesDates(prevDates =>
                                prevDates.map(date =>
                                    date.ReservationId === resId
                                        ? { ...date, IsOptIn: false, PlayingDisplay: respData?.LeagueSession?.PlayingDisplay, IsUnpaid: false }
                                        : date
                                )
                            );
                            pNotify('Successfully Opt-Out.');
                        } else {
                            setTimeout(function () {
                                displayMessageModal({
                                    title: "Opt-Out Error",
                                    description: (optInResponse?.Message),
                                    type: "error",
                                    size: "s"
                                })
                            }, 500)
                        }
                    });
                },
            })
        }
    }

    const optInButton = (data) => {
        let isDisabled = !data.AllowToOptIn;
        let isFreeLeaguePrice = getValueOrDefault(data.PriceToPay, 0) <= 0 || toBoolean(data.FamilyRegisteredMembersCount <= 1);
        let href = '';

        isFreeLeaguePrice = true;

        if (toBoolean(data.IsOptIn)) {
            //fix !toBoolean(isFreeLeaguePrice)
            if (toBoolean(isFreeLeaguePrice)) {
                return (
                    <Button htmlType='button' ghost={true}
                            type='primary'
                            disabled={isDisabled || inProgressStatus}
                            block={true}
                            loading={isOptInLoading}
                            danger={true}
                            onClick={() => {
                                optOutAjax(data, true);
                            }}>
                        OPT-OUT
                    </Button>
                )
            } else {
                return (
                    <Button htmlType='button'
                            ghost={true}
                            type='primary'
                            disabled={isDisabled || inProgressStatus}
                            block={true}
                            danger={true}
                            loading={isOptInLoading}
                            data-href={href}
                            className={cx('prevent-redirect btn-modal', buttonStyles.height44)}
                            onClick={() => {
                                //setIsOptInLoading(true);

                                //setTimeout(function () {
                                //	optOutAjax(data, true)
                                //}, 500)
                            }}>
                        OPT-OUT
                    </Button>
                )
            }
        } else {
            if (toBoolean(isFreeLeaguePrice)) {
                return (
                    <Button htmlType='button'
                            type='primary'
                            disabled={isDisabled}
                            loading={isOptInLoading}
                            onClick={() => {
                                setIsOptInLoading(true);

                                setTimeout(function () {
                                    optInAjax(data, true);
                                }, 500)
                            }}>
                        OPT-IN
                    </Button>
                )
            } else {
                return (
                    <Button htmlType='button'
                            type='primary'
                            disabled={isDisabled}
                            data-href={href}
                            loading={isOptInLoading}>
                        OPT-IN
                    </Button>
                )
            }
        }
    }
    
    return (
        <SwiperSlider count={countListItems(innerLeaguesDates)} arrows={true} fullWidth={true}>
            {innerLeaguesDates.map((leagueSessionDate, index) => {
                const tagClass = leagueSessionDate?.EventStatus === "Info" ? tagStyles.info : tagStyles.grey;

                const unpaidBadge = leagueSessionDate.IsUnpaid && (
                    <Tag key={`unpaid-${leagueSessionDate.LeagueSessionId}`} className={cx(globalStyles.tag, tagStyles.error)}>Unpaid</Tag>
                );

                const pinDisplay = !isNullOrEmpty(leagueSessionDate?.PinDisplay) && <Tag className={cx(globalStyles.tag, tagStyles.grey)}>{leagueSessionDate?.PinDisplay}</Tag>

                const statusBadge = leagueSessionDate.StatusDisplay && (
                    <Tag key={`status-${leagueSessionDate.LeagueSessionId}`} className={cx(globalStyles.tag, tagClass)}>
                        {leagueSessionDate.StatusDisplay}
                    </Tag>
                );

                const inProgress = leagueSessionDate.InProgress && (
                    <Tag key={`in-progress-${leagueSessionDate.LeagueSessionId}`} className={cx(globalStyles.tag, tagStyles.info)}>In Progress</Tag>
                )
                const isLastItem = index === leaguesDates.length - 1;
                const isOneItem = oneListItem(leaguesDates);
                
                return (
                    <Swiper.Item key={index} className={cx((!isOneItem && !isLastItem) && globalStyles.swiperItem, (!isOneItem && isLastItem) && globalStyles.swiperLastItem)}>
                        <>
                            <Card className={cx(globalStyles.card, globalStyles.clickableCard)}>
                                <Flex vertical={true} gap={12}>
                                    <Flex vertical={true} gap={8} onClick={() => navigate(`/league/details/${leagueSessionDate.Id}`)}>
                                        <Flex justify="space-between" align="center" >
                                            <Title level={3}>
                                                Game Day #{leagueSessionDate.GameDayNumber}
                                            </Title>

                                            <Flex gap={8}>
                                                {inProgress}
                                                {unpaidBadge}
                                                {pinDisplay}
                                                {statusBadge}
                                            </Flex>
                                        </Flex>

                                        <Flex vertical gap={2}>
                                            <CardIconLabel icon={'calendar-time'} description={leagueSessionDate.DisplayStartEndTime} size={22}/>

                                            {!isNullOrEmpty(leagueSessionDate.PlayingDisplay) &&
                                                <CardIconLabel icon={'group'} description={leagueSessionDate.PlayingDisplay} size={22}/>
                                            }
                                            {!isNullOrEmpty(leagueSessionDate.EventLocation) &&
                                                <CardIconLabel icon={'grid-2-light'} description={leagueSessionDate.EventLocation} size={22} />
                                            }
                                            {!isNullOrEmpty(leagueSessionDate.ClosedMessage) &&
                                                <CardIconLabel icon={'message'} description={leagueSessionDate.ClosedMessage} size={22}
                                                               iconColor={token.colorError}/>
                                            }
                                        </Flex>
                                    </Flex>

                                    {optInButton(leagueSessionDate)}
                                </Flex>
                            </Card>
                        </>
                    </Swiper.Item>
                )
            })}
        </SwiperSlider>
    );
};

export default ModernDashboardLeaguesDates
