﻿import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton, Input, Button, Tag, Divider} from "antd";
import {useEffect, useRef, useState} from "react";
import {
    anyInList,
    encodeParamsObject,
    equalString,
    isNullOrEmpty,
    moreThanOneInList,
    toBoolean
} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {DownOutline} from "antd-mobile-icons";
import {useStyles} from ".././styles.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import LeagueSessionOptInButton from "@portal/league/modules/LeagueSessionOptInButton.jsx";
import {cx} from "antd-style";
import LeagueDetailsGameDaysPlayers from "@portal/league/details/gamedays/LeagueDetails.GameDays.Players.jsx";
import {leagueHasMatches} from "@portal/league/functions.jsx";
import LeagueDetailsGameDaysMatches from "@portal/league/details/gamedays/LeagueDetails.GameDays.Matches.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import DrawerRowSVG from "@/components/drawer/DrawerRowSVG.jsx";
const {Title, Text} = Typography;

function LeagueDetailsGameDays({selectedTab, tabsHeight, sessionDetails}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [showLeaguesDrawer, setShowLeaguesDrawer] = useState(false);
    const [leagueDetails, setLeagueDetails] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [gameDaySelectedTab, setGameDaySelectedTab] = useState('players');
    const [selectedReservationId, setSelectedReservationId] = useState(sessionDetails.NextReservationId);
    const [dates, setDates] = useState(null);
    const {token, globalStyles} = useApp();
    const {orgId, authDataOrgMemberIds} = useAuth();
    const {styles} = useStyles();
    const tabsRef = useRef(null);
    const gameDayPickerRef = useRef(null);
    const [innerTabsHeight, setInnerTabHeight] = useState(0);


    const loadData = async (resId) => {
        setIsFetching(true);

        let urlData = {
            leagueId: sessionDetails.LeagueId,
            sessionId: sessionDetails.LeagueSessionId,
            resId: resId,
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
            let currentComponentHeaderHeight = 0;

            if (tabsRef.current) {
                // Access the 'ant-tabs-nav' element within tabsRef
                const navElement = tabsRef.current.querySelector('.ant-tabs-nav');
                if (navElement) {
                    //should include bottom margin as well
                    // + token.padding
                    currentComponentHeaderHeight = navElement.offsetHeight;
                }
            }

            if (gameDayPickerRef.current) {
                currentComponentHeaderHeight = currentComponentHeaderHeight + gameDayPickerRef.current.offsetHeight;
            }

            if (currentComponentHeaderHeight > 0) {
                setInnerTabHeight(currentComponentHeaderHeight + tabsHeight + (token.padding * 2) + token.paddingSM - 2); //2 gaps token
            }
        }
    }, [tabsRef, gameDayPickerRef, gameDaySelectedTab]);

    useEffect(() => {
        if (equalString(selectedTab, 'gamedays')) {
            loadData(selectedReservationId)
        }
    }, [selectedReservationId])

    let tabIds = [];
    tabIds.push({
        key: 'players',
        label: 'Players',
        children: <LeagueDetailsGameDaysPlayers selectedTab={gameDaySelectedTab} tabsHeight={innerTabsHeight} sessionDetails={sessionDetails} reservationId={selectedReservationId}/>,
    });

    if (leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus)) {
        tabIds.push({
            key: 'mygroup',
            label: 'My Group',
            children: <LeagueDetailsGameDaysMatches selectedTab={gameDaySelectedTab} tabsHeight={innerTabsHeight} sessionDetails={sessionDetails} isMyMatches={true} reservationId={selectedReservationId}/>,
        });
    }

    tabIds.push({
        key: 'allmatches',
        label: 'All Matches',
        children: <LeagueDetailsGameDaysMatches selectedTab={gameDaySelectedTab} tabsHeight={innerTabsHeight} sessionDetails={sessionDetails} reservationId={selectedReservationId}/>,
    });

    return (
        <>
            {isFetching &&
                <>
                    <PaddingBlock onlyBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            {emptyArray(4).map((item, index) => (
                                <div key={index}>
                                    <Skeleton.Button active={true} block style={{height: `80px`}}/>
                                </div>
                            ))}
                        </Flex>
                    </PaddingBlock>
                </>
            }

            {!isFetching &&
                <>
                    <div ref={gameDayPickerRef}>
                        <PaddingBlock>
                            <Flex gap={token.paddingSM}>
                                <div className={cx(styles.leagueBlock)}>
                                    <Text className={styles.selectLeagueLabel}>
                                        <small>
                                            Game Day
                                        </small>
                                    </Text>
                                    <Input
                                        rootClassName={cx(styles.leagueSelector, styles.leagueGameDaySelector)}
                                        readOnly={true}
                                        value={selectedDay?.DateTimesDisplay}
                                        onClick={() => {
                                            if (moreThanOneInList(dates)) {
                                                setShowLeaguesDrawer(true)
                                            }
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
                    </div>

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

                    <DrawerBottom showDrawer={showLeaguesDrawer}
                                  maxHeightVh={60}
                                  closeDrawer={() => setShowLeaguesDrawer(false)}
                                  label={'Game Day'}>
                        <PaddingBlock>
                            {anyInList(dates) &&
                                <PaddingBlock leftRight={false} onlyBottom={true}>
                                    {dates.map((item, index) => {
                                        const isLastIndex = index === dates.length - 1;

                                        return (
                                            <React.Fragment key={index}>
                                                <Flex align={'center'}
                                                      justify={'space-between'}
                                                      onClick={() => {
                                                          setSelectedReservationId(item.ReservationId);
                                                          setShowLeaguesDrawer(false);
                                                      }}
                                                      className={globalStyles.drawerRow}>
                                                    <Flex vertical={true}>
                                                        <Text>{item.DateTimesDisplay}</Text>
                                                        {!isNullOrEmpty(item.GetDateStatusString) &&
                                                            <Text
                                                                className={cx(styles.leagueDrawerStatus, `status-${item.GetDateStatusInt}`)}>
                                                                {item.GetDateStatusString}
                                                            </Text>
                                                        }
                                                    </Flex>

                                                    <DrawerRowSVG
                                                        checked={equalString(item.ReservationId, selectedReservationId)}/>
                                                </Flex>

                                                {!isLastIndex &&
                                                    <Divider className={globalStyles.noMargin}/>
                                                }
                                            </React.Fragment>
                                        )
                                    })}
                                </PaddingBlock>
                            }
                        </PaddingBlock>
                    </DrawerBottom>
                </>
            }
        </>
    )
}

export default LeagueDetailsGameDays
