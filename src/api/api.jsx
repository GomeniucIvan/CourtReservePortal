import axios from 'axios';

let bearerToken = '';

export const setBearerToken = (token) => {
    bearerToken = token;
};

export const getBearerToken = () => {
    return bearerToken;
};

const axiosInstance = axios.create({
    timeout: 20000,
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
            const response = await axiosInstance.get(url, { params, ...config });
            return response.data;
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
            const response = await axiosInstance.post(url, data, { ...config });
            return response.data;
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