import axios from 'axios';
import {clearAllLocalStorage} from "../storage/AppStorage.jsx";
import {getRequestData} from "./api.jsx";
import {fixResponseData} from "../utils/apiUtils.jsx";

export const apiRoutes = {
    API2: '',
    CREATE_RESERVATION: ''
}

const axiosInstance = axios.create({
    timeout: 60000,
    headers: {
        'X-Requested-By': 'ReactApp',
        'Content-Type': 'application/json',
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
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


const appService = {
    get: async (url, params = {}, config = {}) => {
        try {
            const response = await axiosInstance.get(url, { params, ...config });
            return fixResponseData(response.data);
        } catch (error) {
            console.log('APP41 Error: ');
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

    getRoute: async (route, url, params = {}, config = {}) => {
        try {
            const headerToAdd = getRequestData();
            const headers = { ...config.headers };

            if (headerToAdd) {
                headers['RequestData'] = headerToAdd;
            }

            const response = await axiosInstance.get(url, {
                params,
                ...config,
                headers 
            });

            return fixResponseData(response.data);
        } catch (error) {
            console.log('APP41 Error: ');
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