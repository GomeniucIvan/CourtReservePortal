import * as React from "react";
import {isNullOrEmpty} from "./Utils.jsx";

export const parseSafeInt = (incString, def = 0) => {
    if (isNullOrEmpty(incString)) 
        return def;
    
    try {
        return parseInt(incString);
    } catch (e) {
        return  def;
    }
    
    return def;
};

export const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};