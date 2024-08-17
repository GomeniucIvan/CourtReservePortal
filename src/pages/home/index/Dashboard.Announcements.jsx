import styles from './Dashboard.module.less'
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {anyInList, extractTextFromHTML, toBoolean} from "../../../utils/Utils.jsx";
import {SlickSlider} from "../../../components/slickslider/SlickSlider.jsx";
import EntityCard from "../../../components/entitycard/EntityCard.jsx";
import {Typography, Badge, Card, theme} from "antd";
const { Text, Title } = Typography;
const { useToken } = theme;

const DashboardAnnouncements = ({ dashboardData, isFetching }) => {
    let announcements = dashboardData?.GlobalAnnouncements;
    let showAnnouncementsBlock = dashboardData?.ShowAnnouncementsBlock;
    const { token } = useToken();
    
    if (!toBoolean(showAnnouncementsBlock)) {
        return '';
    }

    const handleAfterChange = (currentSlide) => {

    }

    return (
        <EntityCard title={'Announcements'} link={'/announcements/:orgId'} isFetching={isFetching} addPadding={true}>
            {anyInList(announcements) &&
                <SlickSlider afterChange={handleAfterChange}>
                    {announcements.map((globalAnn, index) => (
                        <div key={index}>
                            <Badge.Ribbon text='Urgent' color="red">
                                <Card>
                                    <Title level={5} className={styles.cardItemTitle}>{globalAnn.Title}</Title>
                                    <Text className={styles.cardItemDescription}>{extractTextFromHTML((globalAnn.Content || globalAnn.ContextText), 90)}</Text>
                                    <Text><small>{globalAnn.UpdatedOnDisplay}</small></Text>
                                </Card>
                            </Badge.Ribbon>
                        </div>
                    ))}
                </SlickSlider>
            }
        </EntityCard>
    );
};

export default DashboardAnnouncements
