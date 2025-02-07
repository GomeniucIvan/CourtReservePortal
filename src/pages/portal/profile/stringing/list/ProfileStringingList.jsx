import {useEffect, useState} from "react";
import {Badge, Button, Flex, Segmented, Space, Tag, Typography} from "antd";
import HeaderSearch from "@/components/header/HeaderSearch.jsx";
import {anyInList, equalString, generateHash, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {AppstoreOutlined, BarsOutlined, FilterOutlined} from "@ant-design/icons";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import appService  from "@/api/app.jsx";
import {dateToString, fromDateTimeStringToDate} from "@/utils/DateUtils.jsx";
import {Card, List} from "antd-mobile";
import {cx} from "antd-style";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import HeaderFilter from "@/components/header/HeaderFilter.jsx";
import {useFormik} from "formik";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import ListFilter from "@/components/filter/ListFilter.jsx";

const {Title, Text} = Typography;

function ProfileStringingList() {
    const navigate = useNavigate();

    const {setHeaderRightIcons} = useHeader();
    
    const {
        setIsFooterVisible,
        globalStyles,
        token,
        setFooterContent
    } = useApp();
    const {orgId} = useAuth();
    
    const [searchText, setSearchText] = useState(null);
    const [showFilter, setShowFilter] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [stringingJobs, setStringingJobs] = useState([]);
    const [filteredStringingJobs, setFilteredStringingJobs] = useState([]);
    const [filterMaxDate, setFilterMaxDate] = useState(undefined);
    
    const loadStringingJob = async (inValues) => {
        let startDate = formik?.values?.StartDate;
        let endDate = formik?.values?.EndDate;
        
        if (!isNullOrEmpty(inValues?.StartDate)) {
            startDate = inValues?.StartDateStringDisplay;
        }
        if (!isNullOrEmpty(inValues?.EndDate)) {
            endDate = inValues?.EndDateStringDisplay;
        }
        setIsFetching(true);

        let response = await appService.get(navigate, `/app/Online/StringingJob/GetJobs?id=${orgId}&startDate=${startDate}&endDate=${endDate}`);

        if (toBoolean(response?.IsValid)) {
            setStringingJobs(response.Data);
            setIsFetching(false);
        }
    }
    
    const stringingJobTemplate = (stringingJob, isUnpaid) => {
        return (
            <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                  onClick={() => {

                  }}>
                <Title level={3} style={{margin: 0}}>Job #{stringingJob.JobNumber}</Title>
                <Text className={globalStyles.block}>{stringingJob.PlayerFullName}</Text>
                <Text className={globalStyles.block}>{stringingJob.RacquetsNumber} Raquet</Text>
                <Text className={globalStyles.block}>{stringingJob.CreatedOnDisplay}</Text>
            </Card>
        )
    }

    const formik = useFormik({
        initialValues: {
            DrawerFilterKey: '',
            DrawerFilter: {
                StartDate: null,
                EndDate: null,
            }
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        },
    });

    const loadData = async () => {
        let response = await appService.get(navigate, `/app/Online/StringingJob/Index?id=${orgId}`);

        if (toBoolean(response?.IsValid)) {
            formik.setFieldValue('DrawerFilter.StartDate', fromDateTimeStringToDate(response.Data.StartDateStringDisplay))
            formik.setFieldValue('DrawerFilter.EndDate', fromDateTimeStringToDate(response.Data.EndDateStringDisplay))
            setFilterMaxDate(fromDateTimeStringToDate(response.Data.EndDateStringDisplay))
            loadStringingJob(response.Data);
        } else{
            navigate(HomeRouteNames.INDEX);
        }
    }
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
        setHeaderRightIcons(
            <Space className={globalStyles.headerRightActions}>
                <HeaderSearch setText={setSearchText}/>

                <HeaderFilter count={0} onClick={() => setShowFilter(true)} />
            </Space>
        )

        loadData();
    }, []);
    
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
                            loadStringingJob();
                        }
                    }
                }
            }

            onFilterChange(showFilter)
        }
    }, [showFilter])

    useEffect(() => {
        if (isNullOrEmpty(searchText) ||!anyInList(stringingJobs)) {
            setFilteredStringingJobs(stringingJobs);
        } else {
            const filtered = stringingJobs.filter(job =>
                job.JobNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                job.PlayerFullName.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredStringingJobs(filtered);
        }
    }, [searchText, stringingJobs]);
    
    return (
        <>
            <List className={cx(globalStyles.itemList)} style={{padding: 0}}>
                {isFetching &&
                    <PaddingBlock topBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            <CardSkeleton count={8} type={SkeletonEnum.STRINGING_JOB}/>
                        </Flex>
                    </PaddingBlock>
                }

                {(!isFetching && anyInList(filteredStringingJobs)) &&
                    <>
                        {filteredStringingJobs.map((stringingJob, index) => (
                            <List.Item span={12}
                                       key={index}
                                       arrowIcon={false}
                                       onClick={() => {

                                       }}>
                                {toBoolean(stringingJob.IsUnpaid) ? (
                                    <Badge.Ribbon text={t('unpaid')} color={'orange'} className={globalStyles.urgentRibbon}>
                                        {stringingJobTemplate(stringingJob, true)}
                                    </Badge.Ribbon>
                                ) : (
                                    <>{stringingJobTemplate(stringingJob)}</>
                                )}
                            </List.Item>
                        ))}
                    </>
                }
            </List>

            <ListFilter formik={formik}
                        show={showFilter}
                        showFilterDates={true}
                        page={'stringing-list'}
                        filterDatesInterval={60}
                        maxDate={filterMaxDate}
                        onClose={() => {setShowFilter(false)}} />
        </>
    )
}

export default ProfileStringingList
