import {equalString, toBoolean} from "@/utils/Utils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";

export const eventValidResponseRedirect = (response, navigate, eventData) => {
    let orgId = eventData.orgId;
    let reservationNumber = eventData.reservationNumber;
    let eventName = eventData.eventName;
    
    let actionType = 1; //1 signup
    if (toBoolean(response.data.RequireOnlinePayment)) {
        actionType = 4;

        let route = toRoute(ProfileRouteNames.PROCESS_PAYMENT, 'id', orgId);
        route = `${route}?evAction=${actionType}`;
        navigate(route);
    } else {
        if (toBoolean(response.data.RequiresApproval)) {
            actionType = 5;
        }
    }

    if (!toBoolean(response.data.RequireOnlinePayment)) {
        if (toBoolean(response.data.IsOrganizedPlayEvent)) {
            let route = toRoute(EventRouteNames.EVENT_DETAILS, 'id', orgId);
            route = toRoute(route, 'number', reservationNumber);
            route = `${route}?evAction=${actionType}`;
            //setPage(setDynamicPages, booking.EventName, route);
            navigate(route);
        } else {
            //USTA ONLY
            if (equalString(orgId,6415)){
                eventUstaSatelliteDataRegistrationRedirect(navigate, orgId,actionType, eventName, response.data);
            } else {
                eventRegistrationRedirect(navigate, orgId, actionType);
            }
        }
    }
}

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
        pNotify('Registered successful.');
    } else if (equalString(actionType, 5)){
        //signup req approval
        pNotify('Registered successful. You will be notified once your registration has been approved.');
    } else if (equalString(actionType, 4)){
        //req payment
    } else if (equalString(actionType, 2)){
        //change signup
        pNotify('Registered successful.');
    } else if (equalString(actionType, 3)){
        //change signup req payment
        pNotify('Registered successful.');
    }

    navigate(HomeRouteNames.INDEX);
}