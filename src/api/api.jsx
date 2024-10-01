﻿import axios from 'axios';

let bearerToken = '';
let requestData = '';
const isProduction = process.env.NODE_ENV === 'production';
let backendUrl = isProduction ? import.meta.env.VITE_BACKEND_URL : '';

export const setBearerToken = (token) => {
    bearerToken = token;
};

export const getBearerToken = () => {
    return bearerToken;
};

export const setRequestData = (reqData) => {
    requestData = reqData;
};

export const getRequestData = () => {
    return requestData;
};

const axiosInstance = axios.create({
    baseURL: backendUrl,
    timeout: 60000,
    headers: {
        'X-Requested-By': 'ReactApp',
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (bearerToken) {
            config.headers.Authorization = `Bearer ${bearerToken}`;
        }

        if (requestData) {
            config.headers.RequestData = requestData;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 unauthorized response

        return Promise.reject(error);
    }
);


const apiService = {
    get: async (url, params = {}, config = {}) => {
        try {
            const response = await axiosInstance.get(url, {params, ...config});
            let responseData = response.data;

            if (responseData) {
                if (responseData.isValid) {
                    responseData.IsValid = true;
                } else if (responseData.IsValid) {
                    responseData.isValid = true;
                }

                if (responseData.message) {
                    responseData.Message = true;
                } else if (responseData.Message) {
                    responseData.message = true;
                }
            }
            return responseData;

        } catch (error) {
            console.log('API43 Error: ');
            console.log(error);

            return {
                isValid: false,
                IsValid: false,
                Message: 'Something wrong, API43-Error',
                message: 'Something wrong, API43-Error'
            }
        }
    },

    post: async (url, data = {}, config = {}) => {
        try {
            const response = await axiosInstance.post(url, data, {...config});
            let responseData = response.data;

            if (responseData) {
                if (responseData.isValid) {
                    responseData.IsValid = true;
                } else if (responseData.IsValid) {
                    responseData.isValid = true;
                }

                if (responseData.message) {
                    responseData.Message = true;
                } else if (responseData.Message) {
                    responseData.message = true;
                }
            }
            return responseData;
        } catch (error) {
            console.log('API49 Error: ');
            console.log(error);

            return {
                isValid: false,
                IsValid: false,
                Message: 'Something wrong, API49-Error',
                message: 'Something wrong, API49-Error'
            }
        }
    }
};

export default apiService;