import * as React from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {Segmented, Space, Flex, Typography, Progress, Button} from "antd";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import LeagueSessionDetailsPartial from "@portal/league/modules/LeagueSessionDetailsPartial.jsx";

const {Title, Text} = Typography;

function LeagueSessionRestrictionBlock({model, memberIds}) {
    const {token} = useApp();
    
    return (
        <Flex vertical={true} gap={token.padding}>
            <AlertBlock
                removePadding={true}
                description={
                    memberIds.length > 1
                        ? 'No Family Members are eligible. See restrictions below.'
                        : 'You are not eligible. See restrictions below.'
                }
                type="danger"
            />

            <Flex vertical={true} gap={token.paddingXS}>
                <LeagueSessionDetailsPartial sessionDetails={model.LeagueSession} page={'restrictions'} />
            </Flex>
        </Flex>
    );
}

export default LeagueSessionRestrictionBlock
