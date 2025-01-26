import {getCurrencySymbolByCulture} from "./DateUtils.jsx";
import {parseSafeInt} from "./NumberUtils.jsx";
import {equalString, isNullOrEmpty} from "./Utils.jsx";

export const costDisplay = (price, negative) => {
    if (isNullOrEmpty(price)){
        price = 0;    
    }
    
    if (parseSafeInt(price) === 0){
        price = 0;
    }

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

    if (!isNullOrEmpty(org) && !isNullOrEmpty(org?.convenienceFeeFixedAmount)) {
        total += org.convenienceFeeFixedAmount || 0;
    }

    const fixedConvFee = org?.convenienceFeePercent || 0;
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

    try {
        const isMonthlyPaymentFrequency = equalString(selectedPaymentFrequency, '1');
        const isQuarterPaymentFrequency = equalString(selectedPaymentFrequency, '2');
        const isAnnualPaymentFrequency = equalString(selectedPaymentFrequency, '3');
        const isCustomPaymentFrequency = equalString(selectedPaymentFrequency, '4');
        const isOneTimePaymentFrequency = equalString(selectedPaymentFrequency, '5');


        if (isMonthlyPaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.MonthlyMembershipPrice)) {
                return false;
            }

            const monthlyDoubleCost = parseFloat(selectedMembership.MonthlyMembershipPrice);
            return monthlyDoubleCost > 0;
        }

        if (isAnnualPaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.AnnualMembershipPrice)) {
                return false;
            }

            const annualDoubleCost = parseFloat(selectedMembership.AnnualMembershipPrice);
            return annualDoubleCost > 0;
        }

        if (isQuarterPaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.QuarterMembershipPrice)) {
                return false;
            }

            const quarterDoubleCost = parseFloat(selectedMembership.QuarterMembershipPrice);
            return quarterDoubleCost > 0;
        }

        if (isCustomPaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.CustomMembershipPrice)) {
                return false;
            }

            const customDoubleCost = parseFloat(selectedMembership.CustomMembershipPrice);
            return customDoubleCost > 0;
        }

        if (isOneTimePaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.LifetimeMembershipPrice)) {
                return false;
            }

            const lifetimeDoubleCost = parseFloat(selectedMembership.LifetimeMembershipPrice);
            return lifetimeDoubleCost > 0;
        }
    } catch (e) {
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

    try {
        const isMonthlyPaymentFrequency = equalString(selectedPaymentFrequency, '1');
        const isQuarterPaymentFrequency = equalString(selectedPaymentFrequency, '2');
        const isAnnualPaymentFrequency = equalString(selectedPaymentFrequency, '3');
        const isCustomPaymentFrequency = equalString(selectedPaymentFrequency, '4');
        const isOneTimePaymentFrequency = equalString(selectedPaymentFrequency, '5');


        if (isMonthlyPaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.MonthlyMembershipPrice)) {
                return null;
            }

            const monthlyDoubleCost = parseFloat(selectedMembership.MonthlyMembershipPrice);
            if (monthlyDoubleCost > 0) {
                return monthlyDoubleCost;
            }
            return null;
        }

        if (isAnnualPaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.AnnualMembershipPrice)) {
                return null;
            }

            const annualDoubleCost = parseFloat(selectedMembership.AnnualMembershipPrice);
            if (annualDoubleCost > 0) {
                return annualDoubleCost;
            }
            return null;
        }

        if (isQuarterPaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.QuarterMembershipPrice)) {
                return null;
            }

            const quarterDoubleCost = parseFloat(selectedMembership.QuarterMembershipPrice);
            if (quarterDoubleCost > 0) {
                return quarterDoubleCost;
            }
            return null;
        }

        if (isCustomPaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.CustomMembershipPrice)) {
                return null;
            }

            const customDoubleCost = parseFloat(selectedMembership.CustomMembershipPrice);
            if (customDoubleCost > 0) {
                return customDoubleCost;
            }
            return null;
        }

        if (isOneTimePaymentFrequency) {
            if (isNullOrEmpty(selectedMembership.LifetimeMembershipPrice)) {
                return false;
            }

            const lifetimeDoubleCost = parseFloat(selectedMembership.LifetimeMembershipPrice);
            if (lifetimeDoubleCost > 0) {
                return lifetimeDoubleCost;
            }
            return null;
        }
    } catch (e) {
        return null;
    }

    return null;
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