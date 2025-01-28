import apiService from "@/api/api.jsx";
import moment from "moment/moment.js";
import {dateFormatByUiCulture} from "@/utils/DateUtils.jsx";
import {equalString} from "@/utils/Utils.jsx";


export const schedulerItemsRead = async (type, schedulerData, selectedDate, courts) => {
    console.log(schedulerData);
    
    const result = {
        startDate: selectedDate,
        //end: scheduler.view().endDate(),
        orgId: schedulerData.OrgId,
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
    
    let resp = null
    if (equalString(type, 'expanded')) {
        resp = await apiService.get(`/api/scheduler/member-expanded?id=${orgId}&jsonData=${JSON.stringify(result)}`);
    } else if (equalString(type, 'instructor')){
        resp = await apiService.get(`/app/Online/Reservations/ReadInstructorExpanded?id=${orgId}&jsonData=${JSON.stringify(result)}`);
    }
    
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
}