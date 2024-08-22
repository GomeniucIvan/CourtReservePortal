import styles from './EventList.module.less'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import mockData from "../../../mocks/event-data.json";
import {useApp} from "../../../context/AppProvider.jsx";
import {Card, Ellipsis, List} from 'antd-mobile'
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {setPage, toRoute} from "../../../utils/RouteUtils.jsx";
import {EventRouteNames} from "../../../routes/EventRoutes.jsx";
import {Button, Segmented, Space, Input, Flex, Typography, Progress, Row, Col} from "antd";
import {BarsOutlined, AppstoreOutlined, FilterOutlined} from "@ant-design/icons";
import {t} from "../../../utils/OrganizationUtils.jsx";
import {cx} from "antd-style";
import {fromLocalStorage, toLocalStorage} from "../../../storage/AppStorage.jsx";
import CardIconLabel from "../../../components/cardiconlabel/CardIconLabel.jsx";
import SVG from "../../../components/svg/SVG.jsx";
import InfiniteScroll from "../../../components/infinitescroll/InfiniteScroll.jsx";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";

const {Search} = Input;
const {Title, Text} = Typography;

function EventList() {
    const {isMockData, setIsFooterVisible, setDynamicPages, setHeaderRightIcons, globalStyles, token} = useApp();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loadedEvents, setLoadedEvents] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isSearchOpened, setIsSearchOpened] = useState(false);
    const [isListDisplay, setIsListDisplay] = useState(equalString(fromLocalStorage('event-list-format', 'list'), 'list'));
    const [isFilterOpened, setIsFilterOpened] = useState(false);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(
            <Space className={globalStyles.headerRightActions}>
                {/*//onSearch={onSearch}*/}
                <div onClick={() => {
                    if (!toBoolean(isSearchOpened)) {
                        setIsSearchOpened(true);
                    }
                }}>
                    <Search
                        rootClassName={cx(globalStyles.headerSearch, isSearchOpened && globalStyles.headerSearchOpened)}
                        placeholder={`Search for ${t('Event(s)')}`}
                        style={{width: 0}}/>
                </div>

                <Segmented
                    defaultValue={!isListDisplay ? 'card' : 'list'}
                    onChange={(e) => {
                        setIsListDisplay(equalString(e, 'list'));
                        toLocalStorage('event-list-format', e);
                    }}
                    options={[
                        {value: 'list', icon: <BarsOutlined/>},
                        {value: 'card', icon: <AppstoreOutlined/>},
                    ]}
                />

                <Button type="default" icon={<FilterOutlined/>} size={'medium'} onClick={() => setIsFilterOpened(true)}/>
            </Space>
        )
        if (isMockData) {
            const list = mockData.list.List;
            setEvents(list.slice(0, 20));
            setLoadedEvents(list);
        } else {
            alert('todo eve list')
        }
    }, []);

    const loadMore = async () => {
        if (isMockData) {
            if (events.length >= loadedEvents.length) {
                setHasMore(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1500));

            const nextEvents = loadedEvents.slice(events.length, events.length + 20);
            setEvents(prevEvents => [...prevEvents, ...nextEvents]);

            if (events.length + nextEvents.length >= loadedEvents.length) {
                setHasMore(false); // No more events to load after this batch
            }
        } else {
            alert('todo eve list')
        }
    }

    return (
        <>
            {anyInList(events) &&
                <>
                    <List className={cx(globalStyles.itemList, !isListDisplay && globalStyles.listCardList)}
                          style={{padding: isListDisplay ? 0 : `${token.padding}px`}}>
                        <>
                            {events.map((item, index) => (
                                <List.Item span={12}
                                           key={index}
                                           arrowIcon={false}
                                           onClick={() => {
                                               let route = toRoute(EventRouteNames.EVENT_DETAILS, 'id', item.EventId);
                                               setPage(setDynamicPages, item.EventName, route);
                                               navigate(route);
                                           }}>
                                    {isListDisplay ?
                                        (
                                            <Card className={cx(globalStyles.card, globalStyles.clickableCard)}>
                                                <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                                    <div className={globalStyles?.cardIconBlock}>
                                                        <i className={globalStyles.entityTypeCircleIcon}
                                                           style={{backgroundColor: item.CategoryBackgroundColor}}></i>
                                                    </div>

                                                    <div>
                                                        <Title level={5}
                                                               className={cx(globalStyles.cardItemTitle, globalStyles.noBottomPadding)}>
                                                            <Ellipsis direction='end' content={item.EventName}/>
                                                        </Title>

                                                        <Text>
                                                            <small>
                                                                <Ellipsis direction='end'
                                                                          content={item.CategoryName}/>
                                                            </small>
                                                        </Text>
                                                    </div>
                                                </Flex>

                                                <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                                    <div className={globalStyles?.cardIconBlock}>
                                                        <SVG icon={'calendar-time'} color={token.colorPrimary}/>
                                                    </div>

                                                    <div>
                                                        <Text>Thu, Aug 22nd - Sat, Aug
                                                            24th {isNullOrEmpty(item.TotalUpcomingDatesCount) ? '' :
                                                                <strong>({item.TotalUpcomingDatesCount} dates)</strong>}</Text>
                                                        <Text style={{display: 'block'}}>10a - 10:30a</Text>
                                                    </div>
                                                </Flex>

                                                <Progress percent={90} status="active"
                                                          strokeColor={{from: token.colorPrimary, to: 'red'}}/>

                                                <CardIconLabel icon={'team'} description={item.SlotsInfo}/>
                                            </Card>
                                        ) :
                                        (
                                            <Card
                                                className={cx(globalStyles.card, globalStyles.listCard, globalStyles.clickableCard)}
                                                style={{borderColor: item.CategoryBackgroundColor}}>
                                                <div className={globalStyles.listBgColor}
                                                     style={{backgroundColor: item.CategoryBackgroundColor}}></div>
                                                <Text>
                                                    <Ellipsis direction='end'
                                                              rows={2}
                                                              content={item.EventName}/>
                                                </Text>
                                                <Text>
                                                    <small>
                                                        <Ellipsis direction='end'
                                                                  rows={2}
                                                                  content={item.EventName}/>
                                                    </small>
                                                </Text>
                                            </Card>
                                        )
                                    }
                                </List.Item>
                            ))}
                        </>
                    </List>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>

                    <DrawerBottom showDrawer={isFilterOpened}
                                  closeDrawer={() => setIsFilterOpened(false)}
                                  showButton={true}
                                  confirmButtonText={'Filter'}
                                  label='Filter'
                                  onConfirmButtonClick={() => {
                                      setIsFilterOpened(false);
                                  }}>
                        <div>test</div>
                    </DrawerBottom>
                </>
            }
        </>
    )
}

export default EventList
