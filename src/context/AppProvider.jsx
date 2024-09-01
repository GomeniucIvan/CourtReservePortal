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
    const [headerRightIcons, setHeaderRightIcons] = useState(null);
    const stylesToUse = useStyles();
    const { token } = useToken();
    const [shouldFetch, setShouldFetch] = useState(false);
    const [availableHeight, setAvailableHeight] = useState(null);
    
    const globalStyles = stylesToUse.styles;
    const refreshData = () => setShouldFetch(true);
    const resetFetch = () => {if (shouldFetch){setShouldFetch(false)}};
    
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
            setDynamicPages,
            setHeaderRightIcons,
            headerRightIcons,
            shouldFetch, 
            refreshData,
            resetFetch,
            availableHeight,
            setAvailableHeight}}>
            
            {children}
        </AppContext.Provider>
    );
};