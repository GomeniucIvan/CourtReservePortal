import * as React from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {Card, Ellipsis, List} from 'antd-mobile'
import {
    anyInList,
    encodeParamsObject,
    equalString,
    generateHash,
    isNullOrEmpty,
    nullToEmpty,
    toBoolean
} from "@/utils/Utils.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {Segmented, Space, Flex, Typography, Progress} from "antd";
import {BarsOutlined, AppstoreOutlined} from "@ant-design/icons";
import {cx} from "antd-style";
import {fromLocalStorage, getNavigationStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import SVG from "@/components/svg/SVG.jsx";
import InfiniteScroll from "@/components/infinitescroll/InfiniteScroll.jsx";
import HeaderSearch from "@/components/header/HeaderSearch.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import ListFilter from "@/components/filter/ListFilter.jsx";
import HeaderFilter from "@/components/header/HeaderFilter.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useFormik} from "formik";
import {listFilter} from "@/utils/ListUtils.jsx";
import {fromDateTimeStringToDate, fromTimeSpanString} from "@/utils/DateUtils.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {eReplace} from "@/utils/TranslateUtils.jsx";

const {Title, Text} = Typography;

function LeagueList({filter}) {
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const {
        isMockData,
        setIsFooterVisible,
        setDynamicPages,
        globalStyles,
        token,
        shouldFetch,
        resetFetch
    } = useApp();

    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loadedEvents, setLoadedEvents] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isListDisplay, setIsListDisplay] = useState(equalString(fromLocalStorage('league-list', 'list'), 'list'));
    const [showFilter, setShowFilter] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const {orgId, authData} = useAuth();
    const [eventData, setEventData] = useState(null);
    const [filteredCount, setFilteredCount] = useState(0);
    const { filterKey } = useParams();

    const formik = useFormik({
        initialValues: {
            DrawerFilterKey: '',

            DrawerFilter: {
                MinPrice: null,
                MaxPrice: null,
                SessionIds: [],
                InstructorIds: [],
                EventTypeIds: [],
                TimeOfDay: null,
                DayOfWeeks: [],
                Dates: null,
                FilterText: null,
                CustomDate_Start: null,
                CustomDate_End: null ,
                FilterTimeOfADayStart: null,
                FilterTimeOfADayEnd: null,
                EventRegistrationTypeId: null,
                EventTagIds: [],
                HideIneligibleAndFullEvents: false,
                EventSortBy: 1,
            }
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        },
    });

    const loadEvents = async (incData, searchText) => {
        let readValues = incData || formik?.values?.DrawerFilter || {};
        setIsFetching(true);

        let postData = {
            ...listFilter(readValues),
            FilterText: searchText,
            EmbedCodeId: null,
            Filter: toBoolean(filterKey) ? filterKey : null,
            preventCookieSave: true,
            FilterPublicKey: '',
            CostTypeId: authData?.CostTypeId,
            SkipRows: 0,
        };

        let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/Leagues/LoadLeagues?id=${orgId}`, postData);
        console.log(response);
        if (toBoolean(response?.IsValid)){
            setEvents(response.Data)
            //setHasMore(response.Data.TotalRecords > response.Data.length)
        }

        setIsFetching(false);
    }

    //filter change
    useEffect(() => {
        if (!isNullOrEmpty(showFilter)) {
            const onFilterChange = async (isOpen) => {
                if (!isNullOrEmpty(formik?.values)){
                    if (isOpen) {
                        formik.setFieldValue("DrawerFilterKey", await generateHash(formik.values.DrawerFilter));
                    } else {

                        let previousHash = formik.values.DrawerFilterKey;
                        let currentHash = await generateHash(formik.values.DrawerFilter);

                        if (!equalString(currentHash, previousHash)) {
                            loadEvents(null);
                        }
                    }
                }
            }

            onFilterChange(showFilter)
        }
    }, [showFilter])

    //header search change
    useEffect(() => {
        //force initial null check
        if (searchText != null) {
            const onFilterTextChange = async () => {
                loadEvents(null, searchText);
            }
            onFilterTextChange()
        }
    }, [searchText])

    const loadData = async (refresh) => {
        setIsFetching(true);

        let postModel = {
            filter: nullToEmpty(filterKey),
        }

        let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/Leagues/List?id=${orgId}&${encodeParamsObject(postModel)}`);

        if (toBoolean(response?.IsValid)) {
            let filterData = {
                ...response.Data,
                CustomDate_Start: fromDateTimeStringToDate(response.Data.CustomDate_StartStringDisplay),
                CustomDate_End: fromDateTimeStringToDate(response.Data.CustomDate_EndStringDisplay),
                FilterTimeOfADayStart: response.Data.FilterTimeOfADayStartStringDisplay,
                FilterTimeOfADayEnd: response.Data.FilterTimeOfADayEndStringDisplay,
            }

            setEventData(filterData);
            await loadEvents(filterData);
        }

        setIsFetching(false);
        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setIsFooterVisible(true);
        loadData();
    }, []);

    useEffect(() => {
        setHeaderRightIcons(
            <Space className={globalStyles.headerRightActions}>
                <HeaderSearch setText={setSearchText}/>

                <Segmented
                    defaultValue={!isListDisplay ? 'card' : 'list'}
                    onChange={(e) => {
                        setIsListDisplay(equalString(e, 'list'));
                        toLocalStorage('league-list', e);
                    }}
                    options={[
                        {value: 'list', icon: <BarsOutlined/>},
                        {value: 'card', icon: <AppstoreOutlined/>},
                    ]}
                />

                <HeaderFilter count={filteredCount} onClick={() => setShowFilter(true)} />
            </Space>
        )
    }, [filteredCount])

    const loadMore = async () => {

    }

    return (
        <>
            {(!isFetching && !anyInList(events)) &&
                <PaddingBlock topBottom={true}>
                    <EmptyBlock description={eReplace('No leagues found')} removePadding={true} />
                </PaddingBlock>
            }

            <List className={cx(globalStyles.itemList, !isListDisplay && globalStyles.listCardList)}
                  style={{padding: isListDisplay ? 0 : `${token.padding}px`}}>
                <>
                    {isFetching &&
                        <>
                            {isListDisplay ? (
                                <PaddingBlock topBottom={true}>
                                    <Flex vertical={true} gap={token.padding}>
                                        <CardSkeleton count={8} type={SkeletonEnum.RESERVATION}/>
                                    </Flex>
                                </PaddingBlock>
                            ) : (
                                <CardSkeleton count={12} type={SkeletonEnum.RESERVATION}/>
                            )}
                        </>
                    }

                    {(!isFetching && anyInList(events)) &&
                        <>
                            {events.map((item, index) => (
                                <List.Item span={12}
                                           key={index}
                                           arrowIcon={false}
                                           onClick={() => {
                                               let route = toRoute(EventRouteNames.EVENT_DETAILS, 'id', item.OrganizationId);
                                               route = toRoute(route, 'number', item.NextReservationNumber);
                                               route = `${route}?resId=${item.NextReservationId}`;
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
                                                        <Title level={1}
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

                                                <CardIconLabel icon={'team'} description={item.SlotsInfo}/>
                                            </Card>
                                        ) :
                                        (
                                            <Card
                                                className={cx(globalStyles.card, globalStyles.listCardGrid, globalStyles.clickableCard)}
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
                    }
                </>
            </List>

            {(!isFetching && 1 == 2) &&
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
            }
            <ListFilter formik={formik}
                        show={showFilter}
                        data={eventData}
                        page={'league-list'}
                        onClose={() => {setShowFilter(false)}}
                        setFilteredCount={setFilteredCount}
                        showDates={true} 
                        showTimeOfADay={true}
                        showEventRegistrationType={false}
                        showDayOfTheWeek={true} />
        </>
    )
}

export default LeagueList
