import {createContext, useContext, useState} from 'react';
import {fromAuthLocalStorage} from "../storage/AppStorage.jsx";
import {nullToEmpty} from "../utils/Utils.jsx";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const memberData = fromAuthLocalStorage('memberData', {});
    console.log(memberData)
    const [orgId, setOrgId] = useState(nullToEmpty(memberData.orgId));
    const [shouldLoadOrgData, setShouldLoadOrgData] = useState(true);
    const [memberId, setMemberId] = useState(nullToEmpty(memberData.memberId));

    const [authData, setAuthData] = useState({
        timezone: nullToEmpty(memberData.timezone),
        uiCulture: nullToEmpty(memberData.uiCulture),
        primaryColor: nullToEmpty(memberData.primaryColor),
    });

    return (
        <AuthContext.Provider value={{
            authData,
            setAuthData,
            setOrgId,
            orgId,
            memberId,
            setMemberId,
            shouldLoadOrgData,
            setShouldLoadOrgData
        }}>
            {children}
        </AuthContext.Provider>
    );
};