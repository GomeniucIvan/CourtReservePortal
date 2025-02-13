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

export const reactActivateStatus = () => {
    if (window.ReactNativeWebView) {
        const message = JSON.stringify({ type: 'activeStateConfirmed' });
        window.ReactNativeWebView.postMessage(message);
    }
};

export const openMobileExternalBrowser = (url) => {
    if (window.ReactNativeWebView) {
        const message = JSON.stringify({ type: 'open_browser', url: url });
        window.ReactNativeWebView.postMessage(message);
    } else {
        //in case is not react native should open
        window.open(url, "_blank", "noopener,noreferrer");
    }
}

export const reactNavigateToMainRoute = (redirectUrl) => {
    if (window.ReactNativeWebView){
        const message = JSON.stringify({ type: 'FlutterNavToMainUrl', redirecturl: redirectUrl });
        window.ReactNativeWebView.postMessage(message);
    } else{
        // browser acess
        window.location.reload();
    }
}

export const reactNativeWebViewReload = () => {
    if (window.ReactNativeWebView){
        const message = JSON.stringify({ type: 'ReactNativeReload' });
        window.ReactNativeWebView.postMessage(message);
    }
}

export const reactNativeSaveBadgeCount = (count) =>{
    if (window.ReactNativeWebView) {
        const message = JSON.stringify({ type: 'FlutterSetBadgeCount', count: count });
        window.ReactNativeWebView.postMessage(message);
    }
}

export const reactNativeInitFireBase = () =>{
    if (window.ReactNativeWebView) {
        const message = JSON.stringify({ type: 'FlutterInitFirebase' });
        window.ReactNativeWebView.postMessage(message);
    }
}

window.reactActivateStatus = reactActivateStatus;