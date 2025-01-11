import {useLocation, useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Flex, List, Skeleton, Tag, Typography} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import BrowserBlock from "@/components/browserblock/BrowserBlock.jsx";
import {currentBaseUrl, getQueryParameter} from "@/utils/RouteUtils.jsx";
const {Title} = Typography;

function NotificationDetails() {
    const navigate = useNavigate();
    const location = useLocation();

    const{setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, token, setIsLoading} = useApp();
    const [notification, setNotification] = useState(null);
    const {orgId} = useAuth();
    const historyId = getQueryParameter(location, "pushNotificationHistoryId");

    const loadData = async (refresh) => {
        if (refresh) {
            setNewsItem(null);
        }

        setIsLoading(true);

        let response = await appService.get(navigate, `/app/Online/Notification/PushNotificationDetails?id=${orgId}&pushNotificationHistoryId=${historyId}`);
        if (toBoolean(response?.IsValid)) {
            setNotification(response.Data);
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

    const rewriteHtml = (html) => {
        let updatedHtml = html;

        // Replace <style> tags
        updatedHtml = updatedHtml.replace(/<style/g, "<fake style='display:none !important' ");
        updatedHtml = updatedHtml.replace(/<\/style>/g, "</fake>");

        // New template updates
        updatedHtml = updatedHtml.replace(/padding: 100px 5px 100px;/g, "padding: 0px 5px 50px;");
        updatedHtml = updatedHtml.replace(/600px/g, "auto");
        updatedHtml = updatedHtml.replace(/padding: 0px 5px;/g, "padding: 0px 0px;");

        updatedHtml = updatedHtml.replace(/app\.courtreserve\.com/g, currentBaseUrl());

        return updatedHtml;
    };

    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                {isNullOrEmpty(notification) &&
                    <>
                        <Skeleton.Button block active={true} style={{height : `520px`}} />
                    </>
                }

                {!isNullOrEmpty(notification?.Id) &&
                    <>
                        {!isNullOrEmpty(notification?.Html) &&
                            <BrowserBlock html={rewriteHtml(notification?.Html)}/>
                        }
                        {isNullOrEmpty(notification?.Html) &&
                            <Title level={3}>{notification.Subject}</Title>
                        }
                    </>
                }
            </Flex>
        </PaddingBlock>
    )
}

export default NotificationDetails
