import { lazy } from 'react';
import {isNullOrEmpty, toBoolean} from "../utils/Utils.jsx";
import prodConfig from './Config.prod.jsx';
import devConfig from './Config.dev.jsx';

let isProduction = import.meta.env.VITE_ENV === 'production';

const ConfigComponent = lazy(() =>
    isProduction
        ? import('./Config.prod.jsx')
        : import('./Config.dev.jsx')
);

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