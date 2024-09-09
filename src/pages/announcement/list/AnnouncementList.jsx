import {useStyles} from "./../styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {Flex, List, Tag} from "antd";
import {useEffect, useState, useRef} from "react";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/home-data.json";
import IframeContent from "../../../components/iframecontent/IframeContent.jsx";
import {isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import CardSkeleton, {SkeletonEnum} from "../../../components/skeleton/CardSkeleton.jsx";

function AnnouncementList() {
    const { styles } = useStyles();
    const [isFetching, setIsFetching] = useState(true);
    
    const{isMockData, setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, token, setIsLoading} = useApp();
    const [announcements, setAnnouncements] = useState([]);
    const {orgId} = useAuth();
    
    const loadData = (refresh) => {
        if (isMockData){
            const list = mockData.dashboard.announcement_list;
            setAnnouncements(list);
            setIsFetching(true);
            setIsLoading(false);
        } else{
            setIsFetching(true);
            
            appService.get(`/app/Online/Announcement/Index?id=${orgId}`).then(r => {
                if (r.IsValid){
                    setAnnouncements(r.Data.GlobalAnnouncements);
                    setIsFetching(false);
                    setIsLoading(false);
                }
            })
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
        loadData();
    }, []);


    return (
        <PaddingBlock leftRight={false}>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        <CardSkeleton type={SkeletonEnum.ANNOUNCEMENT_LIST_ITEM} count={8}/>
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <List
                    className={styles.list}
                    itemLayout="vertical"
                    dataSource={announcements}
                    renderItem={(item) => {
                        return (
                            <List.Item key={item.Id}>
                                <List.Item.Meta
                                    title={item.Title}
                                    description={<>{item.UpdatedOnDisplay}{toBoolean(item.IsUrgent) && <Tag color="error">Urgent</Tag>}</> }
                                />
                                {!isNullOrEmpty(item.Content) &&
                                    <IframeContent content={item.Content} id={item.Id} />
                                }
                            </List.Item>
                        );
                    }}
                />
            }
        </PaddingBlock>
    )
}

export default AnnouncementList
