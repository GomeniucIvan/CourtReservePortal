import { createContext, useContext, useState } from 'react';
import {useStyles} from '../assets/globalStyles.jsx';
import {theme} from "antd";
const { useToken } = theme;
const HeaderContext = createContext(null);

export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }) => {
    const [headerRightIcons, setHeaderRightIcons] = useState(null);
    const [headerTitle, setHeaderTitle] = useState('');
    const [customHeader, setCustomHeader] = useState('');
    const [headerTitleKey, setHeaderTitleKey] = useState('');

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
        }}>

            {children}
        </HeaderContext.Provider>
    );
};