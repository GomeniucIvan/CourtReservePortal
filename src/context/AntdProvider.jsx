import { ConfigProvider, theme, App } from "antd";

//theme.darkAlgorithm
export const AntdProvider = ({ children }) => {
    return (
        <App>
            <ConfigProvider
                theme={{
                    algorithm: theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#873030',
                    },
                    components: {
                        Custom: {
                            cardIconPadding: 8,
                            cardIconWidth: 22,
                            buttonPadding: 8
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
                            labelColonMarginInlineStart: 4,
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
    );
};