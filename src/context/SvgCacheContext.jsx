import { createContext, useContext, useEffect, useState } from "react";

const SvgCacheContext = createContext();
export const useSvgCacheProvider = () => useContext(SvgCacheContext);

export const SvgCacheProvider = ({ children }) => {
    const [svgList, setSvgList] = useState([]);
    const [svgLoaded, setSvgLoaded] = useState(false);

    useEffect(() => {
        const preloadSvgs = async () => {
            try {
                let response = null;
                let data = '';

                if (!response) {
                    // Production
                    try {
                        response = await fetch("/ClientApp/dist/svg-manifest.json");
                        data = await response.json();
                    } catch (error) {
                        response = null;
                    }
                }

                if (!response) {
                    try {
                        response = await fetch("/svg-manifest.json");
                        data = await response.json();
                    } catch (error) {
                        response = null;
                    }
                }

                if (!data || !data.svgs) {
                    console.error("No SVG data found.");
                    return;
                }

                // Fetch all SVGs concurrently
                const svgFetchPromises = data.svgs.map(async (file) => {
                    const iconName = file.replace(".svg", "").replace(/\\/g, "/"); // Normalize to forward slashes
                    try {
                        const svgResponse = await fetch(`/svg/${file}`);
                        const svgText = await svgResponse.text();
                        return { Icon: iconName, Code: svgText };
                    } catch (error) {
                        console.error(`Error fetching SVG: ${file}`, error);
                        return null;
                    }
                });

                const newCache = (await Promise.all(svgFetchPromises)).filter(Boolean); // Remove failed fetches
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
