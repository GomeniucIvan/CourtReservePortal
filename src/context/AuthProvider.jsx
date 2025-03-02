import {createContext, useContext, useEffect, useState} from 'react';
import {clearAllLocalStorage, fromAuthLocalStorage, toAuthLocalStorage} from "../storage/AppStorage.jsx";
import {anyInList, isNullOrEmpty, nullToEmpty} from "../utils/Utils.jsx";
import {setClientUiCulture} from "../utils/DateUtils.jsx";
import appService from "../api/app.jsx";
import {useNavigate} from "react-router-dom";
import {useAntd} from "./AntdProvider.jsx";
import {setRequestData} from "../api/api.jsx";
import {getGlobalSpGuideId} from "@/utils/AppUtils.jsx";
import {stringToJson} from "@/utils/ListUtils.jsx";
import {setTranslateData} from "@/utils/TranslateUtils.jsx";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
//authDataOrgMemberIds

export const AuthProvider = ({children}) => {
    //used only for main dashboard/index page
    const [newOrgId, setNewOrgId] = useState(null);
    
    const [orgId, setOrgId] = useState(null);
    const [enterpriseId, setEnterpriseId] = useState(null);
    const [spGuideId, setSpGuideId] = useState(getGlobalSpGuideId());
    const [shouldLoadOrgData, setShouldLoadOrgData] = useState(true);
    const [authData, setAuthData] = useState(null);
    const navigate = useNavigate();
    const {setPrimaryColor} = useAntd();
    
    const memberData = async () => {
        const memberData = fromAuthLocalStorage('memberData', {});

        if (!isNullOrEmpty(memberData) && !isNullOrEmpty(memberData.MemberId)){
            setAuthData(memberData)
            setClientUiCulture(memberData.UiCulture);
            //setNavigationLinks(stringToJson(memberData.NavigationLinksJson));
            setOrgId(memberData.OrgId);
            if (!isNullOrEmpty(memberData.DashboardButtonBgColor)) {
                setPrimaryColor(memberData.DashboardButtonBgColor);
                setTranslateData(memberData);
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
            setTranslateData(memberResponseData);
        }
        
        setAuthData(memberResponseData);
        toAuthLocalStorage('memberData', memberResponseData);
        setOrgId(memberResponseData.OrgId);
        setClientUiCulture(memberResponseData.UiCulture);
        return true;
    }

    const getAuthDataOrgMemberIds = () => {
        let orgMemberIds = [];
        
        if (anyInList(stringToJson(authData?.FamilyMembersJson))) {
            orgMemberIds = stringToJson(authData?.FamilyMembersJson).map(v => v.OrgMemberId);
        } else {
            if (!isNullOrEmpty(authData?.OrgMemberId)) {
                orgMemberIds.push(authData.OrgMemberId);
            }
        }

        return orgMemberIds;
    };
    
    const authDataOrgMemberIds = getAuthDataOrgMemberIds(); 
    
    return (
        <AuthContext.Provider value={{
            authData,
            setAuthData,
            enterpriseId,
            setEnterpriseId,
            setOrgId,
            orgId,
            newOrgId,
            setNewOrgId,
            shouldLoadOrgData,
            setShouldLoadOrgData,
            spGuideId,
            setAuthorizationData,
            logout,
            memberData,
            authDataOrgMemberIds
        }}>
            {children}
        </AuthContext.Provider>
    );
};