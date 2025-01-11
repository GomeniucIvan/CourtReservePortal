import AppRoutes from "@/routes/AppRoutes.jsx";
import {match} from "path-to-regexp";

export const setPage = (setDynamicPages,title, path, key) => {
    setDynamicPages([{title: title, path: path}]);
}

export const toRoute = (template, key, value) => {
    const regex = new RegExp(`:${key}`, 'g');
    return template.replace(regex, value);
};

export const getQueryParameter = (location, key) => {
    const params = new URLSearchParams(location.search);
    return params.get(key);
}

export const locationCurrentRoute = (location) => {
    return AppRoutes.find(route => {
        if (!route.path || typeof route.path !== 'string') {
            console.error('Invalid route path:', route.path);
            return false;
        }
        
        const matcher = match(route?.path, { decode: decodeURIComponent });
        return matcher(location.pathname);
    });
};

export const currentBaseUrl = () => {
    return `${window.location.protocol}//${window.location.host}/`;
}