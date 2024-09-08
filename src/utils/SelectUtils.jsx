const genders = () => {
    let list = [];
    list.push({Text: "gender.none", Value: 'None', translate: true});
    list.push({Text: "gender.male", Value: 'Female', translate: true});
    list.push({Text: "gender.female", Value: 'Female', translate: true});
    list.push({Text: "gender.preferNotToDisclose", Value: 'PND', translate: true});
    return list;
}

export const genderList = genders();


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

export const usaStateList = usaStates();

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

export const canadianProvincesList = canadianProvinces();