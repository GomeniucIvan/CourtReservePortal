import { lazy } from 'react';
import {isNullOrEmpty, toBoolean} from "../utils/Utils.jsx";
import prodConfig from './Config.prod.jsx';
import devConfig from './Config.dev.jsx';
import {logInfo} from "@/utils/ConsoleUtils.jsx";

let isProduction = import.meta.env.VITE_ENV === 'production';

export const getWebConfigValue = (key) => {
    if (typeof key === 'string' && window[key] !== undefined) {
        logInfo('getWebConfigValue:', key, window[key]);
        return window[key];
    }
    
    return getConfigValue(key);
}

export const getConfigValue = (key) => {
    if (isNullOrEmpty(key)) return null;

    try {
        let configVal = '';
        
        if  (isNullOrEmpty(configVal)){
            if (toBoolean(isProduction)){
                configVal = prodConfig[key];
            } else {
                configVal = devConfig[key];
            }
        }
        
        return configVal;
    } catch (error) {
        console.error("Error loading config component:", error);
    }
};