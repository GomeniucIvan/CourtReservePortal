import {useNavigate, useParams} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import React, {useEffect, useState} from "react";
import mockData from "../../../mocks/event-data.json";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, Skeleton, Tabs, Tag, Typography} from "antd";
import CardIconLabel from "../../../components/cardiconlabel/CardIconLabel.jsx";
import InlineBlock from "../../../components/inlineblock/InlineBlock.jsx";
import {useStyles} from '../../../assets/buttonStyles.jsx';
import {cx} from "antd-style";
import {setPage, toRoute} from "../../../utils/RouteUtils.jsx";
import appService, {apiRoutes} from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";

const {Title, Text} = Typography;

function EventDetails() {
    const navigate = useNavigate();
    let {number} = useParams();
    const [event, setEvent] = useState(null);
    const [registration, setRegistration] = useState(null);
    const {orgId, authData} = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [buttonsCount, setButtonsCount] = useState(0);
    const buttonStyles = useStyles().styles;
    
    let {
        setIsFooterVisible,
        setHeaderRightIcons,
        isMockData,
        shouldFetch, 
        resetFetch,
        setFooterContent,
        token,
        globalStyles,
        setDynamicPages
    } = useApp();

    const loadData = async (refresh) => {
        if (isMockData) {
            const details = mockData.details;
            setEvent(details);
        } else {
            setIsFetching(true);
            let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/ApiDetails?id=${orgId}&number=${number}&memberId=${authData?.MemberId}`);
            if (response.IsValid){
                const data = response.Data;
                const registrationData = data.RegistrationData;
                setEvent(data.EventData);
                
                setButtonsCount((toBoolean(registrationData.ShowJoinWailistBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowRegisterBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowRegisterForDateBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowRegisterForFullEventBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowRequireUpfrontPaymentBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowPaymentBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowEditRegistrationBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowWithdrawBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowUnsubscribeFromWaitlistBtn) ? 1 : 0) +
                    (toBoolean(registrationData.ShowEditWaitlistBtn) ? 1 : 0)
                )
                
                
                
                setRegistration(registrationData);
                setIsFetching(false);
            }
        }
        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent('');
        loadData();
    }, []);

    const tabContent = (key) => {
        return (
            <PaddingBlock>
                {key}
            </PaddingBlock>
        )
    }

    return (
        <>
            {isFetching &&
                <PaddingBlock>
                    <Flex vertical={true} gap={16}>
                        {emptyArray(15).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button active={true} block style={{height: `40px`}}/>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
            <>
                <PaddingBlock>
                    {anyInList(event?.EventTags) &&
                        <Flex gap={token.padding/2}>
                            {event.EventTags.map(eventTag => (
                                <Tag color={eventTag.TextColor} defaultBg={eventTag.BackgroundColor}>{eventTag.Name}</Tag>
                            ))}
                        </Flex>
                    }
                    
                    <div style={{marginBottom: `${token.padding}px`}}>
                        <Title level={4} style={{marginBottom: 0}}>
                            {event?.EventName}

                            {toBoolean(event?.IsFeatured) &&
                                <Tag color="default">Featured</Tag>
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
                            <CardIconLabel icon={'ban'} description={registration?.SignUpNoDropInMessage}/>
                        }

                        {!isNullOrEmpty(registration?.SignUpDropInMessage) &&
                            <CardIconLabel icon={'ban'} description={registration?.SignUpDropInMessage}/>
                        }
                    </Flex>

                    {buttonsCount > 0 &&
                        <PaddingBlock topBottom={true} leftRight={false}>
                            <InlineBlock vertical={buttonsCount > 2}>
                                {toBoolean(registration?.ShowJoinWailistBtn) &&
                                    <Button type="primary"
                                            block
                                            className={buttonStyles.buttonYellow}
                                            htmlType={'button'}>
                                        Join Waitlist
                                    </Button>
                                }

                                {toBoolean(registration?.ShowRegisterBtn) &&
                                    <Button type="primary"
                                            block
                                            htmlType={'button'}>
                                        Register
                                    </Button>
                                }

                                {toBoolean(registration?.ShowRegisterForDateBtn) &&
                                    <Button type="primary"
                                            block
                                            htmlType={'button'}>
                                        Register for /add date/
                                    </Button>
                                }

                                {toBoolean(registration?.ShowRegisterForFullEventBtn) &&
                                    <Button type="primary"
                                            block
                                            htmlType={'button'}>
                                        Register to Full Event
                                    </Button>
                                }

                                {toBoolean(registration?.ShowPaymentBtn) &&
                                    <Button type="primary"
                                            block
                                            className={buttonStyles.buttonBlue}
                                            htmlType={'button'}>
                                        Pay
                                    </Button>
                                }

                                {toBoolean(registration?.ShowRequireUpfrontPaymentBtn) &&
                                    <Button type="primary"
                                            block
                                            className={buttonStyles.buttonBlue}
                                            htmlType={'button'}>
                                        Pay
                                    </Button>
                                }


                                {toBoolean(registration?.ShowWithdrawBtn) &&
                                    <Button type="primary"
                                            danger
                                            block
                                            ghost
                                            htmlType={'button'}>
                                        Withdraw
                                    </Button>
                                }

                                {toBoolean(registration?.ShowUnsubscribeFromWaitlistBtn) &&
                                    <Button type="primary"
                                            danger
                                            block
                                            ghost
                                            className={buttonStyles.buttonYellow}
                                            htmlType={'button'}>
                                        Withdraw from Waitlist
                                    </Button>
                                }

                                {toBoolean(registration?.ShowEditWaitlistBtn) &&
                                    <Button type="primary"
                                            block
                                            ghost
                                            className={buttonStyles.buttonYellow}
                                            htmlType={'button'}>
                                        Edit Waitlist
                                    </Button>
                                }
                            </InlineBlock>
                        </PaddingBlock>
                    }
                    
                    {/*<div>*/}
                    {/*    <Button onClick={() => {*/}
                    {/*        let route = toRoute(EventRouteNames.EVENT_SIGNUP, 'id', event?.ReservationId);*/}
                    {/*        setPage(setDynamicPages, event?.EventName, route);*/}
                    {/*        navigate(route);*/}
                    {/*    }}>*/}
                    {/*        SIGNUP*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                </PaddingBlock>

                <Tabs
                    rootClassName={cx(globalStyles.tabs)}
                    defaultActiveKey="1"
                    items={[
                        {
                            label: 'Players (3)',
                            key: 'players',
                            children: tabContent('players')
                        },
                        {
                            label: 'Match Details',
                            key: 'matchdetails',
                            children: tabContent('matchdetails')
                        },
                        {
                            label: 'Misc. Items',
                            key: 'misc',
                            children: tabContent('misc')
                        },
                        {
                            label: 'Additional',
                            key: 'additional',
                            children: tabContent('additional')
                        },
                    ]}
                />
            </>
            }
        </>
    )
}

export default EventDetails
