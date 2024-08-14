import {FormikProvider} from "./FormikProvider.jsx";
import {FooterProvider} from "./FooterProvider.jsx";

export const GlobalContext = ({ children }) => {
    return (
        <FooterProvider>
            <FormikProvider>
                {children}
            </FormikProvider>
        </FooterProvider>
    );
};