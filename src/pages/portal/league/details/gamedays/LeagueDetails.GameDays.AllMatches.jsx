import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton, Input, Button} from "antd";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {leagueHasMatches} from "@portal/league/functions.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {equalString} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
const {Title, Text} = Typography;

function LeagueDetailsGameDaysAllMatches({selectedTab, tabsHeight, sessionDetails}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus));

    const loadData = async () => {
        setIsFetching(true);
        
        
    }
    
    useEffect(() => {
        if (equalString(selectedTab, 'allmatches')) {
            if (leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus)) {
                loadData()
            } else{
                setIsFetching(false);
            }
        }
    }, [selectedTab]);
    
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
                <PaddingBlock>
                    {leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus) &&
                        <>

                        </>
                    }

                    {!leagueHasMatches(sessionDetails?.SessionGameDayGroupStatus) &&
                        <EmptyBlock description={'Match(s) not created.'} removePadding={true} />
                    }
                </PaddingBlock>
            }
        </>
    )
}

export default LeagueDetailsGameDaysAllMatches
