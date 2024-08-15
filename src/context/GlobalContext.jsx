import {FormikProvider} from "./FormikProvider.jsx";
import {FooterProvider} from "./FooterProvider.jsx";
import {ConfigProvider, theme} from "antd";

//compactAlgorithm
//defaultAlgorithm
//darkAlgorithm

export const GlobalContext = ({ children }) => {
    return (
        <ConfigProvider theme={{algorithm: theme.defaultAlgorithm}} >
            <FooterProvider>
                <FormikProvider>
                    {children}
                </FormikProvider>
            </FooterProvider>
        </ConfigProvider>
    );
};