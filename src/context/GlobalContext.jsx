import { FormikProvider } from "./FormikProvider.jsx";
import { FooterProvider } from "./FooterProvider.jsx";
import { ConfigProvider, theme } from "antd";

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
                    },
                    Input: {
                        borderRadius: 8,
                        controlHeight: 40
                    }
                },
            }}
        >
            <FooterProvider>
                <FormikProvider>
                    {children}
                </FormikProvider>
            </FooterProvider>
        </ConfigProvider>
    );
};