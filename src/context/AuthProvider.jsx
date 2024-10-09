import {createContext, useContext, useEffect, useState} from 'react';
import {clearAllLocalStorage, fromAuthLocalStorage} from "../storage/AppStorage.jsx";
import {nullToEmpty} from "../utils/Utils.jsx";
import {setClientUiCulture} from "../utils/DateUtils.jsx";
import appService from "../api/app.jsx";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [orgId, setOrgId] = useState(null);
    const [authInitialized, setAuthInitialized] = useState(false);
    const [shouldLoadOrgData, setShouldLoadOrgData] = useState(true);
    const [memberId, setMemberId] = useState();
    const [authData, setAuthData] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const memberData = fromAuthLocalStorage('memberData', {});
        
        setOrgId(nullToEmpty(memberData.orgId))
        setMemberId(nullToEmpty(memberData.memberId));
        
        setAuthData({
            timezone: nullToEmpty(memberData.timezone),
            timeZone: nullToEmpty(memberData.timezone),
            uiCulture: nullToEmpty(memberData.uiCulture),
            primaryColor: nullToEmpty(memberData.primaryColor),
            memberId: nullToEmpty(memberData.memberId),
            hasActiveInstructors: nullToEmpty(memberData.hasActiveInstructors),
            isUsingCourtWaitlisting: nullToEmpty(memberData.isUsingCourtWaitlisting),
            myAccountHideMyEvents: nullToEmpty(memberData.myAccountHideMyEvents),
            myAccountHideWaitingList: nullToEmpty(memberData.myAccountHideWaitingList),
            
            useOrganizedPlay: nullToEmpty(memberData.useOrganizedPlay),
            isUsingPushNotifications: nullToEmpty(memberData.isUsingPushNotifications),
        })

        setClientUiCulture(memberData.uiCulture);
        setAuthInitialized(true);
    }, []);

    const logout = async () => {
        clearAllLocalStorage();
        
        setOrgId(null);
        setMemberId(null);
        setAuthData({
            timezone: '',
            timeZone: '',
            uiCulture: '',
            currency: '',
            primaryColor: '',
            memberId: '',
            hasActiveInstructors: '',
            isUsingCourtWaitlisting: '',
            myAccountHideMyEvents: '',
            myAccountHideWaitingList: '',
            useOrganizedPlay: '',
            isUsingPushNotifications: '',
        });
        
        appService.get(navigate, '/app/online/logout').then(r => {
            console.log('Login logout');
        })
        
        return true;
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
            authInitialized,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};