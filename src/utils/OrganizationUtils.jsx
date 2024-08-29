import {getCurrencyTypeByCultureInfo} from "./DateUtils.jsx";
import {equalString} from "./Utils.jsx";

export const t = (string) => {
    return string;
}

export const isCanadaCulture = () => {
    let culture = getCurrencyTypeByCultureInfo();
    return  equalString(culture, 'enca');
}