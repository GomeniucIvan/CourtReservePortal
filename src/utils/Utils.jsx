export const isNullOrEmpty = (data) => {
    if (data === undefined || data === '' || data === null || data === 'undefined' || data === 'null') {
        return true;
    }

    var stringData = data.toString();

    try {
        stringData = stringData.trim();
    } catch (e) {
        return true;
    }

    return (!stringData || 0 === stringData.length);
}

export const getValueOrDefault = (data, defaultValue) => {
    try {
        if (data) {
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
    return data.length <= 1;
}


export const extractTextFromHTML = (html, maxCharacters) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let text = tempDiv.textContent || tempDiv.innerText || '';
    if (maxCharacters && text.length > maxCharacters) {
        text = text.substring(0, maxCharacters) + '...';
    }
    return text;
}

export const organizationLogoSrc = (orgId, logoUrl) => {
    let defSrc = 'https://app.courtreserve.com/Content/Images/logo.png';
    if (!isNullOrEmpty(logoUrl)) {
        defSrc = `https://tgcstorage.blob.core.windows.net/court-reserve-${orgId}/${logoUrl}`;
    }

    return defSrc;
}

export const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return decodeURIComponent(parts.pop().split(';').shift());
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

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};