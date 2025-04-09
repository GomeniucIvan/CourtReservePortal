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
                    theme={{
                        algorithm: toBoolean(isDarkMode) ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        token: {
                            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
                            colorCourtReserve: '#34495E',
                            colorPrimary: primaryColor,
                            colorOrgText: primaryTextColor,
                            boxShadow: !isMobile ? undefined : 'rgb(0 0 0 / 77%) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px',
                            headerActionHeight:!isMobile ? undefined :  32,
                            borderRadiusSM:!isMobile ? undefined :  8,
                            borderRadiusXS:!isMobile ? undefined :  4,
                            checkboxBorderRadius:!isMobile ? undefined :  4,
                            ribonBorderRadius:!isMobile ? undefined :  4,
                            inputLeftPadding:!isMobile ? undefined :  12,
                            fontSizeIcon:!isMobile ? undefined :  14,
                            fontSizeXS:!isMobile ? undefined :  10,
                            fontSizeSM:!isMobile ? undefined :  12,
                            fontSize:!isMobile ? undefined :  14,
                            fontSizeLG:!isMobile ? undefined :  16,
                            fontSizeXL:!isMobile ? undefined :  20,
                            colorSecondary: '#a1a1a1',
                            colorBlack: '#1F1F1F',
                            colorScrollbar: '#eaeaea',
                            colorError: colorError,
                            colorTextDisabled: toBoolean(isDarkMode) ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
                            padding:!isMobile ? undefined :  16,
                            paddingXXL:!isMobile ? undefined :  20,
                            paddingXL:!isMobile ? undefined :  14,
                            paddingLG:!isMobile ? undefined :  12,
                            paddingMD:!isMobile ? undefined :  10,
                            paddingSM:!isMobile ? undefined :  8,
                            paddingXS:!isMobile ? undefined :  4,
                            paddingXXS:!isMobile ? undefined :  2,
                            colorTextTertiary: toBoolean(isDarkMode) ? '#a1a1a1' : 'rgba(0, 0, 0, 0.45)',
                            colorInfoText: '#1677ff',
                            colorSplit: '#d9d9d9', //divider color
                            colorBorderSecondary: '#d9d9d9', //cards color
                            colorLabelValue : '#616161', //FormInputDisplay
                        },
                        components: {
                            Custom: {
                                cardIconPadding:!isMobile ? undefined :   8,
                                cardIconWidth:!isMobile ? undefined :   22,
                                buttonPadding:!isMobile ? undefined :   8,
                                colorPrimaryText: 'black',
                                workingTheme: toBoolean(isDarkMode) ? 'dark' : 'light'
                            },

                            Button: {
                                contentFontSize:!isMobile ? undefined :   16,
                                controlHeightSM:!isMobile ? undefined :   36,
                                controlHeight:!isMobile ? undefined :   40,
                                controlHeightLG:!isMobile ? undefined :   44,
                                borderRadius:!isMobile ? undefined :   8,
                                paddingXS:!isMobile ? undefined :   8,
                                marginXS:!isMobile ? undefined :   8,
                                defaultShadow: 'none',
                                primaryShadow: 'none',
                            },
                            Input: {
                                borderRadius:!isMobile ? undefined :   8,
                                controlHeight:!isMobile ? undefined :   40,
                                activeShadow: 'none',
                                activeBorderColor: '#d9d9d9',
                                hoverBorderColor: '#d9d9d9',
                            },
                            Select: {
                                borderRadius:!isMobile ? undefined :   8,
                                controlHeight:!isMobile ? undefined :   40,
                                activeShadow: 'none',
                                activeBorderColor: '#d9d9d9'
                            },
                            Form: {
                                labelFontSize:!isMobile ? undefined :   14,
                                verticalLabelPadding:!isMobile ? undefined :   '0 0 8px',
                                labelColonMarginInlineStart:!isMobile ? undefined :   0,
                                colorError: colorError,
                                itemMarginBottom:!isMobile ? undefined :   16,
                                labelRequiredMarkColor: colorError,
                                marginXXS:!isMobile ? undefined :   4,
                                colorBorder: "rgb(217,217,217)"
                            },
                            Modal: {
                                fontSize:!isMobile ? undefined :   15,
                                fontSizeHeading5:!isMobile ? undefined :   18
                            },
                            Typography: {
                                titleMarginTop: 0,
                                lineHeight:!isMobile ? undefined :   '22px',
                                titleMarginBottom: 0,
                                fontSizeHeading1:!isMobile ? undefined :   20,
                                fontSizeHeading2:!isMobile ? undefined :   18,
                                fontSizeHeading3:!isMobile ? undefined :   16,
                                fontSizeHeading4:!isMobile ? undefined :   14,
                                fontSizeHeading5:!isMobile ? undefined :   12
                            },
                            Descriptions: {
                                itemPaddingBottom:!isMobile ? undefined :   8
                            },
                            Skeleton: {
                                blockRadius:!isMobile ? undefined :   2
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