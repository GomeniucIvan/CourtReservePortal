import {FormikProvider} from "./FormikProvider.jsx";

export const GlobalContext = ({ children }) => {
    return (
        <FormikProvider>
            {children}
        </FormikProvider>
    );
};