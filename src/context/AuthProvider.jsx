﻿import { createContext, useContext, useState } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOrgMember, setIsOrgMember] = useState(false);
    
    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            isOrgMember,
            setIsOrgMember}}>
            {children}
        </AuthContext.Provider>
    );
};