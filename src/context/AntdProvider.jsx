import { ConfigProvider, theme, App } from "antd";
import {createContext, useContext, useState} from "react";
import {toBoolean} from "../utils/Utils.jsx";
import {fromLocalStorage} from "../storage/AppStorage.jsx";
const AntdContext = createContext();

export const useAntd = () => useContext(AntdContext);

//theme.darkAlgorithm
//theme.defaultAlgorithm,
export const AntdProvider = ({ children }) => {
    const [primaryColor, setPrimaryColor] = useState(fromLocalStorage('primary-color', '#873030'));
    const [isDarkMode, setIsDarkMode] = useState(fromLocalStorage('darkmode', 'False'));
    
    return (
        <AntdContext.Provider value={{setPrimaryColor,setIsDarkMode, isDarkMode}}>
            <App>
                <ConfigProvider
                    theme={{
                        algorithm: toBoolean(isDarkMode) ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        token: {
                            colorPrimary: primaryColor,
                        },
                        components: {
                            Custom: {
                                cardIconPadding: 8,
                                cardIconWidth: 22,
                                buttonPadding: 8,
                                ColorPrimaryText: 'black'
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
                                activeShadow: 'none'
                            },
                            Select: {
                                borderRadius: 8,
                                controlHeight: 40,
                                activeShadow: 'none'
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
                            }
                        },
                    }}
                >
                    {children}
                </ConfigProvider>
            </App>
        </AntdContext.Provider>
    );
};