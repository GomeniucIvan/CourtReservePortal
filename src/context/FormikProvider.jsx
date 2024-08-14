import { createContext, useContext, useState } from 'react';
const FormikContext = createContext();
export const useFormikContext = () => useContext(FormikContext);

export const FormikProvider = ({ children }) => {
    const [formikData, setFormikData] = useState(null);

    return (
        <FormikContext.Provider value={{ formikData, setFormikData }}>
            {children}
        </FormikContext.Provider>
    );
};