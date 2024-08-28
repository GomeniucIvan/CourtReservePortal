import styles from './EventDetails.module.less'
import {useNavigate, useParams} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {useEffect, useState} from "react";
import mockData from "../../../mocks/event-data.json";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, Tabs, Typography} from "antd";
import CardIconLabel from "../../../components/cardiconlabel/CardIconLabel.jsx";
import InlineBlock from "../../../components/inlineblock/InlineBlock.jsx";
import {ProfileRouteNames} from "../../../routes/ProfileRoutes.jsx";
import {EventRouteNames} from "../../../routes/EventRoutes.jsx";
import {cx} from "antd-style";
import {setPage, toRoute} from "../../../utils/RouteUtils.jsx";

const {Title, Text} = Typography;

function EventDetails() {
    const navigate = useNavigate();
    let {id} = useParams();
    const [event, setEvent] = useState(null);

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
            alert('todo home index')
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
            <PaddingBlock>
                <div style={{marginBottom: `${token.padding}px`}}>
                    <Title level={4} style={{marginBottom: 0}}>
                        {event?.EventName}
                    </Title>
                    <Text type="secondary">{event?.EventType}</Text>
                </div>

                <Flex vertical gap={4}>
                    <CardIconLabel icon={'calendar'} description={event?.DisplayFirstAndLastDates}/>
                    <CardIconLabel icon={'clock'} description={event?.OccurrenceTimesDisplay}/>
                    <CardIconLabel icon={'price-tag'} description={event?.CostDisplay}/>
                </Flex>

                <PaddingBlock topBottom={true} leftRight={false}>
                    <InlineBlock>
                        <Button type="primary"
                                danger
                                block
                                ghost
                                htmlType={'button'}
                                onClick={() => {

                                }}>
                            Withdraw
                        </Button>

                        <Button type="primary"
                                block
                                htmlType={'button'}>
                            Edit
                        </Button>
                    </InlineBlock>
                </PaddingBlock>

                <div>
                    <Button onClick={() => {
                        let route = toRoute(EventRouteNames.EVENT_SIGNUP, 'id', event?.ReservationId);
                        setPage(setDynamicPages, event?.EventName, route);
                        navigate(route);
                    }}>
                        SIGNUP
                    </Button>
                </div>
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
    )
}

export default EventDetails
