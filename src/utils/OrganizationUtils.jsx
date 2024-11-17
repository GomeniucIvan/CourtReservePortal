import {getCurrencyTypeByCultureInfo} from "./DateUtils.jsx";
import {equalString, isNullOrEmpty} from "./Utils.jsx";

export const e = (string) => {
    return string;
}

export const requiredMessage = (t, key) => {
    return t('common:requiredMessage', {label: t(key)})
}

export const isCanadaCulture = (uiCulture) => {
    let culture = getCurrencyTypeByCultureInfo(uiCulture);
    return equalString(culture, 'enca');
}

export const orgCardCountryCode = (uiCulture) => {
    let selectedCountry = 'US';

    if (isNullOrEmpty(uiCulture))
    {
        uiCulture = getCurrencyTypeByCultureInfo();
    }
    
    if (equalString(uiCulture, "enca")) {
        selectedCountry = "CA";
    }
    if (equalString(uiCulture, "enGB")) {
        selectedCountry = "UK";
    }
    if (equalString(uiCulture, "enAU")) {
        selectedCountry = "AU";
    }
    if (equalString(uiCulture, "idID")) {
        selectedCountry = "ID";
    }
    if (equalString(uiCulture, "esGT")) {
        selectedCountry = "GT";
    }
    if (equalString(uiCulture, "nlAW")) {
        selectedCountry = "AW";
    }
    if (equalString(uiCulture, "enSG")) {
        selectedCountry = "SG";
    }
    if (equalString(uiCulture, "enKE")) {
        selectedCountry = "KE";
    }
    if (equalString(uiCulture, "enKY")) {
        selectedCountry = "KY";
    }
    if (equalString(uiCulture, "trTR")) {
        selectedCountry = "TR";
    }
    if (equalString(uiCulture, "esMX")) {
        selectedCountry = "MX";
    }

    return selectedCountry;
}