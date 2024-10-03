﻿import React, {createContext, useContext, useEffect, useState} from 'react';
import {SafeArea as AntSafeArea} from 'antd-mobile'
import {useLocation} from "react-router-dom";
import AppRoutes from "../routes/AppRoutes.jsx";
import {theme} from "antd";

const SafeAreaContext = createContext();
export const useSafeArea = () => useContext(SafeAreaContext);

const {useToken} = theme;

const SafeArea = ({children}) => {
    const {token} = useToken();
    const location = useLocation();
    let currentRoute = AppRoutes.find(route => route.path === location.pathname);

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
        const bottom = document.body.getAttribute('data-safe-area-inset-bottom') || 0;
        const left = document.body.getAttribute('data-safe-area-inset-left') || 0;
        const right = document.body.getAttribute('data-safe-area-inset-right') || 0;

        const style = document.createElement('style');
        style.innerHTML = `
            .safe-area-top {
                padding-top: ${top}px;
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
    
    useEffect(() => {
        const top = document.body.getAttribute('data-safe-area-inset-top') || 0;
        const bottom = document.body.getAttribute('data-safe-area-inset-bottom') || 0;
        const left = document.body.getAttribute('data-safe-area-inset-left') || 0;
        const right = document.body.getAttribute('data-safe-area-inset-right') || 0;

        if (top && bottom && left && right) {
            setSafeAreaInsets({
                top: parseInt(top),
                bottom: parseInt(bottom),
                left: parseInt(left),
                right: parseInt(right),
            });
            
            if (currentRoute.fullHeight) {
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