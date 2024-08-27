import Scheduler from "../../components/scheduler/Scheduler.jsx";
import mockData from "../../mocks/scheduler-data.json";
import {useApp} from "../../context/AppProvider.jsx";
import InnerSchedulerItem from "../../components/scheduler/partial/InnerSchedulerItem.jsx";
import React from "react";
import {DayView} from "../../components/scheduler/partial/views/day/DayViewDisplay.jsx";
import {InnerScheduler} from "../../components/scheduler/partial/InnerScheduler.jsx";
import {isNullOrEmpty} from "../../utils/Utils.jsx";
import {SchedulerSlot} from "../../components/scheduler/partial/slots/SchedulerSlotDisplay.jsx";
import {Typography} from "antd";
const {Text} = Typography

function ExpandedScheduler() {
    const {availableHeight} = useApp();
    const courts = mockData.courts;
    const hideReserveButtonsOnAdminSchedulers = false;
    const allowSchedulerDragAndDrop = false;
    const doNotShowMultipleReservations = true;
    const shouldHideReserveButton = false;
    
    //todo
    const startTimeString = '8:00';
    const endTimeString = '20:00';
    const selectedDate = new Date();
    const events = [];
    let timeZone = 'Etc/UTC';
    let interval = 15;
    let customSchedulerId = null;
    
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

    }
    
    const handleDataChange = () => {
        
    }

    const openReservationCreateModal = () => {
        
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
    
    return (
       <>
           <InnerScheduler
               data={events}
               hideDaySelection={true}
               timezone={timeZone}
               date={selectedDate}
               defaultDate={selectedDate}
               onDateChange={handleDateChange}
               onDataChange={handleDataChange}
               modelFields={modelFields}
               height={availableHeight}
               editable={{
                   add: doNotShowMultipleReservations,
                   remove: false,
                   drag: allowSchedulerDragAndDrop,
                   resize: allowSchedulerDragAndDrop,
                   select: allowSchedulerDragAndDrop,
                   edit: false,
               }}
               group={{
                   resources: ["Courts"],
               }}
               interval={interval}
               item={InnerSchedulerItem}
               slot={CustomSlot}
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
