import { FormikProvider } from "./FormikProvider.jsx";
import { FooterProvider } from "./FooterProvider.jsx";
import { ConfigProvider, theme } from "antd";
import SafeArea from "./SafeAreaContext.jsx";

export const GlobalContext = ({ children }) => {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                components: {
                    Button: {
                        contentFontSize: 16,
                        controlHeight: 40,
                        controlHeightLG: 46,
                        borderRadius: 8,
                        paddingXS: 8,
                        marginXS: 8
                    },
                    Input: {
                        borderRadius: 8,
                        controlHeight: 40
                    },
                    Form: {
                        labelFontSize: 14,
                        verticalLabelPadding: '0 0 8px',
                        labelColonMarginInlineStart: 4,
                        colorError: "rgb(255,77,80)",
                        itemMarginBottom: 24,
                        labelRequiredMarkColor: "rgb(255,77,80)",
                        marginXXS: 4,
                        colorBorder: "rgb(217,217,217)"
                    }
                },
            }}
        >
            <FooterProvider>
                <FormikProvider>
                    <SafeArea>
                        {children}
                    </SafeArea>
                </FormikProvider>
            </FooterProvider>
        </ConfigProvider>
    );
};