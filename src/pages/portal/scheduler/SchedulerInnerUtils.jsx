import {dateFormatByUiCulture} from "@/utils/DateUtils.jsx";
import {saveCookie} from "@/utils/CookieUtils.jsx";
import {equalString, isNullOrEmpty} from "@/utils/Utils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import moment from "moment";

export const expandedModelFields = {
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

export const consolidatedModelFields = {
    id: "Id",
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

export const handleDateChange = (event, setSelectedDate) => {
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

export const handleDataChange = (e) => {
}

export const expandedOpenReservationCreateModal = (navigate, props, dataItem) => {
    let start = props.start;
    let end = props.end;
    let customSchedulerId = props.customSchedulerId;
debugger
    navigate(ProfileRouteNames.RESERVATION_CREATE, {
        state: {
            dataItem,
            start,
            end,
            customSchedulerId
        }
    });
}

export const scrollToCurrentTime = () => {
    const currentTimeElement = document.querySelector('.k-current-time');

    if (currentTimeElement) {
        currentTimeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }
};

export const courtHeader = (court, customSchedulerId, token) => {
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

export const instructorHeader = (instructor, token) => {
    return (
        `<span style="color: ${token.colorPrimary};font-weight: 500;">${instructor.FullName}</span><br/><span>${instructor.InstructorType.Name}</span>`
    )
}