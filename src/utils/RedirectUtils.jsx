import {equalString} from "@/utils/Utils.jsx";

export const eventUstaSatelliteDataRegistrationRedirect = (navigate, orgId, actionType, eventName, data) => {
    let feeOrgMembersBlock = data.UIRegisteringOrgMemberIds;
    let reservationMemberId = data.UIFirstReservationMemberId;
    let paymentBlock = [];

    paymentBlock.push({ event: `Drop-in Registration`, type: eventName, booking_id: `rm_${reservationMemberId}`, members: feeOrgMembersBlock })
    _satellite.track('courtreserve_reservation', paymentBlock);

    setTimeout(function () {
        var url = `/Online/Events/RedirectAfterRegistration/@(orgId)?evAction=${actionType}`;
        window.location = url;
    }, 1000)
}

export const eventRegistrationRedirect = (navigate, orgId, actionType) => {
    //url = `/Online/Events/RedirectAfterRegistration/${organizationId}?evAction=${actionType}`;
    //
}