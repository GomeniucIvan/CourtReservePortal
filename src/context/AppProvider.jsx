import {createContext, useContext, useEffect, useState} from 'react';
import {useStyles} from '@/styles/globalStyles.jsx';
import {theme} from "antd";
import {useDevice} from "@/context/DeviceProvider.jsx";
import {useGlobalStylesMobile} from "@/styles/globalStylesMobile.jsx";
import {useGlobalStylesWeb} from "@/styles/globalStylesWeb.jsx";
const { useToken } = theme;
const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const {isMobile} = useDevice();
    
    const [footerContent, setFooterContent] = useState(null);
    const [isFooterVisible, setIsFooterVisible] = useState(true);
    const [formikData, setFormikData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMockData, setIsMockData] = useState(false);
    const [dynamicPages, setDynamicPages] = useState([]);
    const stylesToUse = isMobile ? useGlobalStylesMobile() : useGlobalStylesWeb();
    const { token } = useToken();
    const [shouldFetch, setShouldFetch] = useState(false);
    const [availableHeight, setAvailableHeight] = useState(null);
    const [navigationLinks, setNavigationLinks] = useState([]);
    
    let globalStyles = stylesToUse.styles;
    const refreshData = () => setShouldFetch(true);
    const resetFetch = () => {if (shouldFetch){setShouldFetch(false)}};
    
    console.log(globalStyles)
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
            shouldFetch, 
            refreshData,
            resetFetch,
            availableHeight,
            setAvailableHeight,
            navigationLinks,
            setNavigationLinks
        }}>
            
            {children}
        </AppContext.Provider>
    );
};