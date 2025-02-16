import * as React from "react";
import {
    Flex,
    Typography,
    Skeleton,
    Input,
    Button,
    Card,
    Checkbox, Tag, InputNumber
} from "antd";
import {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {leagueHasMatches} from "@portal/league/functions.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {anyInList, encodeParamsObject, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import appService from "@/api/app.jsx";
import {useStyles} from "./../../styles.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {SyncOutlined, TrophyOutlined} from "@ant-design/icons";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import SVG from "@/components/svg/SVG.jsx";
const {Title, Text} = Typography;
import { cx } from 'antd-style';
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import IOSKeyboard from "@/components/keyboard/IOSKeyboard.jsx";

function LeagueDetailsGameDaysMatches({selectedTab, tabsHeight, sessionDetails, isMyMatches}) {
    const navigate = useNavigate();
    const [matches, setMatches] = useState(null);
    const [isFetching, setIsFetching] = useState(leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus));
    const [noMatches, setNoMatches] = useState(false);
    const {orgId, authDataOrgMemberIds} = useAuth();
    const {globalStyles, token, isLoading, setIsLoading} = useApp();
    const {styles} = useStyles();
    const {buttonStyles} = useCombinedStyles();
    const [reportScoreMatchData, setReportScoreMatchData] = useState(null);

    //lists
    const [distinctGroups, setDistinctGroups] = useState([]);
    const [sortedMatches, setSortedMatches] = useState([]);

    //numeric keyboard, report match
    const [focusedInput, setFocusedInput] = useState(null);
    const [inputs, setInputs] = useState();
    const keyboardRef = useRef(null);

    const loadData = async () => {
        setIsFetching(true);

        let urlParams = {
            leagueSessionId: sessionDetails.LeagueSessionId,
            leagueId: sessionDetails.LeagueId,
            reservationId: sessionDetails.NextReservationId,
            isMyMatches: toBoolean(isMyMatches)
        }

        let response = await appService.get(navigate, `/app/Online/AjaxController/LeagueSession_GetPlayDateMatches?id=${orgId}&${encodeParamsObject(urlParams)}`)

        if (toBoolean(response?.IsValid)){
            if(toBoolean(response?.noMatches)) {
                setNoMatches(true);
            } else {
                let respData = response.Data;

                console.log(respData)
                setMatches(respData.Model.Matches);
                setDistinctGroups(respData.DistinctGroups);
                setSortedMatches(respData.SortedMatches);
            }
        } else {
            displayMessageModal({
                title: "Access Error",
                html: (onClose) => response?.Message,
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {

                },
            })
        }

        setIsFetching(false);
        setIsLoading(false);
    }

    useEffect(() => {
        if (equalString(selectedTab, 'allmatches') || equalString(selectedTab, 'selectedTab')) {
            if (leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus)) {
                loadData()
            } else{
                setIsFetching(false);
                setIsLoading(false);
            }
        }
    }, [selectedTab]);

    const isMemberMatch = (match, orgMemberIds, allMatches) => {
        // Combine team1 and team2 player IDs into one array
        const allMemberIds = [
            ...match.Team1Players.map(player => player.OrganizationMemberId || 0),
            ...match.Team2Players.map(player => player.OrganizationMemberId || 0)
        ];

        // Check if any of these IDs are in the provided orgMemberIds
        if (allMemberIds.some(id => orgMemberIds.includes(id))) {
            return true;
        }

        // Get the groupId of the current match
        const groupId = match.LeagueSessionPlayDateGroupId;

        // Find all groups for matches where orgMemberIds are present
        const myGroups = allMatches
            .filter(m => m.MatchOrgMemberIds.some(id => orgMemberIds.includes(id)))
            .map(m => m.LeagueSessionPlayDateGroupId);

        // Check if the current match's groupId is in myGroups
        return myGroups.includes(groupId);
    };

    const isEligibleForTimeBased = (val) =>
    {
        return !isNullOrEmpty(val) && (equalString(val, 4) || equalString(val, 5) || equalString(val, 7))
    }

    const LeagueFourPersonRotationType = {
        1: "1 rotation to 15",
        2: "1 rotation to 21",
        3: "2 rotations to 11",
        4: "1 rotation",
        5: "2 rotations",
        6: "1 rotation to 11",
        7: "3 rotations"
    };

    const LeagueFivePersonRotationType = {
        1: "1 rotation to 15",
        2: "2 rotations to 11",
        3: "2 rotations to 7",
        4: "1 rotation",
        5: "2 rotations",
        6: "1 rotation to 11",
        7: "3 rotations"
    };

    const getDisplayName = (value, isFive) => {
        if (isFive) {
            return LeagueFivePersonRotationType[value] || "Unknown Rotation Type";
        } else {
            return LeagueFourPersonRotationType[value] || "Unknown Rotation Type";
        }
    };

    const getRotationType = (group) => {
        if (!group) return null;

        let result = '';

        if (group.IsFivePlayersRotationType) {
            result = getDisplayName(group.FivePersonRotationType, true);
            if (isEligibleForTimeBased(group.FivePersonRotationType) && group.TimeLimitMinutes) {
                result += ` (${group.TimeLimitMinutes} minute${group.TimeLimitMinutes > 1 ? 's' : ''})`;
            }
        } else {
            result = getDisplayName(group.FourPersonRotationType);
            if (isEligibleForTimeBased(group.FourPersonRotationType) && group.TimeLimitMinutes) {
                result += ` (${group.TimeLimitMinutes} minute${group.TimeLimitMinutes > 1 ? 's' : ''})`;
            }
        }

        return result;
    };

    const handleScoreChange = (team, matchId) => {
        pNotify(`Score changed for ${team} in match ${matchId}`);
    };

    const displayTeamFormat = (players, separator = '&', extractFirstNameFirstInitial = false) => {
        const formatName = (player) => {
            return extractFirstNameFirstInitial
                ? `${player.FirstName} ${player.LastName}`
                : player.FullName;
        };

        return (
            <div>
                {players.map((player, index) => (
                    <div key={index}>
                        #{player.MatchPlayerRank} {formatName(player)} {index < players.length - 1 && ` ${separator} `}
                    </div>
                ))}
            </div>
        );
    };

    const allowScoreReport = (match) => {
        return toBoolean(sessionDetails?.AllowPlayersToReportScore) && isMemberMatch(match, authDataOrgMemberIds, sortedMatches) && equalString(sessionDetails?.SessionGameDayGroupStatus, 2);
    }

    const handleKeyboardInput = (key) => {
        if (!focusedInput) return;

        setInputs((prev) => {
            const currentValue = String(prev[focusedInput]); // Convert to string for easy manipulation

            if (key === 'delete') {
                // Remove the last digit
                const newValue = currentValue.slice(0, -1);
                return {
                    ...prev,
                    [focusedInput]: newValue === '' ? '' : Number(newValue),
                };
            } else {
                // Append digit only if length < 2
                if (currentValue.length < 2) {
                    const newValue = currentValue + key;
                    return {
                        ...prev,
                        [focusedInput]: Number(newValue),
                    };
                }
                // Ignore input if already has 2 digits
                return prev;
            }
        });
    };

    const reportScore = (match) => {
        let isIncomplete = equalString(match.ScoreStatus, 2);
        
        setInputs({
            team1: match.Team1Score || '',
            team2: match.Team2Score || '',
            incompleteScore: isIncomplete
        })

        if (!isIncomplete) {
            setFocusedInput('team1');
        }

        setReportScoreMatchData(match)
    }

    const reportScorePost = async (match) => {
        setIsLoading(true);
        let isValidScore = false;
        let isIncomplete = toBoolean(inputs['incompleteScore']);
        const isFivePlayerRotationType = toBoolean(match.IsFivePlayersRotationType);
        let fourRotationType = isFivePlayerRotationType ? null : match.FourPersonRotationType;
        let fiveRotationType = isFivePlayerRotationType ? match.FivePersonRotationType : null;
        let max = null;
        let isTimeBased = false;
        let team1Score = inputs['team1'];
        let team2Score = inputs['team2'];

        if (isIncomplete) {
            isValidScore = true;
        }
        else {
            if (!isNullOrEmpty(fourRotationType)) {
                if (equalString(fourRotationType, 1)) {
                    max = 15;
                }
                if (equalString(fourRotationType, 2)) {
                    max = 21;
                }
                if (equalString(fourRotationType, 3)|| equalString(fourRotationType, 6)) {
                    max = 11;
                }

                if (equalString(fourRotationType, 4) || equalString(fourRotationType, 7) || equalString(fourRotationType, 5)) {
                    max = match.MaxScore;
                    isTimeBased = true;
                }
            }

            if (!isNullOrEmpty(fiveRotationType)) {
                if (equalString(fiveRotationType, 1)) {
                    max = 15;
                }
                if (equalString(fiveRotationType, 6)) {
                    max = 11;
                }
                if (equalString(fiveRotationType, 3)) {
                    max = 7;
                }
                if (equalString(fiveRotationType, 2)) {
                    max = 11;
                }

                if (equalString(fourRotationType, 4) || equalString(fourRotationType, 7) || equalString(fourRotationType, 5)) {
                    max = match.MaxScore;
                    isTimeBased = true;
                }
            }

            if (isNullOrEmpty(team1Score) ||
                isNullOrEmpty(team2Score) ||
                equalString(team1Score, team2Score)) {
                isValidScore = false;
            }

            if (team1Score > max || team2Score > max) {
                isValidScore = false;

            } else if (equalString(team1Score, max) || equalString(team2Score, max) || isTimeBased===true) {
                isValidScore = true;
            }

            if (!isValidScore) {
                displayMessageModal({
                    title: "Report Score Error",
                    html: (onClose) => 'Invalid score.',
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {

                    },
                })
                setIsLoading(false);
                return;
            }
        }

        const leagueSessionMatchId = match.LeagueSessionMatchId;
        const leagueSessionMatchTeam1Id = match.LeagueSessionMatchTeam1Id;
        const leagueSessionMatchTeam2Id = match.LeagueSessionMatchTeam2Id;

        let postModel = {
            LeagueSessionId: sessionDetails.LeagueSessionId,
            GroupId: match.LeagueSessionPlayDateGroupId,
            MatchId: leagueSessionMatchId,
            Team1Id: leagueSessionMatchTeam1Id,
            Team2Id: leagueSessionMatchTeam2Id,
            Team1Score: team1Score,
            Team2Score: team2Score,
            MatchRound: match.MatchRound,
            ReservationId: sessionDetails.NextReservationId,
            ScoreStatus: isIncomplete ? 2 : 1
        }

        let response = await appService.post(`/app/Online/Leagues/ReportMatchScore?id=${orgId}`, postModel);

        if (toBoolean(response?.IsValid)) {
            //should update value from list
            //1 - Completed, 2 Incomplete, 3 Pending

            let statusMatch = 1;
            if (isIncomplete){
                statusMatch = 2;
            } else if (isNullOrEmpty(team1Score) && isNullOrEmpty(team2Score)) {
                statusMatch = 3
            }

            setSortedMatches((prevMatches) =>
                prevMatches.map((match) =>
                    equalString(leagueSessionMatchId, match.LeagueSessionMatchId)
                        ? {
                            ...match,
                            Team1Score: team1Score,
                            Team2Score: team2Score,
                            ScoreStatus: statusMatch
                        }
                        : match
                )
            );

            pNotify('Score successfully submitted.');
            setReportScoreMatchData(null);
            setInputs(null);
        } else {
            displayMessageModal({
                title: "Report Score Error",
                html: (onClose) => 'Invalid score.',
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {

                },
            })
        }

        setIsLoading(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                focusedInput &&
                !event.target.closest('.custom-input') &&
                !keyboardRef.current?.contains(event.target)
            ) {
                setFocusedInput(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [focusedInput]);

    return (
        <>
            {isFetching &&
                <>
                    <PaddingBlock>
                        <Flex vertical={true} gap={8}>
                            {emptyArray(6).map((item, index) => (
                                <Skeleton.Button key={index} active={true} block style={{height: '56px'}}/>
                            ))}
                        </Flex>
                    </PaddingBlock>
                </>
            }

            {!isFetching &&
                <PaddingBlock onlyBottom={true}>
                    {leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus) &&
                        <>
                            {(anyInList(distinctGroups) && anyInList(sortedMatches)) &&
                                <Flex vertical={true} gap={token.padding}>
                                    {distinctGroups.map((group, index) => {
                                        let groupMatches = sortedMatches.filter(v => equalString(v.LeagueSessionPlayDateGroupId, group.LeagueSessionPlayDateGroupId));


                                        if (toBoolean(isMyMatches)) {
                                            groupMatches = groupMatches.find(v => isMemberMatch(sessionDetails, authDataOrgMemberIds, sortedMatches));
                                            if (!anyInList(groupMatches))
                                            {
                                                return (<></>);
                                            }
                                        }

                                        let matchNumber = 1;
                                        let rotationType = getRotationType(group);

                                        return (
                                            <Flex key={index} vertical={true} gap={token.paddingLG}>
                                                <Flex justify={'space-between'}>
                                                    <Title level={3}>{group.CourtLabel}</Title>
                                                    {!isNullOrEmpty(rotationType) &&
                                                        <Tag className={globalStyles.tag} color="default">{rotationType}</Tag>
                                                    }
                                                </Flex>

                                                {groupMatches.map((match) => {
                                                    const teamOneDisplay = displayTeamFormat(match.Team1Players, '');
                                                    const teamTwoDisplay = displayTeamFormat(match.Team2Players, '');

                                                    const isTeam1Serving = match.Team1Players.some(player => player.IsFirstServing);
                                                    const isTeam2Serving = match.Team2Players.some(player => player.IsFirstServing);

                                                    const teamOneIsWinner =  match.Team1Score > match.Team2Score;
                                                    const teamTwoIsWinner =  match.Team2Score > match.Team1Score;
                                                    let isIncomplete = equalString(match.ScoreStatus, 2);
                                                    
                                                    return (
                                                        <Card key={match.LeagueSessionMatchId}>
                                                            <Flex vertical={true} gap={token.paddingXXL}>
                                                                <Flex align={'center'} justify={'space-between'}>
                                                                    <Flex gap={token.paddingXS} align={'center'}>
                                                                        <SVG icon={'pickleball-solid'} color={token.colorSecondary} />
                                                                        <Title level={3}>
                                                                            Match #{matchNumber++}
                                                                        </Title>
                                                                    </Flex>
                                                                    {toBoolean(allowScoreReport(match)) &&
                                                                        <Button type="primary"
                                                                                ghost={true}
                                                                                size={'small'}
                                                                                className={buttonStyles.buttonBlue}
                                                                                onClick={() => reportScore(match)}>
                                                                            Report Score
                                                                        </Button>
                                                                    }
                                                                </Flex>

                                                                <Flex vertical={true} gap={token.paddingXS}>
                                                                    <Flex className={(teamOneIsWinner) && styles.winnerTeamWrapper} justify={'space-between'}>
                                                                        <Flex align={'center'} gap={token.paddingXS}>
                                                                            <Text level={4}>{teamOneDisplay}</Text>
                                                                            {isTeam1Serving && <SVG icon={'circle-s-regular'} color={token.colorSecondary} size={16}  />}
                                                                        </Flex>


                                                                        {!isIncomplete &&
                                                                            <Flex align={'center'} gap={token.paddingXXS}>
                                                                                {teamOneIsWinner &&
                                                                                    <SVG icon={'badge-check-solid'} color={token.colorSuccess} size={20}  />
                                                                                }
                                                                                <Input
                                                                                    disabled
                                                                                    defaultValue={match.Team1Score}
                                                                                    className={cx(styles.matchScoreDisabledInput, teamOneIsWinner && styles.matchScoreWinnerInput)}
                                                                                    onChange={() => handleScoreChange('team1', match.LeagueSessionMatchId)}
                                                                                />
                                                                            </Flex>
                                                                        }
                                                                    </Flex>

                                                                    <Flex justify={'end'}>
                                                                        {!isIncomplete &&
                                                                            <Text strong className={styles.matchVsText}>VS</Text>
                                                                        }
                                                                        {isIncomplete &&
                                                                            <Tag color="orange" className={globalStyles.tag}>Incomplete</Tag>
                                                                        }
                                                                    </Flex>

                                                                    <Flex className={(teamTwoIsWinner) && styles.winnerTeamWrapper} justify={'space-between'}>
                                                                        <Text level={4}>{teamTwoDisplay}</Text>
                                                                        {isTeam2Serving && <SVG icon={'circle-s-regular'} color={token.colorSecondary} size={16}  />}

                                                                        {!isIncomplete &&
                                                                            <Flex align={'center'} gap={token.paddingXXS}>
                                                                                {teamTwoIsWinner &&
                                                                                    <SVG icon={'badge-check-solid'} color={token.colorSuccess} size={20}  />
                                                                                }
                                                                                <Input
                                                                                    disabled
                                                                                    defaultValue={match.Team2Score}
                                                                                    className={cx(styles.matchScoreDisabledInput, teamTwoIsWinner && styles.matchScoreWinnerInput)}
                                                                                    onChange={() => handleScoreChange('team2', match.LeagueSessionMatchId)}
                                                                                />
                                                                            </Flex>
                                                                        }
                                                                    </Flex>

                                                                    {match.RestingPlayers.length > 0 && (
                                                                        <Text type="secondary">Bye: {match.RestingPlayers.map(player => player.FullName).join(', ')}</Text>
                                                                    )}
                                                                </Flex>
                                                            </Flex>
                                                        </Card>
                                                    );
                                                })}
                                            </Flex>
                                        )
                                    })}
                                </Flex>
                            }
                        </>
                    }

                    {(!leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus) || toBoolean(noMatches)) &&
                        <EmptyBlock description={toBoolean(isMyMatches) ? 'No Matches.' : 'Match(s) not created.'} removePadding={true} />
                    }

                    <DrawerBottom showDrawer={!isNullOrEmpty(reportScoreMatchData)}
                                  closeDrawer={() => setReportScoreMatchData(null)}
                                  showButton={false}
                                  customFooter={''}
                                  label={`Enter Score`}>
                        <PaddingBlock onlyBottom={true}>
                            <Flex vertical={true} gap={token.padding}>
                                {!isNullOrEmpty(reportScoreMatchData) &&
                                    <Flex vertical={true} gap={token.padding}>
                                        <Flex vertical={true} gap={token.paddingMD}>
                                            <Flex justify={'space-between'} align={'center'}>
                                                <Text>
                                                    {displayTeamFormat(reportScoreMatchData.Team1Players, '')}
                                                </Text>

                                                <InputNumber
                                                    readOnly={true}
                                                    disabled={toBoolean(inputs['incompleteScore'])}
                                                    min={0}
                                                    onFocus={() => setFocusedInput('team1')}
                                                    value={inputs['team1']}
                                                    placeholder={'-'}
                                                    status={inputs['team1'] > reportScoreMatchData.MaxScoreByRotationType ? 'error': undefined}
                                                    max={reportScoreMatchData.MaxScoreByRotationType}
                                                    className={cx(styles.matchScoreNumericInput, equalString(focusedInput,'team1') && styles.matchScoreNumericFocusedInput)}
                                                    onChange={() => handleScoreChange('team1', match.LeagueSessionMatchId)}
                                                />
                                            </Flex>

                                            <Flex justify={'space-between'} align={'center'}>
                                                <Text>
                                                    {displayTeamFormat(reportScoreMatchData.Team2Players, '')}
                                                </Text>

                                                <InputNumber
                                                    min={0}
                                                    onFocus={() => setFocusedInput('team2')}
                                                    value={inputs['team2']}
                                                    max={reportScoreMatchData.MaxScoreByRotationType}
                                                    readOnly={true}
                                                    disabled={toBoolean(inputs['incompleteScore'])}
                                                    placeholder={'-'}
                                                    status={inputs['team2'] > reportScoreMatchData.MaxScoreByRotationType ? 'error': undefined}
                                                    className={cx(styles.matchScoreNumericInput, equalString(focusedInput,'team2') && styles.matchScoreNumericFocusedInput)}
                                                    onChange={() => handleScoreChange('team2', match.LeagueSessionMatchId)}
                                                />
                                            </Flex>

                                            <Checkbox
                                                checked={toBoolean(inputs['incompleteScore'])}
                                                className={globalStyles.checkbox}
                                                onChange={(e) => {
                                                    setInputs((prev) => ({
                                                        ...prev,
                                                        team1: toBoolean(e.target.checked) ? '' : prev.team1,
                                                        team2: toBoolean(e.target.checked) ? '' : prev.team2,
                                                        incompleteScore: e.target.checked
                                                    }));
                                                }}
                                            >
                                                Mark Incomplete
                                            </Checkbox>
                                        </Flex>

                                        <Flex vertical={true} gap={token.padding} ref={keyboardRef}>
                                            <Button type={'primary'} loading={isLoading} onClick={() => reportScorePost(reportScoreMatchData)}>
                                                Submit Result
                                            </Button>

                                            <IOSKeyboard
                                                show={!isNullOrEmpty(focusedInput)}
                                                showCloseButton={false}
                                                onInput={handleKeyboardInput}
                                                onDelete={() => handleKeyboardInput('delete')}
                                            />
                                        </Flex>
                                    </Flex>
                                }
                            </Flex>
                        </PaddingBlock>
                    </DrawerBottom>
                </PaddingBlock>
            }
        </>
    )
}

export default LeagueDetailsGameDaysMatches
