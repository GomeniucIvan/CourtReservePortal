import {useApp} from "@/context/AppProvider.jsx";
import React, {useEffect, useState} from "react";
import {DayView} from "@/components/scheduler/partial/views/day/DayViewDisplay.jsx";
import {InnerScheduler} from "@/components/scheduler/partial/InnerScheduler.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {Flex, Skeleton, Spin, Typography} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
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
import {useHeader} from "@/context/HeaderProvider.jsx";
import '@progress/kendo-date-math/tz/all.js';
import {
    courtHeader, expandedModelFields,
    expandedOpenReservationCreateModal,
    handleDataChange,
    handleDateChange, instructorHeader, scrollToCurrentTime
} from "@portal/scheduler/SchedulerInnerUtils.jsx";
import {schedulerItemsRead} from "@portal/scheduler/SchedulerInnerServices.jsx";
import {useTranslation} from "react-i18next";
import {SchedulerSlot} from "@/components/scheduler/partial/slots/SchedulerSlotDisplay.jsx";
import ConsolidatedSchedulerSlot from "@portal/scheduler/ConsolidatedSchedulerSlot.jsx";

function ExpandedScheduler() {
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const {availableHeight, setIsFooterVisible, setFooterContent, token, globalStyles} = useApp();
    const {orgId} = useAuth();
    const {t} = useTranslation('');
    
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
        setIsFooterVisible(true);
        setFooterContent(null);
        setHeaderRightIcons(null);
        const loadSchedulerData = async () => {
            let response = await appService.getRoute(apiRoutes.MemberSchedulersApiUrl, `/app/Online/PublicSchedulerApi/Bookings/${orgId}?sId=${customSchedulerId}`, {}, {}, true);

            if (toBoolean(response?.IsValid)){
                const model = response.Data.Model;

                setHeaderTitle(model.Name)
                
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
                    Text: courtHeader(court, customSchedulerId, token),
                    Value: court.Id
                }));

                if (equalString(model?.TypeString, 'Instructor')) {
                    formattedCourts = model.SchedulerInstructors.map(instructor => ({
                        ...instructor,
                        Text:  instructorHeader(instructor, token),
                        Value: instructor.Id
                    }));
                } else if (equalString(model?.TypeString, 'Consolidated')){
                    formattedCourts = model.AllCourtTypes.map(courtType => ({
                        ...courtType,
                        Text:  courtType.Name,
                        Value: courtType.Value
                    }));
                }

                setCourts(formattedCourts);
                setIsSchedulerInitializing(false);
                setCurrentDateTime(currentDateTime);

                //always last
                setSelectedDate(dateToShow);
                setTimeout(function(){
                    //dom
                    scrollToCurrentTime();
                }, 50)
            } else {
                navigate(response.Path);
            }
        }

        loadSchedulerData();
    }, []);
    
    useEffect(() => {
        const loadSchedulerItems = async () => {
            if (!isNullOrEmpty(selectedDate) && schedulerData){

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
                    } else {
                        let newOpenTimeString = dateToTimeString(scheduleForDay.OpenTimeDate, true);
                        let newCloseTimeString = dateToTimeString(scheduleForDay.CloseTimeDate, true);

                        if (!equalString(newOpenTimeString, startTimeString) || !equalString(newCloseTimeString, endTimeString)){
                            setStartTimeString(newOpenTimeString);
                            setEndTimeString(newCloseTimeString);
                        }
                    }
                }

                let items = await schedulerItemsRead(schedulerData?.TypeString, schedulerData, selectedDate, courts);

                setEvents(items);
                setLoading(false);
            }
        }
        
        loadSchedulerItems();
    }, [selectedDate]);

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
               //slot
               data={events}
               hideDaySelection={true}
               timezone={timeZone}
               date={selectedDate}
               editable={false}
               loading={loading}
               setLoading={setLoading}
               defaultDate={selectedDate}
               currentDateTime={currentDateTime}
               onDateChange={(e) => {handleDateChange(e, setSelectedDate)}}
               onDataChange={handleDataChange}
               modelFields={expandedModelFields}
               height={availableHeight}
               minDate={minDate}
               maxDate={maxDate}
               viewSlot={CustomViewSlot}
               group={{
                   resources: equalString(schedulerData?.TypeString, 'Consolidated') ? ["CourtTypes"] : ["Courts"],
               }}
               interval={interval}
               item={equalString(schedulerData?.TypeString, 'Consolidated') ? ConsolidatedSchedulerSlot : ExpandedSchedulerItem}
               useTextSchedulerSlot={!equalString(schedulerData?.TypeString, 'Consolidated')}
               openReservationCreateModal={(props, dataItem) => {expandedOpenReservationCreateModal(navigate, props, dataItem)}}
               resources={equalString(schedulerData?.TypeString, 'Consolidated') ?
                   [{
                       name: 'CourtTypes',
                       data: courts,
                       field: 'Text',
                       textField: 'Text',
                       valueField: 'Value',
                       color: 'ReservationColor'
                   }]
                       :
                   [{
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
