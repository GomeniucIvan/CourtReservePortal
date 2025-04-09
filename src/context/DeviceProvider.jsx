import { createContext, useContext, useState } from 'react';
const DeviceContext = createContext(null);

export const useDevice = () => useContext(DeviceContext);

export const DeviceProvider = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);

    return (
        <DeviceContext.Provider value={{
            isMobile,
            setIsMobile
        }}>

            {children}
        </DeviceContext.Provider>
    );
};