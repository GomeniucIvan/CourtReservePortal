import {equalString, isNullOrEmpty} from "./Utils.jsx";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

let clientUiCulture = 'en-US';

export const setClientUiCulture = (uiCulture) => {
    clientUiCulture = uiCulture;
}

export const getClientUiCulture = () => {
    return clientUiCulture;
}

export const getCurrencyTypeByCultureInfo = (culture) => {
    if (isNullOrEmpty(culture)) {
        culture = getClientUiCulture();
    }

    if (isNullOrEmpty(culture)) {
        culture = "enUs";
    }

    culture = culture.toLowerCase();

    switch (culture) {
        case "enus":
        case "en-us":
            return "Usd";
        case "engb":
        case "en-gb":
            return "Gbp";
        case "enca":
        case "en-ca":
            return "Cad";
        case "enau":
        case "en-au":
            return "Aud";
        case "enie":
        case "en-ie":
            return "Eur";
        case "id":
        case "id-id":
        case "idid":
        case "idID":
            return "Id";
        case "esgt":
        case "es-gt":
            return "Quetzal";
        case "nl-aw":
        case "nlaw":
            return "Florin";
        case "en-sg":
        case "ensg":
            return "SGD";
        case "en-ke":
        case "enke":
            return "KES";
        case "en-ky":
        case "enky":
            return "KYD";
        case "tr-tr":
        case "trtr":
            return "TRY";
        case "es-mx":
        case "esmx":
            return "MXN";
        case "arae":
            return "AED";
        default:
            return "Usd";
    }
};

export const dateFormatByUiCulture = () => {
    let culture = getCurrencyTypeByCultureInfo();

    if (isNullOrEmpty(culture)) {
        culture = "enUs";
    }

    culture = culture.toLowerCase();

    if (equalString(culture, 'enGB') ||
        equalString(culture, 'enIE') ||
        equalString(culture, 'enAU') ||
        equalString(culture, 'idID') ||
        equalString(culture, 'esGT') ||
        equalString(culture, 'nlAW') ||
        equalString(culture, 'enSG') ||
        equalString(culture, 'enKE') ||
        equalString(culture, 'esMX') ||
        equalString(culture, 'enKY') ||
        equalString(culture, 'arAE')
    ) {
        return "D/M/YYYY";
    } else if (equalString(culture, 'trTR')) {
        return "D.M.YYYY";
    } else {
        return "M/D/YYYY";
    }
}

export const cultureStartingWithDay = (uiCulture) => {
    const isStartingWithDay = equalString(uiCulture, 'en-GB') ||
        equalString(uiCulture, 'en-GB') ||
        equalString(uiCulture, 'en-AU') ||
        equalString(uiCulture, 'en-IE') ||
        equalString(uiCulture, 'id-ID') ||
        equalString(uiCulture, 'en-SG') ||
        equalString(uiCulture, 'es-GT');
    return isStartingWithDay;
}

export const fixDate = (dateString) =>{
    if (!dateString) return null;

    // Check if the format is the Microsoft JSON date format
    const msDateMatch = (dateString && typeof dateString === 'string') ? dateString.match(/\/Date\((\d+)([-+]\d+)?\)\//) : null;
    if (msDateMatch) {
        const ms = parseInt(msDateMatch[1], 10); // Extract milliseconds since epoch
        //return dayjs.utc(ms).tz(dayjs.tz.guess(), true).format('YYYY-MM-DDTHH:mm:ssZ');
        return dayjs.utc(ms).format('YYYY-MM-DDTHH:mm:ssZ');
    }

    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }

    return null;
}

export const dateToString = (incDate) => {
    if (isNullOrEmpty(incDate)){
        return '';
    }
    
    const fixedDate = fixDate(incDate);
    const date = dayjs(fixedDate);
    return date.format(dateFormatByUiCulture());
}

export const dateToTimeString = (incDate, twentyFourHourFormat) => {
    if (isNullOrEmpty(incDate)){
        return '';
    }

    const fixedDate = fixDate(incDate);
    const date = dayjs(fixedDate).utc();
    if (twentyFourHourFormat){
        return date.format('HH:mm');
    }
    
    return date.format('H:mm'); 
}

export const isNonUsCulture = () => {
    if (isNullOrEmpty(clientUiCulture)) {
        return false;
    }

    return equalString(clientUiCulture, 'en-us');
} 

export const toAspNetDate = (incDate) => {
    return dateToString(incDate);
    
    // const milliseconds = parseInt(incDate.replace(/\/Date\((\d+)\)\//, '$1'), 10);
    // console.log(milliseconds)
    // return new Date(milliseconds);
}

export const dateTimeToFormat = (incDate, format) => {
    if (isNullOrEmpty(incDate)){
        return '';
    }

    const fixedDate = fixDate(incDate);
    const date = dayjs(fixedDate);
    return date.format(format);
}