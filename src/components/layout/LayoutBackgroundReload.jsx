import React, { useEffect, useRef, useState } from "react";
import { reactNativeWebViewReload } from "@/utils/MobileUtils.jsx";
import {useLocation} from "react-router-dom";
import {equalString} from "@/utils/Utils.jsx";
import {logCritical} from "@/utils/ConsoleUtils.jsx";

function LayoutBackgroundReload({ children }) {
    const [initialVersion, setInitialVersion] = useState(null);
    const backgroundTimer = useRef(null); // Timer for background checks
    
    //test case
    //const location = useLocation();
    // useEffect(() => {
    //     let checkVersion = async () => {
    //         let currentVersion = await fetchVersion();
    //        
    //         if (!equalString(initialVersion, currentVersion)) {
    //             logCritical('Current Version' + currentVersion)
    //             logCritical('New Version' + initialVersion)
    //             setInitialVersion(currentVersion);
    //         }
    //     }
    //     checkVersion();
    // }, [location])
    
    const fetchVersion = async () => {
        try {
            const isProduction = process.env.NODE_ENV === 'production';
            let response = '';
            if (isProduction) {
                response = await fetch("/ClientApp/dist/version.json", { cache: "no-store" });
            } else {
                response = await fetch("/version.json", { cache: "no-store" });
            }
           
            const data = await response.json();
            return data.version;
        } catch (error) {
            console.error("Failed to fetch version.json:", error);
            return null;
        }
    };

    const startBackgroundTimer = () => {
        // Start a timer to check the version every hour
        if (!backgroundTimer.current) {
            backgroundTimer.current = setInterval(async () => {
                console.log("Checking version while in background...");
                const currentVersion = await fetchVersion();

                if (currentVersion && currentVersion !== initialVersion) {
                    console.log("Version mismatch detected. Reloading WebView...");
                    reactNativeWebViewReload();
                    clearInterval(backgroundTimer.current); // Stop timer after reload
                    backgroundTimer.current = null;
                }
            }, 3600000); // Check every hour (3600000 ms)
        }
    };

    const stopBackgroundTimer = () => {
        // Stop the timer
        if (backgroundTimer.current) {
            clearInterval(backgroundTimer.current);
            backgroundTimer.current = null;
        }
    };

    useEffect(() => {
        // Fetch and store the initial version when the component mounts
        const fetchInitialVersion = async () => {
            const version = await fetchVersion();
            setInitialVersion(version);
        };
        fetchInitialVersion();
    }, []);

    useEffect(() => {
        // Define the handler for app state changes
        window.onReactNativeStateChange = (state) => {
            console.log(`App state changed to: ${state}`);

            if (state === "background") {
                // Start the background timer when the app goes to the background
                startBackgroundTimer();
            } else if (state === "active") {
                // Stop the timer when the app returns to the foreground
                stopBackgroundTimer();
            }
        };

        return () => {
            // Cleanup on component unmount
            stopBackgroundTimer();
        };
    }, [initialVersion]);

    return <>{children}</>;
}

export default LayoutBackgroundReload;