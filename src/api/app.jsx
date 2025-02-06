import axios from 'axios';
import {clearAllLocalStorage} from "../storage/AppStorage.jsx";
import {getRequestData} from "./api.jsx";
import {fixResponseData} from "../utils/apiUtils.jsx";
import {isNullOrEmpty, toBoolean} from "../utils/Utils.jsx";

const isProduction = import.meta.env.MODE === 'production';
const appUrl = isProduction ? import.meta.env.VITE_APP_URL : '';

export const apiRoutes = {
    API2: appUrl,
    API4: appUrl,
    CREATE_RESERVATION: appUrl,
    HUB_URL_READ: appUrl,
    MemberSchedulersApiUrl: appUrl,
    ServiceMemberPortal: appUrl,
    EventsApiUrl: appUrl,
    MemberTransactionsUrl: appUrl
}

const axiosInstance = axios.create({
    timeout: 60000,
    headers: {
        'X-Requested-By': 'ReactApp',
        'Content-Type': 'application/json',
        'ReactSubmit': 'true'
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Modify config, e.g., add Authorization headers if needed
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response, 
    (error) => {
        // 401 unauthorized
        if (error.response && error.response.status === 401) {
            clearAllLocalStorage();
            window.location.href = '/account/login';
        }
        return Promise.reject(error);
    }
);


const appService = {
    get: async (navigate, url, params = {}, config = {}) => {
        try {
            if (isProduction){
                if (url.startsWith('/app/')) {
                    url = url.replace('/app/', '/');
                } 
                
                url = appUrl+url;
            }
            
            const response = await axiosInstance.get(url, { params, ...config });
            const fixedResponse = fixResponseData(response.data);

            
            if (!isNullOrEmpty(fixedResponse?.baseRedirectPath) && typeof navigate === 'function'){
                navigate(fixedResponse?.baseRedirectPath);
                return;
            }

            return fixedResponse;
        } catch (error) {
            console.log('APP41 Error: ' + url);
            console.log(error);

            return {
                isValid: false,
                IsValid: false,
                Message: 'Something wrong, APP41-Error',
                message: 'Something wrong, APP41-Error'
            }
        }
    },
    
    post: async (url, data = {}, config = {}) => {
        try {
            if (isProduction){
                if (url.startsWith('/app/')) {
                    url = url.replace('/app/', '/');
                }
                url = appUrl + url;
            }

            let response = await axiosInstance.post(url, data, { ...config });
            return fixResponseData(response.data);
        } catch (error) {
            console.log('APP43 Error: ');
            console.log(error);

            return {
                isValid: false,
                IsValid: false,
                Message: 'Something wrong, APP43-Error',
                message: 'Something wrong, APP43-Error'
            }
        }
    },

    getRoute: async (route, url, params = {}, config = {}, addCookies = false) => {
        try {
            const headerToAdd = getRequestData();
            const headers = { ...config.headers };

            if (headerToAdd) {
                headers['RequestData'] = headerToAdd;
            }

            if (isProduction){
                if (url.startsWith('/app/')) {
                    url = url.replace('/app/', '/');
                }
                url = route + url;
            }
            
            if (toBoolean(addCookies)){
                if (isNullOrEmpty(params)){
                    params = {}
                }
                const cookies = document.cookie.split(";").reduce((cookies, item) => {
                    const [name, value] = item.split("=").map(c => c.trim());
                    cookies[name] = value;
                    return cookies;
                }, {});
                
                params.cookieData = JSON.stringify(cookies)
            }
            
            const response = await axiosInstance.get(url, {
                params,
                ...config,
                headers 
            });

            return fixResponseData(response.data);
        } catch (error) {
            console.log('APP41 Error: ' + url);
            console.log(error);

            return {
                isValid: false,
                IsValid: false,
                Message: 'Something wrong, APP41-Error',
                message: 'Something wrong, APP41-Error'
            }
        }
    },
    
    postRoute: async (route, url, data = {}, config = {}) => {
        try {
            const headerToAdd = getRequestData();
            const headers = { ...config.headers };

            if (headerToAdd) { 
                headers['RequestData'] = headerToAdd; 
            }

            if (isProduction){
                if (url.startsWith('/app/')) {
                    url = url.replace('/app/', '/');
                }
                url = route + url;
            }
            
            const response = await axiosInstance.post(url, data, {
                ...config,
                headers
            });

            return fixResponseData(response.data);
        } catch (error) {
            console.log('APP43 Error: ');
            console.log(error);

            return {
                isValid: false,
                IsValid: false,
                Message: 'Something wrong, APP43-Error',
                message: 'Something wrong, APP43-Error'
            };
        }
    }
};

export default appService;