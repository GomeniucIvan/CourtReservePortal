import { createContext, useContext, useEffect, useState } from "react";
import {toBoolean} from "@/utils/Utils.jsx";

const SvgCacheContext = createContext();
export const useSvgCacheProvider = () => useContext(SvgCacheContext);
let isProduction = import.meta.env.VITE_ENV === 'production';

export const SvgCacheProvider = ({ children }) => {
    const [svgList, setSvgList] = useState([]);
    const [svgLoaded, setSvgLoaded] = useState(false);

    useEffect(() => {
        const preloadSvgs = async () => {
            try {
                let response = null;
                let data = '';
                
                if (!response) {
                    //production
                    try {
                        response = await fetch("/ClientApp/dist/svg-manifest.json");
                        data = await response.json();
                    } catch (error) {
                        response = null;
                    }
                }

                if (!response){
                    try {
                        response = await fetch("/svg-manifest.json");
                        data = await response.json();
                    } catch (error) {
                        response = null
                    }
                }
                
                const newCache = [];

                for (const file of data.svgs) {
                    const iconName = file.replace(".svg", "").replace(/\\/g, "/"); // Normalize to forward slashes
                    const svgResponse = await fetch(`/svg/${file}`);
                    const svgText = await svgResponse.text();
                    
                    newCache.push({
                        Icon: iconName,
                        Code: svgText,
                    })
                }
                setSvgList(newCache);
                setSvgLoaded(true);
            } catch (error) {
                console.error("Error preloading SVGs:", error);
            }
        };

        preloadSvgs();
    }, []);

    return (
        <SvgCacheContext.Provider value={{ svgList, svgLoaded }}>
            {children}
        </SvgCacheContext.Provider>
    );
};

