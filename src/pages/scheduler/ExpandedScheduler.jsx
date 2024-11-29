import mockData from "../../mocks/scheduler-data.json";
import {useApp} from "../../context/AppProvider.jsx";
import React, {useCallback, useEffect, useState} from "react";
import {DayView} from "../../components/scheduler/partial/views/day/DayViewDisplay.jsx";
import {InnerScheduler} from "../../components/scheduler/partial/InnerScheduler.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Flex, Skeleton, Spin, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {ProfileRouteNames} from "../../routes/ProfileRoutes.jsx";
import moment from "moment";
const {Text} = Typography
import '@progress/kendo-date-math/tz/all.js';
import {
    SchedulerProportionalViewItem
} from "../../components/scheduler/partial/items/SchedulerProportionalViewItemDisplay.jsx";
import {SchedulerViewSlot} from "../../components/scheduler/partial/slots/SchedulerViewSlotDisplay.jsx";
import ExpandedSchedulerItem from "./ExpandedSchedulerItem.jsx";
import appService, {apiRoutes} from "../../api/app.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {dateFormatByUiCulture, dateTimeToFormat, dateToTimeString, toReactDate} from "../../utils/DateUtils.jsx";
import {emptyArray} from "../../utils/ListUtils.jsx";
import dayjs from "dayjs";
import apiService from "../../api/api.jsx";
import {saveCookie} from "../../utils/CookieUtils.jsx";

function ExpandedScheduler() {
    const {availableHeight, setIsFooterVisible, setFooterContent, setHeaderRightIcons, isMockData, token, globalStyles} = useApp();
    const {orgId} = useAuth();
    const customSchedulerId = 11945;
    
    const hideReserveButtonsOnAdminSchedulers = false;
    const allowSchedulerDragAndDrop = false;
    const doNotShowMultipleReservations = true;
    const shouldHideReserveButton = false;
    const [courts, setCourts] = useState([]);
    const [isSchedulerInitializing, setIsSchedulerInitializing] = useState(true);
    const [timeZone, setTimeZone] = useState('');
    const [schedulerData, setSchedulerData] = useState(null);
    const [schedulerHours, setSchedulerHours] = useState([]);
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState(null);
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [interval, setInterval] = useState(15);
    const [startTimeString, setStartTimeString] = useState('')
    const [endTimeString, setEndTimeString] = useState('')

    useEffect(() => {
        if (!isNullOrEmpty(selectedDate) && schedulerData){
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

            const dayOfWeek = equalString(moment(selectedDate).day(), 0) ? 7 : moment(selectedDate).day();
            const scheduleForDay = schedulerHours.find(item => item.Day === dayOfWeek);

            if (!isNullOrEmpty(scheduleForDay)){
                let isClosed = toBoolean(scheduleForDay?.IsClosed);
                if (isClosed && !isNullOrEmpty(interval)){
                    const hours = Math.floor(interval / 60);
                    const mins = interval % 60;

                    const formattedHours = String(hours).padStart(2, "0");
                    const formattedMinutes = String(mins).padStart(2, "0");
                    
                    setStartTimeString('00:00');
                    setEndTimeString(`${formattedHours}:${formattedMinutes}`);
                } else{
                    let newOpenTimeString = dateToTimeString(scheduleForDay.OpenTimeDate, true);
                    let newCloseTimeString = dateToTimeString(scheduleForDay.CloseTimeDate, true);
                    
                    if (!equalString(newOpenTimeString, startTimeString) || !equalString(newCloseTimeString, endTimeString)){
                        setStartTimeString(newOpenTimeString);
                        setEndTimeString(newCloseTimeString);
                    }
                }
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
                
                setEvents(formattedEvents);
                setLoading(false);
            });
        }
    }, [selectedDate]);
    
    const courtHeader = (court) => {
        if (equalString(`WAITLIST${customSchedulerId}`, court.Label)){
            return `<span style="color: ${token.colorPrimary};font-weight: 500;">WAITLIST</span>`
        }
        
        if (isNullOrEmpty(court?.CourtTypeName)){
            return `<span style="color: ${token.colorPrimary};font-weight: 500;">${court.Label}</span>`
        }
        
        return (
            `<span style="color: ${token.colorPrimary};font-weight: 500;">${court.Label}</span><br/><span>${court.CourtTypeName}</span>`
        )
    }
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(null);
        setHeaderRightIcons(null);

        appService.getRoute(apiRoutes.MemberSchedulersApiUrl, `/app/Online/PublicSchedulerApi/Bookings/${orgId}?sId=${customSchedulerId}`).then(r => {
            if (toBoolean(r?.IsValid)){
                const model = r.Data.Model;
                setStartTimeString(dateToTimeString(model.StartTime, true));
                setEndTimeString(dateToTimeString(model.EndTime, true));

                setSchedulerData(model);
                setSchedulerHours(model.SchedulerDto.OrganizationHours)
                const currentDateTime = toReactDate(model.CurrentDateTime);
                const dateToShow = toReactDate(model.SchedulerDate);
                setMinDate(currentDateTime);
                setTimeZone(model.TimeZone);
                setInterval(model.MinInterval);

                const formattedCourts = model.Courts.map(court => ({
                    ...court,
                    Text:  courtHeader(court),
                    Value: court.Id
                }));

                setCourts(formattedCourts);
                setIsSchedulerInitializing(false);
                setCurrentDateTime(currentDateTime);

                //always last
                setSelectedDate(dateToShow);
                setTimeout(function(){
                    //dom
                    scrollToCurrentTime();
                }, 50)
            } else{
                navigate(r.Path);
            }
        })
    }, []);

    const scrollToCurrentTime = () => {
        const currentTimeElement = document.querySelector('.k-current-time');

        if (currentTimeElement) {
            currentTimeElement.scrollIntoView({
                behavior: 'smooth', 
                block: 'center', 
            });
        }
    };
    
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
    
    const handleDateChange = (event) => {
        const selectedDate = event.value;
        setSelectedDate(selectedDate);

        let dateTimeToSave = dateTimeToFormat(selectedDate, dateFormatByUiCulture());
        saveCookie('InternalCalendarDate', dateTimeToSave, 300);
    }
    
    const handleDataChange = (e) => {
    }

    const openReservationCreateModal = (props, dataItem) => {
        let start = props.start;
        let end = props.end;
        
        navigate(ProfileRouteNames.RESERVATION_CREATE, {
            state: {
                dataItem,
                start,
                end
            }
        });
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
        //startTimezone: "StartTimezone",
        //endTimezone: "EndTimezone",
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
        <Spin spinning={loading}>
           
           <InnerScheduler
               data={events}
               hideDaySelection={true}
               timezone={timeZone}
               date={selectedDate}
               editable={false}
               loading={loading}
               setLoading={setLoading}
               defaultDate={selectedDate}
               currentDateTime={currentDateTime}
               onDateChange={handleDateChange}
               onDataChange={handleDataChange}
               modelFields={modelFields}
               height={availableHeight}
               minDate={minDate}
               maxDate={maxDate}
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
                   eventOffset={false}
                   slotDivisions={1}
                   hideDateRow={true}
               />
           </InnerScheduler>
       </Spin>
    );
}

export default ExpandedScheduler
