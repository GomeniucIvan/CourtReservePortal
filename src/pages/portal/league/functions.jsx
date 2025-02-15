import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {fromDateTimeStringToDateFormat} from "@/utils/DateUtils.jsx";

export const leagueHasMatches = (sessionGameDayGroupStatus) => {
    let hasMatches = equalString(sessionGameDayGroupStatus, '2') || equalString(sessionGameDayGroupStatus, '3');
    return toBoolean(hasMatches);
}

export const displayLeaguePlayerFormat = (leagueGender) => {
    if (equalString(leagueGender, 1)) {
        return 'Men';
    } else if (equalString(leagueGender, 2)) {
        return 'Women';
    } else if (equalString(leagueGender, 3)) {
        return 'Mixed';
    } else if (equalString(leagueGender, 4)) {
        return 'Co-Ed';
    }
}

export const leagueDisplayEventDates = (model) => {
    let result = '';
    if (!isNullOrEmpty(model.FirstLeagueStartDateTimeStringDisplay) && !isNullOrEmpty(model.LastLeagueStartDateTimeStringDisplay))
    {
        if (equalString(model.FirstLeagueStartDateTimeStringDisplay, model.LastLeagueStartDateTimeStringDisplay))
        {
            result = fromDateTimeStringToDateFormat(model.FirstLeagueStartDateTimeStringDisplay);
        }
        else
        {
            result = `${fromDateTimeStringToDateFormat(model.FirstLeagueStartDateTimeStringDisplay)} - ${fromDateTimeStringToDateFormat(model.LastLeagueStartDateTimeStringDisplay)}`;
        }
    }

    if (model.TotalDatesCount > 1)
    {
        result = `${result} (${model.TotalDatesCount} dates)`;
    }

    return result;
}