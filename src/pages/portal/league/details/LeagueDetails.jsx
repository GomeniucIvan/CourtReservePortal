import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton} from "antd";
import {useEffect, useRef, useState} from "react";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {anyInList, encodeParamsObject, equalString, isNullOrEmpty, nullToEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useLocation, useParams} from "react-router-dom";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {cx} from "antd-style";
import {useAuth} from "@/context/AuthProvider.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import LeagueDetailsSessionInfo from "@portal/league/details/LeagueDetails.SessionInfo.jsx";
import LeagueDetailsGameDays from "@portal/league/details/LeagueDetails.GameDays.jsx";
import LeagueDetailsStandings from "@portal/league/details/LeagueDetails.Standings.jsx";
const {Title, Text} = Typography;

function LeagueDetails() {
    const [sessionDetails, setSessionDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [selectedTab, setSelectedTab] = useState('');
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const {authDataOrgMemberIds, orgId} = useAuth();
    const [tabsHeight, setTabsHeight] = useState(0);
    const tabsRef = useRef(null);
    
    const {
        setIsFooterVisible,
        setDynamicPages,
        globalStyles,
        token,
        shouldFetch,
        setFooterContent,
        resetFetch
    } = useApp();

    let {lsid} = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    
    const loadData = async () => {
        setIsFetching(true);
        
        let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/Leagues/Details?id=${orgId}&sessionId=${lsid}&tab=${nullToEmpty(tab)}`);

        if (toBoolean(response?.IsValid)){
            let data = response.Data;
            let firstSelectedTab = data.FirstSelectedTab;
            const allPlayersPendingApproval = data.RegisteredPlayers.filter(player => authDataOrgMemberIds.includes(player.OrganizationMemberId)).every(player => !toBoolean(player.IsApproved));

            if (equalString(firstSelectedTab, 2) && (!toBoolean(data.IsLoggedInAccountRegistered) || allPlayersPendingApproval)) {
                firstSelectedTab = 1;
            }

            if (equalString(firstSelectedTab, 1) || equalString(firstSelectedTab, 4)) {
                setSelectedTab('sessioninfo')
            } else if (equalString(firstSelectedTab, 2)) {
                setSelectedTab('gamedays')
            } else if (equalString(firstSelectedTab, 3)) {
                setSelectedTab('standings')
            }
            
            let setData = {
                ...response?.Data,
                AllowToOptIn: toBoolean(response?.Data?.AllowToOptInBool),
            }
            
            setSessionDetails(setData);
        } else {
            displayMessageModal({
                title: 'Error',
                html: (onClose) => `${response?.Message}`,
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {

                },
            })
            
            if (isNullOrEmpty(response?.RestrictionData)){
                let respData = response.RestrictionData;
                
            } else {
                
            }
        }

        setIsFetching(false);
    }
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('');
        setFooterContent('');
        loadData();
    }, []);

    useEffect(() => {
        const updateTabsHeight = () => {
            if (tabsRef.current) {
                const navElement = tabsRef.current.querySelector('.ant-tabs-nav');
                if (navElement) {
                    setTabsHeight(navElement.offsetHeight);
                }
            }
        };

        // Delay the execution to ensure elements are rendered
        setTimeout(updateTabsHeight, 0);

        // Attach a resize observer to update height dynamically
        const observer = new ResizeObserver(updateTabsHeight);
        if (tabsRef.current) {
            observer.observe(tabsRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [sessionDetails, selectedTab]);
    
    let tabIds = [];
    
    tabIds.push({
        key: 'sessioninfo',
        label: 'Session Info',
        children: <LeagueDetailsSessionInfo selectedTab={selectedTab} tabsHeight={tabsHeight} sessionDetails={sessionDetails}/>,
    });
    
    let allRegisteredPlayersInPendingApproval = false;
    if (anyInList(sessionDetails?.RegisteredPlayers)) {
        allRegisteredPlayersInPendingApproval = sessionDetails.RegisteredPlayers.filter(player => authDataOrgMemberIds.includes(player.OrganizationMemberId)).every(player => !toBoolean(player.IsApproved));
    }
    
    if (toBoolean(sessionDetails?.IsLoggedInAccountRegistered) || allRegisteredPlayersInPendingApproval) {
        tabIds.push({
            key: 'gamedays',
            label: 'Game Days',
            children: <LeagueDetailsGameDays selectedTab={selectedTab} tabsHeight={tabsHeight} sessionDetails={sessionDetails}/>,
        })
    }

    if (!toBoolean(sessionDetails?.IsStandingHidden)) {
        tabIds.push({
            key: 'standings',
            label: 'Standings',
            children: <LeagueDetailsStandings selectedTab={selectedTab} tabsHeight={tabsHeight} sessionDetails={sessionDetails}/>
        })
    }
    
    return (
        <>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(15).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block style={{height: `60px`}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <>
                    {(!toBoolean(sessionDetails?.IsLoggedInAccountRegistered) && toBoolean(sessionDetails?.IsStandingHidden)) &&
                        <PaddingBlock topBottom={true} leftRight={false}>
                            <LeagueDetailsSessionInfo selectedTab={'sessioninfo'} tabsHeight={tabsHeight} sessionDetails={sessionDetails}/>
                        </PaddingBlock>
                    }

                    {(toBoolean(sessionDetails?.IsLoggedInAccountRegistered) || !toBoolean(sessionDetails?.IsStandingHidden)) &&
                        <div ref={tabsRef} style={{display: 'block'}}>
                            <Tabs 
                                rootClassName={cx(globalStyles.tabs)}
                                onChange={(e) => {
                                    setSelectedTab(e);
                                }}
                                defaultActiveKey={selectedTab}
                                items={tabIds}
                            />
                        </div>
                    }
                </>
            }
        </>
    )
}

export default LeagueDetails
