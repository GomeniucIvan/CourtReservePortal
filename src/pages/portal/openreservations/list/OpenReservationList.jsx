import * as React from "react";
import {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {Card, Flex, Segmented, Skeleton, Space, Typography} from "antd";
import HeaderSearch from "@/components/header/HeaderSearch.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {emptyArray, listFilter} from "@/utils/ListUtils.jsx";
import {
    anyInList,
    equalString,
    generateHash,
    isNullOrEmpty,
    toBoolean
} from "@/utils/Utils.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useNavigate} from "react-router-dom";
const {Title, Text} = Typography;
import {useHeader} from "@/context/HeaderProvider.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {fromLocalStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import {useFormik} from "formik";
import {fromDateTimeStringToDate} from "@/utils/DateUtils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {AppstoreOutlined, BarsOutlined} from "@ant-design/icons";
import HeaderFilter from "@/components/header/HeaderFilter.jsx";
import ListFilter from "@/components/filter/ListFilter.jsx";

function OpenReservationList({}) {
    const [searchText, setSearchText] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [openReservations, setOpenReservations] = useState([]);
    const [data, setData] = useState(null);
    const [isListDisplay, setIsListDisplay] = useState(equalString(fromLocalStorage('open-reservation-list-format', 'list'), 'list'));
    const [filteredCount, setFilteredCount] = useState(0);
    
    const {setHeaderRightIcons} = useHeader();
    const{setIsFooterVisible, shouldFetch, resetFetch, token, setIsLoading, globalStyles, setDynamicPages, setFooterContent} = useApp();
    const {orgId,authData} = useAuth();
    const navigate = useNavigate();

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

    const loadOpenReservations = async (incData, searchText) => {
        let readValues = incData || formik?.values?.DrawerFilter || {};
        setIsFetching(true);

        let postData = {
            ...listFilter(readValues),
            FilterText: searchText,
            EmbedCodeId: null,
            //Filter: toBoolean(filterKey) ? filterKey : null,
            preventCookieSave: true,
            FilterPublicKey: '',
            CostTypeId: authData?.CostTypeId,
            SkipRows: 0,
        };

        let response = await appService.get(navigate, `/app/Online/OpenReservation/LoadReservations?id=${orgId}`, postData);
        if (toBoolean(response?.IsValid)){
            setOpenReservations(response.Data)
            //setHasMore(response.Data.TotalRecords > response.Data.List.length)
        }

        setIsFetching(false);
        setIsLoading(false);
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
                            loadOpenReservations(null);
                        }
                    }
                }
            }

            onFilterChange(showFilter)
        }
    }, [showFilter])

    useEffect(() => {
        //force initial null check
        if (searchText != null) {
            const onFilterTextChange = async () => {
                loadOpenReservations(null, searchText);
            }
            onFilterTextChange()
        }
    }, [searchText])

    const loadData = async (refresh) => {
        setIsFetching(true);

        let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/OpenReservation/List?id=${orgId}`);

        if (toBoolean(response?.IsValid)) {
            let filterData = {
                ...response.Data,
                CustomDate_Start: fromDateTimeStringToDate(response.Data.CustomDate_StartStringDisplay),
                CustomDate_End: fromDateTimeStringToDate(response.Data.CustomDate_EndStringDisplay),
                FilterTimeOfADayStart: response.Data.FilterTimeOfADayStartStringDisplay,
                FilterTimeOfADayEnd: response.Data.FilterTimeOfADayEndStringDisplay,
            }

            setData(filterData);
            await loadOpenReservations(filterData);
        } else {
            if (!isNullOrEmpty(response?.Path)) {
                navigate(response?.Path);
            }

            if (!isNullOrEmpty(response?.Message)) {
                pNotify(response?.Message, 'error');
            }
        }

        setIsFetching(false);
        resetFetch();
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
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
    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                {isFetching &&
                    <>
                        {emptyArray(8).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button block active={true} style={{height : `160px`}} />
                            </div>
                        ))}
                    </>
                }

                {(!isFetching) &&
                    <>
                        {anyInList(openReservations)&&
                            <>

                            </>
                        }
                        {!anyInList(openReservations) &&
                            <EmptyBlock description={isNullOrEmpty(searchText)  ? `No open reservation(s) found.` : `No notifications found by filter.`} removePadding={true} />
                        }

                        <ListFilter formik={formik}
                                    show={showFilter}
                                    data={data}
                                    page={'open-reservation-list'}
                                    onClose={() => {setShowFilter(false)}}
                                    setFilteredCount={setFilteredCount}
                                    showDates={true} 
                                    showTimeOfADay={true}
                                    showEventRegistrationType={true}
                                    showDayOfTheWeek={true} />
                    </>
                }
            </Flex>
        </PaddingBlock>
    )
}

export default OpenReservationList
