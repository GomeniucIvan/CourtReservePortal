import { ConfigProvider, theme, App } from "antd";
import {createContext, useContext, useEffect, useState} from "react";
import {isNullOrEmpty, setCookie, toBoolean} from "../utils/Utils.jsx";
import {fromLocalStorage, toLocalStorage} from "../storage/AppStorage.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";
import {
    getGlobalSpGuideBaseColor,
    getGlobalSpGuideTextColor,
} from "@/utils/AppUtils.jsx";
const AntdContext = createContext();

export const useAntd = () => useContext(AntdContext);

//theme.darkAlgorithm
//theme.defaultAlgorithm,
export const AntdProvider = ({ children }) => {
    const [primaryColor, setPrimaryColor] = useState('#34495E');
    const [primaryTextColor, setPrimaryTextColor] = useState('#ffffff');
    const [isDarkMode, setIsDarkMode] = useState(toBoolean(fromLocalStorage('darkmode', 'false')));

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
                    theme={{
                        algorithm: toBoolean(isDarkMode) ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        token: {
                            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
                            colorCourtReserve: '#34495E',
                            colorPrimary: primaryColor,
                            colorOrgText: primaryTextColor,
                            boxShadow: 'rgb(0 0 0 / 77%) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px',
                            headerActionHeight: 32,
                            borderRadiusSM: 8,
                            borderRadiusXS: 4,
                            checkboxBorderRadius: 4,
                            ribonBorderRadius: 4,
                            inputLeftPadding: 12,
                            fontSizeIcon: 14,
                            fontSizeXS: 10,
                            fontSizeSM: 12,
                            fontSize: 14,
                            fontSizeLG: 16,
                            fontSizeXL: 20,
                            colorSecondary: '#a1a1a1',
                            colorBlack: '#1F1F1F',
                            colorScrollbar: '#eaeaea',
                            colorError: colorError,
                            colorTextDisabled: toBoolean(isDarkMode) ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
                            padding: 16,
                            paddingXXL: 20,
                            paddingXL: 14,
                            paddingLG: 12,
                            paddingMD: 10,
                            paddingSM: 8,
                            paddingXS: 4,
                            paddingXXS: 2,
                            colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
                            colorInfoText: '#1677ff',
                            colorSplit: '#d9d9d9', //divider color
                            colorBorderSecondary: '#d9d9d9', //cards color
                            colorLabelValue : '#616161', //FormInputDisplay
                        },
                        components: {
                            Custom: {
                                cardIconPadding: 8,
                                cardIconWidth: 22,
                                buttonPadding: 8,
                                colorPrimaryText: 'black',
                                workingTheme: toBoolean(isDarkMode) ? 'dark' : 'light'
                            },

                            Button: {
                                contentFontSize: 16,
                                controlHeightSM: 36,
                                controlHeight: 40,
                                controlHeightLG: 44,
                                borderRadius: 8,
                                paddingXS: 8,
                                marginXS: 8,
                                defaultShadow: 'none',
                                primaryShadow: 'none',
                            },
                            Input: {
                                borderRadius: 8,
                                controlHeight: 40,
                                activeShadow: 'none',
                                activeBorderColor: '#d9d9d9',
                                hoverBorderColor: '#d9d9d9',
                            },
                            Select: {
                                borderRadius: 8,
                                controlHeight: 40,
                                activeShadow: 'none',
                                activeBorderColor: '#d9d9d9'
                            },
                            Form: {
                                labelFontSize: 14,
                                verticalLabelPadding: '0 0 8px',
                                labelColonMarginInlineStart: 0,
                                colorError: colorError,
                                itemMarginBottom: 16,
                                labelRequiredMarkColor: colorError,
                                marginXXS: 4,
                                colorBorder: "rgb(217,217,217)"
                            },
                            Modal: {
                                fontSize: 15,
                                fontSizeHeading5: 18
                            },
                            Typography: {
                                titleMarginTop: 0,
                                lineHeight: '22px',
                                titleMarginBottom: 0,
                                fontSizeHeading1: 20,
                                fontSizeHeading2: 18,
                                fontSizeHeading3: 16,
                                fontSizeHeading4: 14,
                                fontSizeHeading5: 12
                            },
                            Descriptions: {
                                itemPaddingBottom: 8
                            },
                            Skeleton: {
                                blockRadius: 2
                            },
                        },
                    }}
                >
                    {children}
                </ConfigProvider>
            </App>
        </AntdContext.Provider>
    );
};