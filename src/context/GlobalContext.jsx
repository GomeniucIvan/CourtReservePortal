import { FormikProvider } from "./FormikProvider.jsx";
import { FooterProvider } from "./FooterProvider.jsx";
import SafeArea from "./SafeAreaContext.jsx";
import {AntdProvider} from "./AntdProvider.jsx";

export const GlobalContext = ({ children }) => {
    return (
        <AntdProvider>
            <FooterProvider>
                <FormikProvider>
                    <SafeArea>
                        {children}
                    </SafeArea>
                </FormikProvider>
            </FooterProvider>
        </AntdProvider>
    );
};