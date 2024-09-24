import {useEffect, useState} from "react";
import {Badge, Button, Flex, Segmented, Space, Tag, Typography} from "antd";
import HeaderSearch from "../../../../components/header/HeaderSearch.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../../utils/Utils.jsx";
import {toLocalStorage} from "../../../../storage/AppStorage.jsx";
import {AppstoreOutlined, BarsOutlined, FilterOutlined} from "@ant-design/icons";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../../context/AppProvider.jsx";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import appService  from "../../../../api/app.jsx";
import {toAspNetDate} from "../../../../utils/DateUtils.jsx";
import {Card, List} from "antd-mobile";
import {cx} from "antd-style";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
import CardSkeleton, {SkeletonEnum} from "../../../../components/skeleton/CardSkeleton.jsx";

const {Title, Text} = Typography;

function ProfileStringingList() {

    const navigate = useNavigate();

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
    
    const [searchText, setSearchText] = useState(null);
    const [isFilterOpened, setIsFilterOpened] = useState(null);
    const [filterData, setFilterData] = useState();
    const [isFetching, setIsFetching] = useState(true);
    const [stringingJobs, setStringingJobs] = useState([]);
    
    const loadStringingJob = (incFilter) => {
        let filter = filterData;
        if (!isNullOrEmpty(incFilter)){
            filter = incFilter;
        }
        
        setIsFetching(true);

        appService.get(navigate, `/app/Online/StringingJob/GetJobs?id=${orgId}&startDate=${toAspNetDate(filter?.StartDate)}&endDate=${toAspNetDate(filter?.EndDate)}`).then(r => {
            if (toBoolean(r?.IsValid)) {
                console.log(r.Data)
                setStringingJobs(r.Data);
                setIsFetching(false);
            }
        })
    }
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
        setHeaderRightIcons(
            <Space className={globalStyles.headerRightActions}>
                <HeaderSearch setText={setSearchText}/>

                <Button type="default" icon={<FilterOutlined/>} size={'medium'} onClick={() => setIsFilterOpened(true)}/>

            </Space>
        )

        if (isMockData){

        } else{
            appService.get(navigate, `/app/Online/StringingJob/Index?id=${orgId}`).then(r => {
                if (toBoolean(r?.IsValid)) {
                    setFilterData(r.Data)
                    loadStringingJob(r.Data);
                } else{
                    navigate('/');
                }
            })
        }
    }, []);
    
    const stringingJobTemplate = (stringingJob, isUnpaid) => {
        return (
            <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                  onClick={() => {

                  }}>
                <Title level={4} style={{margin: 0}}>Job #{stringingJob.JobNumber}</Title>
                <Text className={globalStyles.block}>{stringingJob.PlayerFullName}</Text>
                <Text className={globalStyles.block}>{stringingJob.RacquetsNumber} Raquet</Text>
                <Text className={globalStyles.block}>{stringingJob.CreatedOnDisplay}</Text>
            </Card>
        )
    }
    
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

                {(!isFetching && anyInList(stringingJobs)) &&
                    <>
                        {stringingJobs.map((stringingJob, index) => (
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
        </>
    )
}

export default ProfileStringingList
