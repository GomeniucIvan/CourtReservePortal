import {equalString, isNullOrEmpty} from "./Utils.jsx";
import moment from "moment";

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

export const getCurrencySymbolByCulture = () => {
    const currency = getCurrencyTypeByCultureInfo();

    switch (currency) {
        case 'Usd':
        case 'Cad':
        case 'Aud':
        case 'SGD':
        case 'KYD':
        case 'MXN':
            return '$';
        case 'Gbp':
            return '£';
        case 'Eur':
            return '€';
        case 'AED':
            return 'د.إ';
        case 'Id':
            return 'Rp';
        case 'Quetzal':
            return 'Q';
        case 'Florin':
            return 'Afl';
        case 'Nzd':
            return '$';
        case 'KES':
            return 'Ksh';
        case 'TRY':
            return '₺';
        default:
            return '$';
    }
}

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

export const fromAspDate = (dateString) => {
    if (!dateString) return null;
    return moment.utc(dateString).toDate();
}


export const fromAspDateToString = (dateString) => {
    if (!dateString) return null;
    return moment.utc(dateString).format(`${dateFormatByUiCulture()} HH:mm:ss`);
}

export const fixDate = (dateString) =>{
    if (!dateString) return null;

    return fromAspDate(dateString);
}

export const toReactDate = (incDate) => {
    if (isNullOrEmpty(incDate)){
        return '';
    }
    
    return fromAspDate(incDate);
}

export const dateToString = (incDate) => {
    if (isNullOrEmpty(incDate)){
        return '';
    }

    return moment.utc(incDate).format(dateFormatByUiCulture());
}

export const dateToTimeString = (incDate, twentyFourHourFormat) => {
    if (isNullOrEmpty(incDate)){
        return '';
    }

    if (twentyFourHourFormat){
        return moment.utc(incDate).format('HH:mm');
    }

    return moment.utc(incDate).format('H:mm');
}

export const isNonUsCulture = () => {
    if (isNullOrEmpty(clientUiCulture)) {
        return false;
    }

    return equalString(clientUiCulture, 'en-us');
}

export const dateTimeToFormat = (incDate, format) => {
    if (isNullOrEmpty(incDate)){
        return '';
    }

    return moment.utc(incDate).format(format);
}

export const dateTimeToTimes = (incStartDate, incEndDate, format) => {
    if (isNullOrEmpty(incStartDate) || isNullOrEmpty(incEndDate)){
        return '';
    }

    if (equalString(format, 'friendly')){
        return `${moment.utc(incStartDate).format('ha').toLowerCase()} - ${moment.utc(incEndDate).format('ha').toLowerCase()}`;
    }
    
    return `${moment.utc(incStartDate).format('ha').toLowerCase()} - ${moment.utc(incEndDate).format('ha').toLowerCase()}`;
}