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