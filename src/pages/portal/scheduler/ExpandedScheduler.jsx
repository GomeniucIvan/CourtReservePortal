import {useApp} from "@/context/AppProvider.jsx";
import React, {useEffect, useState} from "react";
import {DayView} from "@/components/scheduler/partial/views/day/DayViewDisplay.jsx";
import {InnerScheduler} from "@/components/scheduler/partial/InnerScheduler.jsx";
import {anyInList, equalString, isNullOrEmpty, moreThanOneInList, toBoolean} from "@/utils/Utils.jsx";
import {Flex, Segmented, Skeleton, Space, Spin, Typography} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import moment from "moment";
import {
    SchedulerProportionalViewItem
} from "@/components/scheduler/partial/items/SchedulerProportionalViewItemDisplay.jsx";
import {SchedulerViewSlot} from "@/components/scheduler/partial/slots/SchedulerViewSlotDisplay.jsx";
import ExpandedSchedulerItem from "./ExpandedSchedulerItem.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {
    fromDateTimeStringToDateTime, fromTimeSpanString
} from "@/utils/DateUtils.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import '@progress/kendo-date-math/tz/all.js';
import {
    consolidatedModelFields,
    courtHeader, expandedModelFields,
    expandedOpenReservationCreateModal,
    handleDataChange,
    handleDateChange, instructorHeader, scrollToCurrentTime
} from "@portal/scheduler/SchedulerInnerUtils.jsx";
import {schedulerItemsRead} from "@portal/scheduler/SchedulerInnerServices.jsx";
import {useTranslation} from "react-i18next";
import ConsolidatedSchedulerSlot from "@portal/scheduler/ConsolidatedSchedulerSlot.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import HeaderFilter from "@/components/header/HeaderFilter.jsx";

function ExpandedScheduler({index}) {
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
    const [filterSelectedView, headerFilterSelectedView] = useState('')

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const customSchedulerId = queryParams.get("sId");

    useEffect(() => {
        if (!isNullOrEmpty(filterSelectedView)){
            setHeaderRightIcons(
                <Space className={globalStyles.headerRightActions}>
                    <HeaderFilter onClick={() => {}}
                                  showSchedulerOptions={true}
                                  selectedView={filterSelectedView}
                                  onOptionChange={(selValue) => {
                                      if (!equalString(filterSelectedView, selValue)) {
                                          headerFilterSelectedView(selValue);
                                          setIsSchedulerInitializing(true);
                                          
                                          setTimeout(function () {
                                              loadSchedulerData(selValue);
                                          }, 300)
                                      }
                                  }} />
                </Space>
            )
        }
    }, [filterSelectedView]);

    const loadSchedulerData = async (selectedIndexViewType) => {

        let response = null;
        if (toBoolean(index)) {
            //default scheduler
            if (equalString(selectedIndexViewType, 'expanded')) {
                response = await appService.get(navigate, `/app/Online/Reservations/Tab_CourtsScheduler/${orgId}`);
            } else if (equalString(selectedIndexViewType, 'consolidated')){
                response = await appService.get(navigate, `/app/Online/Reservations/Tab_ConsolidatedScheduler/${orgId}`);
            }
        } else{
            //custom scheduler data
            response = await appService.getRoute(apiRoutes.MemberSchedulersApiUrl, `/app/Online/PublicSchedulerApi/Bookings/${orgId}?sId=${customSchedulerId}`, {}, {}, true)
        }

        if (toBoolean(response?.IsValid)){
            const model = toBoolean(index) ? response.Data  : response.Data.Model;

            if (!toBoolean(index)){
                setHeaderTitle(model.Name)
            }

            setStartTimeString(model.StartTimeSpanStringDisplay);
            setEndTimeString(model.EndTimeSpanStringDisplay);

            setSchedulerData(model);
            setSchedulerHours(model.SchedulerDto.OrganizationHours)
            const currentDateTime = new Date(fromDateTimeStringToDateTime(model.CurrentDateTimeStringDisplay));
            const dateToShow = new Date(fromDateTimeStringToDateTime(model.SchedulerDateStringDisplay));
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
            } else if (equalString(model?.TypeString, 'Consolidated') || toBoolean(index) && equalString(selectedIndexViewType, 'consolidated')) {
                formattedCourts = model.AllCourtTypes.map(courtType => ({
                    ...courtType,
                    Text:  toBoolean(courtType.IsWailitsingData) ? 'WATILIST' : courtType.Name,
                    Value: courtType.Name
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
            if (isNullOrEmpty(response?.Message)) {
                pNotify(response?.Message, ' error');
            }
            if (!isNullOrEmpty(response.Path)) {
                navigate(response.Path);
            }
        }
    }
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(null);

        const loadMultipleSchedulerTab = async () => {
            setHeaderTitle('Book a Court')
            let response = await appService.getRoute(apiRoutes.MemberSchedulersApiUrl, `/app/Online/PublicSchedulerApi/Index/${orgId}?sId=${customSchedulerId}`, {}, {}, true);
            if (toBoolean(response?.IsValid)){
                let data = response?.Data;
                let allowedViewTypes = data.ViewTypes;
                if (anyInList(allowedViewTypes)){
                    //add ability to select type from header
                    let firstAllowedType = allowedViewTypes[0];

                    if (moreThanOneInList(allowedViewTypes)){
                        headerFilterSelectedView(firstAllowedType);
                    }
                    loadSchedulerData(firstAllowedType);
                }
            } else {
                if (!isNullOrEmpty(response?.IsValid)){
                    pNotify(response?.Message, ' error');
                }
            }
        }

        if (toBoolean(index)) {
            loadMultipleSchedulerTab();
        } else{
            loadSchedulerData();
        }
    }, []);

    useEffect(() => {
        const loadSchedulerItems = async () => {
            if (!isNullOrEmpty(selectedDate) && schedulerData){

                const dayOfWeek = equalString(moment(selectedDate).day(), 0) ? 7 : moment(selectedDate).day();
                const scheduleForDay = schedulerHours.find(item => equalString(item.Day, dayOfWeek));

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
                        let newOpenTimeString = fromTimeSpanString(scheduleForDay.OpenTimeDateStringDisplay);
                        let newCloseTimeString = fromTimeSpanString(scheduleForDay.CloseTimeDateStringDisplay);

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
                modelFields={equalString(schedulerData?.TypeString, 'Consolidated') ? consolidatedModelFields : expandedModelFields}
                height={availableHeight}
                minDate={minDate}
                maxDate={maxDate}
                viewSlot={CustomViewSlot}
                type={schedulerData?.TypeString}
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
                        field: 'CourtType',
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
