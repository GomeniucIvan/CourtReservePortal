import {isNullOrEmpty} from "./Utils.jsx";

const bookingTypesFunc = () => {
    const types = [];
    types.push({Text: 'reservations', Value: 1})
    types.push({Text: 'courtWaitlist', Value: 2})
    types.push({Text: 'lessons', Value: 3})
    types.push({Text: 'eventRegistered', Value: 4})
    types.push({Text: 'eventWaitlist', Value: 5})
    return types;
}

const filterDatesFunc = () => {
    const types = [];
    types.push({Text: 'date.today', Value: 1})
    types.push({Text: 'date.tomorrow', Value: 2})
    types.push({Text: 'date.next7Days', Value: 3})
    types.push({Text: 'date.next30Days', Value: 4})
    types.push({Text: 'date.custom', Value: 5})
    return types;
}

export const bookingTypes = bookingTypesFunc();
export const filterDates = filterDatesFunc();






const isValidJson = (jsonString) => {
    if (isNullOrEmpty(jsonString)){
        return false;
    }
    
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        console.error('Invalid JSON:', error);
        return false;
    }
};

export const stringToJson = (incString) => {
    if (isValidJson(incString)) {
        return JSON.parse(incString);
    }
    
    return [];
}