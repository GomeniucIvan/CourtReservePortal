import {getCurrencySymbolByCulture} from "./DateUtils.jsx";
import {parseSafeInt} from "./NumberUtils.jsx";
import {isNullOrEmpty} from "./Utils.jsx";

export const costDisplay = (price, negative) => {
    if (parseSafeInt(price) === 0){
        price = 0;
    }

    if (negative && price !== 0){
        price = price * -1;
    }
    
    return `${getCurrencySymbolByCulture()}${price.toFixed(2)}`;
}

export const calculateConvenienceFee = (authData, total, onlyFee) => {
    if (isNullOrEmpty(total)) {
        return null;
    }

    if (total <= 0) {
        return null;
    }

    let incrementedTotal = total;

    if (!isNullOrEmpty(org) && !isNullOrEmpty(org.ConvenienceFeeFixedAmount)) {
        total += org.ConvenienceFeeFixedAmount || 0;

        const fixedConvFee = org.ConvenienceFeePercent || 0;
        if (fixedConvFee > 0) {
            total += (total * fixedConvFee) / 100;
        }
    }

    if (onlyFee) {
        return Math.round(total - incrementedTotal);
    }

    return Math.round(total);
}