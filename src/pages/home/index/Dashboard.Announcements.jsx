import {useStyles} from "./styles.jsx";
import {anyInList, toBoolean} from "../../../utils/Utils.jsx";
import {SlickSlider} from "../../../components/slickslider/SlickSlider.jsx";
import EntityCard from "../../../components/entitycard/EntityCard.jsx";
import {Typography, Badge} from "antd";
import {Ellipsis} from 'antd-mobile'
import {CloseOutline} from "antd-mobile-icons";

const {Text, Title} = Typography;
import {Button, Card} from 'antd-mobile'
import {cx} from "antd-style";
import {useNavigate} from "react-router-dom";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import {setPage, toRoute} from "../../../utils/RouteUtils.jsx";
import {useEffect} from "react";
import {useApp} from "../../../context/AppProvider.jsx";

const DashboardAnnouncements = ({dashboardData, isFetching}) => {
    let {setDynamicPages, globalStyles} = useApp();
    let announcements = dashboardData?.GlobalAnnouncements;
    let showAnnouncementsBlock = dashboardData?.ShowAnnouncementsBlock;
    const {styles} = useStyles();
    const navigate = useNavigate();

    if (!toBoolean(showAnnouncementsBlock)) {
        return '';
    }

    const handleAfterChange = (currentSlide) => {

    }

    const announcementCard = (globalAnn, isUrgent) => {
        return (
            <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                  onClick={() => {
                      let route = toRoute(HomeRouteNames.ANNOUNCEMENT_DETAILS, 'id', globalAnn.Id);
                      setPage(setDynamicPages, globalAnn.Title, route);
                      navigate(route);
                  }}>
                <Title level={5} className={cx(globalStyles.cardItemTitle, isUrgent && globalStyles.urgentcardItemTitle)}>
                    <Ellipsis direction='end' content={globalAnn.Title}/>
                </Title>

                <Button className={cx(styles.hideAnnouncementButton, isUrgent && styles.urgentHideAnnouncementButton)}>
                    <CloseOutline/>
                </Button>
                <Text className={styles.cardItemDescription}>
                    <Ellipsis direction='end' rows={2} content={(globalAnn.Content || globalAnn.ContextText)}/>
                </Text>
                <Text><small>{globalAnn.UpdatedOnDisplay}</small></Text>
            </Card>
        );
    }


    return (
        <EntityCard title={'Announcements'} link={'/announcement/list'} isFetching={isFetching} addPadding={true}>
            {anyInList(announcements) &&
                <SlickSlider afterChange={handleAfterChange}>
                    {announcements.map((globalAnn, index) => (
                        <div key={index}>
                            {toBoolean(globalAnn.IsUrgent) ? (
                                <Badge.Ribbon text='Urgent' color="red" className={globalStyles.urgentRibbon}>
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
