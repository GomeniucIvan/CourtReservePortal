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
    
    const iconSize = 20;
    
    return (
        <PaddingBlock>
            {!isNullOrEmpty(sessionDetails) &&
                <Flex vertical={true} gap={token.paddingXXS}>
                    {!isNullOrEmpty(leagueDisplayEventDates(sessionDetails)) &&
                        <CardIconLabel icon={'event-dates'} description={leagueDisplayEventDates(sessionDetails)} size={iconSize} />
                    }

                    {!isNullOrEmpty(sessionDetails.DisplayStartEndTimesString) &&
                        <CardIconLabel icon={'clock'} description={sessionDetails.DisplayStartEndTimesString} size={iconSize} />
                    }
                    {!isNullOrEmpty(sessionDetails.DisplayCostString) &&
                        <CardIconLabel icon={'price-tag'} description={sessionDetails.DisplayCostString} size={iconSize} />
                    }
                    {!isNullOrEmpty(sessionDetails.Note) &&
                        <CardIconLabel icon={'message'} description={sessionDetails.Note} size={iconSize} />
                    }
                    {!isNullOrEmpty(sessionDetails.RatingNames) &&
                        <CardIconLabel icon={'star-light'} description={sessionDetails.RatingNames} size={iconSize} />
                    }
                    {(!isNullOrEmpty(sessionDetails.LeagueGender) && !equalString(sessionDetails.LeagueGender, 4)) &&
                        <CardIconLabel icon={'person-half-dress-sharp-regular'} description={displayLeaguePlayerFormat(sessionDetails.LeagueGender)} size={iconSize} />
                    }
                    {(!isNullOrEmpty(sessionDetails.AgeRestrictionString)) &&
                        <CardIconLabel icon={'arrow-up-9-1-regular'} description={sessionDetails.AgeRestrictionString} size={iconSize} />
                    }
                    {(!isNullOrEmpty(sessionDetails.SlotsInfoString) && toBoolean(sessionDetails.ShowSlotsInfoBool)) &&
                        <CardIconLabel icon={'grid-sharp-light'} description={sessionDetails.SlotsInfoString} size={iconSize} />
                    }

                    {!isNullOrEmpty(sessionDetails.OccurrenceSignUpNotYetOpenErrorMessage) &&
                        <AlertBlock type={'error'} description={sessionDetails.OccurrenceSignUpNotYetOpenErrorMessage} removePadding={true} size={iconSize} />
                    }

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
                        </>
                    }
                </Flex>
            }

        </PaddingBlock>
    )
}

export default LeagueDetailsSessionInfo
