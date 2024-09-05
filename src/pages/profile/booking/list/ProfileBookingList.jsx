import lessStyles from './ProfileBookingList.module.less'
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Badge, Button, Flex, Input, Segmented, Space, Tag, Typography} from "antd";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../../utils/Utils.jsx";
import {cx} from "antd-style";
import {e} from "../../../../utils/OrganizationUtils.jsx";
import {useApp} from "../../../../context/AppProvider.jsx";
import mockData from "../../../../mocks/reservation-data.json";
import {AppstoreOutlined, BarsOutlined, FilterOutlined} from "@ant-design/icons";
import DrawerBottom from "../../../../components/drawer/DrawerBottom.jsx";
import {Card, Ellipsis, List, Selector} from "antd-mobile";
import {setPage, toRoute} from "../../../../utils/RouteUtils.jsx";
import {ProfileRouteNames} from "../../../../routes/ProfileRoutes.jsx";
import CardIconLabel from "../../../../components/cardiconlabel/CardIconLabel.jsx";
import {fromLocalStorage, toLocalStorage} from "../../../../storage/AppStorage.jsx";
import {EventRouteNames} from "../../../../routes/EventRoutes.jsx";
import InfiniteScroll from "../../../../components/infinitescroll/InfiniteScroll.jsx";
import appService, {apiRoutes} from "../../../../api/app.jsx";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
import { Collapse } from 'antd-mobile'
import {useTranslation} from "react-i18next";
import * as React from "react";
import FormRangePicker from "../../../../form/formrangepicker/FormRangePicker.jsx";
import {bookingTypes, filterDates} from "../../../../utils/ListUtils.jsx";


const {Search} = Input;
const {Title, Text} = Typography;

