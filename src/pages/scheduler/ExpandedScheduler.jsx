import mockData from "../../mocks/scheduler-data.json";
import {useApp} from "../../context/AppProvider.jsx";
import React, {useEffect, useState} from "react";
import {DayView} from "../../components/scheduler/partial/views/day/DayViewDisplay.jsx";
import {InnerScheduler} from "../../components/scheduler/partial/InnerScheduler.jsx";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {SchedulerSlot} from "../../components/scheduler/partial/slots/SchedulerSlotDisplay.jsx";
import {Flex, Skeleton, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {ProfileRouteNames} from "../../routes/ProfileRoutes.jsx";
const {Text} = Typography
import '@progress/kendo-date-math/tz/Europe/Chisinau';
import {
    SchedulerProportionalViewItem
} from "../../components/scheduler/partial/items/SchedulerProportionalViewItem.mjs";
import {SchedulerViewSlot} from "../../components/scheduler/partial/slots/SchedulerViewSlotDisplay.jsx";
import ExpandedSchedulerItem from "./ExpandedSchedulerItem.jsx";
import appService, {apiRoutes} from "../../api/app.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {dateToString, fixDate} from "../../utils/DateUtils.jsx";
import {emptyArray} from "../../utils/ListUtils.jsx";
import dayjs from "dayjs";
import apiService from "../../api/api.jsx";

function ExpandedScheduler() {
    const {availableHeight, setIsFooterVisible, setFooterContent, setHeaderRightIcons, isMockData, token, globalStyles} = useApp();
    const {orgId} = useAuth();
    
    const hideReserveButtonsOnAdminSchedulers = false;
    const allowSchedulerDragAndDrop = false;
    const doNotShowMultipleReservations = true;
    const shouldHideReserveButton = false;
    const [courts, setCourts] = useState([]);
    const [isSchedulerInitializing, setIsSchedulerInitializing] = useState(true);
    const [timeZone, setTimeZone] = useState('');
    const [schedulerData, setSchedulerData] = useState(null);
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    
    //todo
    const startTimeString = '8:00';
    const endTimeString = '23:00';
    let interval = 15;

    useEffect(() => {
        if (!isNullOrEmpty(selectedDate) && schedulerData){
            console.log('loading')
            console.log(new Date(selectedDate))
            console.log(dayjs(selectedDate).date())
            const result = {
                startDate: selectedDate,
                //end: scheduler.view().endDate(),
                orgId: schedulerData.OrgId,
                TimeZone: schedulerData.TimeZone,
                Date: new Date(selectedDate).toUTCString(),
                KendoDate: {
                    Year: dayjs(selectedDate).year(),    
                    Month: dayjs(selectedDate).month() + 1,
                    Day: dayjs(selectedDate).date()
                },
                UiCulture: schedulerData.UiCulture,
                CostTypeId: schedulerData.CostTypeId,
                CustomSchedulerId: schedulerData.SchedulerId,
                ReservationMinInterval: schedulerData.MajorTick,
                SelectedCourtIds: courts.map(item => item.Id).join(','),
                SelectedInstructorIds: '',
                MemberIds: schedulerData.MemberIds.join(','),
                MemberFamilyId: '',
                EmbedCodeId: '',
                HideEmbedCodeReservationDetails: ''
            }

            apiService.get(`/api/scheduler/member-expanded?id=${schedulerData.OrgId}&jsonData=${JSON.stringify(result)}`).then(resp => {

                const formattedEvents = resp.Data.map(event => ({
                    ...event,
                    Start: new Date(event.Start),
                    start: new Date(event.Start),
                    End: new Date(event.End),
                    end: new Date(event.End),

                    isAllDay: false,
                    IsAllDay: false,
                }));
                console.log(formattedEvents)
                setEvents(formattedEvents)
            });
        }
    }, [selectedDate]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(null);
        setHeaderRightIcons(null);
        
        if (isMockData){
           setTimeout(function(){
               setCourts(mockData.courts);
               setIsSchedulerInitializing(false);
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
        else{
            appService.get(`/app/Online/Reservations/Bookings/${orgId}?sId=11945`).then(r => {
                if (toBoolean(r?.IsValid)){
                    const model = r.Data.Model;
                    setSchedulerData(model);
                    
                    const dateToShow = new Date(dateToString(r.Data.Model.CurrentDateTime));
                    setTimeZone(model.TimeZone);
                    
                    const formattedCourts = r.Data.Model.Courts.map(court => ({
                        ...court,
                        Text:  `<span style="color: ${token.colorPrimary};font-weight: 500;">${court.Label}</span><br/><span>${court.CourtTypeName}</span>`,
                        Value: court.Id
                    }));

                    setCourts(formattedCourts);
                    setIsSchedulerInitializing(false);

                    //always last
                    setSelectedDate(dateToShow);
                } else{
                    navigate(r.Path);
                }
            })
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
    
    if (isSchedulerInitializing){
       return (
           <Flex vertical={true} gap={2} style={{overflow: 'auto'}}>
               <>
                   {emptyArray().map((item, index) => (
                       <div key={index} className={globalStyles.skeletonTable}>
                           <Flex gap={1}>
                               <Skeleton.Input active={true} block style={{width: '120px', height: (index === 0 ? '45px' : '60px')}}/>

                               <>
                                   {emptyArray(4).map((innerItem, innerIndex) => (
                                       <Skeleton.Input key={innerIndex}  active={true} block style={{width: '160px', height: (index === 0 ? '45px' : '60px')}}/>
                                   ))}
                               </>
                           </Flex>
                       </div>
                   ))}
               </>
           </Flex>
       )
    }
    
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
