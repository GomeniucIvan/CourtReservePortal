import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton, Button} from "antd";
import {anyInList, encodeParamsObject, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {displayLeaguePlayerFormat, leagueDisplayEventDates} from "@portal/league/functions.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import {LeagueRouteNames} from "@/routes/LeagueRoutes.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {countListItems} from "@/utils/ListUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useNavigate} from "react-router-dom";
import LeagueSessionDetailsPartial from "@portal/league/modules/LeagueSessionDetailsPartial.jsx";
const {Title, Text} = Typography;

function LeagueDetailsSessionInfo({selectedTab, tabsHeight, sessionDetails}) {
    const{orgId, authData, authDataOrgMemberIds} = useAuth();
    const{token} = useApp();
    const navigate = useNavigate();
    let firstMemberRequireUpfrontPayment = false;
    let transactionIdsToPay = [];
    let registeredFamilyMembersCount = 0;

    if (anyInList(sessionDetails?.RegisteredPlayers)) {
        firstMemberRequireUpfrontPayment = sessionDetails.RegisteredPlayers.find(
            (player) =>
                authDataOrgMemberIds.includes(player.OrganizationMemberId) &&
                toBoolean(player.RequireOnlinePayment) &&
                player.PriceToPay > 0 &&
                player.PaidAmt < player.PriceToPay
        );

        transactionIdsToPay = sessionDetails?.RegisteredPlayers
            .filter(
                (player) =>
                    authDataOrgMemberIds.includes(player.OrganizationMemberId) &&
                    !toBoolean(player.RequireOnlinePayment) &&
                    player.PriceToPay > 0 &&
                    player.TransactionFeeId > 0 &&
                    player.PaidAmt < player.PriceToPay
            )
            .map((player) => player.TransactionFeeId);

        registeredFamilyMembersCount = sessionDetails?.RegisteredPlayers.filter(player =>
            authDataOrgMemberIds.includes(player.OrganizationMemberId)
        ).length;
    }

    let urlParams = {
        sessionId: sessionDetails.LeagueSessionId,
        leagueId: sessionDetails.LeagueId,
        resId: sessionDetails.NextReservationId
    }

    const registeredOrWaitlistedFamMembersCount = sessionDetails?.WaitListPlayers.filter(v => authDataOrgMemberIds.includes(v.OrganizationMemberId)).length +
        sessionDetails?.RegisteredPlayers.filter(v => authDataOrgMemberIds.includes(v.OrganizationMemberId)).length;

    return (
        <PaddingBlock>
            {!isNullOrEmpty(sessionDetails) &&
                <Flex vertical={true} gap={token.paddingXXL}>
                    <Flex vertical={true} gap={token.paddingXXS}>
                        <LeagueSessionDetailsPartial sessionDetails={sessionDetails}/>
                    </Flex>

                    {!toBoolean(sessionDetails.GameDayCall) &&
                        <>
                            {(toBoolean(sessionDetails?.IsRegistrationOpenBool) && !toBoolean(sessionDetails.IsLoggedInAccountRegistered)) &&
                                <>
                                    <Button type={'primary'} onClick={() => {
                                        let route = toRoute(LeagueRouteNames.LEAGUE_REGISTRATION, 'id', orgId);
                                        navigate(`${route}?${encodeParamsObject(urlParams)}`);
                                    }}>
                                        Register
                                    </Button>
                                </>
                            }

                            {toBoolean(sessionDetails.IsLoggedInAccountRegistered) &&
                                <>
                                    {(toBoolean(authData.AcceptOnlinePayments) && toBoolean(sessionDetails.ShowPayButtonBool)) &&
                                        <>
                                            {!isNullOrEmpty(firstMemberRequireUpfrontPayment) &&
                                                <Button type={'primary'}
                                                        onClick={() => {
                                                            let route = toRoute(ProfileRouteNames.PROCESS_PAYMENT, 'id', orgId);
                                                            navigate(`${route}?sessionId=${sessionDetails.LeagueSessionId}`);
                                                        }}>
                                                    Pay
                                                </Button>
                                            }

                                            {isNullOrEmpty(firstMemberRequireUpfrontPayment) &&
                                                <Button type={'primary'}
                                                        onClick={() => {
                                                            let route = toRoute(ProfileRouteNames.PROCESS_PAYMENT, 'id', orgId);
                                                            navigate(`${route}?payments=${transactionIdsToPay.join(',')}`);
                                                        }}>
                                                    Pay
                                                </Button>
                                            }
                                        </>
                                    }

                                    {(toBoolean(sessionDetails?.IsRegistrationOpenBool) && countListItems(authDataOrgMemberIds) > registeredFamilyMembersCount) &&
                                        <>
                                            <Button type={'primary'}
                                                    onClick={() => {
                                                        let route = toRoute(LeagueRouteNames.LEAGUE_REGISTRATION, 'id', orgId);
                                                        route = `${route}?${encodeParamsObject(urlParams)}`
                                                        navigate(route);
                                                    }}>
                                                Register Other Family Member
                                            </Button>
                                        </>
                                    }

                                    {toBoolean(sessionDetails.AllowPlayersToWithdraw) &&
                                        <>
                                            <Button type={'primary'}
                                                    danger={true}
                                                    onClick={() => {
                                                        let route = toRoute(LeagueRouteNames.LEAGUE_WITHDRAWN, 'id', orgId);
                                                        navigate(`${route}?${encodeParamsObject(urlParams)}`);
                                                    }}>
                                                Withdraw
                                            </Button>
                                        </>
                                    }
                                </>
                            }

                            {toBoolean(sessionDetails.IsLoggedInAccountWaitlisted) &&
                                <Flex vertical={true} gap={token.padding}>
                                    <>
                                        {(countListItems(authDataOrgMemberIds) > registeredOrWaitlistedFamMembersCount && countListItems(authDataOrgMemberIds) > 1) &&
                                            <>
                                                <Button block={true} 
                                                        type={'primary'}
                                                        onClick={() => {
                                                            let route = toRoute(LeagueRouteNames.LEAGUE_JOIN_WAITLIST, 'id', orgId);
                                                            navigate(`${route}?${encodeParamsObject(urlParams)}&action=waitlist-edit`);
                                                        }}>
                                                    Waitlist Other Family Member
                                                </Button>
                                            </>
                                        }

                                        <Button block={true}
                                                danger={true}
                                                onClick={() => {
                                                    let route = toRoute(LeagueRouteNames.LEAGUE_JOIN_WAITLIST, 'id', orgId);
                                                    navigate(`${route}?${encodeParamsObject(urlParams)}&action=waitlist-unsubscribe`);
                                                }}>
                                            Unsubscribe From Waitlist
                                        </Button>
                                    </>
                                </Flex>
                            }

                            {(!toBoolean(sessionDetails.IsLoggedInAccountRegistered) &&
                                    !toBoolean(sessionDetails?.IsLoggedInAccountWaitlisted) &&
                                    toBoolean(sessionDetails?.AllowWaitlist) &&
                                    sessionDetails?.MaxPlayers <= sessionDetails?.LeagueSessionRegistrantsCount) &&
                                <Button block={true}
                                        type={'primary'}
                                        onClick={() => {
                                            let route = toRoute(LeagueRouteNames.LEAGUE_JOIN_WAITLIST, 'id', orgId);
                                            navigate(`${route}?${encodeParamsObject(urlParams)}&action=waitlist`);
                                        }}>
                                    Join Waitlist
                                </Button>
                            }
                        </>
                    }
                </Flex>
            }

        </PaddingBlock>
    )
}

export default LeagueDetailsSessionInfo
