import {useDevice} from "@/context/DeviceProvider.jsx";
import {useGlobalStylesMobile} from "@/styles/globalStylesMobile.jsx";
import {useGlobalStylesWeb} from "@/styles/globalStylesWeb.jsx";

export const useStyles = () => {
    const { isMobile } = useDevice();
    const platformStyles = isMobile ? useGlobalStylesMobile() : useGlobalStylesWeb();

    // Merge common + device-specific styles
    return {
        ...platformStyles.styles,
    };
};