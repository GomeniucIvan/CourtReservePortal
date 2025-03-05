import {useApp} from "@/context/AppProvider.jsx";
import React from "react";
import {Flex, Tag, Typography} from "antd";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";

const {Title, Text} = Typography;

function EventDetailsPartial({registration, event, page = 'details'}) {
    let {token,
        globalStyles
    } = useApp();

    return (
        <>
            {anyInList(event?.EventTags) &&
                <Flex gap={token.padding/2}>
                    {event.EventTags.map(eventTag => (
                        <Tag color={eventTag.TextColor} key={eventTag.EventTagId} style={{ backgroundColor: eventTag.BackgroundColor }} className={globalStyles.tag}>{eventTag.Name}</Tag>
                    ))}
                </Flex>
            }
            
            <div style={{marginBottom: `${token.padding}px`}}>
                <Title level={3} style={{marginBottom: 0}}>
                    {event?.EventName}

                    {toBoolean(event?.IsFeatured) &&
                        <Tag color="default" className={globalStyles.tag}>Featured</Tag>
                    }
                </Title>
                <Text type="secondary">{event?.EventType}</Text>
            </div>

            <Flex vertical gap={4}>
                {!isNullOrEmpty(registration?.CalendarDate) &&
                    <CardIconLabel icon={'calendar'} description={registration?.CalendarDate}/>
                }

                {!isNullOrEmpty(registration?.CalendarDates) &&
                    <CardIconLabel icon={'dates'} description={registration?.CalendarDates}/>
                }

                {!isNullOrEmpty(registration?.Clock) &&
                    <CardIconLabel icon={'clock'} description={registration?.Clock}/>
                }

                {!isNullOrEmpty(registration?.FullPriceData) &&
                    <CardIconLabel icon={'price-tag'} description={registration?.FullPriceData}/>
                }

                {!isNullOrEmpty(registration?.SinglePriceData) &&
                    <CardIconLabel icon={'price-tag'} description={registration?.SinglePriceData}/>
                }

                {!isNullOrEmpty(registration?.SignUpNoDropInMessage) &&
                    <CardIconLabel icon={'alert'} description={registration?.SignUpNoDropInMessage}/>
                }

                {!isNullOrEmpty(registration?.SignUpDropInMessage) &&
                    <CardIconLabel icon={'alert'} description={registration?.SignUpDropInMessage}/>
                }

                {!isNullOrEmpty(registration?.SlotsInfo) &&
                    <CardIconLabel icon={'alert'} description={registration?.SlotsInfo}/>
                }

                {!isNullOrEmpty(event?.DisplayRequiredParticipant) &&
                    <CardIconLabel icon={'hourglass'} description={event?.DisplayRequiredParticipant}/>
                }

                {(toBoolean(event?.DisplayOrganizersOnMemberPortal) &&
                        toBoolean(event?.DisplayOrganizersOnPublicCalendars) &&
                        !isNullOrEmpty(event?.OrganizersDisplay)) &&
                    <CardIconLabel icon={'instructor'} description={event?.OrganizersDisplay}/>
                }
                {!isNullOrEmpty(event?.PinCode) &&
                    <CardIconLabel icon={'event-pincode'} description={event?.PinCode}/>
                }
                {(!isNullOrEmpty(event?.Courts) && !toBoolean(event?.IsCourtAssignmentHiddenOnPortal)) &&
                    <CardIconLabel icon={'event-courts'} description={event?.Courts}/>
                }

                {anyInList(event?.EventUdfs) &&
                    <>
                        {event.EventUdfs
                            .filter((udf) => !isNullOrEmpty(udf.Val))
                            .map((udf, index) => (
                                <CardIconLabel icon={'event-courts'}
                                               description={`<strong>${udf.Name}</strong> ${udf?.Val}`}/>
                            ))}
                    </>
                }

                {anyInList(event?.MemberGroups) && (
                    <CardIconLabel icon={'member-group'}
                                   description={event.MemberGroups.map((group) => group.Name).join(", ")}/>
                )}
                {!isNullOrEmpty(event?.EventNote) &&
                    <CardIconLabel icon={'note'} description={event?.EventNote}/>
                }
            </Flex>
        </>
    )
}

export default EventDetailsPartial
