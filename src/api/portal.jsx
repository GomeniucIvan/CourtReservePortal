import {encodeParamsObject, isNullOrEmpty, nullToEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import apiService, {loadBearerToken, setRequestData} from "@/api/api.jsx";
import {setNavigationStorage} from "@/storage/AppStorage.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";


const portalService = {
    frictLogin: async (navigate, ssoKey, secretKey, spGuideId) => {
        return await appService.get(navigate, `/app/MobileSso/FrictLogin?ssoKey=${ssoKey}&initialAuthCode=${secretKey}&spGuideId=${nullToEmpty(spGuideId)}&loaded=true`)
    },
    navigationData: async (navigate, orgId) => {
        let navigationType = getCookie("dashboard_navigationType");
        return  await appService.get(navigate, `/app/Online/AuthData/NavigationData?id=${orgId}&navigationType=${navigationType}`);
    },
    requestData: async (navigate, orgId) => {
        //params for bearer authorization, we pass param like requestData to auth member/user
        let response = await appService.get(navigate, `/app/Online/AuthData/RequestData?id=${orgId}`);
        
        if (toBoolean(response?.IsValid)) {
            const responseData = response.Data;
            setRequestData(responseData.RequestData);

            
            let dashboardData = await portalService.navigationData(navigate, orgId);

            if (toBoolean(dashboardData?.IsValid)) {
                setNavigationStorage(orgId,
                    dashboardData.Data.menu,
                    dashboardData.Data.more,
                    dashboardData.Data.listOrg,
                    dashboardData.Data.mainLinks,
                    dashboardData.Data.allListItems);
            }
            
            return await portalService.organizationData(orgId);
        } else {
            //UnathorizeAccess
            if (toBoolean(response?.UnathorizeAccess) || toBoolean(response?.Data?.UnathorizeAccess)) {
                return {
                    IsValid: false,
                    UnathorizeAccess: true,
                }
            }
        }
    },
    organizationData: async (orgId) => {
        //organization data like org name, member membership id, fullname
        await loadBearerToken();
        let authResponse = await apiService.post(`/api/dashboard/org-member-data?orgId=${orgId}`);

        if (toBoolean(authResponse?.IsValid)) {
            let data = authResponse.Data;
            return {
                IsValid: true,
                OrganizationData: data,
            }
        }

        return {
            IsValid: false
        }
    },
    dashboardData: async (orgId, membershipId, isFamilyLevel, requireWaitlistInfo, uiCulture, checkAnnouncements, deviceId, isUsingLeagues, orgMemberId, memberFamilyId, leagueId) => {
        //member portal dashboard items like bookings, leagues etc.
        await loadBearerToken();
        
        let postModel = {
            currentOrgDateTimeString: '',
            membershipId: membershipId,
            isFamilyLevel: isFamilyLevel,
            requireWaitlistInfo: requireWaitlistInfo,
            checkAnnouncements: checkAnnouncements,
            uiCulture: uiCulture,
            checkPushNotificationsCount: true,
            showUnsubscribeOptInModal: false,
            deviceId: deviceId,
            isUsingLeagues: isUsingLeagues,
            showWeather: false,
            orgMemberId: orgMemberId,
            memberFamilyId: memberFamilyId,
            leagueId: leagueId,
            loadWeatherData: false,
            dashboardButtonBgColor: '',
            
        }
        return await apiService.post(`/api/dashboard/portal?id=${orgId}&${encodeParamsObject(postModel)}`);
    },
    changeOrganization: async (orgId) => {
        
        window.location.href = '/'
    }   
}

export default portalService;