function ProfileBookingList() {
    const navigate = useNavigate();
    
    const [isSearchOpened, setIsSearchOpened] = useState(false);
    const {
        setIsFooterVisible,
        setHeaderRightIcons,
        resetFetch,
        isMockData,
        globalStyles,
        setDynamicPages,
        token,
        setFooterContent
    } = useApp();
    const {orgId} = useAuth();
    
    const [bookings, setBookings] = useState([]);
    const [filterData, setFilterData] = useState(null);
    const [isFilterOpened, setIsFilterOpened] = useState(false);
    const [isListDisplay, setIsListDisplay] = useState(equalString(fromLocalStorage('booking-list-format', 'list'), 'list'));
    const [hasMore, setHasMore] = useState(false);
    const [selectedType, setSelectedType] = useState('Upcoming');
    const { t } = useTranslation('');
    
    const loadBookings = (incFilterData, type) => {
        if (isNullOrEmpty(incFilterData)){
            incFilterData = filterData;
        }
        
        console.log(incFilterData)
        
        const filterModel = {
            OrganizationId: orgId,
            OrgMemberIdsString: incFilterData.OrgMemberIds.join(','),
            BookingTypesString: incFilterData.BookingTypes.join(','),
            DatesString: '',
            SkipRows: incFilterData.SkipRows,
            CustomDate_Start: incFilterData.CustomDate_Start,
            CustomDate_End: incFilterData.CustomDate_End,
            IsCancelledView : equalString((type || selectedType), 'Cancelled')
        };

        const postData = {
            ...filterModel,
        };
        
        appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/BookingsApi/ApiLoadBookings?id=${orgId}`, postData).then(r => {
            if (toBoolean(r?.IsValid)){
                const responseData = r.Data;
                console.log(responseData)
                
                setHasMore(responseData.TotalRecords > responseData.SkipRows);
                setBookings(responseData.List);
            }
        })
    }

    const onTypeChange = (type) => {
        setSelectedType(type);
        loadBookings(null, type);
    }
    
    const loadData = (refresh) => {
        if (isMockData) {
            const list = mockData.list.List;
            const totalRecords = mockData.list.TotalRecords;
            const skipRows = mockData.list.SkipRows;

            setHasMore(parseInt(totalRecords) > parseInt(skipRows));
            setBookings(list);
        } else {
           if (!refresh){
               appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/BookingsApi/ApiList?id=${orgId}`).then(r => {
                   if (toBoolean(r?.IsValid)){
                       setFilterData(r.Data);
                       loadBookings(r.Data);
                   }
               })
           } else {
               loadBookings();
           }
        }

        resetFetch();
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
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
                        placeholder={`Search for ${e('Booking')}`}
                        style={{width: 0}}/>
                </div>

                <Segmented
                    defaultValue={!isListDisplay ? 'card' : 'list'}
                    onChange={(e) => {
                        setIsListDisplay(equalString(e, 'list'));
                        toLocalStorage('booking-list-format', e);
                    }}
                    options={[
                        {value: 'list', icon: <BarsOutlined/>},
                        {value: 'card', icon: <AppstoreOutlined/>},
                    ]}
                />

                <Button type="default" icon={<FilterOutlined/>} size={'medium'}
                        onClick={() => setIsFilterOpened(true)}/>

            </Space>
        )

        loadData();
    }, []);

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
                            <Title level={5}
                                   className={cx(globalStyles.cardItemTitle, isUnpaid && globalStyles.urgentcardItemTitle, globalStyles.noBottomPadding)}>
                                <Ellipsis direction='end' content={booking.ReservationTypeName}/>
                            </Title>

                            <Text><small><Ellipsis direction='end' content={booking.Subtitle}/></small></Text>
                        </div>
                    </Flex>

                    <CardIconLabel icon={'calendar-time'} description={booking.ReservationStartDateTime}/>
                    <CardIconLabel icon={'team'} description={booking.ReservationId}/>

                    {!isNullOrEmpty(booking.CourtNamesDisplay) &&
                        <Tag color="default">{booking.CourtNamesDisplay}</Tag>
                    }

                    <Tag color="default">
                        {booking.RegistrantsCount} {!isNullOrEmpty(booking.EventId) ? "Registrant(s)" : "Player(s)"}
                    </Tag>
                </Card>
            )
        }

        return (
            <Card
                className={cx(globalStyles.card, globalStyles.listCardGrid, globalStyles.clickableCard, lessStyles.cardGrid)}
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
            <Segmented options={['Upcoming', 'Cancelled']} onChange={(e) => {onTypeChange(e)}} block style={{margin : `${token.padding}px`, marginBottom: 0 }}/>

            <List className={cx(globalStyles.itemList, !isListDisplay && globalStyles.listCardList)}
                  style={{padding: isListDisplay ? 0 : `${token.padding}px`}}>
                {anyInList(bookings) &&
                    <>
                        {bookings.map((booking, index) => (
                            <List.Item span={12}
                                       key={index}
                                       arrowIcon={false}
                                       onClick={() => {
                                           if (isNullOrEmpty(booking.EventId)) {
                                               let route = toRoute(ProfileRouteNames.RESERVATION_DETAILS, 'id', booking.ReservationId);
                                               setPage(setDynamicPages, booking.ReservationTypeName, route);
                                               navigate(route);
                                           } else {
                                               let route = toRoute(EventRouteNames.EVENT_DETAILS, 'id', booking.ReservationId);
                                               setPage(setDynamicPages, booking.EventName, route);
                                               navigate(route);
                                           }
                                       }}>
                                {toBoolean(booking.IsUnpaid) ? (
                                    <Badge.Ribbon text={t('unpaid')} color={'orange'} className={globalStyles.urgentRibbon}>
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

            <DrawerBottom showDrawer={isFilterOpened}
                          closeDrawer={() => setIsFilterOpened(false)}
                          showButton={true}
                          maxHeightVh={80}
                          confirmButtonText={t('filter')}
                          label={t('filter')}
                          onConfirmButtonClick={() => {
                              setIsFilterOpened(false);
                          }}>
                <PaddingBlock leftRight={false}>
                    <Collapse defaultActiveKey={['family', 'entity', 'dates']} className={globalStyles.collapse}>
                        <Collapse.Panel key='family' title={t('profile.myFamily')}>
                            <Selector
                                options={[
                                    {
                                        label: 'Mike',
                                        value: '1',
                                    },
                                    {
                                        label: 'Olla',
                                        value: '2',
                                    },
                                    {
                                        label: 'Jason',
                                        value: '3',
                                    },
                                ]}
                                defaultValue={['1', '2', '3']}
                                multiple
                                onChange={(arr, extend) => console.log(arr, extend.items)}
                            />
                        </Collapse.Panel>
                        <Collapse.Panel key='entity' title={t('profile.entityType')}>
                            <Selector
                                options={bookingTypes.map(item => ({
                                    label: e(t(item.Text)),
                                    value: `${item.Value}`,
                                }))}
                                defaultValue={['1', '2', '3', '4', '5']}
                                multiple
                                onChange={(arr, extend) => console.log(arr, extend.items)}
                            />
                        </Collapse.Panel>
                        <Collapse.Panel key='dates' title={t('profile.date')}>
                            <Selector
                                options={filterDates.map(item => ({
                                    label: t(item.Text),
                                    value: `${item.Value}`,
                                }))}
                                defaultValue={['1']}
                                onChange={(arr, extend) => console.log(arr, extend.items)}
                            />

                            <FormRangePicker />
                        </Collapse.Panel>
                    </Collapse>
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default ProfileBookingList
