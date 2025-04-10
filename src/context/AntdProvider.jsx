import { ConfigProvider, theme, App } from "antd";
import {createContext, useContext, useEffect, useState} from "react";
import {isNullOrEmpty, setCookie, toBoolean} from "../utils/Utils.jsx";
import {fromLocalStorage, toLocalStorage} from "../storage/AppStorage.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";
import {
    getGlobalSpGuideBaseColor,
    getGlobalSpGuideTextColor,
} from "@/utils/AppUtils.jsx";
import {useDevice} from "@/context/DeviceProvider.jsx";
const AntdContext = createContext();

export const useAntd = () => useContext(AntdContext);

const webThemeConfig = (primaryColor, primaryTextColor, isDarkMode) => ({
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
        colorPrimary: primaryColor,
        colorOrgText: primaryTextColor,
        colorCourtReserve: '#34495E',
        colorError: '#D32F2F',
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, ...",
        colorTextDisabled: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
    },
    components: {
        Custom: {
            workingTheme: isDarkMode ? 'dark' : 'light',
            colorPrimaryText: 'black',
        },
        Button: {
            defaultShadow: 'none',
            primaryShadow: 'none',
        },
    }
});

const mobileThemeConfig = (primaryColor, primaryTextColor, isDarkMode) => ({
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
        colorPrimary: primaryColor,
        colorOrgText: primaryTextColor,
        boxShadow: 'rgb(0 0 0 / 77%) 0px 6px 16px 0px, ...',
        fontSize: 14,
        borderRadiusSM: 8,
        padding: 16,
        colorError: '#D32F2F',
        colorTextDisabled: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
    },
    components: {
        Custom: {
            cardIconPadding: 8,
            cardIconWidth: 22,
            workingTheme: isDarkMode ? 'dark' : 'light',
        },
        Button: {
            contentFontSize: 16,
            controlHeight: 40,
            borderRadius: 8,
        },
        Input: {
            borderRadius: 8,
            controlHeight: 40,
        },
        Form: {
            labelFontSize: 14,
            itemMarginBottom: 16,
            colorError: '#D32F2F',
        },
    }
});

//theme.darkAlgorithm
//theme.defaultAlgorithm,
export const AntdProvider = ({ children }) => {
    const [primaryColor, setPrimaryColor] = useState('#34495E');
    const [primaryTextColor, setPrimaryTextColor] = useState('#ffffff');
    const [isDarkMode, setIsDarkMode] = useState(toBoolean(fromLocalStorage('darkmode', 'false')));
    const {isMobile} = useDevice();
    
    useEffect(() => {
        //primary color
        let cookiePrimaryColor = getCookie('primary-color');
        if (!isNullOrEmpty(cookiePrimaryColor)) {
            setPrimaryColor(cookiePrimaryColor)
        } else {
            cookiePrimaryColor = getGlobalSpGuideBaseColor();
            if (!isNullOrEmpty(cookiePrimaryColor)) {
                setPrimaryColor(cookiePrimaryColor)
            }
        }
        
        //primary text color
        let cookiePrimaryTextColor = getGlobalSpGuideTextColor();
        if (!isNullOrEmpty(cookiePrimaryTextColor)) {
            setPrimaryTextColor(cookiePrimaryTextColor)
        }

        const message = JSON.stringify({ type: 'updateMobileStatusBar', style: (isDarkMode ? 'light' : 'dark') });
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(message);
        }
    }, []);
    
    useEffect(() => {
        const message = JSON.stringify({ type: 'updateMobileStatusBar', style: (isDarkMode ? 'light' : 'dark') });
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(message);
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (isDarkMode !== null) {
            toLocalStorage('darkmode', isDarkMode);
            setIsDarkMode(toBoolean(isDarkMode));
        }
    }, [isDarkMode]);
    
    let colorError = '#D32F2F';
    return (
        <AntdContext.Provider value={{setPrimaryColor, setIsDarkMode, isDarkMode, setPrimaryTextColor}}>
            <App>
                <ConfigProvider
                    wave={{ disabled: true }}
                    theme={isMobile ? mobileThemeConfig(
                        primaryColor,
                        primaryTextColor,
                        toBoolean(isDarkMode)
                    ) :
                        webThemeConfig(
                            primaryColor,
                            primaryTextColor,
                            toBoolean(isDarkMode)
                        )}
                >
                    {children}
                </ConfigProvider>
            </App>
        </AntdContext.Provider>
    );
};