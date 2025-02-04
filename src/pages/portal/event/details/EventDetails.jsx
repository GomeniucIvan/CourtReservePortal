import {useNavigate, useParams} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import React, {useEffect, useState} from "react";
import mockData from "@/mocks/event-data.json";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Flex, Skeleton, Tabs, Tag, Typography} from "antd";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import InlineBlock from "@/components/inlineblock/InlineBlock.jsx";
import {cx} from "antd-style";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {isNullOrEmptyHtmlCode} from "@/utils/HtmlUtils.jsx";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import {dateTimeToFormat, dateTimeToTimes} from "@/utils/DateUtils.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";

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

    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    
    let {
        setIsFooterVisible,
        isMockData,
        shouldFetch, 
        resetFetch,
        setFooterContent,
        token,
        globalStyles,
        setDynamicPages
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
        console.log(response)
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

        if (equalString(key, 2)) {
            //description
            return (
                <PaddingBlock onlyBottom={true}>
                    <IframeContent content={event?.EventDescription} id={'event-description'} />
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

        if (!toBoolean(registration?.ShowRegistrationTab)){
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
                    {anyInList(event?.EventTags) &&
                        <Flex gap={token.padding/2}>
                            {event.EventTags.map(eventTag => (
                                <Tag color={eventTag.TextColor} key={eventTag.EventTagId} style={{ backgroundColor: eventTag.BackgroundColor }} className={globalStyles.tag}>{eventTag.Name}</Tag>
                            ))}
                        </Flex>
                    }
                    
                    <div style={{marginBottom: `${token.padding}px`}}>
                        <Title level={3} style={{marginBottom: 0}}>
                            {event?.EventName}

                            {toBoolean(event?.IsFeatured) &&
                                <Tag color="default" className={globalStyles.tag}>Featured</Tag>
                            }
                        </Title>
                        <Text type="secondary">{event?.EventType}</Text>
                    </div>

                    <Flex vertical gap={4}>
                        {!isNullOrEmpty(registration?.CalendarDate) &&
                            <CardIconLabel icon={'calendar'} description={registration?.CalendarDate}/>
                        }

                        {!isNullOrEmpty(registration?.CalendarDates) &&
                            <CardIconLabel icon={'dates'} description={registration?.CalendarDates}/>
                        }
                        
                        {!isNullOrEmpty(registration?.Clock) &&
                            <CardIconLabel icon={'clock'} description={registration?.Clock}/>
                        }

                        {!isNullOrEmpty(registration?.FullPriceData) &&
                            <CardIconLabel icon={'price-tag'} description={registration?.FullPriceData}/>
                        }

                        {!isNullOrEmpty(registration?.SinglePriceData) &&
                            <CardIconLabel icon={'price-tag'} description={registration?.SinglePriceData}/>
                        }

                        {!isNullOrEmpty(registration?.SignUpNoDropInMessage) &&
                            <CardIconLabel icon={'alert'} description={registration?.SignUpNoDropInMessage}/>
                        }

                        {!isNullOrEmpty(registration?.SignUpDropInMessage) &&
                            <CardIconLabel icon={'alert'} description={registration?.SignUpDropInMessage}/>
                        }

                        {!isNullOrEmpty(registration?.SlotsInfo) &&
                            <CardIconLabel icon={'alert'} description={registration?.SlotsInfo}/>
                        }

                        {!isNullOrEmpty(event?.DisplayRequiredParticipant) &&
                            <CardIconLabel icon={'hourglass'} description={event?.DisplayRequiredParticipant}/>
                        }

                        {(toBoolean(event?.DisplayOrganizersOnMemberPortal) && 
                                toBoolean(event?.DisplayOrganizersOnPublicCalendars) &&
                                !isNullOrEmpty(event?.OrganizersDisplay)) &&
                            <CardIconLabel icon={'instructor'} description={event?.OrganizersDisplay}/>
                        }
                        {!isNullOrEmpty(event?.PinCode) &&
                            <CardIconLabel icon={'event-pincode'} description={event?.PinCode}/>
                        }
                        {(!isNullOrEmpty(event?.Courts) && !toBoolean(event?.IsCourtAssignmentHiddenOnPortal))  &&
                            <CardIconLabel icon={'event-courts'} description={event?.Courts}/>
                        }

                        {anyInList(event?.EventUdfs) &&
                            <>
                                {event.EventUdfs
                                    .filter((udf) =>  !isNullOrEmpty(udf.Val)) 
                                    .map((udf, index) => (
                                        <CardIconLabel icon={'event-courts'} description={`<strong>${udf.Name}</strong> ${udf?.Val}`}/>
                                    ))}
                            </>
                        }

                        {anyInList(event?.MemberGroups) && (
                            <CardIconLabel icon={'member-group'} description={event.MemberGroups.map((group) => group.Name).join(", ")} />
                        )}
                        {!isNullOrEmpty(event?.EventNote) &&
                            <CardIconLabel icon={'note'} description={event?.EventNote}/>
                        }
                    </Flex>

                    {buttonsCount > 0 &&
                        <PaddingBlock topBottom={true} leftRight={false}>
                            <InlineBlock vertical={buttonsCount > 2}>
                                {toBoolean(registration?.ShowJoinWailistBtn) &&
                                    <Button type="primary"
                                            block
                                            className={buttonStyles.buttonYellow}
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
                                                let route = toRoute(EventRouteNames.EVENT_FULL_SIGNUP, 'reservationId', event.ReservationId);
                                                route = toRoute(route, 'eventId', event.EventId);
                                                setPage(setDynamicPages, event.EventName, route);
                                                navigate(route);
                                            }}
                                            htmlType={'button'}>
                                        Register to Full Event
                                    </Button>
                                }

                                {toBoolean(registration?.ShowPaymentBtn) &&
                                    <Button type="primary"
                                            block
                                            className={buttonStyles.buttonBlue}
                                            htmlType={'button'}>
                                        Pay
                                    </Button>
                                }

                                {toBoolean(registration?.ShowRequireUpfrontPaymentBtn) &&
                                    <Button type="primary"
                                            block
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
                                            htmlType={'button'}>
                                        Withdraw from Waitlist
                                    </Button>
                                }

                                {toBoolean(registration?.ShowEditWaitlistBtn) &&
                                    <Button type="primary"
                                            block
                                            ghost
                                            className={buttonStyles.buttonYellow}
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
                        // items={[
                        //     {
                        //         label: 'Players (3)',
                        //         key: 'players',
                        //         children: tabContent('players')
                        //     },
                        //     {
                        //         label: 'Match Details',
                        //         key: 'matchdetails',
                        //         children: tabContent('matchdetails')
                        //     },
                        //     {
                        //         label: 'Misc. Items',
                        //         key: 'misc',
                        //         children: tabContent('misc')
                        //     },
                        //     {
                        //         label: 'Additional',
                        //         key: 'additional',
                        //         children: tabContent('additional')
                        //     },
                        // ]}
                    />
                }
            </>
            }
        </>
    )
}

export default EventDetails
