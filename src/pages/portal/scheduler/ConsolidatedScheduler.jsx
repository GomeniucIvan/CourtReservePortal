import {useApp} from "@/context/AppProvider.jsx";
import React, {useEffect, useState} from "react";
import {DayView} from "@/components/scheduler/partial/views/day/DayViewDisplay.jsx";
import {InnerScheduler} from "@/components/scheduler/partial/InnerScheduler.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {Flex, Skeleton, Spin, Typography} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import moment from "moment";
import {
    SchedulerProportionalViewItem
} from "@/components/scheduler/partial/items/SchedulerProportionalViewItemDisplay.jsx";
import {SchedulerViewSlot} from "@/components/scheduler/partial/slots/SchedulerViewSlotDisplay.jsx";
import ExpandedSchedulerItem from "./ExpandedSchedulerItem.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {dateFormatByUiCulture, dateToTimeString, toReactDate} from "@/utils/DateUtils.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import apiService from "@/api/api.jsx";
import {saveCookie} from "@/utils/CookieUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import '@progress/kendo-date-math/tz/all.js';
import {toRoute} from "@/utils/RouteUtils.jsx";

function ExpandedScheduler() {
    const {setHeaderRightIcons} = useHeader();
    const {availableHeight, setIsFooterVisible, setFooterContent, token, globalStyles} = useApp();
    const {orgId} = useAuth();
    
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

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const customSchedulerId = queryParams.get("sId");
    
    useEffect(() => {
        if (!isNullOrEmpty(selectedDate) && schedulerData){

            const result = {
                startDate: selectedDate,
                //end: scheduler.view().endDate(),
                orgId: orgId,
                TimeZone: schedulerData.TimeZone,
                Date: moment(selectedDate).format(dateFormatByUiCulture()),
                KendoDate: {
                    Year: moment(selectedDate).year(),
                    Month: moment(selectedDate).month() + 1,
                    Day: moment(selectedDate).date()
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
            
            //instructor
            if (equalString(schedulerData?.SchedulerEntityType, 2)){
                appService.get(navigate, `/app/Online/Reservations/ReadInstructorExpanded?id=${orgId}&jsonData=${JSON.stringify(result)}`).then(resp => {
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
            } else{
                apiService.get(`/api/scheduler/member-expanded?id=${orgId}&jsonData=${JSON.stringify(result)}`).then(resp => {
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

    const instructorHeader = (instructor) => {
        return (
            `<span style="color: ${token.colorPrimary};font-weight: 500;">${instructor.FullName}</span><br/><span>${instructor.InstructorType.Name}</span>`
        )
    }
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(null);
        setHeaderRightIcons(null);

        appService.getRoute(apiRoutes.MemberSchedulersApiUrl, `/app/Online/PublicSchedulerApi/Bookings/${orgId}?sId=${customSchedulerId}`, {}, {}, true).then(r => {
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

                let formattedCourts = model.Courts.map(court => ({
                    ...court,
                    Text: courtHeader(court),
                    Value: court.Id
                }));

                if (equalString(model.SchedulerEntityType, 2)) {
                    formattedCourts = model.SchedulerInstructors.map(instructor => ({
                        ...instructor,
                        Text:  instructorHeader(instructor),
                        Value: instructor.Id
                    }));
                }
                
                console.log(formattedCourts);
                
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
    
    const handleDateChange = (event) => {
        const selectedDate = event.value;
        
        //datepicker
        let selectedLocalDate = selectedDate._localDate;
        
        //header arrows, today
        if (isNullOrEmpty(selectedLocalDate)){
            selectedLocalDate = selectedDate;
        }
        
        setSelectedDate(selectedLocalDate);

        let dateTimeToSave = moment(selectedLocalDate).format(dateFormatByUiCulture());
        saveCookie('InternalCalendarDate', dateTimeToSave, 300);
    }
    
    const handleDataChange = (e) => {
    }

    const openReservationCreateModal = (props, dataItem) => {
        let start = props.start;
        let end = props.end;

        let route = toRoute(ProfileRouteNames.RESERVATION_CREATE, 'id', orgId)
        
        navigate(route, {
            state: {
                dataItem,
                start,
                end,
                customSchedulerId
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
