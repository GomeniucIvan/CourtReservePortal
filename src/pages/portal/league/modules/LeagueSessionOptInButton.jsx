import * as React from "react";
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
import {LeagueRouteNames} from "@/routes/LeagueRoutes.jsx";

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

function LeagueSessionOptInButton({sessionData, orgMemberIds, orgId, dateId, isCancelled, allowToOptIn}) {
    if (isCancelled) return null;

    const fakeLeagueSession = sessionData;
    
    const registeredFamilyPlayersOrgMember = fakeLeagueSession.RegisteredPlayers.filter(player => orgMemberIds.includes(player.OrganizationMemberId));
    const registeredFamilyPlayersOrgMemberIds = registeredFamilyPlayersOrgMember.map(player => player.OrganizationMemberId);
    const firstMemberRegistrationId = fakeLeagueSession.RegisteredPlayers.find(player => orgMemberIds.includes(player.OrganizationMemberId))?.RegistrationId;
    const onlyOneMemberRegistered = fakeLeagueSession.RegisteredPlayers.filter(player => orgMemberIds.includes(player.OrganizationMemberId)).length === 1;

    const isFreeCost = isCostFree(fakeLeagueSession);
    const isEdit = registeredFamilyPlayersOrgMember.some(v => v.IsOptIn) && registeredFamilyPlayersOrgMember.some(v => !v.IsOptIn);
    
    const reservationId = dateId || fakeLeagueSession.NextReservationId;
    
    const isOptedIn = (eventDto, orgMemberId, resID) => {
        const registeredMember = eventDto.RegisteredPlayers.find(v => orgMemberId === v.OrganizationMemberId);
        let registrationId = registeredMember?.RegistrationId;

        if (eventDto.CheckOnlyByOptInOrgMemberIdsString) {
            return eventDto.OptInOrgMemberIds.includes(orgMemberId);
        } else {
            const date = eventDto.AllDates.find(c => c.ReservationId === resID);

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
            const date = eventDto.AllDates.find(d => d.ReservationId === resID);
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
            console.log(isEdit)
            if (isEdit) {
                return 'Edit Opt-In';
            }
            return allRegisteredFamilyMembersAreOptedIn && registeredFamMembers.length ? 'Opt-Out' : 'Opt-In';
        }

        return '';
    };
    
    const handleOptOut = () => { /* Implement Opt-Out logic */ };
    const handleOptInFree = () => { /* Implement Opt-In logic for free sessions */ };
    const handleOptIn = () => { /* Implement Opt-In logic */ };

    return (
        <>
            {toBoolean(fakeLeagueSession?.AllowToOptIn) &&
                <>
                    {onlyOneMemberRegistered && toBoolean(isOptedIn(fakeLeagueSession, orgMemberIds[0], reservationId)) ? (
                        <Button onClick={handleOptOut} type="primary"
                                danger={getOptInClassOrLabel(fakeLeagueSession, 'class', orgMemberIds, undefined, undefined, reservationId )}>
                            {getOptInClassOrLabel(fakeLeagueSession, 'label', orgMemberIds, undefined, undefined, reservationId )}
                        </Button>
                    ) : isFreeCost && onlyOneMemberRegistered ? (
                        <Button onClick={handleOptInFree}
                                type="primary"
                                className="btn btn-block fn-swal fn-disable"
                                danger={getOptInClassOrLabel(fakeLeagueSession, 'class', orgMemberIds, undefined, undefined, reservationId )}>
                            {getOptInClassOrLabel(fakeLeagueSession, 'label', orgMemberIds, undefined, undefined, reservationId )}
                        </Button>
                    ) : (
                        <Button onClick={handleOptIn}
                                type="primary"
                                className="btn btn-block btn-modal fn-disable"
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
