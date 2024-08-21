import styles from './EventList.module.less'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import mockData from "../../../mocks/event-data.json";
import {useApp} from "../../../context/AppProvider.jsx";
import { InfiniteScroll, List } from 'antd-mobile'
import {anyInList, equalString, toBoolean} from "../../../utils/Utils.jsx";
import {setPage, toRoute} from "../../../utils/RouteUtils.jsx";
import {EventRouteNames} from "../../../routes/EventRoutes.jsx";
import {Button, Segmented, Space, Input} from "antd";
import {BarsOutlined, AppstoreOutlined, FilterOutlined, SearchOutlined} from "@ant-design/icons";
import {t} from "../../../utils/OrganizationUtils.jsx";
import {cx} from "antd-style";
import {fromLocalStorage, toLocalStorage} from "../../../storage/AppStorage.jsx";
const { Search } = Input;

function EventList() {
    const{isMockData, setIsFooterVisible, setDynamicPages, setHeaderRightIcons, globalStyles} = useApp();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loadedEvents, setLoadedEvents] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isSearchOpened, setIsSearchOpened] = useState(false);
    const [displayFormatStyle, setDisplayFormatStyle] = useState(fromLocalStorage('event-list-format', 'list'))
    const [isSearchLoading, setIsSearchLoading] = useState();

    useEffect(() => {

    }, [])

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(
            <Space className={globalStyles.headerRightActions}>
                {/*//onSearch={onSearch}*/}
                <div onClick={() =>{
                    if (!toBoolean(isSearchOpened)) {
                        setIsSearchOpened(true);
                    }
                }}>
                    <Search rootClassName={cx(globalStyles.headerSearch, isSearchOpened && globalStyles.headerSearchOpened )}
                            placeholder={`Search for ${t('Event(s)')}`}
                            style={{ width: 0 }} />
                </div>


                <Segmented
                    defaultValue={displayFormatStyle}
                    onChange={(e) => {
                        setDisplayFormatStyle(e);
                        toLocalStorage('event-list-format', e);
                    }}
                    options={[
                        { value: 'list', icon: <BarsOutlined /> },
                        { value: 'card', icon: <AppstoreOutlined /> },
                    ]}
                />

                <Button type="default" icon={<FilterOutlined />} size={'medium'} />
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
        if (isMockData){
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
        } else{
            alert('todo eve list')
        }
    }

    return (
        <>
            {anyInList(events) &&
                <>
                    <List className={globalStyles.itemList}>
                        {events.map((item, index) => (
                            <List.Item key={index} arrowIcon={false} onClick={() => {
                                let route = toRoute(EventRouteNames.EVENT_DETAILS, 'id', item.EventId);
                                setPage(setDynamicPages, item.EventName, route);
                                navigate(route);
                            }}>
                                {equalString(displayFormatStyle, 'list') ?
                                    (
                                        <>
                                            {item.EventName}
                                        </>
                                    ):
                                    (
                                        <>
                                            test {item.EventName}
                                        </>
                                    )
                                }
                            </List.Item>
                        ))}
                    </List>
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                </>
            }
        </>
    )
}

export default EventList
