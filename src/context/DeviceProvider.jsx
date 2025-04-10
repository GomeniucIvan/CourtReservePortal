import {createContext, useContext, useEffect, useState} from 'react';
import {getGlobalIsMobile} from "@/utils/AppUtils.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
const DeviceContext = createContext(null);

export const useDevice = () => useContext(DeviceContext);

export const DeviceProvider = ({ children }) => {
    const [isMobile, setIsMobile] = useState(getInitialIsMobile());

    function getInitialIsMobile() {
        if (!isNullOrEmpty(getCookie('IsMobile'))) {
            return toBoolean(getCookie('IsMobile'));
        }
        
        return getGlobalIsMobile();
    }

    useEffect(() => {
        const handleResize = () => {
            if (!isNullOrEmpty(getCookie('IsMobile')) || getGlobalIsMobile()) {
                //we should not update
            } else {
                const width = window.innerWidth;
                const mobileOrTablet = width <= 1024;
                setIsMobile(mobileOrTablet);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return (
        <DeviceContext.Provider value={{
            isMobile,
            setIsMobile
        }}>

            {children}
        </DeviceContext.Provider>
    );
};