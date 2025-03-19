import {getCurrencySymbolByCulture} from "./DateUtils.jsx";
import {parseSafeInt} from "./NumberUtils.jsx";
import {anyInList, equalString, isNullOrEmpty} from "./Utils.jsx";

export const costDisplay = (price, negative) => {
    if (isNullOrEmpty(price)){
        price = 0;    
    }
    //
    // if (parseSafeInt(price) === 0){
    //     price = 0;
    // }

    if (negative && price !== 0){
        price = price * -1;
    }
    
    return `${getCurrencySymbolByCulture()}${price.toFixed(2)}`;
}

export const calculateConvenienceFee = (total, org, onlyFee) => {
    if (isNullOrEmpty(total)) {
        return null;
    }

    if (total <= 0) {
        return null;
    }

    let incrementedTotal = total;

    let convenienceFeeFixedAmount = org?.convenienceFeeFixedAmount || org?.ConvenienceFeeFixedAmount;
    let convenienceFeePercent = org?.convenienceFeePercent || org?.ConvenienceFeePercent;
    
    
    if (!isNullOrEmpty(org) && !isNullOrEmpty(convenienceFeeFixedAmount)) {
        total += convenienceFeeFixedAmount || 0;
    }

    const fixedConvFee = convenienceFeePercent || 0;
    if (fixedConvFee > 0) {
        total += (total * fixedConvFee) / 100;
    }

    if (onlyFee) {
        let sumToReturn = total - incrementedTotal;

        if (sumToReturn > 0) {
            return Math.round(sumToReturn * 100) / 100;
        }

        return Math.round(sumToReturn);
    }

    if (total > 0) {
        return Math.round(total * 100) / 100;
    }

    return Math.round(total);
}

export const membershipRequirePayment = (selectedMembership, selectedPaymentFrequency) => {
    if (isNullOrEmpty(selectedMembership)) {
        return false;
    }

    if (isNullOrEmpty(selectedPaymentFrequency)) {
        return false;
    }

    if (anyInList(selectedMembership?.Prices)) {
        try {
            const findPayment = selectedMembership.Prices.find((price) => price.CostTypeFrequency == selectedPaymentFrequency ? price : null);

            if (findPayment) {
                const doubleCost = parseFloat(findPayment.Price);
                return doubleCost > 0;
            }
        } catch (e) {
            return false;
        }
    } else if (anyInList(selectedMembership?.GetMembershipFrequenciesWithCost)) {
        let selectedCost = selectedMembership?.GetMembershipFrequenciesWithCost.find(v => equalString(v.Value, selectedPaymentFrequency));
        if (selectedCost) {
            const doubleCost = parseFloat(selectedCost.Cost);
            return doubleCost > 0;
        }

        return false;
    }

    return false;
}

export const membershipPaymentFrequencyCost = (selectedMembership, selectedPaymentFrequency) => {
    if (isNullOrEmpty(selectedMembership)) {
        return null;
    }

    if (isNullOrEmpty(selectedPaymentFrequency)) {
        return null;
    }

    if (anyInList(selectedMembership?.Prices)) {
        try {
            const findPayment = selectedMembership?.Prices.find((price) => price.CostTypeFrequency == selectedPaymentFrequency ? price : null);

            if (findPayment) {
                const doubleCost = parseFloat(findPayment.Price);
                if (doubleCost > 0) {
                    return doubleCost;
                }
            }
            // return selectedMembership.Prices[0].FullPriceDisplay;
        } catch (e) {
            return null;
        }
    } else if (anyInList(selectedMembership?.GetMembershipFrequenciesWithCost)) {
        let selectedCost = selectedMembership?.GetMembershipFrequenciesWithCost.find(v => equalString(v.Value, selectedPaymentFrequency));
        if (selectedCost) {
            const doubleCost = parseFloat(selectedCost.Cost);
            if (doubleCost > 0) {
                return doubleCost;
            }
        }

        return null;
    }
}

export const membershipCalculateTaxProperties = (selectedMembership, planFrequency, subtotal) => {
    if (isNullOrEmpty(selectedMembership)) {
        return null;
    }

    if (isNullOrEmpty(selectedMembership.TaxRateId)) {
        return null;
    }

    const taxRate = selectedMembership.TaxRate;

    if (isNullOrEmpty(taxRate)) {
        return null;
    }

    if (!equalString(taxRate.InitiationFeeTaxable, 1) && isNullOrEmpty(planFrequency)) {
        return null;
    }

    //InitiationFeeTaxableOptionEnum.Taxable
    if (isNullOrEmpty(planFrequency) && equalString(taxRate.InitiationFeeTaxable, 1)) {
        return null;
    }

    let taxTotal = null;

    //TaxOptionEnum.Excluded
    if (equalString(taxRate.TaxOptionId, 1)) {
        taxTotal = subtotal * (taxRate.Percent / 100);
    }

    //if (equalString(taxRate.TaxOptionId, 2)) {
    //    taxTotal = subtotal - (subtotal / (1 + (taxRate.Percent / 100)));
    //}

    if (taxTotal > 1000) {
        taxTotal = null;
    }

    return taxTotal;
}