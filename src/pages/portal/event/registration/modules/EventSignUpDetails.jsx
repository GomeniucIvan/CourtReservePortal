import React from "react";
import {Flex, Typography} from "antd";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";

import {
    anyInList,
    toBoolean
} from "@/utils/Utils.jsx";
import {dateTimeToFormat, dateTimeToTimes} from "@/utils/DateUtils.jsx";
const {Title, Text} = Typography;

function EventSignUpDetails({event}) {
    
    return (
        <>
            <div>
                <Title level={3} style={{marginBottom: 0}}>
                    {event?.EventName}
                </Title>
                <Text type="secondary">{event?.Type}</Text>
            </div>

            <Flex vertical gap={4}>
                {(!toBoolean(event?.IsSignUpForEntireEvent) && !toBoolean(event?.NoDropInRegistration)) &&
                    <CardIconLabel icon={'calendar'}
                                   description={dateTimeToFormat(event?.SelectedReservation.Start, 'ddd, MMM Do')}/>
                }
                {(anyInList(event?.OtherFromSameEvent) && toBoolean(event?.NoDropInRegistration)) &&
                    <CardIconLabel icon={'calendar'} description={event?.GetDateDisplayNoDropInHeader}/>
                }
                <CardIconLabel icon={'clock'}
                               description={dateTimeToTimes(event?.SelectedReservation.Start, event?.SelectedReservation.End, 'friendly')}/>
            </Flex>
        </>
    )
}

export default EventSignUpDetails
