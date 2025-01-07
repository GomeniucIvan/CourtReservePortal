import {createContext, useContext, useEffect, useState} from 'react';
import {clearAllLocalStorage, fromAuthLocalStorage, toAuthLocalStorage} from "../storage/AppStorage.jsx";
import {isNullOrEmpty, nullToEmpty} from "../utils/Utils.jsx";
import {setClientUiCulture} from "../utils/DateUtils.jsx";
import appService from "../api/app.jsx";
import {useNavigate} from "react-router-dom";
import {stringToJson} from "../utils/ListUtils.jsx";
import {useAntd} from "./AntdProvider.jsx";
import {useApp} from "./AppProvider.jsx";
import {setRequestData} from "../api/api.jsx";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [orgId, setOrgId] = useState(null);
    const [spGuideId, setSpGuideId] = useState(null);
    const [shouldLoadOrgData, setShouldLoadOrgData] = useState(true);
    const [authData, setAuthData] = useState(null);
    const navigate = useNavigate();
    const {setPrimaryColor} = useAntd();
    const {setNavigationLinks} = useApp();
    
    const memberData = async () => {
        const memberData = fromAuthLocalStorage('memberData', {});

        if (!isNullOrEmpty(memberData) && !isNullOrEmpty(memberData.MemberId)){
            setAuthData(memberData)
            setClientUiCulture(memberData.UiCulture);
            //setNavigationLinks(stringToJson(memberData.NavigationLinksJson));
            setOrgId(memberData.OrgId);
            if (!isNullOrEmpty(memberData.DashboardButtonBgColor)) {
                setPrimaryColor(memberData.DashboardButtonBgColor);
            }
        }
        return memberData;
    }

    const logout = async () => {
        clearAllLocalStorage();
        
        setOrgId(null);
        setAuthData(null);
        
        let response = await appService.get(navigate, '/app/MobileSso/LogOutRequest');
        console.log('Login logout');
        
        return true;
    }
    
    const setAuthorizationData = async (memberResponseData) => {
        //setNavigationLinks(stringToJson(memberResponseData.NavigationLinksJson));
        
        if (!isNullOrEmpty(memberResponseData.RequestData)){
            setRequestData(memberResponseData.RequestData)
        }
        
        if (!isNullOrEmpty(memberResponseData.DashboardButtonBgColor)) {
            setPrimaryColor(memberResponseData.DashboardButtonBgColor);
        }

        setAuthData(memberResponseData);
        toAuthLocalStorage('memberData', memberResponseData);
        setOrgId(memberResponseData.OrgId);
        setClientUiCulture(memberResponseData.UiCulture);
        return true;
    }
    
    return (
        <AuthContext.Provider value={{
            authData,
            setAuthData,
            setOrgId,
            orgId,
            shouldLoadOrgData,
            setShouldLoadOrgData,
            spGuideId,
            setAuthorizationData,
            logout,
            memberData
        }}>
            {children}
        </AuthContext.Provider>
    );
};