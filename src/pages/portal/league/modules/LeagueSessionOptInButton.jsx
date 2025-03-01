﻿import * as React from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {Card, Ellipsis, List} from 'antd-mobile'
import {
    anyInList,
    encodeParamsObject,
    equalString,
    generateHash,
    isNullOrEmpty,
    nullToEmpty,
    toBoolean
} from "@/utils/Utils.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {Segmented, Space, Flex, Typography, Progress, Button} from "antd";
import {BarsOutlined, AppstoreOutlined} from "@ant-design/icons";
import {cx} from "antd-style";
import {fromLocalStorage, getNavigationStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import SVG from "@/components/svg/SVG.jsx";
import InfiniteScroll from "@/components/infinitescroll/InfiniteScroll.jsx";
import HeaderSearch from "@/components/header/HeaderSearch.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import ListFilter from "@/components/filter/ListFilter.jsx";
import HeaderFilter from "@/components/header/HeaderFilter.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useFormik} from "formik";
import {listFilter} from "@/utils/ListUtils.jsx";
import {fromDateTimeStringToDate, fromTimeSpanString} from "@/utils/DateUtils.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {eReplace} from "@/utils/TranslateUtils.jsx";
import {LeagueRouteNames as RouteNames, LeagueRouteNames} from "@/routes/LeagueRoutes.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import toast from "react-hot-toast";
import {pNotify} from "@/components/notification/PNotify.jsx";

const {Title, Text} = Typography;

const getPriceToPay = (eventDto, costTypeId = null, includeTaxes = false) => {
    let price = null;

    if (!costTypeId) {
        if (equalString(eventDto.PriceType, 1)) {
            price = eventDto.LeaguePlayDatePrice;
        } else if (equalString(eventDto.PriceType, 2)) {
            price = eventDto.LeagueEntirePrice;
        }
    } else {
        const lsCostType = eventDto.CostTypes.find(v => v.CostTypeId === costTypeId);
        if (lsCostType) {
            if (equalString(eventDto.PriceType, 1)) {
                price = lsCostType.LeaguePlayDatePrice;
            } else if (equalString(eventDto.PriceType, 2)) {
                price = lsCostType.LeagueEntirePrice;
            }
        }
    }

    if (includeTaxes && eventDto.IsTaxable) {
        price = eventDto.TaxRate * price / 100 + price;
    }

    return price;
};

const isCostFree = (eventDto) =>
{
    let cost = getPriceToPay(eventDto);
    return isNullOrEmpty(cost) || equalString(cost, 0);
}

function LeagueSessionOptInButton({sessionData, orgMemberIds, orgId, dateId, isCancelled, onPlayerOptInOptOut, allDates}) {
    if (isCancelled) return null;
    const {token, setDynamicPages} = useApp();
    const navigate = useNavigate();
    const fakeLeagueSession = sessionData;

    const registeredFamilyPlayersOrgMember = fakeLeagueSession.RegisteredPlayers.filter(player => orgMemberIds.includes(player.OrganizationMemberId));
    const registeredFamilyPlayersOrgMemberIds = registeredFamilyPlayersOrgMember.map(player => player.OrganizationMemberId);
    const firstMemberRegistration = fakeLeagueSession.RegisteredPlayers.find(player => orgMemberIds.includes(player.OrganizationMemberId));
    const onlyOneMemberRegistered = fakeLeagueSession.RegisteredPlayers.filter(player => orgMemberIds.includes(player.OrganizationMemberId)).length === 1;
    
    const isFreeCost = isCostFree(fakeLeagueSession);
    const isEdit = registeredFamilyPlayersOrgMember.some(v => v.IsOptIn) && registeredFamilyPlayersOrgMember.some(v => !v.IsOptIn);

    const reservationId = dateId || fakeLeagueSession.NextReservationId;
    const [isOptOut, setIsOptOut] = useState(false);
    
    const isOptedIn = (eventDto, orgMemberId, resID) => {
        const registeredMember = eventDto.RegisteredPlayers.find(v => equalString(orgMemberId, v.OrganizationMemberId));
        let registrationId = registeredMember?.RegistrationId;

        if (eventDto.CheckOnlyByOptInOrgMemberIdsString) {
            return eventDto.OptInOrgMemberIds.includes(orgMemberId);
        } else {
            const date = allDates.find(c => c.ReservationId === resID);

            if (!date && registeredMember?.IsOptIn) {
                return true;
            }

            if (!date) return false;

            return date.OptInOrgMemberIds.includes(orgMemberId);
        }
    };

    const getOptInClassOrLabel = (eventDto, type, orgMemberIds, useSuccessClass = false, isEdit = false, resID = null) => {
        let registeredFamMembers = eventDto.RegisteredPlayers.filter(v => orgMemberIds.includes(v.OrganizationMemberId));

        
        if (eventDto.CheckOnlyByOptInOrgMemberIdsString) {
            registeredFamMembers = registeredFamMembers.filter(v => eventDto.OptInOrgMemberIds.includes(v.OrganizationMemberId));
        }

        const registeredFamMembersCount = registeredFamMembers.length;
        let optedInPlayers = eventDto.OptInOrgMemberIds;

        if (resID && resID > 0) {
            const date = allDates.find(d => equalString(d.ReservationId, resID));
            if (date) optedInPlayers = date.OptInOrgMemberIds;
        }

        let optInFamilyMembersCount = optedInPlayers.filter(id => orgMemberIds.includes(id)).length;

        if (registeredFamMembers.length && !optedInPlayers.length) {
            const optedInRegisteredMembers = registeredFamMembers.filter(v => v.IsOptIn);
            if (optedInRegisteredMembers.length) optInFamilyMembersCount = optedInRegisteredMembers.length;
        }

        let allRegisteredFamilyMembersAreOptedIn = registeredFamMembersCount === optInFamilyMembersCount;

        if (!allRegisteredFamilyMembersAreOptedIn && registeredFamMembersCount === 1) {
            const isOptIn = isOptedIn(eventDto, orgMemberIds[0], resID);
            if (isOptIn) allRegisteredFamilyMembersAreOptedIn = true;
        }

        if (type === 'class') {
            if (allRegisteredFamilyMembersAreOptedIn && registeredFamMembers.length) {
                return true;
            }
            return false;
        }

        if (type === 'label') {
            if (isEdit) {
                return 'Edit Opt-In';
            }
            return allRegisteredFamilyMembersAreOptedIn && registeredFamMembers.length ? 'Opt-Out' : 'Opt-In';
        }

        if (type === 'action') {
            if (isEdit) {
                return 'editoptin';
            }
            return allRegisteredFamilyMembersAreOptedIn && registeredFamMembers.length ? 'optout' : 'optin';
        }
        
        return '';
    };

    const handleOptOut = async () => {
        const handleOptOutPost = async (onClose) => {
            let urlData = {
                leagueId: sessionData.LeagueId,
                sessionId: sessionData.LeagueSessionId,
                resId: sessionData.NextReservationId,
                orgMemberId: nullToEmpty(firstMemberRegistration?.OrganizationMemberId),
                orgMemberRegistrationId: nullToEmpty(firstMemberRegistration?.RegistrationId),
                uiCulture: sessionData.UiCulture,
            }
            setIsOptOut(true);
            onClose();
            
            const response = await toast.promise(
                appService.post(`/app/Online/Leagues/OptOutOrgMemberPost?id=${orgId}&${encodeParamsObject(urlData)}`),
                {
                    position: 'top-center',
                    loading: 'Loading...',
                    //className: 'safe-area-top-margin',
                    error: () => {},
                    success: () => {}
                }
            );

            if (toBoolean(response?.IsValid)) {
                if (typeof onPlayerOptInOptOut == 'function') {
                    pNotify('Successfully Opt-Out.')
                    onPlayerOptInOptOut();
                }
                setIsOptOut(false);
            } else {
                displayMessageModal({
                    title: "Opt-Out error",
                    html: (onClose) => response.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })
                setIsOptOut(false);
            }
        }

        displayMessageModal({
            title: "Opt-Out",
            html: (onClose) =>  <Flex vertical={true} gap={token.paddingXXL}>
                <Text>Are you sure you want to Opt-Out?</Text>

                <Flex vertical={true} gap={token.padding}>
                    <Button type={'primary'}
                            block={true}
                            danger={true}
                            loading={isOptOut}
                            onClick={() => {
                                handleOptOutPost(onClose);
                            }}>
                        Opt-Out
                    </Button>

                    <Button block={true}
                            onClick={() => {
                                onClose();
                            }}>
                        Close
                    </Button>
                </Flex>
            </Flex>,
            type: "warning",
            buttonType: '',
            onClose: () => {},
        })
    };
    
    const handleOptInFree = async () => {
        let urlData = {
            leagueId: sessionData.LeagueId,
            resId: sessionData.NextReservationId,
            orgMemberId: firstMemberRegistration?.OrganizationMemberId,
            registrationId: firstMemberRegistration?.RegistrationId,
            sessionId: sessionData.LeagueSessionId,
            uiCulture: sessionData.UiCulture,
        }
        
        let response = await appService.post(`/app/Online/Leagues/OptinFree?id=${orgId}&${encodeParamsObject(urlData)}`)
        if (toBoolean(response?.IsValid)) {
            if (typeof onPlayerOptInOptOut == 'function') {
                pNotify('Successfully Opt-In.')
                onPlayerOptInOptOut();
            }
        } else {
            displayMessageModal({
                title: "Opt-Out error",
                html: (onClose) => response.Message,
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {},
            })
        }
    };

    const handleOptIn = async (action) => {
        let route = toRoute(RouteNames.LEAGUE_OPTIN, 'id', orgId);;

        let pageTitle = equalString(action, 'optin') ? 'Opt-In' : 'Opt-Out';
        if (equalString(action, 'editoptin')) {
            pageTitle = 'Edit Opt-In';
        }

        route = `${route}?sessionId=${sessionData.LeagueSessionId}&leagueId=${sessionData.LeagueId}&resId=${sessionData.NextReservationId}&action=${action}`;
        setPage(setDynamicPages, pageTitle, route);
        navigate(route)
    };

console.log('fakeLeagueSession', fakeLeagueSession)
    return (
        <>
            {toBoolean(sessionData?.AllowToOptIn) &&
                <>
                    {onlyOneMemberRegistered && toBoolean(isOptedIn(fakeLeagueSession, orgMemberIds[0], reservationId)) ? (
                        <Button onClick={handleOptOut} type="primary"
                                loading={isOptOut}
                                danger={getOptInClassOrLabel(fakeLeagueSession, 'class', orgMemberIds, undefined, undefined, reservationId )}>
                            {getOptInClassOrLabel(fakeLeagueSession, 'label', orgMemberIds, undefined, undefined, reservationId )}
                        </Button>
                    ) : isFreeCost && onlyOneMemberRegistered ? (
                        <Button onClick={handleOptInFree}
                                type="primary"
                                loading={isOptOut}
                                danger={getOptInClassOrLabel(fakeLeagueSession, 'class', orgMemberIds, undefined, undefined, reservationId )}>
                            {getOptInClassOrLabel(fakeLeagueSession, 'label', orgMemberIds, undefined, undefined, reservationId )}
                        </Button>
                    ) : (
                        <Button onClick={() => handleOptIn(getOptInClassOrLabel(fakeLeagueSession, 'action', orgMemberIds, registeredFamilyPlayersOrgMemberIds, isEdit, reservationId ))}
                                type="primary"
                                loading={isOptOut}
                                danger={getOptInClassOrLabel(fakeLeagueSession, 'class', orgMemberIds, registeredFamilyPlayersOrgMemberIds, isEdit, reservationId )}>
                            {getOptInClassOrLabel(fakeLeagueSession, 'label', orgMemberIds, registeredFamilyPlayersOrgMemberIds, isEdit, reservationId)}
                        </Button>
                    )}
                </>
            }
        </>
    );
}

export default LeagueSessionOptInButton
