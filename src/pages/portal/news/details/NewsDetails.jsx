import {useStyles} from "./../styles.jsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Flex, List, Skeleton, Tag, Typography} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import BrowserBlock from "@/components/browserblock/BrowserBlock.jsx";
import {getQueryParameter} from "@/utils/RouteUtils.jsx";
import {imageSrc} from "@/utils/ImageUtils.jsx";
import {Ellipsis} from "antd-mobile";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
const {Title} = Typography;

function NewsDetails() {
    const navigate = useNavigate();
    const { styles } = useStyles();
    const location = useLocation();
    const {setHeaderRightIcons} = useHeader();
    const{setIsFooterVisible, shouldFetch, resetFetch, token, setIsLoading} = useApp();
    const [newsItem, setNewsItem] = useState(null);
    const {orgId} = useAuth();
    const newsId = getQueryParameter(location, "newsId");

    const loadData = async (refresh) => {
        if (refresh) {
            setNewsItem(null);
        }

        setIsLoading(true);

        let response = await appService.get(navigate, `/app/Online/News/Details?id=${orgId}&newsId=${newsId}`);
        if (toBoolean(response?.IsValid)) {
            setNewsItem(response.Data);
        }

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
                {isNullOrEmpty(newsItem) &&
                    <>
                        <Skeleton.Button block active={true} style={{height : `120px`}} />
                        <Skeleton.Button block active={true} style={{height : `30px`}} />
                        <Skeleton.Button block active={true} style={{height : `480px`}} />
                    </>
                }

                {!isNullOrEmpty(newsItem?.Id) &&
                    <>
                        {!isNullOrEmpty(newsItem?.ImageUrl) &&
                            <img src={imageSrc(newsItem?.ImageUrl, orgId)} className={styles.detailsImage} alt={newsItem.Subject}/>
                        }

                        {!isNullOrEmpty(newsItem?.Subject) &&
                            <Title level={3}>
                                <Ellipsis direction='end' rows={1} content={newsItem?.Subject}/>
                            </Title>
                        }

                        <CardIconLabel size={20} icon={'clock'} description={newsItem?.DateTimeDisplay}/>

                        <BrowserBlock html={newsItem?.Content}/>
                    </>
                }
            </Flex>
        </PaddingBlock>
    )
}

export default NewsDetails
