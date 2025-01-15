import React, {createContext, useContext, useEffect, useState} from 'react';
import {SafeArea as AntSafeArea} from 'antd-mobile'
import {useLocation} from "react-router-dom";
import {theme} from "antd";
import {isNullOrEmpty, setCookie, toBoolean} from "../utils/Utils.jsx";
import {locationCurrentRoute} from "@/utils/RouteUtils.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";

const SafeAreaContext = createContext();
export const useSafeArea = () => useContext(SafeAreaContext);

const {useToken} = theme;

const SafeArea = ({children}) => {
    const {token} = useToken();
    const location = useLocation();

    let currentRoute = locationCurrentRoute(location);
    
    const [safeAreaCurrent, setSafeAreaInsetsCurrent] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });
    
    const [safeAreaInsets, setSafeAreaInsets] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });

    //--data-safe-area-inset-top-px
    //--data-safe-area-inset-bottom-px
    //--data-safe-area-inset-left-px
    //--data-safe-area-inset-right-px

    useEffect(() => {
        const top = document.body.getAttribute('data-safe-area-inset-top') || 0;

        const style = document.createElement('style');
        style.innerHTML = `
            .safe-area-top {
                padding-top: ${top}px;
            }
            .safe-area-top-margin {
                margin-top: ${top}px;
            }
            .safe-area-glass {
                height: ${top}px;
            }
        `;

        document.head.appendChild(style);

        return () => {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        };
    }, [location, currentRoute]);

    const setSafeArea = () => {
        let safeArea = {
            top: document.body.getAttribute('data-safe-area-inset-top') || 0,
            bottom: document.body.getAttribute('data-safe-area-inset-bottom') || 0,
            left: document.body.getAttribute('data-safe-area-inset-left') || 0,
            right: document.body.getAttribute('data-safe-area-inset-right') || 0,
        };

        let cookieSafeArea = getCookie('data-safe-area-data');
        let isCookie = false;
        if (!isNullOrEmpty(cookieSafeArea)) {
            let cookieData = JSON.parse(cookieSafeArea);
            if (isNullOrEmpty(safeArea.top) || safeArea.top === 0) {
                safeArea = { ...cookieData };
                isCookie = true;
            }
        }

        if (safeArea.top !== 0 && !isCookie) {
            setCookie('data-safe-area-data', JSON.stringify(safeArea), 120);
        }

        let top = safeArea.top;
        let bottom = safeArea.bottom;
        let left = safeArea.left;
        let right = safeArea.right;
        
        if (top && bottom && left && right) {
            setSafeAreaInsets({
                top: parseInt(top),
                bottom: parseInt(bottom),
                left: parseInt(left),
                right: parseInt(right),
            });

            if (toBoolean(currentRoute?.fullHeight)) {
                setSafeAreaInsetsCurrent({
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                });
            } else {
                setSafeAreaInsetsCurrent({
                    top: parseInt(top),
                    bottom: parseInt(bottom),
                    left: parseInt(left),
                    right: parseInt(right),
                });
            }
        }
    }
    
    useEffect(() => {
        setSafeArea();
    }, []);
    
    useEffect(() => {
        setSafeArea();
    }, [location]);

    return (
        <SafeAreaContext.Provider value={{safeAreaInsets}}>
            <>
                <div style={{paddingTop: `${safeAreaCurrent.top}px`, backgroundColor: token.colorBgBase}}>
                    <AntSafeArea position="top"/>
                </div>
                <div style={{paddingLeft: `${safeAreaCurrent.left}px`, paddingRight: `${safeAreaCurrent.right}px`}}>
                    {children}
                </div>
                <div style={{paddingBottom: `${safeAreaCurrent.bottom}px`}}>
                    <AntSafeArea position="bottom"/>
                </div>
            </>
        </SafeAreaContext.Provider>
    );
};

export default SafeArea;