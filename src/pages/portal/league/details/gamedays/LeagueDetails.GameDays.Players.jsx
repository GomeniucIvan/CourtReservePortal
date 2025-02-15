import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton, Input, Button, Table} from "antd";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {countListItems, emptyArray} from "@/utils/ListUtils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
const {Title, Text} = Typography;
import {useStyles} from "./../../styles.jsx";
import { cx } from 'antd-style';
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
const {Column} = Table;

function LeagueDetailsGameDaysPlayers({selectedTab, tabsHeight, sessionDetails}) {

    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [players, setPlayers] = useState([]);
    const{orgId, authData, authDataOrgMemberIds} = useAuth();
    const {token, globalStyles} = useApp();
    const {styles} = useStyles();

    const loadData = async () => {
        setIsFetching(true);
        let response = await appService.get(navigate, `/app/Online/Leagues/GameDayPlayersTab?id=${orgId}&sessionId=${sessionDetails.LeagueSessionId}&reservationId=${sessionDetails.NextReservationId}`);

        if(toBoolean(response?.IsValid)) {
            let playerResponse = await appService.get(navigate,`/app/Online/Leagues/GameDayPlayers?id=${orgId}&sessionId=${sessionDetails.LeagueSessionId}&reservationId=${sessionDetails.NextReservationId}`)

            if(toBoolean(playerResponse?.IsValid)) {
                setPlayers(playerResponse?.Data);
            }
        }

        setIsFetching(false);
    }

    useEffect(() => {
        if (equalString(selectedTab, 'players')) {
            loadData();
        }
    }, [selectedTab])

    const playingPlayers = players
        .filter(v => toBoolean(v.IsOptIn))
        .map((player, index) => ({ ...player, key: index }));

    const undecidedPlayers = players
        .filter(v => !toBoolean(v.IsOptIn))
        .map((player, index) => ({ ...player, key: index }));

    const displayPayButton = (player) => {
        let isFamilyMember = authDataOrgMemberIds.find(v => equalString(v, player.OrganizationMemberId));
        if(toBoolean(isFamilyMember) && toBoolean(player.ShowPayButton)) {
            return (
                <Button type={'primary'} size={'small'}
                        onClick={() => {
                            let route = toRoute(ProfileRouteNames.PROCESS_PAYMENT, 'id', orgId);
                            navigate(`${route}?reservationId=${player.ReservationId}&resMemberId=${player.ReservationMemberId}&sessionId=${sessionDetails.LeagueSessionId}`);
                        }}>
                    Pay
                </Button>
            )
        }
        return (<></>);
    }


    const tableBlock = (incPlayers) => {
        return (
            <Table dataSource={incPlayers}
                   bordered
                   rowHoverable={false}
                   borderColor={token.colorBorder}
                   className={cx(globalStyles.table, globalStyles.tableSmallHead, styles.playersTable)}
                   rowClassName={(record) => {
                       if (toBoolean(record?.IsAuthMemberPlayer)) {
                           return styles.highlightColumn
                       }
                       return '';
                   }}
                   pagination={{position: ['none', 'none'], pageSize: 200}}>

                <Column title={'Rank'}
                        dataIndex="Rank"
                        key="Rank"
                        className={styles.playersTableRankColumn}
                        render={(rank, player) => {
                            return (
                                <Text>{rank}</Text>
                            );
                        }}
                />

                <Column title={'Player'}
                        dataIndex="FullName"
                        key="FullName"
                        className={styles.playersTablePlayerColumn}
                        render={(fullName, player) => {
                            return (
                                <Flex align={'center'} justify={'space-between'}>
                                    <Flex vertical={true}>
                                        <Text>{player.FullName}</Text>
                                        {!isNullOrEmpty(player?.RatingName) &&
                                            <Text style={{color: token.colorSecondary}}>{player.RatingName}</Text>
                                        }
                                    </Flex>

                                    {(toBoolean(authData?.AcceptOnlinePayments) && equalString(sessionDetails?.PriceType, 1)) &&
                                        <>{displayPayButton(player)}</>
                                    }
                                </Flex>
                            );
                        }}
                />
            </Table>
        )
    }

    return (
        <>
            {isFetching && 
                <PaddingBlock>
                    <Flex vertical={true} gap={8}>
                        {emptyArray(6).map((item, index) => (
                            <Skeleton.Button key={index} active={true} block style={{height: '56px'}}/>
                        ))}
                    </Flex>
                </PaddingBlock>
            }
            
            {!isFetching &&
                <Flex vertical={true} gap={token.padding}>
                    {anyInList(playingPlayers) &&
                        <PaddingBlock>
                            <Flex vertical={true} gap={token.paddingXS}>
                                <Flex gap={token.paddingXS} align={'center'}>
                                    <SVG icon="circle-filled" color={token.colorSuccess} size={16} preventCircles={false} />
                                    <Title level={4}>Playing <Text style={{color: token.colorSecondary, fontWeight: 400}}>({countListItems(playingPlayers)})</Text></Title>
                                </Flex>

                                {tableBlock(playingPlayers)}
                            </Flex>
                        </PaddingBlock>
                    }

                    {anyInList(undecidedPlayers) &&
                        <PaddingBlock>
                            <Flex vertical={true} gap={token.paddingXS}>
                                <Flex gap={token.paddingXS} align={'center'}>
                                    <SVG icon="circle-filled" color={token.colorWarning} size={16} preventCircles={false} />
                                    <Title level={4}>Undecided <Text style={{color: token.colorSecondary, fontWeight: 400}}>({countListItems(undecidedPlayers)})</Text></Title>
                                </Flex>

                                {tableBlock(undecidedPlayers)}
                            </Flex>
                        </PaddingBlock>
                    }
                </Flex>
            }
        </>
    )
}

export default LeagueDetailsGameDaysPlayers
