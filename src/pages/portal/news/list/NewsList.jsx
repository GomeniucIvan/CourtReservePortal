import {useStyles} from "./../styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Flex, List, Tag} from "antd";
import {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/home-data.json";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import SVG from "@/components/svg/SVG.jsx";

function NewsList() {
    const navigate = useNavigate();
    const { styles } = useStyles();
    const [isFetching, setIsFetching] = useState(true);
    
    const{isMockData, setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, token, setIsLoading} = useApp();
    const [news, setNews] = useState([]);
    const {orgId} = useAuth();
    
    const loadData = (refresh) => {
        if (refresh) {
            setIsFetching(true);    
        }

        setIsLoading(true);
        
        let response = appService.get(navigate, `/app/Online/News/List?id=${orgId}`);
        if (response.IsValid) {
            setNews(response.Data);
            setIsFetching(false);
            setIsLoading(false);
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
                        <CardSkeleton type={SkeletonEnum.NEWS_LIST_ITEM} count={8}/>
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <List
                    itemLayout="vertical"
                    dataSource={news}
                    renderItem={(item) => {
                        return (
                            <List.Item key={item.Id}>
                                <List.Item.Meta
                                    title={item.Subject}
                                    description={<><SVG icon={'clock'}/>{isNullOrEmpty(item.ActiveFrom) ? item.CreatedOn : item.ActiveFrom}</> }
                                />
                                {!isNullOrEmpty(item.ShortDescription) &&
                                    <IframeContent content={item.ShortDescription} id={item.Id} />
                                }
                            </List.Item>
                        );
                    }}
                />
            }
        </PaddingBlock>
    )
}

export default NewsList
