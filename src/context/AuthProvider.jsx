import { createContext, useContext, useState } from 'react';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn] = useState(false);
    
    return (
        <AuthContext.Provider value={{
            isLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );
};