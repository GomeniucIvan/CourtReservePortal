import {createContext, useContext, useEffect, useState} from 'react';
import {clearAllLocalStorage, fromAuthLocalStorage} from "../storage/AppStorage.jsx";
import {nullToEmpty} from "../utils/Utils.jsx";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [orgId, setOrgId] = useState(null);
    const [shouldLoadOrgData, setShouldLoadOrgData] = useState(true);
    const [memberId, setMemberId] = useState();
    const [authData, setAuthData] = useState(null);

    useEffect(() => {
        const memberData = fromAuthLocalStorage('memberData', {});
        
        setOrgId(nullToEmpty(memberData.orgId))
        setMemberId(nullToEmpty(memberData.memberId));
        
        setAuthData({
            timezone: nullToEmpty(memberData.timezone),
            uiCulture: nullToEmpty(memberData.uiCulture),
            primaryColor: nullToEmpty(memberData.primaryColor),
        })
    }, []);

    const logout = () => {
        clearAllLocalStorage();
        
        setOrgId(null);
        setMemberId(null);
        setAuthData({
            timezone: '',
            uiCulture: '',
            currency: '',
            primaryColor: '',
        });
    }
    
    return (
        <AuthContext.Provider value={{
            authData,
            setAuthData,
            setOrgId,
            orgId,
            memberId,
            setMemberId,
            shouldLoadOrgData,
            setShouldLoadOrgData,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};