import { createContext, useContext, useState } from 'react';
const FooterContext = createContext(null);

export const useFooter = () => useContext(FooterContext);

export const FooterProvider = ({ children }) => {
    const [alertsCount, setAlertsCount] = useState(0);
    
    return (
        <FooterContext.Provider value={{
            alertsCount,
            setAlertsCount
        }}>

            {children}
        </FooterContext.Provider>
    );
};