import {useStyles} from "./../styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Card, Flex, Typography} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import {cx} from "antd-style";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {Ellipsis} from "antd-mobile";
import {imageSrc} from "@/utils/ImageUtils.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";

const {Title}  = Typography ;

function NewsList() {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);

    const{setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, token, setIsLoading, globalStyles} = useApp();
    const [news, setNews] = useState([]);
    const {orgId} = useAuth();

    const loadData = async (refresh) => {
        if (refresh) {
            setIsFetching(true);
        }

        setIsLoading(true);

        let response = await appService.get(navigate, `/app/Online/News/List?id=${orgId}`);
        if (toBoolean(response?.IsValid)) {
            setNews(response.Data);
        }

        setIsFetching(false);
        setIsLoading(false);
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
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                {isFetching &&
                    <CardSkeleton type={SkeletonEnum.NEWS_LIST_ITEM} count={8}/>
                }

                {(!isFetching && anyInList(news)) &&
                    <>
                        {news.map((newsItem) => {
                            return (
                                <Card className={cx(globalStyles.card, globalStyles.clickableCard, globalStyles.cardSMPadding)}
                                      key={newsItem.Id}
                                      onClick={() => {
                                          let route = toRoute(HomeRouteNames.NEWS_DETAILS, 'id', orgId);
                                          navigate(`${route}?newsId=${newsItem.Guid}`);
                                      }}>
                                    <Flex vertical={true} gap={4}>
                                        {!isNullOrEmpty(newsItem?.ImageUrl) &&
                                            <img src={imageSrc(newsItem?.ImageUrl, orgId)}  alt={newsItem.Subject}/>
                                        }
                                        {!isNullOrEmpty(newsItem.Subject) &&
                                            <Title level={3}>
                                                <Ellipsis direction='end' rows={1} content={newsItem.Subject}/>
                                            </Title>
                                        }

                                        <CardIconLabel size={20} icon={'clock'} description={newsItem.DateTimeDisplay}/>

                                        {!isNullOrEmpty(newsItem.ShortDescription) &&
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: newsItem.ShortDescription
                                                }}
                                            />
                                        }
                                    </Flex>
                                </Card>
                            )
                        })}
                    </>
                }
            </Flex>
        </PaddingBlock>
    )
}

export default NewsList
