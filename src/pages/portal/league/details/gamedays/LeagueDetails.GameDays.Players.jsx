import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton, Input, Button} from "antd";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
const {Title, Text} = Typography;

function LeagueDetailsGameDaysPlayers({selectedTab, tabsHeight, sessionDetails}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);

    
    return (
        <>
 
        </>
    )
}

export default LeagueDetailsGameDaysPlayers
