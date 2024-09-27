import React, {useEffect, useState} from 'react';
import { SafeArea as AntSafeArea } from 'antd-mobile'
import {useLocation} from "react-router-dom";
import AppRoutes from "../routes/AppRoutes.jsx";
import {theme} from "antd";
const { useToken } = theme;

const SafeArea = ({ children }) => {
    const { token } = useToken();
    const location = useLocation();
    let currentRoute = AppRoutes.find(route => route.path === location.pathname);
    
    const [safeAreaInsets, setSafeAreaInsets] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    });

    const checkSafeAreaInsets = () => {
        const top = document.body.getAttribute('data-safe-area-inset-top');
        const bottom = document.body.getAttribute('data-safe-area-inset-bottom');
        const left = document.body.getAttribute('data-safe-area-inset-left');
        const right = document.body.getAttribute('data-safe-area-inset-right');
        const isInitialized = document.body.getAttribute('data-safe-area-inset-initialized');

        if (top && bottom && left && right) {
            if (currentRoute.fullHeight){
                setSafeAreaInsets({
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                });
            } else{
                setSafeAreaInsets({
                    top: parseInt(top),
                    bottom: parseInt(bottom),
                    left: parseInt(left),
                    right: parseInt(right),
                });
            }
        } else {
            if (isInitialized !== 'true') { 
                setTimeout(checkSafeAreaInsets, 100);
            }
        }
    };
    
    useEffect(() => {
        checkSafeAreaInsets();
    }, [location]);

    return (
        <>
            <div style={{ paddingTop: `${safeAreaInsets.top}px`, backgroundColor: token.colorBgBase }}>
                <AntSafeArea position="top" />
            </div>
            <div style={{ paddingLeft: `${safeAreaInsets.left}px`, paddingRight: `${safeAreaInsets.right}px` }}>
                {children}
            </div>
            <div style={{ paddingBottom: `${safeAreaInsets.bottom}px` }}>
                <AntSafeArea position="bottom" />
            </div>
        </>
    );
};

export default SafeArea;