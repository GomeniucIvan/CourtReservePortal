import { createContext, useContext, useState } from 'react';
const FormikContext = createContext();
export const useFormikContext = () => useContext(FormikContext);

export const FormikProvider = ({ children }) => {
    const [formikData, setFormikData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    return (
        <FormikContext.Provider value={{ formikData, setFormikData,isLoading, setIsLoading }}>
            {children}
        </FormikContext.Provider>
    );
};