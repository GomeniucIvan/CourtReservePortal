import {fromAuthLocalStorage} from "../storage/AppStorage.jsx";
import {toBoolean} from "./Utils.jsx";

const genders = () => {
    let list = [];
    list.push({Text: "gender.none", Value: 'None', translate: true});
    list.push({Text: "gender.male", Value: 'Female', translate: true});
    list.push({Text: "gender.female", Value: 'Female', translate: true});
    list.push({Text: "gender.preferNotToDisclose", Value: 'PND', translate: true});
    return list;
}

const matchMakerGenders = () => {
    let list = [];
    list.push({Text: "No Gender Restrictions", Value: '1', translate: false});
    list.push({Text: "Mixed", Value: '2', translate: false});
    list.push({Text: "M", Value: '3', translate: false});
    list.push({Text: "F", Value: '4', translate: false});
    return list;
}

const usaStates = () => {
    const states = [
        "AK", "AL", "AR", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
        "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME",
        "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM",
        "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
        "UT", "VA", "VT", "WA", "WI", "WV", "WY", "PR", "VI"
    ];
    
    return states.map(state => ({
        Text: state,
        Value: state
    }));
}
const canadianProvinces = () => {
    const provinces = [
        "AB", // Alberta
        "BC", // British Columbia
        "MB", // Manitoba
        "NB", // New Brunswick
        "NL", // Newfoundland and Labrador
        "NT", // Northwest Territories
        "NS", // Nova Scotia
        "NU", // Nunavut
        "ON", // Ontario
        "PE", // Prince Edward Island
        "QC", // Quebec
        "SK", // Saskatchewan
        "YT"  // Yukon
    ];

    return  provinces.map(province => ({
        Text: province,
        Value: province
    }));
}
const bookingTypesFunc = () => {
    const types = [];
    const memberData = fromAuthLocalStorage('memberData', {});

    types.push({Text: 'reservations', Value: 1})

    if (toBoolean(memberData?.isUsingCourtWaitlisting)){
        types.push({Text: 'courtWaitlist', Value: 2})
    }

    if (toBoolean(memberData?.hasActiveInstructors)){
        types.push({Text: 'lessons', Value: 3});
    }

    if (!toBoolean(memberData?.myAccountHideMyEvents)){
        types.push({Text: 'eventRegistered', Value: 4});
    }

    if (!toBoolean(memberData?.myAccountHideWaitingList)){
        types.push({Text: 'eventWaitlist', Value: 5});
    }

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

export const numberList = (minValue, maxValue) => {
    const list = [];
    let difference = maxValue - minValue;

    for (let i = 0; i <= difference; i++) {
        list.push({Text: minValue + i, Value: minValue + i})
    }
    return list;
}

export const bookingTypes = bookingTypesFunc();
export const filterDates = filterDatesFunc();
export const usaStateList = usaStates();
export const genderList = genders();
export const matchmakerGenderList = matchMakerGenders();
export const canadianProvincesList = canadianProvinces();