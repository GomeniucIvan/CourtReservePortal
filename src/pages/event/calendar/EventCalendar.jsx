import Scheduler from "../../../components/scheduler/Scheduler.jsx";
import React, {useEffect, useState} from "react";
import {Button, Flex, Segmented, Skeleton, Space, Spin} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import {useApp} from "../../../context/AppProvider.jsx";
import {InnerScheduler} from "../../../components/scheduler/partial/InnerScheduler.jsx";
import {DayView} from "../../../components/scheduler/partial/views/day/DayViewDisplay.jsx";
import {WeekView} from "../../../components/scheduler/partial/views/week/WeekView.mjs";
import {MonthView} from "../../../components/scheduler/partial/views/month/MonthView.jsx";
import {AgendaView} from "../../../components/scheduler/partial/views/agenda/AgendaView.jsx";
import {Typography} from "antd";
import mockData from "../../../mocks/scheduler-data.json";
import EventCalendarItem from "./EventCalendarItem.jsx";
import '@progress/kendo-date-math/tz/America/New_York';
import {useNavigate} from "react-router-dom";
import appService, {apiRoutes} from "../../../api/app.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {
    dateFormatByUiCulture,
    dateTimeToFormat,
    dateToTimeString,
    toAspNetDateTime,
    toReactDate
} from "../../../utils/DateUtils.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import dayjs from "dayjs";
import apiService from "../../../api/api.jsx";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {saveCookie} from "../../../utils/CookieUtils.jsx";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {Selector} from "antd-mobile";

const {Text} = Typography

