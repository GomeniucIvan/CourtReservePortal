import {pNotify} from "../components/notification/PNotify.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const isNullOrEmpty = (data) => {
    if (data === undefined || data === '' || data === null || data === 'undefined' || data === 'null') {
        return true;
    }

    if ((Array.isArray(data) && data.length === 0)) {
        //empty array is not nullable data
        return false;
    }
    
    let stringData = data.toString();

    try {
        stringData = stringData.trim();
    } catch (e) {
        return true;
    }

    return (!stringData || 0 === stringData.length);
}

export const getValueOrDefault = (data, defaultValue) => {

    try {
        if (isNullOrEmpty(data)) {
            return defaultValue;
        }
        return data;
    } catch (e) {
        return defaultValue;
    }
}

export const containsString  = (firstItem, secondItem) => {
    if (isNullOrEmpty(firstItem) && isNullOrEmpty(secondItem)) {
        return true;
    }

    if (!isNullOrEmpty(firstItem) && isNullOrEmpty(secondItem)) {
        return false;
    }

    if (isNullOrEmpty(firstItem) && !isNullOrEmpty(secondItem)) {
        return false;
    }

    const firstItemToString = firstItem.toString().toLowerCase();
    const secondItemToString = secondItem.toString().toLowerCase();

    return firstItemToString.includes(secondItemToString);
}

export const equalString = (firstItem, secondItem, isPath) => {
    if (isNullOrEmpty(firstItem) && isNullOrEmpty(secondItem)) {
        return true;
    }

    if (!isNullOrEmpty(firstItem) && isNullOrEmpty(secondItem)) {
        return false;
    }

    if (isNullOrEmpty(firstItem) && !isNullOrEmpty(secondItem)) {
        return false;
    }

    if (toBoolean(isPath)) {
        let workingSeoCode = localStorage.getItem('working_seo');
        if (!isNullOrEmpty(workingSeoCode)) {
            secondItem = `/${workingSeoCode}${secondItem}`;
        }
    }

    const firstItemToString = firstItem.toString().toLowerCase();
    const secondItemToString = secondItem.toString().toLowerCase();

    return firstItemToString === secondItemToString;
}

export function toBoolean(value) {
    if (isNullOrEmpty(value)) {
        return false;
    }
    else if (typeof value === 'boolean') {
        return value;
    } else if (typeof value === 'string') {
        const lowerCaseValue = value.toLowerCase();
        return lowerCaseValue === 'true' || lowerCaseValue === 'yes' || lowerCaseValue === '1';
    } else {
        return Boolean(value);
    }
}

export const anyInList = (data) => {
    if (data === undefined || data === '' || data === null || data === 'undefined') {
        return false;
    }
    return data.length > 0;
}

export const moreThanOneInList = (data) => {
    if (data === undefined || data === '' || data === null || data === 'undefined') {
        return false;
    }
    return data.length > 1;
}

export const oneListItem = (data) => {
    if (data === undefined || data === '' || data === null || data === 'undefined') {
        return false;
    }
    return data.length === 1;
}

export const organizationLogoSrc = (orgId, logoUrl) => {
    let defSrc = 'https://app.courtreserve.com/Content/Images/logo.png';
    if (!isNullOrEmpty(logoUrl)) {
        defSrc = `https://tgcstorage.blob.core.windows.net/court-reserve-${orgId}/${logoUrl}`;
    }

    return defSrc;
}

export const setCookie = (name, value, minutes) => {
    const now = new Date();
    now.setTime(now.getTime() + (minutes * 60 * 1000));
    const expires = "expires=" + now.toUTCString();
    const encodedValue = encodeURIComponent(value);
    document.cookie = name + "=" + encodedValue + ";" + expires + ";path=/";
}

export const nullToEmpty = (incValue) => {
    if (isNullOrEmpty(incValue)) {
        return '';
    }
    return incValue;
}

export const notValidScroll = () => {
    const firstInvalidElement = document.querySelector('.is-invalid');
    if (firstInvalidElement) {
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

export const isIOS = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
};

export const bound = (position, min, max) => {
    let ret = position
    if (min !== undefined) {
        ret = Math.max(position, min)
    }
    if (max !== undefined) {
        ret = Math.min(ret, max)
    }
    return ret;
};

export const mergeProps = (defaultProps, props) => {
    return { ...defaultProps, ...props };
}

export const focus = (name) => {
    setTimeout(function(){
        document.querySelector('[name="email"]').focus();
    }, 500);
}

export const textFromHTML = (html, maxCharacters) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let text = tempDiv.textContent || tempDiv.innerText || '';
    if (maxCharacters && text.length > maxCharacters) {
        text = text.substring(0, maxCharacters) + '...';
    }
    return text;
}

export const calculateSkeletonLabelWidth = (label) => {
    let charCount = label ? label.length : (10 + randomNumber(1, 4));
    if (charCount > 30){
        charCount = 30 + randomNumber(1, 4);
    }
    return `${charCount * 9}px`;
};

export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            pNotify('Successfully copied');
        })
        .catch((err) => {
            // Handle errors if any occur
            console.error('Failed to copy text: ', err);
        });
};

export const encodeParam = (input) => {
    return encodeURIComponent(input);
}

export const encodeParamsObject = (params) => {
    return Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
};

export const fullNameInitials = (fullName) => {
    if (isNullOrEmpty(fullName)) return '';

    const namesArray = fullName.trim().split(' ');
    if (namesArray.length === 1) {
        return namesArray[0].charAt(0).toUpperCase();
    }

   return namesArray[0].charAt(0).toUpperCase() + namesArray[namesArray.length - 1].charAt(0).toUpperCase();
}

export const isValidEmail = (incEmail) => {
    if (isNullOrEmpty(incEmail)) {
        return false;
    }

    return emailRegex.test(incEmail);
}

export const containsNoCase = (str1, str2) => {
    if (isNullOrEmpty(str1) || isNullOrEmpty(str2)) {
        return false;
    }

    return String(str1).toLowerCase().includes(String(str2).toLowerCase());
};

export const generateHash = async (obj) => {
    // Convert object to a sorted JSON string for consistent hashing
    const jsonStr = JSON.stringify(obj, Object.keys(obj).sort());

    // Convert string to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonStr);

    // Generate hash using SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");

    // Return a shorter version (first 10 characters for quick comparison)
    return hashHex.slice(0, 10);
}

export const filterList = (keys, list, searchText) => {
    return list.filter(item =>
        keys.some(key => containsNoCase(item[key], searchText))
    );
};

export const displayMinMaxAgeValue = (minAge, maxAge) => {
    if (!isNullOrEmpty(minAge) && !isNullOrEmpty(maxAge)) {
        return `Min Age ${minAge}, Max Age ${maxAge}`;
    }
    if (!isNullOrEmpty(minAge)) {
        return `Min Age ${minAge}`;
    }
    if (!isNullOrEmpty(maxAge)) {
        return `Max Age ${maxAge}`;
    }
    
    return ``;
}