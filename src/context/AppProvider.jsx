import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [footerContent, setFooterContent] = useState(null);
    const [isFooterVisible, setIsFooterVisible] = useState(true);
    const [formikData, setFormikData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMockData, setIsMockData] = useState(true);
    
    return (
        <AppContext.Provider value={{
            footerContent,
            setFooterContent,
            isFooterVisible,
            setIsFooterVisible,
            formikData,
            setFormikData,
            isLoading,
            setIsLoading,
            isMockData}}>
            
            {children}
        </AppContext.Provider>
    );
};