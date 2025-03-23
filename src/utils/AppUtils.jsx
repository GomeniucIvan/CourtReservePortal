import {logInfo} from "@/utils/ConsoleUtils.jsx";
import {equalString, toBoolean} from "@/utils/Utils.jsx";

export const getGlobalIsAuthorized = () => {
    if (typeof globalIsAuthorized !== 'undefined') {
        logInfo('globalIsAuthorized:', globalIsAuthorized);
        return globalIsAuthorized;

    } else {
        logInfo('globalIsAuthorized is not defined');
    }
}

export const getGlobalSpGuideId = () => {
    if (typeof globalSpGuideId !== 'undefined') {
        logInfo('globalSpGuideId:', globalSpGuideId);
        if (!equalString(globalSpGuideId, 'courtreserve')) {
            return globalSpGuideId; 
        }
    } else {
        logInfo('globalSpGuideId is not defined');
    }

    return '';
}

export const getGlobalMobileToken = () => {
    if (typeof globalMobileToken !== 'undefined') {
        logInfo('globalSpGuideId:', globalMobileToken);
        return globalMobileToken;

    } else {
        logInfo('globalMobileToken is not defined');
    }
}

export const getGlobalMobileTokenId = () => {
    if (typeof globalMobileTokenId !== 'undefined') {
        logInfo('globalMobileTokenId:', globalMobileTokenId);
        return globalMobileTokenId;

    } else {
        logInfo('globalMobileTokenId is not defined');
    }
}

export const getGlobalDeviceId = () => {
    if (typeof globalDeviceId !== 'undefined') {
        logInfo('globalDeviceId:', globalDeviceId);
        return globalDeviceId;
    } else {
        logInfo('globalDeviceId is not defined');
    }

    return '';
}

export const getInitialGlobalRedirectUrl = (clearValue) => {
    if (typeof globalRedirectUrl !== 'undefined') {
        logInfo('globalRedirectUrl:', globalRedirectUrl);
        let valueToReturn = globalRedirectUrl;
        if (toBoolean(clearValue)) {
            valueToReturn = null;
        }
        
        return valueToReturn;
    } else {
        logInfo('globalRedirectUrl is not defined');
    }

    return '';
}

export const getGlobalSpGuideBaseColor = () => {
    if (typeof globalSpGuideBaseColor !== 'undefined') {
        logInfo('globalSpGuideBaseColor:', globalSpGuideBaseColor);
        return globalSpGuideBaseColor;

    } else {
        logInfo('globalSpGuideBaseColor is not defined');
    }

    return '';
}

export const getGlobalSpGuideTextColor = () => {
    if (typeof globalSpGuideTextColor !== 'undefined') {
        logInfo('globalSpGuideTextColor:', globalSpGuideTextColor);
        return globalSpGuideTextColor;
    } else {
        logInfo('globalSpGuideTextColor is not defined');
    }

    return '';
}