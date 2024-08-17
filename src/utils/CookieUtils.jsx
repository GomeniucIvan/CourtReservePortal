import Cookies from 'js-cookie';

export const removeCookieById = (cookieName) => {
    Cookies.remove(cookieName);
}