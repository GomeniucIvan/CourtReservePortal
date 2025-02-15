import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton, Input, Button} from "antd";
import {useEffect, useRef, useState} from "react";
import {encodeParamsObject, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {DownOutline} from "antd-mobile-icons";
import {useStyles} from ".././styles.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import LeagueSessionOptInButton from "@portal/league/modules/LeagueSessionOptInButton.jsx";
import LeagueDetailsSessionInfo from "@portal/league/details/LeagueDetails.SessionInfo.jsx";
import {cx} from "antd-style";
import LeagueDetailsGameDaysPlayers from "@portal/league/details/gamedays/LeagueDetails.GameDays.Players.jsx";
import LeagueDetailsGameDaysMyGroup from "@portal/league/details/gamedays/LeagueDetails.GameDays.MyGroup.jsx";
import LeagueDetailsGameDaysAllMatches from "@portal/league/details/gamedays/LeagueDetails.GameDays.AllMatches.jsx";
import {leagueHasMatches} from "@portal/league/functions.jsx";
const {Title, Text} = Typography;

function LeagueDetailsGameDays({selectedTab, tabsHeight, sessionDetails}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [leagueDetails, setLeagueDetails] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [gameDaySelectedTab, setGameDaySelectedTab] = useState('players');
    const [dates, setDates] = useState(null);
    const {token, globalStyles} = useApp();
    const {orgId, authDataOrgMemberIds} = useAuth();
    const {styles} = useStyles();
    const tabsRef = useRef(null);
    
    const loadData = async () => {
        setIsFetching(true);

        let urlData = {
            leagueId: sessionDetails.LeagueId,
            sessionId: sessionDetails.LeagueSessionId,
            resId: sessionDetails.NextReservationId,
            costTypeId: sessionDetails.CostTypeId,
            uiCulture: sessionDetails.UiCulture,
        }

        let response = await appService.get(navigate, `/app/Online/AjaxController/LeagueSession_GetAdditionalDates?id=${orgId}&${encodeParamsObject(urlData)}`);

        if (toBoolean(response?.IsValid)) {
            let responseData = response.Data;
            const dates = responseData.AllDates;
            setDates(dates);
            let selDate =  dates.find(v => equalString(v.ReservationId, responseData.NextReservationId));
            if (!isNullOrEmpty(selDate?.DateTimesDisplay)) {
                setSelectedDay(selDate);
            }

            setLeagueDetails(responseData);
        }

        setIsFetching(false);
    }

    useEffect(() => {
        if (equalString(selectedTab, 'gamedays')) {
            loadData()
        }
    }, [selectedTab])

    let tabIds = [];
    tabIds.push({
        key: 'players',
        label: 'Players',
        children: <LeagueDetailsGameDaysPlayers selectedTab={gameDaySelectedTab} tabsHeight={tabsHeight} sessionDetails={sessionDetails}/>,
    });

    if (leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus)) {
        tabIds.push({
            key: 'mygroup',
            label: 'My Group',
            children: <LeagueDetailsGameDaysMyGroup selectedTab={gameDaySelectedTab} tabsHeight={tabsHeight} sessionDetails={sessionDetails}/>,
        });
    }

    tabIds.push({
        key: 'allmatches',
        label: 'All Matches',
        children: <LeagueDetailsGameDaysAllMatches selectedTab={gameDaySelectedTab} tabsHeight={tabsHeight} sessionDetails={sessionDetails}/>,
    });

    return (
        <>
            {!isFetching &&
                <>
                    <PaddingBlock>
                        <Flex gap={token.paddingSM}>
                            <div className={styles.leagueBlock}>
                                <Text className={styles.selectLeagueLabel}>
                                    <small>
                                        Game Day
                                    </small>
                                </Text>
                                <Input
                                    rootClassName={styles.leagueSelector}
                                    readOnly={true}
                                    value={selectedDay?.DateTimesDisplay}
                                    onClick={() => {
                                        //setShowLeaguesDrawer(true)
                                    }}
                                    suffix={
                                        <DownOutline style={{color: 'rgba(0,0,0,.45)'}}/>
                                    }
                                />
                            </div>

                            {toBoolean(leagueDetails?.IsLoggedInAccountRegistered) &&
                                <>
                                    <LeagueSessionOptInButton orgId={orgId}
                                                              sessionData={sessionDetails}
                                                              orgMemberIds={authDataOrgMemberIds}/>
                                </>
                            }
                        </Flex>
                    </PaddingBlock>

                    <div ref={tabsRef} style={{display: 'block'}}>
                        <Tabs
                            rootClassName={cx(globalStyles.tabs)}
                            onChange={(e) => {
                                setGameDaySelectedTab(e);
                            }}
                            defaultActiveKey={gameDaySelectedTab}
                            items={tabIds}
                        />
                    </div>
                </>
            }
        </>
    )
}

export default LeagueDetailsGameDays
