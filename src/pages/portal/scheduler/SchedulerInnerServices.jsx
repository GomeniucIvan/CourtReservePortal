import apiService from "@/api/api.jsx";
import moment from "moment/moment.js";
import {dateFormatByUiCulture} from "@/utils/DateUtils.jsx";
import {equalString} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";


export const schedulerItemsRead = async (type, schedulerData, selectedDate, courts) => {
    let orgId = schedulerData.OrgId;
    
    let result = {
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
        ReservationMinInterval: schedulerData.MajorTick
    }
    
    if (equalString(type, 'expanded')) {
        result.SelectedCourtIds = courts.map(item => item.Id).join(',');
        result.SelectedInstructorIds = '';
        result.MemberIds = schedulerData.MemberIds.join(',');
        result.MemberFamilyId = '';
        result.EmbedCodeId = '';
        result.HideEmbedCodeReservationDetails = '';
    } else if (equalString(type, 'instructor')) {
        
    } else if (equalString(type, 'consolidated')) {
        //nothing
    }
    
    let resp = null;

    let formattedEvents = [];
    
    if (equalString(type, 'expanded')) {
        resp = await apiService.get(null, `/api/scheduler/member-expanded?id=${orgId}&jsonData=${JSON.stringify(result)}`);
    } else if (equalString(type, 'instructor')){
        resp = await appService.get(null, `/app/Online/Reservations/ReadInstructorExpanded?id=${orgId}&jsonData=${JSON.stringify(result)}`);
    } else if (equalString(type, 'consolidated')){
        resp = await appService.get(null, `/app/Online/Reservations/ReadConsolidated?id=${orgId}&jsonData=${JSON.stringify(result)}`);
    }
    
    console.log(resp.Data);
    
    formattedEvents = resp.Data.map(event => ({
        ...event,
        Start: equalString(type, 'consolidated') ? new Date(event.StartTimeString) :  new Date(event.Start),
        start: equalString(type, 'consolidated') ? new Date(event.StartTimeString) :  new Date(event.Start),
        End: equalString(type, 'consolidated') ? new Date(event.EndTimeString) :  new Date(event.End),
        end: equalString(type, 'consolidated') ? new Date(event.EndTimeString) :  new Date(event.End),

        isAllDay: false,
        IsAllDay: false,
    }));

    return formattedEvents;
}