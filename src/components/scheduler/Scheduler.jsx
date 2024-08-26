import React, {useEffect, useState} from 'react';
import {isNullOrEmpty} from "../../utils/Utils.jsx";
import {InnerScheduler} from "./partial/InnerScheduler.jsx";
import InnerSchedulerItem from "./partial/InnerSchedulerItem.jsx";
import {DayView} from "./partial/views/day/DayViewDisplay.jsx";
import {SchedulerSlot} from "./partial/slots/SchedulerSlotDisplay.jsx";
import {cx} from "antd-style";
import {useStyles} from "./styles.jsx";

function Scheduler({
                       readUrl,
                       schedulerDate = new Date(),
                       schedulerStartTime = '10:00',
                       schedulerEndTime = '12:00',
                       orgId,
                       hideDaySelection = true,
                       interval = 15,
                       customSchedulerId
                   }) {

    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date(schedulerDate));
    const [startTimeString, setStartTimeString] = useState(schedulerStartTime);
    const [endTimeString, setEndTimeString] = useState(schedulerEndTime);
    const [allowSchedulerDragAndDrop, setAllowSchedulerDragAndDrop] = useState(false);
    const [courtsData, setCourtsData] = useState([]);
    const doNotShowMultipleReservations = true;
    const hideReserveButtonsOnAdminSchedulers = false;
    const souldHideReserveButton = false;

    let schedulerHub = {};
    let timeZone = 'Etc/UTC';
    const {styles} = useStyles();

    useEffect(() => {
        let fakeCourts = [{
            CourtId: "1", Text: "Court1", Value: "CourtVal1"
        }, {
            CourtId: "2", Text: "Court2", Value: "CourtVal2"
        }]

        setCourtsData(fakeCourts)
    }, []);

    // schedulerHub = $.connection.courtSchedulerViewHub;
    //
    // schedulerHub.client.onCourtsChange = function () {
    //     loadEventsData(/*initialCall*/ true, selectedDate);
    // };

    // schedulerHub.client.create = function (ev) {
    //     ev.Start = new Date(ev.Start);
    //     ev.End = new Date(ev.End);
    //     ev.start = new Date(ev.Start);
    //     ev.end = new Date(ev.End);
    //
    //     ev.isAllDay = false;
    //     setEvents(currentEvents => [...currentEvents, ev]);
    //
    //     setTimeout(function () {
    //         initKendoTooltip();
    //     }, 300);
    // };

    // schedulerHub.client.update = function (ev) {
    //     if (ev) {
    //         setEvents(currentEvents => {
    //             let filteredEvents = currentEvents.filter(event => event.UqId !== ev.UqId);
    //
    //             ev.Start = new Date(ev.Start);
    //             ev.End = new Date(ev.End);
    //             ev.start = new Date(ev.Start);
    //             ev.end = new Date(ev.End);
    //             ev.isAllDay = false;
    //             filteredEvents.push(ev)
    //             return filteredEvents;
    //         });
    //
    //         setTimeout(function () {
    //             initKendoTooltip();
    //         }, 300);
    //     }
    // };
    //
    // schedulerHub.client.destroy = function (ev) {
    //     if (ev) {
    //         setEvents(currentEvents => currentEvents.filter(event => event.UqId !== ev.UqId));
    //     }
    // };
    //
    // $.connection.hub.start().done(function () {
    //     schedulerHub.server.startTracking(`${orgId}`);
    // });

    const loadEventsData = async (initialCall, incDate) => {
        // if (!$('.rct-sched-wrapper').hasClass('--loading')) {
        //     $('.rct-sched-wrapper').addClass('--loading');
        // }
        //
        // const formData = getSelectedCriterias(incDate);
        // const response = await fetch(`${readUrl}&jsonData=${encodeURIComponent(formData)}`);
        // const result = await response.json();
        //
        // if (result) {
        //     const formattedEvents = result.events.map(event => ({
        //         ...event,
        //         Start: new Date(event.Start),
        //         start: new Date(event.Start),
        //         End: new Date(event.End),
        //         end: new Date(event.End),
        //         isAllDay: false
        //     }));
        //
        //     const timeUpdated = (startTimeString != result.openTime || endTimeString != result.closeTime);
        //     if (timeUpdated) {
        //         setStartTimeString(result.openTime);
        //         setEndTimeString(result.closeTime);
        //     }
        //
        //     if (timeUpdated) {
        //         fixSchedulerTimes();
        //
        //         setTimeout(function () {
        //             fixSchedulerTimes();
        //         }, 100);
        //     }
        //
        //     setEvents(formattedEvents);
        //
        //     $('.rct-sched-wrapper').removeClass('--loading');
        //
        //     setTimeout(function () {
        //         initKendoTooltip();
        //     }, 300);
        // }
    }

    const fixSchedulerTimes = () => {
        let counter = 0;

        // const timesItems = document.querySelectorAll('.k-scheduler-body .k-scheduler-group .k-scheduler-row:nth-child(1) .k-scheduler-cell.k-heading-cell');
        // timesItems.forEach(el => {
        //     counter++;
        //     if (counter === 1) {
        //         $(el).addClass('sch-main-time');
        //     } else {
        //         $(el).addClass('sch-secondary-time');
        //     }
        //
        //     if (counter === minorTick) {
        //         $(el).addClass('--last-interval-row');
        //         counter = 0;
        //     }
        // });
    }

    useEffect(() => {
        // $('#react-scheduler').removeClass('--loading');
        // fixSchedulerTimes();
        //
        // setTimeout(function () {
        //     fixSchedulerTimes();
        // }, 100);
        //
        // const resourceHeaders = document.querySelectorAll('.k-scheduler-head .k-scheduler-group .k-scheduler-row:nth-child(1) .k-scheduler-cell.k-heading-cell');
        // let indexFlag = 0;
        // resourceHeaders.forEach(el => {
        //     indexFlag = 0;
        //
        //     const innerHtml = $(el).html();
        //     if (indexFlag === 0 && innerHtml.includes('WAITLIST') && isUsingCourtWaitListing) {
        //         $(el).addClass('sch-waitlist-row');
        //     }
        //
        //     if (innerHtml.includes('grid-header-name')) {
        //         let tempDiv = document.createElement("div");
        //         tempDiv.innerHTML = innerHtml;
        //         let decodedHtml = tempDiv.textContent || tempDiv.innerText || "";
        //         $(el).html(decodedHtml);
        //     }
        //     indexFlag++;
        // });
        //
        // addToolbar();
        // addExportButton();
        // loadEventsData(/*initialCall*/ true, selectedDate);
        // scrollSchedulerToSpecificTime();
        //
        // const handleDragAndDropUpdate = (ev) => {
        //     if (ev && ev.detail) {
        //         let enableDragAndDrop = toBoolean(ev.detail.enableDragAndDrop);
        //         setAlowSchedulerDragAndDrop(enableDragAndDrop);
        //     }
        // }
        //
        // const handleReloadClick = () => {
        //     loadEventsData(/*initialCall*/ true, selectedDate);
        // }
        //
        // document.addEventListener('enableDragAndDropUpdate', handleDragAndDropUpdate);
        // document.addEventListener('reloadSchedulerData', handleReloadClick);
        // document.addEventListener('navigateToToday', handleTodayClick);
        //
        // return () => document.removeEventListener('enableDragAndDropUpdate', handleDragAndDropUpdate);
        // return () => document.removeEventListener('reloadSchedulerData', handleReloadClick);
        // return () => document.removeEventListener('navigateToToday', handleTodayClick);
    }, []);

    const getKendoDate = (incDate) => {
        const date = incDate;
        const year = date.getFullYear();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        return {
            Year: year, Month: month, Day: day
        }
    }

    const getSelectedCriterias = (incDate) => {
        let result = {
            startDate: incDate,
            end: incDate,
            orgId: orgId,
            TimeZone: timeZone,
            Date: incDate.toUTCString(),
            KendoDate: getKendoDate(incDate),
            CustomSchedulerId: customSchedulerId,
            ReservationMinInterval: majorTick,
            SelectedCourtIds: selectedCourtIds, //SelectedInstructorIds: $.cookie('InstructorId_CourtsScheduler'),
            IsAdmin: 'True', //ShowCanceledReservationsDueToClosuresOnAdminSchedulers: $("#@Html.IdFor(v => v.ShowCanceledReservationsDueToClosuresOnAdminSchedulers)").is(":checked"),
            //HideClosures: $("#@Html.IdFor(v => v.HideClosures)").is(':checked'),
            //OpenMatchesOnly: openMatchesOnly,
            RequestData: requestData,
        };

        var stringData = JSON.stringify(result);
        return stringData;
    }

    const shouldHideButton = (courtId, slotStartInc, slotEndInc) => {
        if (!souldHideReserveButton) {
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
            <button start={props.zonedStart}
                    end={props.zonedEnd}
                    courtid={courtId}
                    type='button'
                    onClick={() => openReservationCreateModal(courtId, props.zonedStart, props.zonedEnd)}
                    className={`btn btn-xs btn-default slot-btn ${shouldHideButton(courtId, props.zonedStart, props.zonedEnd) ? 'hide' : ''}`}>Reserve
            </button>
        </SchedulerSlot>)
    }

    const handleDateChange = (event) => {
        reloadDataByDate(event.value);
    }

    const handleTodayClick = () => {
        reloadDataByDate(new Date(orgEndOfADayTime));
    }

    const reloadDataByDate = (date) => {
        setSelectedDate(date);
        // $(".k-scheduler-layout").animate({scrollTop: 0}, "fast");
        //
        // loadEventsData(/*initialCall*/ false, date);
        // var dateStringVal = formatDateByUiCulture(date, uiCulture);
        // saveToCookie("InternalCalendarDate", dateStringVal, 300);
    }

    const handleDataChange = ({
                                  created, updated, deleted,
                              }) => {

        const updatedEvent = updated[0];

        var canEdit = canUserEditItem(updatedEvent);
        if (!canEdit || isMobileLayout) {

        } else {
            const prevEvent = events.find(event => event.UqId === updatedEvent.UqId);
            schedulerResizeEvent(updatedEvent, prevEvent);
        }
    };

    const addExportButton = () => {
        const exportButton = document.createElement('button');
        exportButton.className = 'k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-pdf';
        exportButton.setAttribute('tabindex', '-1');

        // Create the icon span
        const iconSpan = document.createElement('span');
        iconSpan.className = 'k-button-icon k-icon k-i-file-pdf';

        // Create the text span
        const textSpan = document.createElement('span');
        textSpan.className = 'k-button-text';
        textSpan.textContent = 'Export to PDF';

        // Append the spans to the button
        exportButton.appendChild(iconSpan);
        exportButton.appendChild(textSpan);

        // Attach click event listener
        exportButton.addEventListener('click', () => {
            $('.k-scheduler-layout').css('display', 'initial');
            $('.sch-waitlist-row').addClass('k-export-cell-fix').removeClass('sch-waitlist-row');
            $('.k-scheduler').addClass('h-100');

            setTimeout(function () {
                let element = document.querySelector('.k-scheduler-layout');
                savePDF(element, {
                    paperSize: 'auto', fileName: 'Expanded Courts Scheduler'
                });

                $('.k-scheduler-layout').css('display', 'grid');
                $('.k-export-cell-fix').addClass('sch-waitlist-row').removeClass('k-export-cell-fix');
                $('.k-scheduler').removeClass('h-100');
            }, 200);
        });

        const toolbarElement = document.querySelector('.k-toolbar-item');
        if (toolbarElement) {
            // Create a wrapper div for the export button
            const wrapper = document.createElement('div');
            wrapper.className = 'sch-export-wrapper';
            wrapper.appendChild(exportButton);

            // Use insertBefore to add the wrapper as the first child of toolbarElement
            toolbarElement.insertBefore(wrapper, toolbarElement.firstChild);
        }
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

    const fakeCreateForm = () => {

    }

    return (
        <div className={cx(styles.scheduler)}>
            <InnerScheduler
                data={events}
                hideDaySelection={hideDaySelection}
                timezone={timeZone}
                date={selectedDate}
                defaultDate={selectedDate}
                onDateChange={handleDateChange}
                onDataChange={handleDataChange}
                modelFields={modelFields}
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
                footer={(props) => <React.Fragment/>}
                resources={[{
                    name: 'Courts',
                    data: courtsData,
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
                />
            </InnerScheduler>
        </div>
    );
}

export default Scheduler
