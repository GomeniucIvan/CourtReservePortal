import { createContext, useContext, useState } from 'react';
import {useStyles} from '../assets/globalStyles.jsx';
import {theme} from "antd";
const { useToken } = theme;
const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [footerContent, setFooterContent] = useState(null);
    const [isFooterVisible, setIsFooterVisible] = useState(true);
    const [formikData, setFormikData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMockData, setIsMockData] = useState(true);
    const [dynamicPages, setDynamicPages] = useState([]);
    const stylesToUse = useStyles();
    const { token } = useToken();
    const globalStyles = stylesToUse.styles;
    
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
            isMockData,
            globalStyles,
            token,
            dynamicPages,
            setDynamicPages}}>
            
            {children}
        </AppContext.Provider>
    );
};