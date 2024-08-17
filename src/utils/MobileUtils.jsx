import {isNullOrEmpty} from "./Utils.jsx";
import {removeCookieById} from "./CookieUtils.jsx";

export const isMobileKeyboardOpen = () => {
    const currentInnerHeight = window.innerHeight;
    const initialInnerHeight = window.screen.height;
    return currentInnerHeight < initialInnerHeight * 0.8;
};

export const updateMobileStatusBar = (style) => {
    if (window.ReactNativeWebView) {
        const message = JSON.stringify({ type: 'updateMobileStatusBar', style: style });
        window.ReactNativeWebView.postMessage(message);
    }
}

export const saveMobileTokenKey = (tokenKey, tokenIdKey) => {
    if (!isNullOrEmpty(tokenKey)) {
        if (window.ReactNativeWebView) {
            const message = JSON.stringify({ type: 'saveMobileTokenKey', key: tokenKey, id: tokenIdKey });
            window.ReactNativeWebView.postMessage(message);
            removeCookieById('MobileTokenKey');
            removeCookieById('MobileTokenIdKey');
        }
    }
}