function EventCalendar() {
    const {setHeaderRightIcons, globalStyles, setIsFooterVisible, setFooterContent, token} = useApp();
    const [showFilter, setShowFilter] = useState(false);
    const [selectedView, setSelectedView] = useState('');
    const {availableHeight, isMockData} = useApp();
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSchedulerInitializing, setIsSchedulerInitializing] = useState(true);
    const [timeZone, setTimeZone] = useState('');
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const navigate = useNavigate();
    const [interval, setInterval] = useState(15);
    const [startTimeString, setStartTimeString] = useState('')
    const [endTimeString, setEndTimeString] = useState('')
    const [schedulerData, setSchedulerData] = useState(null);
    const [eventCategories, setEventCategories] = useState([]);
    const [eventSessions, setEventSessions] = useState([]);
    const [filterChanged, setFilterChanged] = useState(false);

    const {orgId} = useAuth();

    const persistSelectedView = async (value) => {
        let response = await appService.post(`/app/Online/AjaxController/PersistEventsCalendar?viewType=${value}&isLeague=false`);
    }

    const loadEvents = () => {
        setLoading(true);
        let startDayToPass = null;
        let endDayToPass = null;
        const selectedDateObj = dayjs(selectedDate);

        if (equalString(selectedView, 'day')) {
            startDayToPass = selectedDateObj.startOf('day');
            endDayToPass = selectedDateObj.endOf('day');
        }
        else if (equalString(selectedView, 'week')) {
            startDayToPass = selectedDateObj.startOf('isoWeek');
            endDayToPass = selectedDateObj.endOf('isoWeek');
        }
        else if (equalString(selectedView, 'month')) {
            startDayToPass = selectedDateObj.startOf('month');
            endDayToPass = selectedDateObj.endOf('month');
        }
        else if (equalString(selectedView, 'agenda')) {
            // Example: Next 30 days from the selected date
            startDayToPass = selectedDateObj.startOf('day');
            endDayToPass = selectedDateObj.add(30, 'days').endOf('day');
        }

        const result = {
            startDate: toAspNetDateTime(selectedDate),
            //end: scheduler.view().endDate(),
            Date: new Date(selectedDate).toUTCString(),
            orgId: orgId,
            TimeZone: schedulerData.TimeZone,
            KendoStart: {
                Year: dayjs(startDayToPass).year(),
                Month: dayjs(startDayToPass).month() + 1,
                Day: dayjs(startDayToPass).date()
            },
            KendoEnd: {
                Year: dayjs(endDayToPass).year(),
                Month: dayjs(endDayToPass).month() + 1,
                Day: dayjs(endDayToPass).date()
            },
            Categories: eventCategories
                .filter(eventCategory => eventCategory.Selected)
                .map(eventCategory => eventCategory.Id),
            UiCulture: schedulerData.UiCulture,
            CostTypeId: schedulerData.CostTypeId,
            MemberId: schedulerData.MemberId,
            FamilyId: schedulerData.FamilyId,
            EventSessionIds: eventSessions
                .filter(eventSession => eventSession.Selected)
                .map(eventSession => eventSession.Id)
        }

        appService.get(navigate, `/app/Online/Calendar/ReadCalendarEvents?id=${orgId}&jsonData=${JSON.stringify(result)}`).then(resp => {
            const formattedEvents = resp.Data.map(event => ({
                ...event,
                Start: toReactDate(event.Start),
                start: toReactDate(event.Start),
                End: toReactDate(event.End),
                end: toReactDate(event.End),

                isAllDay: false,
                IsAllDay: false,
            }));

            setEvents(formattedEvents);
            setLoading(false);
        });
    }
    
    useEffect(() => {
        if (isNullOrEmpty(selectedView)){
            //loading?
            setHeaderRightIcons('');
        } else{
            setHeaderRightIcons(
                <Space className={globalStyles.headerRightActions}>
                    <Segmented
                        defaultValue={selectedView}
                        options={['Day', 'Week', 'Month', 'Agenda']}
                        onChange={(value) => {
                            setSelectedView(value);
                            //not async
                            persistSelectedView(value);
                        }}
                    />

                    <Button type="default" icon={<FilterOutlined/>} size={'medium'}
                            onClick={() => setShowFilter(true)}/>
                </Space>
            )
        }
    }, [selectedView]);

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(null);

        if (isMockData){
            setTimeout(function(){
                const formattedEvents = mockData.calendar_events.map(event => ({
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
            appService.get(navigate, `/app/Online/Calendar/Events/${orgId}`).then(r => {
                if (toBoolean(r?.IsValid)){
                    const model = r.Data;

                    setStartTimeString(dateToTimeString(model.MinOpenTime, true));
                    setEndTimeString(dateToTimeString(model.MaxCloseTime, true));

                    setSchedulerData(model);
                    setSelectedView(model.ViewType);

                    setEventCategories(model.EventCategories.map(eventCategory => ({
                        Id: eventCategory.Id,
                        Name: eventCategory.Name,
                        Selected: model.SelectedCategories.includes(eventCategory.Id)
                    })))
                    setEventSessions(model.EventSessions.map(eventSession => ({
                        Id: eventSession.Id,
                        Name: eventSession.Name,
                        Selected: model.SelectedEventSessionIds.includes(eventSession.Id)
                    })))

                    const dateToShow = toReactDate(model.SchedulerDate);
                    setMinDate(dateToShow);
                    setTimeZone(model.TimeZone);
                    setInterval(model.MinInterval);

                    setIsSchedulerInitializing(false);

                    //always last
                    setSelectedDate(dateToShow);
                } else{
                    navigate(r.Path);
                }
            })
        }
    }, []);

    useEffect(() => {
        if (!isNullOrEmpty(selectedDate) && schedulerData){
            loadEvents()
        }
    }, [selectedDate, selectedView]);

    useEffect(() => {
        if (filterChanged && !showFilter){
            setFilterChanged(false);
            loadEvents();
        }
    }, [filterChanged, showFilter]);
    
    const handleDateChange = (event) => {
        const selectedDate = event.value;
        setSelectedDate(selectedDate);
        let dateTimeToSave = dateTimeToFormat(selectedDate, dateFormatByUiCulture());
        saveCookie('InternalCalendarDate', dateTimeToSave, 300);
    }

    const handleDataChange = (event) => {
        //console.log(event);
    }

    const modelFields = {
        id: "Number",
        start: "Start",
        end: "End",
        title: "Title",
        description: "Description",
        recurrenceRule: "RecurrenceRule",
        recurrenceExceptions: "RecurrenceException",
        isAllDay: "isAllDay",
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
            <Spin spinning={loading}>
                <InnerScheduler
                    data={events}
                    hideDaySelection={true}
                    timezone={timeZone}
                    date={selectedDate}
                    defaultDate={selectedDate}
                    loading={loading}
                    setLoading={setLoading}
                    onDateChange={handleDateChange}
                    onDataChange={handleDataChange}
                    modelFields={modelFields}
                    selectedView={selectedView}
                    height={availableHeight}
                    editable={false}
                    minDate={minDate}
                    maxDate={maxDate}
                    interval={interval}
                >

                    <DayView
                        startTime={startTimeString}
                        endTime={endTimeString}
                        workDayStart={startTimeString}
                        workDayEnd={endTimeString}
                        slotDuration={interval}
                        slotDivisions={1}
                        viewItem={EventCalendarItem}
                        hideDateRow={false}
                    />

                    <WeekView/>
                    <MonthView selectedView={'month'}/>
                    <AgendaView/>
                </InnerScheduler>
            </Spin>

            <DrawerBottom
                showDrawer={showFilter}
                closeDrawer={() => {
                    setShowFilter(false);
                }}
                label={'Filter'}
                showButton={true}
                confirmButtonText={'Filter'}
                onConfirmButtonClick={() => {
                    setShowFilter(false);
                }}
            >
                <>
                    {anyInList(eventCategories) &&
                        <PaddingBlock>
                            <label className={globalStyles.globalLabel}>
                                Categories
                            </label>

                            <Selector className={globalStyles.filterSelector}
                                //showCheckMark={false}
                                      multiple={true}
                                      onChange={(selectedValues) => {
                                          setFilterChanged(true);

                                          setEventCategories(prevCategories =>
                                              prevCategories.map(eventCategory => ({
                                                  ...eventCategory,
                                                  Selected: selectedValues.includes(eventCategory.Id)
                                              }))
                                          );
                                      }}
                                      options={eventCategories.map(eventCategory => ({
                                          label: eventCategory.Name,
                                          value: eventCategory.Id
                                      }))}
                                      defaultValue={eventCategories
                                          .filter(eventCategory => eventCategory.Selected)
                                          .map(eventCategory => eventCategory.Id)}
                            />
                        </PaddingBlock>
                    }

                    {anyInList(eventSessions) &&
                        <PaddingBlock onlyTop={true}>
                            <label className={globalStyles.globalLabel}>
                                Sessions
                            </label>

                            <Selector className={globalStyles.filterSelector}
                                //showCheckMark={false}
                                      multiple={true}
                                      onChange={(selectedValues) => {
                                          setFilterChanged(true);

                                          setEventSessions(prevSessions =>
                                              prevSessions.map(eventSession => ({
                                                  ...prevSession,
                                                  Selected: selectedValues.includes(eventSession.Id)
                                              }))
                                          );
                                      }}
                                      options={eventSessions.map(eventSession => ({
                                          label: eventSession.Name,
                                          value: eventSession.Id
                                      }))}
                                      defaultValue={eventSessions
                                          .filter(eventSession => eventSession.Selected)
                                          .map(eventSession => eventSession.Id)}
                            />
                        </PaddingBlock>
                    }
                </>
            </DrawerBottom>
        </>
    )
}

export default EventCalendar
