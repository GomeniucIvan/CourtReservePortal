import axios from 'axios';
import {clearAllLocalStorage} from "../storage/AppStorage.jsx";

const axiosInstance = axios.create({
    timeout: 20000,
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
            return response.data;
        } catch (error) {
            throw error; 
        }
    },

    post: async (url, data = {}, config = {}) => {
        try {
            const response = await axiosInstance.post(url, data, { ...config });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default appService;