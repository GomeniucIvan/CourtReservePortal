import {getConfigValue} from "@/config/WebConfig.jsx";
import {toBoolean} from "@/utils/Utils.jsx";

export const addCypressTag = (key) => {
    let includeTags = getConfigValue('IncludeCypressTags');
    const isTestSubdomain =
        toBoolean(includeTags) ||
        window.location.hostname.startsWith('test.');
    return isTestSubdomain ? { 'data-cy': key } : {};
};