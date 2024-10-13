import {isNullOrEmpty} from "./Utils.jsx";
import {getCurrencySymbolByCulture} from "./DateUtils.jsx";

export const costDisplay = (price) => {
    if (isNullOrEmpty(price)){
        price = 0;
    }

    return `${getCurrencySymbolByCulture()}${price.toFixed(2)}`;
}