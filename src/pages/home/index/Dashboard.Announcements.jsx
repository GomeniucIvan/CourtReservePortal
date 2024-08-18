﻿import {useStyles} from "./styles.jsx";
import {anyInList, toBoolean} from "../../../utils/Utils.jsx";
import {SlickSlider} from "../../../components/slickslider/SlickSlider.jsx";
import EntityCard from "../../../components/entitycard/EntityCard.jsx";
import {Typography, Badge} from "antd";
import { Ellipsis } from 'antd-mobile'
import {CloseOutline} from "antd-mobile-icons";
const { Text, Title } = Typography;
import { Button, Card } from 'antd-mobile'
import {cx} from "antd-style";

const DashboardAnnouncements = ({ dashboardData, isFetching }) => {
    let announcements = dashboardData?.GlobalAnnouncements;
    let showAnnouncementsBlock = dashboardData?.ShowAnnouncementsBlock;
    const { styles } = useStyles();
    
    if (!toBoolean(showAnnouncementsBlock)) {
        return '';
    }

    const handleAfterChange = (currentSlide) => {

    }

    const announcementCard = (globalAnn, isUrgent) => {
        return (
            <Card className={styles.card}>
                <Title level={5} className={cx(styles.cardItemTitle, isUrgent && styles.urgentcardItemTitle)}>
                    <Ellipsis direction='end' content={'Summer Clinics are openSummer Clinics are openSummer Clinics are openSummer Clinics are openSummer Clinics are open'} />
                </Title>

                <Button className={cx(styles.hideAnnouncementButton, isUrgent && styles.urgentHideAnnouncementButton)}>
                    <CloseOutline />
                </Button>
                <Text className={styles.cardItemDescription}>
                    <Ellipsis direction='end' rows={2} content={(globalAnn.Content || globalAnn.ContextText)} />
                </Text>
                <Text><small>{globalAnn.UpdatedOnDisplay}</small></Text>
            </Card>
        );
    }
    
    
    return (
        <EntityCard title={'Announcements'} link={'/announcements/:orgId'} isFetching={isFetching} addPadding={true}>
            {anyInList(announcements) &&
                <SlickSlider afterChange={handleAfterChange}>
                    {announcements.map((globalAnn, index) => (
                        <div key={index}>
                            {toBoolean(globalAnn.IsUrgent) ? (
                                <Badge.Ribbon text='Urgent' color="red" className={styles.urgentRibbon}>
                                    {announcementCard(globalAnn, true)}
                                </Badge.Ribbon>
                                ) : (
                                <>{announcementCard(globalAnn)}</>
                                )}
                        </div>
                    ))}
                </SlickSlider>
            }
        </EntityCard>
    );
};

export default DashboardAnnouncements
