import {equalString} from "@/utils/Utils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";

export const eventUstaSatelliteDataRegistrationRedirect = (navigate, orgId, actionType, eventName, data) => {
    let feeOrgMembersBlock = data.UIRegisteringOrgMemberIds;
    let reservationMemberId = data.UIFirstReservationMemberId;
    let paymentBlock = [];

    paymentBlock.push({ event: `Drop-in Registration`, type: eventName, booking_id: `rm_${reservationMemberId}`, members: feeOrgMembersBlock })
    _satellite.track('courtreserve_reservation', paymentBlock);

    setTimeout(function () {
        //wait until is post to api
        eventRegistrationRedirect(navigate, orgId, actionType);
    }, 1000)
}

export const eventRegistrationRedirect = (navigate, orgId, actionType) => {
    if (equalString(actionType, 1)){
        //signup
        pNotify('Registration successful.');
    } else if (equalString(actionType, 5)){
        //signup req approval
        pNotify('Registration successful. You will be notified once your registration has been approved.');
    } else if (equalString(actionType, 4)){
        //req payment
    } else if (equalString(actionType, 2)){
        //change signup
        pNotify('Registration successful.');
    } else if (equalString(actionType, 3)){
        //change signup req payment
        pNotify('Registration successful.');
    }

    navigate(HomeRouteNames.INDEX);
}