import {useNavigate, useParams} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import React, {useEffect, useState} from "react";
import mockData from "@/mocks/event-data.json";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Tabs, Tag, Typography} from "antd";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import InlineBlock from "@/components/inlineblock/InlineBlock.jsx";
import {cx} from "antd-style";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {anyInList, encodeParamsObject, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {isNullOrEmptyHtmlCode} from "@/utils/HtmlUtils.jsx";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import {dateTimeToFormat, dateTimeToTimes} from "@/utils/DateUtils.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";
import {getConfigValue} from "@/config/WebConfig.jsx";
import {eReplace} from "@/utils/TranslateUtils.jsx";
import {any} from "prop-types";
import EventDetailsMyRegistration from "@portal/event/details/EventDetails.MyRegistration.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {LeagueRouteNames} from "@/routes/LeagueRoutes.jsx";
import EventDetailsPartial from "@portal/event/modules/EventDetailsPartial.jsx";

const {Title, Text} = Typography;

function EventDetails() {
    const navigate = useNavigate();
    let {number} = useParams();
    const [event, setEvent] = useState(null);
    const [registration, setRegistration] = useState(null);
    const {orgId, authData} = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [buttonsCount, setButtonsCount] = useState(0);
    const [additionalDates, setAdditionalDates] = useState(null);
    const [additionalDatesLoading, setAdditionalDatesLoading] = useState(false);
    const {buttonStyles} = useCombinedStyles();
    let clubsToRestrictUpdateWithdrawForEvents = getConfigValue('ClubsToRestrictUpdateWithdrawForEvents');
    
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    
    let {
        setIsFooterVisible,
        isMockData,
        shouldFetch, 
        resetFetch,
        setFooterContent,
        token,
        globalStyles,
        setDynamicPages,
        setIsLoading
    } = useApp();

    const loadData = async (refresh) => {
        if (isMockData) {
            const details = mockData.details;
            setEvent(details);
        } else {
            setIsFetching(true);
            let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/ApiDetails?id=${orgId}&number=${number}&memberId=${authData?.MemberId}`);
            if (response.IsValid){
                const data = response.Data;
                const registrationData = data.RegistrationData;
                setEvent(data.EventData);
                setHeaderTitle(data.EventData.EventName)
                setButtonsCount((toBoolean(registrationData.ShowJoinWailistBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowRegisterBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowRegisterForDateBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowRegisterForFullEventBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowRequireUpfrontPaymentBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowPaymentBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowEditRegistrationBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowWithdrawBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowUnsubscribeFromWaitlistBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowEditWaitlistBtn) ? 1 : 0)
                )
                
                setRegistration(registrationData);
                setIsFetching(false);
                setIsLoading(false);
            }
        }
        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent('');
        loadData();
    }, []);

    const loadAdditionalDates = async () => {
       let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/Event_GetAdditionalDates?id=${orgId}&uiCulture=${authData.UiCulture}&eventId=${event.EventId}&allowDropIns=${event.AllowDropIns}&leftReservationsCount=${event.LeftReservationsCount}&costTypeID=${event.MembershipId}&isHybridEvent=${(event.AllowDropIns && event.AllowFullEventPrice)}&hidePricing=${event.HidePricing}&showSlotInfo=${event.ShowSlowInfo}&allowWaitList=${event.AllowWaitList}`)

        if (toBoolean(response?.IsValid)){
            setAdditionalDates(response.Data.Dates);
        }
    }

    useEffect(() => {
        if (additionalDatesLoading){
            loadAdditionalDates();
        }

    }, [additionalDatesLoading]);
    
    const tabContent = (key) => {
        if (equalString(key, 1)) {
            //my registration
            return (
                <PaddingBlock onlyBottom={true}>
                    <EventDetailsMyRegistration model={event} />
                </PaddingBlock>
            )
        }
        
        if (equalString(key, 2)) {
            //description
            return (
                <PaddingBlock onlyBottom={true}>
                    <IframeContent content={event?.EventDescription} id={'event-description'} />
                </PaddingBlock>
            )
        }

        if (equalString(key, 3)) {
            //registrants
            const registeringResMembers = event?.AllRegisteredMembers.filter(d => toBoolean(d.IsApproved));
            let registeringMembers = [];

            registeringResMembers.forEach(resMember => {
                registeringMembers.push(resMember);

                if (anyInList(event?.ReservationGuests)){
                    const memberGuests = event.ReservationGuests.filter(v => equalString(v.GetGuestOrgMemberId, resMember.OrganizationMemberId));
                    memberGuests.forEach(resGuest => {
                        registeringMembers.push({
                            FirstName: resGuest.FirstName,
                            LastName: `${resGuest.LastName} (G)`,
                            Email: resGuest.Email,
                            UdfString: resGuest.UdfJson,
                            OrganizationMemberId: resGuest.OrganizationMemberId ?? 0,
                            GuestOwnerFullName: resGuest.OwnerFullName,
                        });
                    });
                }
            });

            if (anyInList(event?.ReservationGuests)) {
                registeringMembers.push(
                    ...event.ReservationGuests
                        .filter(c => (c.GetGuestOrgMemberId ?? 0) === 0)
                        .map(resGuest => ({
                            FirstName: resGuest.FirstName,
                            LastName: `${resGuest.LastName} (G)`,
                            Email: resGuest.Email,
                            UdfString: resGuest.UdfJson,
                            OrganizationMemberId: resGuest.OrganizationMemberId ?? 0,
                            GuestOwnerFullName: resGuest.OwnerFullName,
                        }))
                );
            }
            
            return (
                <PaddingBlock onlyBottom={true}>
                    {anyInList(registeringMembers) &&
                        <Card className={globalStyles.card}>
                            {registeringMembers.map((member, index) => {
                                const isLastIndex = index === registeringMembers.length - 1;
                                
                                return (
                                    <Flex key={index} vertical={true}>
                                        <Flex justify={'space-between'} align={'center'}>
                                            <Text>{member.FirstName} {member.LastName}</Text>
                                        </Flex>
                                        {(!isLastIndex) &&
                                            <Divider style={{marginTop: token.paddingLG, marginBottom: token.paddingLG}}/>
                                        }
                                    </Flex>
                                )
                            })}
                        </Card>
                    }
                </PaddingBlock>
            )
        }
        
        if (equalString(key, 4)){
            //dates
            if (isNullOrEmpty(additionalDates)){
                if (!additionalDatesLoading){
                    setAdditionalDatesLoading(true);
                }
                return (
                    <PaddingBlock onlyBottom={true}>
                        <Flex vertical={true} gap={4}>
                            {emptyArray(event.LeftReservationsCount).map((item, index) => (
                                <div key={index}>
                                    <Skeleton.Button active={true} block style={{height: `80px`}}/>
                                </div>
                            ))}
                        </Flex>
                    </PaddingBlock>
                )
            } else{
                return (
                    <PaddingBlock onlyBottom={true}>
                        <Flex vertical={true} gap={token.padding / 2}>
                            {additionalDates.map((additionalDate, index) => (
                                <div key={index}>
                                    <Card className={cx(globalStyles.card, globalStyles.clickableCard, globalStyles.cardSMPadding)}>
                                        <Flex vertical={true} gap={4}>
                                            <CardIconLabel icon={'calendar'} description={dateTimeToFormat(additionalDate.Start, 'ddd, MMM Do')}/>
                                            <CardIconLabel icon={'clock'} description={dateTimeToTimes(additionalDate.Start, additionalDate.End, 'friendly')}/>

                                            {!isNullOrEmpty(event?.HidePricing) &&
                                                <CardIconLabel icon={'price-tag'} description={costDisplay(additionalDate?.GetOccurrencePrice)}/>
                                            }
                                        </Flex>
                                    </Card>
                                </div>
                            ))}
                        </Flex>
                    </PaddingBlock>
                )
            }
        }
        
        if (equalString(key, 5)){
            //restrictions

            return (
                <PaddingBlock onlyBottom={true}>
                    <Flex vertical={true} gap={4}>
                        {!isNullOrEmpty(event?.GenderRestriction) &&
                            <Text><strong>Gender:</strong> {event?.GenderRestriction}</Text>
                        }
                        {(!isNullOrEmpty(event?.MinAgeRestriction) && !isNullOrEmpty(event?.MaxAgeRestriction)) &&
                            <Text><strong>Age:</strong> Min Age {event?.MinAgeRestriction}, Max Age {event?.MaxAgeRestriction}</Text>
                        }
                        {(!isNullOrEmpty(event?.MinAgeRestriction) && isNullOrEmpty(event?.MaxAgeRestriction)) &&
                            <Text><strong>Age:</strong> Min Age {event?.MinAgeRestriction}</Text>
                        }
                        {(isNullOrEmpty(event?.MinAgeRestriction) && !isNullOrEmpty(event?.MaxAgeRestriction)) &&
                            <Text><strong>Age:</strong> Max Age {event?.MaxAgeRestriction}</Text>
                        }

                        <Text><strong>CATEGORY:</strong> TO IMPLEMENT</Text>
                    </Flex>
                </PaddingBlock>
            )
        }
        
        return (
            <PaddingBlock onlyBottom={true}>
                {key}
            </PaddingBlock>
        )
    }

    const registrationTabs = () => {
        if (!anyInList(registration?.Tabs)){
            return [];
        }
        
        let tabs = registration?.Tabs.map(registrationTab => ({
            label: equalString(registrationTab.TabNameEnum, 4) ? `Dates (${event?.LeftReservationsCount})` : registrationTab.TabNameToDisplay,
            key: registrationTab.TabNameEnum,
            children: tabContent(registrationTab.TabNameEnum)
        }));
        
        if (!toBoolean(registration?.ShowRegistrationTab)){
            tabs = tabs.filter(registrationTab => !equalString(registrationTab.key, "1")); 
        }
        
        if (isNullOrEmptyHtmlCode(event?.EventDescription)){
            tabs = tabs.filter(registrationTab => !equalString(registrationTab.key, "2"));
        }

        if (!toBoolean(registration?.ShowRegistrantsTab)){
            tabs = tabs.filter(registrationTab => !equalString(registrationTab.key, "3"));
        }
        
        const showAdditionalDates = !isNullOrEmpty(event?.LeftReservationsCount) && event?.LeftReservationsCount > 1 && toBoolean(event?.AllowDropIns);
        if (showAdditionalDates){
            //show
        } else{
            tabs = tabs.filter(registrationTab => !equalString(registrationTab.key, "4"));
        }
        
        if (!isNullOrEmpty(event?.GenderRestriction) ||
            !isNullOrEmpty(event?.MinAgeRestriction) ||
            !isNullOrEmpty(event?.MaxAgeRestriction) ||
            (!isNullOrEmpty(event?.EventRatingCategoriesRestriction) && event?.EventRatingCategoriesRestriction.Count > 0)){
            tabs = [
                ...tabs,
                {
                    label: "Restriction(s)", 
                    key: 5,
                    children: tabContent(5)
                }
            ];
        }
        
        return tabs;
    }
    
    return (
        <>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={16}>
                        {emptyArray(15).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button active={true} block style={{height: `50px`}}/>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
            <>
                <PaddingBlock onlyTop={true}>
                    <EventDetailsPartial event={event} registration={registration} />

                    {buttonsCount > 0 &&
                        <PaddingBlock topBottom={true} leftRight={false}>
                            <InlineBlock vertical={buttonsCount > 2}>
                                {toBoolean(registration?.ShowJoinWailistBtn) &&
                                    <Button type="primary"
                                            block
                                            className={buttonStyles.buttonYellow}
                                            onClick={() => {
                                                let route = toRoute(EventRouteNames.EVENT_JOIN_WAITLIST, 'id', orgId);
                                                navigate(`${route}?eventId=${event.EventId}&reservationId=${event.ReservationId}&action=waitlist`);
                                            }}
                                            htmlType={'button'}>
                                        Join Waitlist
                                    </Button>
                                }

                                {toBoolean(registration?.ShowRegisterBtn) &&
                                    <Button type="primary"
                                            block
                                            onClick={() => {
                                                let route = toRoute(EventRouteNames.EVENT_SIGNUP, 'id', orgId);
                                                route = `${route}?eventId=${event.EventId}&reservationId=${event.ReservationId}&reservationNumber=${event.ReservationNumber}`;
                                                setPage(setDynamicPages, event.EventName, route);
                                                navigate(route);
                                            }}
                                            htmlType={'button'}>
                                        Register
                                    </Button>
                                }

                                {toBoolean(registration?.ShowRegisterForDateBtn) &&
                                    <Button type="primary"
                                            block
                                            onClick={() => {
                                                let route = toRoute(EventRouteNames.EVENT_SIGNUP, 'id', orgId);
                                                route = `${route}?eventId=${event.EventId}&reservationId=${event.ReservationId}&reservationNumber=${event.ReservationNumber}`;
                                                setPage(setDynamicPages, event.EventName, route);
                                                navigate(route);
                                            }}
                                            htmlType={'button'}>
                                        Register for {registration?.FriendlyMdDate}
                                    </Button>
                                }

                                {toBoolean(registration?.ShowRegisterForFullEventBtn) &&
                                    <Button type="primary"
                                            block
                                            onClick={() => {
                                                let route = toRoute(EventRouteNames.EVENT_SIGNUP, 'id', orgId);
                                                route = `${route}?eventId=${event.EventId}&reservationId=${event.ReservationId}&reservationNumber=${event.ReservationNumber}&isFullEventReg=true`;
                                                setPage(setDynamicPages, event.EventName, route);
                                                navigate(route);
                                            }}
                                            htmlType={'button'}>
                                        {eReplace('Register to Full Event')}
                                    </Button>
                                }

                                {(toBoolean(registration?.ShowEditRegistrationBtn)) &&
                                    <Button type="primary"
                                            block
                                            onClick={() => {
                                                let route = toRoute(EventRouteNames.EVENT_CHANGE_SIGNUP, 'id', orgId);
                                                route = `${route}?eventId=${event.EventId}&reservationId=${event.ReservationId}`;
                                                setPage(setDynamicPages, event.EventName, route);
                                                navigate(route);
                                            }}
                                            htmlType={'button'}>
                                        Edit Registration
                                    </Button>
                                }
                                
                                {toBoolean(registration?.ShowPaymentBtn) &&
                                    <Button type="primary"
                                            block
                                            className={buttonStyles.buttonBlue}
                                            onClick={() => {
                                                let route = toRoute(ProfileRouteNames.PROCESS_PAYMENT, 'id', orgId);
                                                navigate(`${route}?reservationId=${event.ReservationId}`);
                                            }}
                                            htmlType={'button'}>
                                        Pay
                                    </Button>
                                }

                                {toBoolean(registration?.ShowRequireUpfrontPaymentBtn) &&
                                    <Button type="primary"
                                            block
                                            onClick={() => {
                                                let route = toRoute(ProfileRouteNames.PROCESS_PAYMENT, 'id', orgId);
                                                navigate(route);
                                            }}
                                            className={buttonStyles.buttonBlue}
                                            htmlType={'button'}>
                                        Pay
                                    </Button>
                                }

                                {toBoolean(registration?.ShowWithdrawBtn) &&
                                    <Button type="primary"
                                            danger
                                            block
                                            ghost
                                            onClick={() => {
                                                let route = toRoute(EventRouteNames.EVENT_WITHDRAWN, 'id', orgId);
                                                route = `${route}?eventId=${event.EventId}&reservationId=${event.ReservationId}`;
                                                setPage(setDynamicPages, event.EventName, route);
                                                navigate(route);
                                            }}
                                            htmlType={'button'}>
                                        Withdraw
                                    </Button>
                                }

                                {toBoolean(registration?.ShowUnsubscribeFromWaitlistBtn) &&
                                    <Button type="primary"
                                            danger
                                            block
                                            ghost
                                            className={buttonStyles.buttonYellow}
                                            onClick={() => {
                                                let route = toRoute(EventRouteNames.EVENT_JOIN_WAITLIST, 'id', orgId);
                                                navigate(`${route}?eventId=${event.EventId}&reservationId=${event.ReservationId}&action=waitlist-unsubscribe`);
                                            }}
                                            htmlType={'button'}>
                                        Withdraw from Waitlist
                                    </Button>
                                }

                                {toBoolean(registration?.ShowEditWaitlistBtn) &&
                                    <Button type="primary"
                                            block
                                            ghost
                                            className={buttonStyles.buttonYellow}
                                            onClick={() => {
                                                let route = toRoute(EventRouteNames.EVENT_JOIN_WAITLIST, 'id', orgId);
                                                navigate(`${route}?eventId=${event.EventId}&reservationId=${event.ReservationId}&action=waitlist-edit`);
                                            }}
                                            htmlType={'button'}>
                                        Edit Waitlist
                                    </Button>
                                }
                            </InlineBlock>
                        </PaddingBlock>
                    }
                    
                    {/*<div>*/}
                    {/*    <Button onClick={() => {*/}
                    {/*        let route = toRoute(EventRouteNames.EVENT_SIGNUP, 'id', event?.ReservationId);*/}
                    {/*        setPage(setDynamicPages, event?.EventName, route);*/}
                    {/*        navigate(route);*/}
                    {/*    }}>*/}
                    {/*        SIGNUP*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </PaddingBlock>

                {anyInList(registrationTabs()) &&
                    <Tabs
                        rootClassName={cx(globalStyles.tabs, registrationTabs().length <= 2 && globalStyles.leftTabs, registrationTabs().length > 3 && globalStyles.scrollableTabs)}
                        defaultActiveKey="1"
                        items={registrationTabs()}
                    />
                }
            </>
            }
        </>
    )
}

export default EventDetails
