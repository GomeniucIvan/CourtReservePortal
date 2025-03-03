import Cookies from 'js-cookie';
import {isNullOrEmpty} from "./Utils.jsx";

export const removeCookieById = (cookieName) => {
    Cookies.remove(cookieName);
}

export const saveCookie = (cookieName, value, minutes) => {
    if (!isNullOrEmpty(cookieName)) {
        const expiresInDays = minutes / (24 * 60);
        Cookies.set(cookieName, value, { expires: expiresInDays, path: '' });
    }
}

export const getCookie = (cookieName) => {
    return Cookies.get(cookieName);
}

export const getCookieWithDefault = (cookieName, value) => {
    let cookieValue = Cookies.get(cookieName);
    if (isNullOrEmpty(cookieValue)) {
        return value;
    }
    
    return cookieValue;
}

export const clearAllCookies = () => {
    Object.keys(Cookies.get()).forEach((cookie) => {
        Cookies.remove(cookie, { path: '/' });
    });
    
    return true;
}