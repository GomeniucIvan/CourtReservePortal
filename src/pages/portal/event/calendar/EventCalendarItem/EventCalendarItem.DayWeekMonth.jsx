import React, {useState} from 'react';
import {useApp} from "@/context/AppProvider.jsx";
import {data, useNavigate} from "react-router-dom";
import {Button, Flex, Tag, theme} from "antd";
import {useAuth} from "@/context/AuthProvider.jsx";
import {SchedulerItem} from "@/components/scheduler/partial/items/SchedulerItemDisplay.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";
import { cx } from 'antd-style';
const { useToken } = theme;

const EventCalendarItemDayWeekMonth = (props) => {
    const {setDynamicPages, globalStyles} = useApp();
    const {authData, orgId} = useAuth();
    const navigate = useNavigate();
    const dataItem = props.dataItem;
    const { token } = useToken();
    const {tagStyles} = useCombinedStyles();
    
    let showSignUpLink = toBoolean(authData?.AllowMembersToLogIntoThePortal) || !isNullOrEmpty(authData?.OrgMemberId);
    let eventTypeBgColor = dataItem.EventTypeBgColor;
    let eventTypeTextColor = dataItem.EventTypeTextColor;
    let isLeague = dataItem.IsLeague;
    
    let LeagueSessionId = dataItem.LeagueSessionId;

    let   InPast = dataItem.InPast;
    let   EventName = dataItem.EventName;
    let   displayOrganziersOnCalendar = dataItem.displayOrganziersOnCalendar;
    let    OranizersDisplay = dataItem.OranizersDisplay;
    let    DisplayOrganizersOnMemberPortal = dataItem.DisplayOrganizersOnMemberPortal;
    let    LeagueSessionName = dataItem.LeagueSessionName;
    let    TimeDisplay = dataItem.TimeDisplay;
    let    EventNote = dataItem.EventNote;
    let    ShowSlotInfo = dataItem.ShowSlotInfo;
    let    showEventAvailableSlotsOnMemberPortal = dataItem.showEventAvailableSlotsOnMemberPortal;
    let    SlotsInfo = dataItem.SlotsInfo;
    let     ShowLeagueSlotInfo = dataItem.ShowLeagueSlotInfo;
    let     LeagueSlotsInfo = dataItem.LeagueSlotsInfo;
    let    IsFull = dataItem.IsFull;
    let     isMemberLoggedIn = dataItem.isMemberLoggedIn;
    let   AllowWaitList = dataItem.AllowWaitList;
    let    IsMemberInWaitList = dataItem.IsMemberInWaitList;
    let    IsMemberRegistered = dataItem.IsMemberRegistered;
    let    OnlineSignUpOff = dataItem.OnlineSignUpOff;
    let    isMobileLayout = true;
    let RegistrationOpen = dataItem.RegistrationOpen;
    let CanSignUp = dataItem.CanSignUp;
    let EventId = dataItem.EventId;
    let ReservationId = dataItem.ReservationId;



    const onItemClick = () => {
        if (toBoolean(showSignUpLink)) {
            let urlDetails = `/Online/Events/Details/${orgId}/${dataItem.Number}`;
            if (isLeague) {
                urlDetails = `/Online/Leagues/Details/${orgId}/${LeagueSessionId}`;
            }
            
            navigate(urlDetails);
        }
    }
    
    return (
        <SchedulerItem
            //onMouseEnter={() => setIsHovered(true)}
            //onMouseLeave={() => setIsHovered(false)}
            {...props}
            
            style={{
                ...props.style,
                //minHeight: '80px',
                fontSize: '11px'
            }}
        >
            <Flex
                justify="center"
                vertical={true}
                onClick={onItemClick}
                style={{background: eventTypeBgColor, color: eventTypeTextColor, height: '100%'}}
                className={`event-calendar-month ${InPast ? "past-k-event" : ""} ${showSignUpLink ? "link-k-event" : ""}`}
            >
                <div style={{margin: 'auto'}}>
                    <Flex
                        justify="center"
                        style={{color: eventTypeTextColor}}
                    >
                        <span>{EventName}</span>
                        {displayOrganziersOnCalendar &&
                            OranizersDisplay &&
                            OranizersDisplay.length > 1 &&
                            DisplayOrganizersOnMemberPortal && (
                                <span> ({OranizersDisplay})</span>
                            )}
                    </Flex>
                    
                    {isLeague && <Flex justify="center">{LeagueSessionName}</Flex>}
                    <Flex justify="center">{TimeDisplay}</Flex>
                    
                    {EventNote && EventNote.length > 1 && (
                        <Flex justify="center">{EventNote}</Flex>
                    )}
                    
                    {ShowSlotInfo && !InPast && showEventAvailableSlotsOnMemberPortal && (
                        <Flex justify="center" style={{fontStyle: "italic"}}>{SlotsInfo}</Flex>
                    )}
                    
                    {ShowLeagueSlotInfo && !InPast && showEventAvailableSlotsOnMemberPortal && (
                        <Flex justify="center" style={{fontStyle: "italic"}}>{LeagueSlotsInfo}</Flex>
                    )}

                    {InPast ? null : (
                        <div>
                            {IsFull && (
                                <div style={{textAlign: "center"}}>
                                    <Tag className={cx(globalStyles.tag, tagStyles.error)} style={{lineHeight: '16px'}}>FULL</Tag>
                                    {isMemberLoggedIn && AllowWaitList && !IsMemberInWaitList && !IsMemberRegistered && !OnlineSignUpOff && !isMobileLayout && RegistrationOpen && !isLeague && (
                                        <Button type="primary"
                                                href={`/Online/Events/SignUpToWaitingList/${orgId}?eventId=${EventId}&reservationId=${ReservationId}`}>
                                            Join Waitlist
                                        </Button>
                                    )}
                                    {IsMemberRegistered && (
                                        <Tag color="gray">Registered</Tag>
                                    )}
                                    {IsMemberInWaitList && !isMobileLayout && (
                                        <Tag color="gray">In Waitlist</Tag>
                                    )}
                                </div>
                            )}

                            {(CanSignUp || true) && showSignUpLink && (
                                <div style={{textAlign: "center"}}>
                                    {IsMemberRegistered ? (
                                        <div style={{color: eventTypeTextColor}}>
                                            EDIT REGISTRATION
                                        </div>
                                    ) : (
                                        (!IsFull || (AllowWaitList && IsFull && isMobileLayout)) && (
                                            <div style={{fontWeight: "bold", color: eventTypeTextColor}}>
                                                {isMobileLayout && IsFull && AllowWaitList ? (
                                                    IsMemberInWaitList ? "EDIT WAITLIST" : "JOIN WAITLIST"
                                                ) : CanSignUp ? (
                                                    "REGISTER"
                                                ) : (
                                                    "Details"
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {isMemberLoggedIn && (
                                <div style={{fontWeight: "bold", color: eventTypeTextColor}}>
                                    DETAILS
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Flex>
        </SchedulerItem>
    );
};


export default EventCalendarItemDayWeekMonth;