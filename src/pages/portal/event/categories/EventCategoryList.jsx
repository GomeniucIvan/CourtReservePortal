import {useNavigate} from "react-router-dom";
import {useStyles} from "./styles.jsx";
import React, {useEffect, useState} from "react";
import appService from "@/api/app.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {Card, Flex, Skeleton, Typography} from "antd";
import {cx} from "antd-style";
import {toRoute} from "@/utils/RouteUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {Ellipsis} from "antd-mobile";
const {Title} = Typography;

function EventCategoryList() {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState([]);
    const { styles } = useStyles();
    
    const{setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, token, setIsLoading, globalStyles} = useApp();
    const {orgId} = useAuth();
    
    const loadData = async (refresh) => {
        if (refresh) {
            setIsFetching(true);
        }

        setIsLoading(true);

        let response = await appService.get(navigate, `/app/Online/Events/Categories?id=${orgId}`);
        if (toBoolean(response?.IsValid)) {
            setCategories(response.Data);
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
    }, [])

    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                {isFetching &&
                    <>
                        {emptyArray(8).map((item, index) => (
                            <Skeleton.Button block key={index} active={true} style={{height : `120px`}} />
                        ))}
                    </>
                }

                {(!isFetching && anyInList(categories)) &&
                    <>
                        {categories.map((category) => {
                            let isMainList = equalString(category.Id, 0);

                            let categoryColor = category.TextColor;
                            let categoryBgColor =category.BackgroundColor;

                            if (isMainList) {
                                categoryColor = token.colorOrgText;
                                categoryBgColor = token.colorPrimary;
                            }

                            return (
                                <Card className={cx(globalStyles.card, globalStyles.clickableCard, globalStyles.cardSMPadding)}
                                      key={category.Id || -1}
                                      onClick={() => {
                                          if (equalString(isMainList)) {
                                              let route = toRoute(EventRouteNames.EVENT_LIST, 'id', orgId);
                                              navigate(`${route}?evTypeId=-10`);
                                          } else {
                                              let route = toRoute(EventRouteNames.EVENT_LIST, 'id', orgId);
                                              navigate(`${route}?evTypeId=${category.Id}`);
                                          }
                                      }}>
                                    <Flex gap={token.padding} align={'center'}>
                                        <Flex align={'center'} justify={'center'} className={styles.circle}
                                            style={{
                                                color: categoryColor,
                                                backgroundColor: categoryBgColor
                                            }}>
                                            {category.EventsCount}
                                        </Flex>

                                        <Title level={3}><Ellipsis direction='end' content={category.Name}/></Title>
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

export default EventCategoryList
