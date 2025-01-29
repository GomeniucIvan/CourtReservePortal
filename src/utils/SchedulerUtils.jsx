import {anyInList} from "@/utils/Utils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";

export const isMemberSignUp = (resMemberIds, authFamilyMembers) => {
    if (!anyInList(authFamilyMembers)) {
        return false;
    }
    
    const authMemberIds = authFamilyMembers.map(member => member.MemberId);
    return resMemberIds.some(id => authMemberIds.includes(id));
}

export const queuedOrder = (members) => {
    pNotify(`queuedOrder`)
}