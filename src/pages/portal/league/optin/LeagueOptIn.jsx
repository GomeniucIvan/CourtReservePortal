import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import LeagueSessionDetailsPartial from "@portal/league/modules/LeagueSessionDetailsPartial.jsx";

const {Title, Text} = Typography;

function LeagueOptIn() {
    const [isFetching, setIsFetching] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("sessionId");
    const leagueId = queryParams.get("leagueId");
    const resId = queryParams.get("resId");
    const navigate = useNavigate();
    const {orgId} = useAuth();
    const [sessionDetails, setSessionDetails] = useState(null);
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const {
        setIsFooterVisible,
        setDynamicPages,
        globalStyles,
        token,
        shouldFetch,
        setFooterContent,
        resetFetch
    } = useApp();

    const loadData = async () => {
        setIsFetching(true);

        let response = await appService.get(navigate, `/app/Online/Leagues/OptIn?id=${orgId}&sessionId=${sessionId}&leagueId=${leagueId}&resId=${resId}`);
        if (toBoolean(response?.IsValid)) {
            console.log(response);
            setSessionDetails(response.Data);
        } else {
            displayMessageModal({
                title: 'Error',
                html: (onClose) => `${response?.Message}`,
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {

                },
            })
        }

        setIsFetching(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('');
        setFooterContent('');
        loadData();
    }, [])

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

            {(!isNullOrEmpty(sessionDetails?.LeagueSession) && !isFetching) &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        <div>
                            <Text type="secondary">{sessionDetails?.LeagueSession.Name}</Text>
                            <Title level={3} style={{marginBottom: 0}}>
                                {sessionDetails?.LeagueSession.LeagueName}
                            </Title>
                        </div>

                        <Flex vertical={true}>
                            <LeagueSessionDetailsPartial sessionDetails={sessionDetails.LeagueSession} page={'optin'}/>
                        </Flex>
                    </Flex>
                </PaddingBlock>
            }
        </>
    )
}

export default LeagueOptIn
