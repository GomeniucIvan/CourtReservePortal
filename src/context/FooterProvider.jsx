import { createContext, useContext, useState } from 'react';

const FooterContext = createContext();

export const useFooter = () => useContext(FooterContext);

export const FooterProvider = ({ children }) => {
    const [footerContent, setFooterContent] = useState(null);
    const [isFooterVisible, setIsFooterVisible] = useState(true);

    return (
        <FooterContext.Provider value={{ footerContent, setFooterContent, isFooterVisible, setIsFooterVisible }}>
            {children}
        </FooterContext.Provider>
    );
};