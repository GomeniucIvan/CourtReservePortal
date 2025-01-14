import {containsNoCase, isNullOrEmpty} from "./Utils.jsx";

export const requiredMessage = (t, key) => {
    return t('common:requiredMessage', {label: t(key)})
}

export const getMembershipText = (selectedMembershipName) => {
    if (containsNoCase(selectedMembershipName, 'membership')) {
        return selectedMembershipName;
    } else if (!isNullOrEmpty(selectedMembershipName)) {
        return `${selectedMembershipName} Membership`;
    }
};

export const e = (string) => {
    return string;
}

export const eReplace = (string) => {
    return string;
}