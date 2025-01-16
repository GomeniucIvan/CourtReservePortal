import { createContext, useContext, useState } from 'react';
import {theme} from "antd";
const { useToken } = theme;
const HeaderContext = createContext(null);

export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }) => {
    const [headerRightIcons, setHeaderRightIcons] = useState(null);
    const [headerTitle, setHeaderTitle] = useState('');
    const [customHeader, setCustomHeader] = useState('');
    const [headerTitleKey, setHeaderTitleKey] = useState('');
    const [hideHeader, setHideHeader] = useState(false);
    const [onBack, setOnBack] = useState(null); // Add state for the `onBack` function
    
    return (
        <HeaderContext.Provider value={{
            setHeaderRightIcons,
            headerRightIcons,
            headerTitle,
            setHeaderTitle,
            customHeader,
            setCustomHeader,
            headerTitleKey,
            setHeaderTitleKey,
            onBack,
            setOnBack,
            hideHeader,
            setHideHeader,
        }}>

            {children}
        </HeaderContext.Provider>
    );
};