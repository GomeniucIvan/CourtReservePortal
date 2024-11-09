import {getCurrencySymbolByCulture} from "./DateUtils.jsx";
import {parseSafeInt} from "./NumberUtils.jsx";

export const costDisplay = (price, negative) => {
    if (parseSafeInt(price) === 0){
        price = 0;
    }

    if (negative && price !== 0){
        price = price * -1;
    }
    
    return `${getCurrencySymbolByCulture()}${price.toFixed(2)}`;
}