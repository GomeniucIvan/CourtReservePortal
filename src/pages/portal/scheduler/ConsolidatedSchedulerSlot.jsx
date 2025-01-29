import React from 'react';
import {SchedulerItem} from "@/components/scheduler/partial/items/SchedulerItemDisplay.jsx";
import {useStyles} from "./styles.jsx";
import {Button, Flex, theme, Typography} from "antd";
import {isMemberSignUp, queuedOrder} from "@/utils/SchedulerUtils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import { cx } from 'antd-style';
import {useApp} from "@/context/AppProvider.jsx";

const {Text} = Typography;

const ConsolidatedSchedulerSlot = (props) => {

    let dataItem = props.dataItem;

    let IsWaitListSlot = dataItem.IsWaitListSlot;
    let IsAvailableTemplate = dataItem.IsAvailableTemplate;
    let IsCourtAssignmentHiddenOnPortal = dataItem.IsCourtAssignmentHiddenOnPortal;
    let AvailableCourts = dataItem.AvailableCourts;
    let MemberIds = dataItem.MemberIds;
    let QueuedMembers = dataItem.QueuedMembers;
    let ShowWaitList = dataItem.ShowWaitList;
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

    const {styles} = useStyles();
    const {token} = useApp();
    
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
                    <Flex align={'center'} justify={'center'} className={styles.availableWaitListSlot}>
                        <Text style={{color: '#3a3a3a'}}>
                            {IsCourtAssignmentHiddenOnPortal ? 'Available' : `${AvailableCourts} available`}
                        </Text>
                    </Flex>
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
                    <Flex align={'center'} 
                          justify={'center'}
                          onClick={handleWaitlistClick}
                          className={cx(styles.joinWaitlist, isInWaitlist && styles.editWaitlist)}>
                        <Text style={{color: token.colorOrgText}}>{isInWaitlist ? 'Edit Waitlist' : 'Join Waitlist'}</Text>
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
                    </Flex>
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
                    <Flex align={'center'} justify={'center'} className={styles.unavailableCell}>
                        <Text>Unavailable</Text>
                    </Flex>
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
                    <Flex align={'center'} justify={'center'} className={styles.unavailableCell}>
                        <Text>Unavailable</Text>
                    </Flex>
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
                    <Flex align={'center'} justify={'center'} className={styles.noneAvailable}>
                        <Text style={{color: '#ffffff'}}>None Available</Text>
                    </Flex>
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
                    <Flex align={'center'} justify={'center'} className={styles.availableSlot}>
                        <Text style={{color: token.colorOrgText}}>
                            {hideCourtsCount ? (
                                'Reserve'
                            ) : (
                                <>{`${AvailableCourts} Available`}</>
                            )}
                        </Text>
                    </Flex>
                </SchedulerItem>
            );
        }
    }
};


export default ConsolidatedSchedulerSlot;