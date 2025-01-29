import React, {useState} from 'react';
import {SchedulerItem} from "@/components/scheduler/partial/items/SchedulerItemDisplay.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {useNavigate} from "react-router-dom";
import {Button, Card, theme, Typography} from "antd";
import {isMemberSignUp} from "@/utils/SchedulerUtils.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {stringToJson} from "@/utils/ListUtils.jsx";
import {SchedulerSlot} from "@/components/scheduler/partial/slots/SchedulerSlotDisplay.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
const { useToken } = theme;

const {Text} = Typography;

const ConsolidatedSchedulerSlot = (props) => {
    console.log(props)
    let dataItem = props.dataItem;

    let IsWaitListSlot = dataItem.IsWaitListSlot;
    let IsAvailableTemplate = dataItem.IsAvailableTemplate;
    let IsCourtAssignmentHiddenOnPortal = dataItem.IsCourtAssignmentHiddenOnPortal;
    let AvailableCourts = dataItem.AvailableCourts;
    let MemberIds = dataItem.MemberIds;
    let QueuedMembers = dataItem.QueuedMembers;
    let ShowWaitList = dataItem.ShowWaitList;
    let queuedOrder = dataItem.queuedOrder;
    let ShowCourtWaitlistOrderNumber = dataItem.ShowCourtWaitlistOrderNumber;
    let WaitListCount = dataItem.WaitListCount;
    let showQueueNumber = dataItem.showQueueNumber;
    let showInWaitingCount = dataItem.showInWaitingCount;
    let IsClosed = dataItem.IsClosed;
    let IsInPast = dataItem.IsInPast;
    let hideCourtsCount = dataItem.hideCourtsCount;
    let AvailableCourtsCount = dataItem.AvailableCourtsCount;
    let embedCodeCall = dataItem.embedCodeCall;
    let urlPref = dataItem.urlPref;
    let SchedulerId = dataItem.SchedulerId;

    const handleWaitlistClick = () => {
        pNotify('handleWaitlistClick')
    }
    const handleReserveClick = () => {
        pNotify('handleReserveClick')
    }


    if (IsWaitListSlot) {
        if (IsAvailableTemplate) {
            return (
                <SchedulerItem
                    {...props}
                    style={{
                        ...props.style
                    }}
                >
                    <Card
                        style={{ backgroundColor: '#cdf5b6', color: '#3a3a3a' }}
                        className="main-reservation-container"
                    >
                        <div className="reservation-container">
                            <Text style={{ fontWeight: 500, fontSize: 'large' }}>
                                {IsCourtAssignmentHiddenOnPortal ? 'Available' : `${AvailableCourts} available`}
                            </Text>
                        </div>
                    </Card>
                </SchedulerItem>
            );
        } else {
            const isInWaitlist = isMemberSignUp(MemberIds);
            const waitlistClass = isInWaitlist ? 'my-wl-section' : '';
            const orderNumber = queuedOrder(QueuedMembers);
            const showOrderNumber =
                ShowCourtWaitlistOrderNumber && orderNumber != null && showQueueNumber;
            const showWaitlistCount = !showOrderNumber && showInWaitingCount;

            return (
                <SchedulerItem
                    {...props}
                    style={{
                        ...props.style
                    }}
                >

                    <Card
                        className={`main-reservation-container org-sch-wl-template ${waitlistClass}`}
                        style={{ cursor: 'pointer' }}
                        onClick={handleWaitlistClick}
                    >
                        <div className="reservation-container">
                            <Text style={{ fontWeight: 500, fontSize: 'large' }}>
                                {isInWaitlist ? 'Edit Waitlist' : 'Join Waitlist'}
                            </Text>
                            {ShowWaitList && (
                                <>
                                    {showOrderNumber && (
                                        <Text style={{ fontSize: '10px' }} className={`nr_${SchedulerId}`}>
                                            {orderNumber}
                                        </Text>
                                    )}
                                    {showWaitlistCount && (
                                        <Text style={{ fontSize: '10px' }}>{WaitListCount} waiting</Text>
                                    )}
                                </>
                            )}
                        </div>
                    </Card>
                </SchedulerItem>
            );
        }
    } else {
        if (IsClosed) {
            return (
                <SchedulerItem
                    {...props}
                    style={{
                        ...props.style
                    }}
                >

                    <Card className="schedule-Event-Container">
                        <Text className="consolidate-text closed-consolidated-sch-span">
                            UNAVAILABLE
                        </Text>
                    </Card>
                </SchedulerItem>
            );
        } else if (IsInPast) {
            return (
                <SchedulerItem
                    {...props}
                    style={{
                        ...props.style
                    }}
                >

                    <Card className="schedule-Event-Container">
                        <div className="consolidate-item-container inPast-courts-container">
                            <Text className="consolidate-text">Unavailable (Date Has Passed)</Text>
                        </div>
                    </Card>
                </SchedulerItem>
            );
        } else if (AvailableCourts === 0) {
            return (
                <SchedulerItem
                    {...props}
                    style={{
                        ...props.style
                    }}
                >

                    <Card className="schedule-Event-Container">
                        <div className="consolidate-item-container not-available-courts-container">
                            <Text className="consolidate-text">None Available</Text>
                        </div>
                    </Card>
                </SchedulerItem>
            );
        } else {
            return (
                <SchedulerItem
                    {...props}
                    style={{
                        ...props.style
                    }}
                >

                    <Card className="schedule-Event-Container">
                        <div className="consolidate-item-container available-courts-container">
                            <Button
                                type="primary"
                                className="slot-btn btn-consolidate-slot"
                                onClick={handleReserveClick}
                            >
                                {hideCourtsCount ? (
                                    'Reserve'
                                ) : (
                                    <span> <span>{AvailableCourts}</span> Available </span>
                                )}
                            </Button>
                        </div>
                    </Card>
                </SchedulerItem>
            );
        }
    }


    return (
        <>
            <SchedulerSlot
                {...props}
                style={{ ...props.style, backgroundColor: props.isAllDay ? 'lightgray' : 'darkgray' }}
            >
                Test33
            </SchedulerSlot>
        </>
    );
};


export default ConsolidatedSchedulerSlot;