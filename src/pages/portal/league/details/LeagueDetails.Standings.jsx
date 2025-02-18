import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton, Table} from "antd";
const {Title, Text} = Typography;
import {useStyles} from './../styles.jsx';
import {useEffect, useState} from "react";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";

function LeagueDetailsStandings({selectedTab, tabsHeight, sessionDetails}) {
    const {orgId} = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [dataSource, setDataSource] = useState([]);
    const navigate = useNavigate();
    const {styles} = useStyles();
    const [bodyHeight, setBodyHeight] = useState(null);
    const {globalStyles, token, isLoading, setIsLoading, availableHeight} = useApp();
    
    const loadData = async () => {
        setIsFetching(true);
        let response = await appService.get(navigate, `/app/Online/Leagues/LeagueSession_GetStandingPlayers?id=${orgId}&sessionId=${sessionDetails?.LeagueSessionId}`);
        if (toBoolean(response?.IsValid)) {
            setDataSource(response?.Data);
            fixHeaderItems();
        }

        setIsFetching(false);
    }

    useEffect(() => {
        if (equalString(selectedTab, 'standings')) {
            loadData()
        }
    }, [selectedTab])
    
    const displayLastGames = (record) => {
        // Custom function to display last games
        if (anyInList(record?.LastGames)) {
            return record.LastGames.map(game => game.result).join(' ');
        }
        
        return '';
    };

    const fixHeaderItems = () => {
        if (tabsHeight > 0) {
            setBodyHeight(availableHeight - tabsHeight);
        }
    }
    
    const columns = [
        {
            title: '#',
            dataIndex: 'Rank',
            key: 'Rank',
            fixed: 'left',
            align: 'center',
            width: 60,
            render: (text, record) => (
                <Flex align="center" justify='center' gap={token.paddingXS}>
                    <Text>#{record.Rank}</Text>
                    {!isNullOrEmpty(record.MovementDisplayHtml) &&
                        <span dangerouslySetInnerHTML={{__html: record.MovementDisplayHtml}}/>
                    }
                </Flex>
            ),
        },
        {
            title: 'Player',
            dataIndex: 'FullName',
            key: 'FullName',
            fixed: 'left',
            width: 120,
            render: (text, record) => (
                <Text style={{fontSize: token.fontSizeSM}}>
                    {record.FullName} {record.RatingName ? `(${record.RatingName})` : ''}
                </Text>
            ),
        },
        {
            title: 'Pts W',
            dataIndex: 'PointsWon',
            key: 'PointsWon',
            width: 90,
            render: (text, record) => (
                <Text><span style={{ fontWeight: 'bold' }}>{record.PointsWon}</span>/{record.PointsPossible}</Text>
            ),
        },
    {
        title: 'Pts W %',
        dataIndex: 'WinPercentage',
        key: 'WinPercentage',
        width: 90,
        render: (text) => `${(text * 100).toFixed(2)}%`,
    },
    {
        title: 'GP',
        dataIndex: 'TotalGamesPlayed',
        key: 'TotalGamesPlayed',
        width: 90,
    },
    {
        title: 'W',
        dataIndex: 'GamesWon',
        key: 'GamesWon',
        width: 90,
    },
    {
        title: 'L',
        dataIndex: 'GamesLost',
        key: 'GamesLost',
        width: 90,
    },
];

    if (toBoolean(sessionDetails?.IsTimeBased)) {
        columns.push({
            title: 'T',
            dataIndex: 'GamesTied',
            key: 'GamesTied',
            width: 90,
        });
    }

    columns.push(
        {
            title: 'Win %',
            dataIndex: 'WinLossPercentage',
            key: 'WinLossPercentage',
            width: 90,
            render: (text) => `${(text * 100).toFixed(2)}%`,
        },
        {
            title: 'Form (last 6)',
            dataIndex: 'OrganizationMemberId',
            key: 'OrganizationMemberId',
            width: 160,
            render: (text, record) => displayLastGames(record),
        }
    );
    
    return (
        <>
            {isFetching &&
                <>
                    <Skeleton.Button active={true} block style={{height: `280px`}}/>
                </>
            }

            {!isFetching &&
                <>
                    <Table
                        className={styles.standingsTable}
                        columns={columns}
                        dataSource={dataSource}
                        size={'medium'}
                        pagination={false}
                        scroll={{ x: 'max-content', y: bodyHeight }}
                    />   
                </>
            }

        </>
    )
}

export default LeagueDetailsStandings
