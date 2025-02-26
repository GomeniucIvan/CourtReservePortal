import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Badge, Button, Flex, Input, Segmented, Space, Tag, Typography} from "antd";
import {anyInList, containsString, equalString, generateHash, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {cx} from "antd-style";
import {e} from "@/utils/TranslateUtils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/reservation-data.json";
import {AppstoreOutlined, BarsOutlined, FilterOutlined} from "@ant-design/icons";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import {Card, Ellipsis, List, Selector} from "antd-mobile";
import {getQueryParameter, setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {fromLocalStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import InfiniteScroll from "@/components/infinitescroll/InfiniteScroll.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Collapse} from 'antd-mobile'
import {useTranslation} from "react-i18next";
import * as React from "react";
import FormRangePicker from "@/form/formrangepicker/FormRangePicker.jsx";
import {bookingTypes, filterDates} from "@/utils/SelectUtils.jsx";
import HeaderSearch from "@/components/header/HeaderSearch.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useFormik} from "formik";
import ListFilter from "@/components/filter/ListFilter.jsx";
import HeaderFilter from "@/components/header/HeaderFilter.jsx";
import {fromDateTimeStringToDate} from "@/utils/DateUtils.jsx";

const {Title, Text} = Typography;

function ProfileBookingList() {
    const navigate = useNavigate();
    const {setHeaderRightIcons} = useHeader();
    
    const {
        setIsFooterVisible,
        resetFetch,
        globalStyles,
        setDynamicPages,
        token,
        setFooterContent
    } = useApp();
    const {orgId} = useAuth();

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState(null);
    const [searchText, setSearchText] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [showFilter, setShowFilter] = useState(null);
    const [isListDisplay, setIsListDisplay] = useState(equalString(fromLocalStorage('booking-list-format', 'list'), 'list'));
    const [hasMore, setHasMore] = useState(false);
    const [selectedType, setSelectedType] = useState('Upcoming');
    const [isFetching, setIsFetching] = useState(true);
    const [filteredCount, setFilteredCount] = useState(0);
    const {t} = useTranslation('');
    
    const location = useLocation();
    const typeParam = getQueryParameter(location, "type");

    const formik = useFormik({
        initialValues: {
            DrawerFilterKey: '',

            DrawerFilter: {
                OrgMemberIds: [],
                BookingTypes: [],
                Dates: [],
                CustomDate_Start: '',
                CustomDate_End: '',
            }
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        },
        
    });
    
    const loadBookings = async (incFilterData, type, skip) => {
        let readValues = incFilterData || formik?.values?.DrawerFilter || {};
        setIsFetching(true);
        
        const filterModel = {
            OrganizationId: orgId,
            OrgMemberIdsString: readValues.OrgMemberIds.join(','),
            BookingTypesString: readValues.BookingTypes.join(','),
            DatesString: '',
            SkipRows: skip || readValues.SkipRows,
            CustomDate_Start: readValues.CustomDate_Start,
            CustomDate_End: readValues.CustomDate_End,
            IsCancelledView: equalString((type || selectedType), 'Cancelled')
        };

        const postData = {
            ...filterModel,
        };

        let response = await appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/BookingsApi/ApiLoadBookings?id=${orgId}`, postData);

        if (toBoolean(response?.IsValid)) {
            const responseData = response.Data;

            setHasMore(responseData.TotalRecords > responseData.SkipRows);
            setBookings(responseData.List);
            setFilteredBookings(responseData.List);
            setIsFetching(false);
        }
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
                            loadBookings();
                        }
                    }
                }
            }

            onFilterChange(showFilter)
        }
    }, [showFilter])
    
    const onTypeChange = (type) => {
        setIsFetching(true);
        setSelectedType(type);
        loadBookings(null, type);
    }

    const loadData = async (refresh) => {
        if (!refresh) {
            let response = await appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/BookingsApi/ApiList?id=${orgId}&type=${typeParam}`);

            if (toBoolean(response?.IsValid)) {
                let data = response.Data;

                let filterData = {
                    ...data,
                    CustomDate_Start: fromDateTimeStringToDate(data.CustomDate_StartStringDisplay),
                    CustomDate_End: fromDateTimeStringToDate(data.CustomDate_EndStringDisplay),
                }
                setFilterData(filterData);
                loadBookings(filterData);

                await formik.setFieldValue('DrawerFilter.CustomDate_Start', fromDateTimeStringToDate(data.CustomDate_StartStringDisplay))
                await formik.setFieldValue('DrawerFilter.CustomDate_End', fromDateTimeStringToDate(data.CustomDate_EndStringDisplay))
            }
        } else {
            loadBookings();
        }

        resetFetch();
    }

    useEffect(() => {
        if (!isNullOrEmpty(searchText)) {
            const results = bookings.filter((booking) => {
                return containsString(booking.ReservationTypeName, searchText) ||
                    containsString(booking.EventCategoryName, searchText) ||
                    containsString(booking.TypeName, searchText) ||
                    containsString(booking.EventName, searchText)
            });

            setFilteredBookings(results);
        } else {
            setFilteredBookings(bookings);
        }
    }, [searchText]);

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
        loadData();
    }, []);

    useEffect(() => {
        setHeaderRightIcons(
            <Space className={globalStyles.headerRightActions}>
                {/*<HeaderSearch setText={setSearchText}/>*/}

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

                <HeaderFilter count={filteredCount} onClick={() => setShowFilter(true)} />
            </Space>
        )
    }, [filteredCount])
    
    const bookingTemplate = (booking, isUnpaid) => {
        if (isListDisplay) {
            return (
                <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                      onClick={() => {
                          let route = toRoute(ProfileRouteNames.RESERVATION_DETAILS, 'id', booking.ReservationId);
                          setPage(setDynamicPages, booking.Title, route);
                          navigate(route);
                      }}>
                    <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                        <div className={globalStyles?.cardIconBlock}>
                            <i className={globalStyles.entityTypeCircleIcon}
                               style={{backgroundColor: booking.TypeBackgroundColor}}></i>
                        </div>

                        <div>
                            <Title level={1}
                                   className={cx(globalStyles.cardItemTitle, isUnpaid && globalStyles.urgentcardItemTitle, globalStyles.noBottomPadding)}>
                                <Ellipsis direction='end' content={booking.ReservationTypeName}/>
                            </Title>

                            <Text><small><Ellipsis direction='end' content={booking.Subtitle}/></small></Text>
                        </div>
                    </Flex>

                    <CardIconLabel icon={'calendar-time'} description={booking.ReservationStartDateTime}/>
                    <CardIconLabel icon={'team'} description={booking.ReservationId}/>

                    {!isNullOrEmpty(booking.CourtNamesDisplay) &&
                        <Tag color="default" className={globalStyles.tag}>{booking.CourtNamesDisplay}</Tag>
                    }

                    <Tag color="default" className={globalStyles.tag}>
                        {booking.RegistrantsCount} {!isNullOrEmpty(booking.EventId) ? "Registrant(s)" : "Player(s)"}
                    </Tag>
                </Card>
            )
        }

        return (
            <Card
                className={cx(globalStyles.card, globalStyles.listCardGrid, globalStyles.clickableCard, globalStyles.listCardGrid)}
                style={{borderColor: booking.TypeBackgroundColor}}>
                <div className={globalStyles.listBgColor}
                     style={{backgroundColor: booking.TypeBackgroundColor}}></div>
                <Text>
                    <Ellipsis direction='end'
                              rows={2}
                              content={booking.ReservationTypeName}/>
                </Text>
                <Text>
                    <small>
                        <Ellipsis direction='end'
                                  rows={2}
                                  content={booking.ReservationTypeName}/>
                    </small>
                </Text>
            </Card>
        )
    }

    const loadMore = async () => {

    }

    return (
        <>
            <Segmented options={[
                           { value: 'Upcoming', label: t('booking.upcoming') },
                           { value: 'Cancelled', label: t('booking.cancelled') },
                       ]}
                       onChange={(e) => {
                onTypeChange(e)
            }} block style={{margin: `${token.padding}px`, marginBottom: 0}}/>

            <List className={cx(globalStyles.itemList, !isListDisplay && globalStyles.listCardList)}
                  style={{padding: isListDisplay ? 0 : `${token.padding}px`}}>
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
                
                {(!isFetching && anyInList(filteredBookings)) &&
                    <>
                        {filteredBookings.map((booking, index) => (
                            <List.Item span={12}
                                       key={index}
                                       arrowIcon={false}
                                       onClick={() => {
                                           if (isNullOrEmpty(booking.EventId)) {
                                               let route = toRoute(ProfileRouteNames.RESERVATION_DETAILS, 'id', booking.ReservationId);
                                               setPage(setDynamicPages, booking.ReservationTypeName, route);
                                               navigate(route);
                                           } else {
                                               let route = toRoute(EventRouteNames.EVENT_DETAILS, 'id', orgId);
                                               route = toRoute(route, 'number', booking.Number);
                                               route = `${route}?resId=${booking.ReservationId}`;
                                               setPage(setDynamicPages, booking.EventName, route);
                                               navigate(route);
                                           }
                                       }}>
                                {toBoolean(booking.IsUnpaid) ? (
                                    <Badge.Ribbon text={t('unpaid')} color={'orange'}
                                                  className={globalStyles.urgentRibbon}>
                                        {bookingTemplate(booking, true)}
                                    </Badge.Ribbon>
                                ) : (
                                    <>{bookingTemplate(booking)}</>
                                )}
                            </List.Item>
                        ))}
                    </>
                }
            </List>
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>

            <ListFilter formik={formik}
                        show={showFilter}
                        data={filterData}
                        page={'my-booking-list'}
                        onClose={() => {setShowFilter(false)}}
                        setFilteredCount={setFilteredCount}
                        showDates={true}
                        showTimeOfADay={false}
                        showEventRegistrationType={false}
                        showDayOfTheWeek={false} />
        </>
    )
}

export default ProfileBookingList
