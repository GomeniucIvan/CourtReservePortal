﻿import mockData from "../../mocks/scheduler-data.json";
import {useApp} from "../../context/AppProvider.jsx";
import React, {useEffect, useState} from "react";
import {DayView} from "../../components/scheduler/partial/views/day/DayViewDisplay.jsx";
import {InnerScheduler} from "../../components/scheduler/partial/InnerScheduler.jsx";
import {isNullOrEmpty} from "../../utils/Utils.jsx";
import {SchedulerSlot} from "../../components/scheduler/partial/slots/SchedulerSlotDisplay.jsx";
import {Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {ProfileRouteNames} from "../../routes/ProfileRoutes.jsx";
const {Text} = Typography
import '@progress/kendo-date-math/tz/America/New_York';
import {
    SchedulerProportionalViewItem
} from "../../components/scheduler/partial/items/SchedulerProportionalViewItem.mjs";
import {SchedulerViewSlot} from "../../components/scheduler/partial/slots/SchedulerViewSlotDisplay.jsx";
import ExpandedSchedulerItem from "./ExpandedSchedulerItem.jsx";

function ExpandedScheduler() {
    const {availableHeight, setIsFooterVisible, setFooterContent, setHeaderRightIcons, isMockData} = useApp();
    const hideReserveButtonsOnAdminSchedulers = false;
    const allowSchedulerDragAndDrop = false;
    const doNotShowMultipleReservations = true;
    const shouldHideReserveButton = false;
    const [courts, setCourts] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    
    //todo
    const startTimeString = '8:00';
    const endTimeString = '20:00';
    let timeZone = 'America/New_York';
    let interval = 15;
    let customSchedulerId = null;

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(null);
        setHeaderRightIcons(null);
        if (isMockData){
           setTimeout(function(){
               setCourts(mockData.courts)
           }, 100);

            setTimeout(function(){

                const formattedEvents = mockData.reservations.map(event => ({
                    ...event,
                    Start: new Date(event.Start),
                    start: new Date(event.Start),
                    End: new Date(event.End),
                    end: new Date(event.End),
                    isAllDay: false
                }));
                
                setEvents(formattedEvents)
            }, 400);
        }
    }, []);
    
    const shouldHideButton = (courtId, slotStartInc, slotEndInc) => {
        if (!shouldHideReserveButton) {
            return false;
        }

        const slotStart = new Date(slotStartInc);
        const slotEnd = new Date(slotEndInc);

        const eventsOfCurrentCourt = events.filter(event => event.CourtId === courtId);
        if (eventsOfCurrentCourt.length <= 0) {
            return false;
        }

        for (let event of eventsOfCurrentCourt) {
            const eventStart = new Date(event.Start);
            const eventEnd = new Date(event.End);

            if ((eventStart <= slotStart && eventEnd > slotStart) || (eventStart < slotEnd && eventEnd > slotStart) || (eventStart <= slotStart && eventEnd >= slotEnd) || (eventStart >= slotStart && eventEnd <= slotEnd)) {
                return true;
            }
        }

        return false;
    };
    
    const onDoubleClickCreate = (courtId, start, end) => {

    }
    
    const handleDateChange = (event) => {
        const selectedDate = event.value;
        setSelectedDate(selectedDate);
    }
    
    const handleDataChange = (e) => {
    }

    const openReservationCreateModal = (e) => {
        let courtId = e.currentTarget.getAttribute('entytyid');
        let start = e.currentTarget.getAttribute('start');
        let end = e.currentTarget.getAttribute('end');
        
        console.log('CourtId: ' + courtId)

        navigate(ProfileRouteNames.RESERVATION_CREATE);
    }
    
    const CustomSlot = (props) => {
        const courtId = props.group.resources[0].Value;

        if ((courtId === -1 && isNullOrEmpty(customSchedulerId)) || (!isNullOrEmpty(customSchedulerId) && courtId == -1) || (!isNullOrEmpty(customSchedulerId) && courtId == customSchedulerId)) {
            return (<SchedulerSlot {...props} onDoubleClick={() => onDoubleClickCreate(courtId)}>

            </SchedulerSlot>);
        }

        if (hideReserveButtonsOnAdminSchedulers) {
            return (<SchedulerSlot {...props} onDoubleClick={() => onDoubleClickCreate(courtId)}>
                <div className='slot-btn-dbl' start={props.zonedStart}
                     end={props.zonedEnd}
                     courtid={courtId}>

                </div>
            </SchedulerSlot>);
        }

        return (<SchedulerSlot {...props} onDoubleClick={() => onDoubleClickCreate(courtId)}>
            <Text
                start={props.zonedStart}
                end={props.zonedEnd}
                courtid={courtId}
                onClick={() => openReservationCreateModal(courtId, props.zonedStart, props.zonedEnd)}
                style={{
                    height: '40px',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: `${(shouldHideButton(courtId, props.zonedStart, props.zonedEnd) ? 'none' : 'flex')}`}}>

                Reserve
            </Text>
        </SchedulerSlot>)
    }
    
    const modelFields = {
        id: "UqId",
        title: "Title",
        description: "Description",
        start: "Start",
        end: "End",
        recurrenceRule: "RecurrenceRule",
        recurrenceId: "RecurrenceId",
        recurrenceExceptions: "RecurrenceException",
        startTimezone: "StartTimezone",
        endTimezone: "EndTimezone",
        isAllDay: "isAllDay",
    };

    const CustomViewSlot = (props) => {
        return (
            <SchedulerViewSlot
                {...props}
                style={{
                    ...props.style,
                    cursor:  "no-drop",
                }}
            />
        );
    };
    
    return (
       <>
           <InnerScheduler
               data={events}
               hideDaySelection={true}
               timezone={timeZone}
               date={selectedDate}
               editable={false}
               defaultDate={selectedDate}
               onDateChange={handleDateChange}
               onDataChange={handleDataChange}
               modelFields={modelFields}
               height={availableHeight}
               viewSlot={CustomViewSlot}
               group={{
                   resources: ["Courts"],
               }}
               interval={interval}
               item={ExpandedSchedulerItem}
               useTextSchedulerSlot={true}
               openReservationCreateModal={openReservationCreateModal}
               resources={[{
                   name: 'Courts',
                   data: courts,
                   field: 'CourtId',
                   textField: 'Text',
                   valueField: 'Value',
                   color: 'ReservationColor'
               }]}
           >
               <DayView
                   viewItem={SchedulerProportionalViewItem}
                   startTime={startTimeString}
                   endTime={endTimeString}
                   workDayStart={startTimeString}
                   workDayEnd={endTimeString}
                   slotDuration={interval}
                   slotDivisions={1}
                   hideDateRow={true}
               />
           </InnerScheduler>
       </>
    );
}

export default ExpandedScheduler
