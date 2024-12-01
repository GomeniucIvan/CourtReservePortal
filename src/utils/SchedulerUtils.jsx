
export const isMemberSignUp = (resMemberIds, authFamilyMembers) => {
    const authMemberIds = authFamilyMembers.map(member => member.MemberId);
    return resMemberIds.some(id => authMemberIds.includes(id));
}
