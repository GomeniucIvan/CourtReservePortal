import { ConfigProvider, theme, App } from "antd";
import {createContext, useContext, useEffect, useState} from "react";
import {toBoolean} from "../utils/Utils.jsx";
import {fromLocalStorage, toLocalStorage} from "../storage/AppStorage.jsx";
const AntdContext = createContext();

export const useAntd = () => useContext(AntdContext);

//theme.darkAlgorithm
//theme.defaultAlgorithm,
export const AntdProvider = ({ children }) => {
    
    //todo change from cookie
    const [primaryColor, setPrimaryColor] = useState(fromLocalStorage('primary-color', '#873030'));
    const [isDarkMode, setIsDarkMode] = useState(fromLocalStorage('darkmode', 'False'));

    useEffect(() => {
        const message = JSON.stringify({ type: 'updateMobileStatusBar', style: (isDarkMode ? 'dark' : 'light') });
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(message);
        }
    }, [isDarkMode]);
    
    useEffect(() => {
        if (primaryColor){
            toLocalStorage('primary-color', primaryColor);
        }

    }, [primaryColor]);

    useEffect(() => {
        if (isDarkMode !== null) {
            toLocalStorage('darkmode', isDarkMode);
            setIsDarkMode(isDarkMode);
        }
    }, [isDarkMode]);
    
    return (
        <AntdContext.Provider value={{setPrimaryColor,setIsDarkMode, isDarkMode}}>
            <App>
                <ConfigProvider
                    wave={{ disabled: true }}
                    theme={{
                        algorithm: toBoolean(isDarkMode) ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        token: {
                            colorCourtReserve: '#34495E',
                            colorPrimary: primaryColor,
                            boxShadow: 'rgb(0 0 0 / 77%) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px',
                            headerActionHeight: 32,
                            borderRadiusSM: 8,
                            paddingXS: 4,
                            paddingSM: 8,
                            inputLeftPadding: 12,
                            fontSizeIcon: 14,
                            fontSizeXS: 10,
                            fontSizeSM: 12,
                            fontSize: 14,
                            fontSizeLG: 16,
                            fontSizeXL: 20,
                            colorSecondary: '#a1a1a1'
                            
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
                                controlHeight: 40,
                                controlHeightLG: 46,
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
                                activeBorderColor: '#d9d9d9'
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
                                colorError: "rgb(255,77,80)",
                                itemMarginBottom: 16,
                                labelRequiredMarkColor: "rgb(255,77,80)",
                                marginXXS: 4,
                                colorBorder: "rgb(217,217,217)"
                            },
                            Modal: {
                                fontSize: 15,
                                fontSizeHeading5: 18
                            },
                            Typography: {
                                titleMarginTop: 0,
                                lineHeight: '26px',
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
                        },
                    }}
                >
                    {children}
                </ConfigProvider>
            </App>
        </AntdContext.Provider>
    );
};