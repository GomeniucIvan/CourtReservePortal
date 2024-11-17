import {containsNoCase, isNullOrEmpty} from "./Utils.jsx";

export const getMembershipText = (selectedMembershipName) => {
    if (containsNoCase(selectedMembershipName, 'membership')) {
        return selectedMembershipName;
    } else if (!isNullOrEmpty(selectedMembershipName)) {
        return `${selectedMembershipName} Membership`;
    }
};