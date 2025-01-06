import {isNullOrEmpty} from "@/utils/Utils.jsx";

export const orgLogoSrc = (logoUrl, orgId) => {
    if (!isNullOrEmpty(logoUrl)) {
       return `https://tgcstorage.blob.core.windows.net/court-reserve-${orgId}/${logoUrl}`; 
    }
    
    return `https://app.courtreserve.com/Content/Images/logo.png`;
}
