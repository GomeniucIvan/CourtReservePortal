import {useStyles} from ".././styles.jsx";
import {Typography, Badge, Flex, Button} from "antd";
import {Ellipsis} from 'antd-mobile'
import {Card} from 'antd-mobile'
import {cx} from "antd-style";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {stringToJson} from "@/utils/ListUtils.jsx";
import {anyInList, isNullOrEmpty, textFromHTML, toBoolean} from "@/utils/Utils.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import EntityCard from "@/components/entitycard/EntityCard.jsx";
import {SlickSlider} from "@/components/slickslider/SlickSlider.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import {ModalRemove} from "@/utils/ModalUtils.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";

const {Text, Title} = Typography;

const DashboardAnnouncements = ({dashboardData, isFetching}) => {
    let {setDynamicPages, globalStyles, token} = useApp();
    let {orgId} = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [showAnnouncementsBlock, setShowAnnouncementsBlock] = useState(false);
    const { t } = useTranslation('');
    
    const {styles} = useStyles();
    const navigate = useNavigate();
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        if (dashboardData){
            setAnnouncements(stringToJson(dashboardData?.GlobalAnnouncementsJson));
            setShowAnnouncementsBlock(toBoolean(dashboardData?.ShowAnnouncementsBlock) && anyInList(stringToJson(dashboardData?.GlobalAnnouncementsJson)));
        }
        
    }, [dashboardData]);
    
    if (!toBoolean(showAnnouncementsBlock)) {
        return '';
    }

    const handleAfterChange = (currentSlide) => {
        const indexAnnouncement = announcements[currentSlide];
        if (!isNullOrEmpty(indexAnnouncement) && toBoolean(indexAnnouncement.IsNew)) {
            appService.postRoute(apiRoutes.API2, `/app/Online/MemberDashboard/GlobalAnnouncementMarkAsSeenOrRemoved?id=${orgId}&globalAnnouncementId=${indexAnnouncement.Id}&markAsNotNew=true`).then(r => {

            });
            
            const updatedAnnouncements = announcements.map((announcement, index) => {
                if (index === currentSlide) {
                    return { ...announcement, IsNew: false };
                }
                return announcement;
            });

            setAnnouncements(updatedAnnouncements);
        }
    }

    const removeAnnouncementFromDashboard = (announcement) => {
        const announcementsToSet = announcements.filter(a => a.Id !== announcement.Id);
        setAnnouncements(announcementsToSet);
        setShowAnnouncementsBlock(anyInList(announcementsToSet));
        
        setSelectedAnnouncement(null);
        
        appService.postRoute(apiRoutes.API2, `/app/Online/MemberDashboard/GlobalAnnouncementMarkAsSeenOrRemoved?id=${orgId}&globalAnnouncementId=${announcement.Id}&markAsHidden=true`).then(r => {
            
        });
    }

    const announcementCard = (globalAnn, isUrgent) => {
        return (
            <Card className={cx(globalStyles.card, globalStyles.clickableCard)}
                  onClick={() => {
                      setSelectedAnnouncement(globalAnn);
                  }}>
                <Title level={1}
                       className={cx(globalStyles.cardItemTitle, isUrgent && globalStyles.urgentcardItemTitle)}>
                    <Ellipsis direction='end' content={globalAnn.Title}/>
                </Title>

                {/*<Button className={cx(styles.hideAnnouncementButton, isUrgent && styles.urgentHideAnnouncementButton)}>*/}
                {/*    <CloseOutline/>*/}
                {/*</Button>*/}
                <Text className={styles.cardItemDescription}>
                    <Ellipsis direction='end' rows={2}
                              content={textFromHTML((globalAnn.Content || globalAnn.ContextText), 120)}/>
                </Text>
                <Text><small>{globalAnn.UpdatedOnDisplay}</small></Text>
            </Card>
        );
    }

    return (
        <>
            <EntityCard title={t('announcement.title')} link={'/announcement/list'} isFetching={isFetching} addPadding={true}>
                {isFetching &&
                    <SlickSlider>
                        <CardSkeleton type={SkeletonEnum.DASHBOARD_ANNOUNCEMENT} count={1} marginBottom={true}/>
                     </SlickSlider>
                }
                {(!isFetching && anyInList(announcements)) &&
                    <SlickSlider afterChange={handleAfterChange}>
                        {announcements.map((globalAnn, index) => (
                            <div key={index}>
                                {toBoolean(globalAnn.IsUrgent) ? (
                                    <Badge.Ribbon text={t('urgent')} color="red" className={globalStyles.urgentRibbon}>
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

            <DrawerBottom showDrawer={!isNullOrEmpty(selectedAnnouncement)}
                          closeDrawer={() => setSelectedAnnouncement(null)}
                          showButton={true}
                          maxHeightVh={80}
                          customFooter={<Flex gap={token.padding}>
                              <Button type={'primary'} danger block onClick={() => {
                                  ModalRemove({
                                      content: t('announcement.dashboardRemove', { title: selectedAnnouncement?.Title }),
                                      showIcon: false,
                                      onRemove: (e) => {
                                          removeAnnouncementFromDashboard(selectedAnnouncement);
                                      }
                                  })
                              }}>
                                  {t('remove')}
                              </Button>

                              <Button type={'primary'} block onClick={() => {
                                  let route = toRoute(HomeRouteNames.ANNOUNCEMENT_DETAILS, 'id', selectedAnnouncement?.Id);
                                  setPage(setDynamicPages, selectedAnnouncement?.Title, route);
                                  navigate(route);
                                  setSelectedAnnouncement(null);
                              }}>
                                  {t('details')}
                              </Button>
                          </Flex>}
                          confirmButtonText={''}
                          label={selectedAnnouncement?.Title}>
                <PaddingBlock>
                    {!isNullOrEmpty(selectedAnnouncement?.Content) &&
                        <IframeContent content={selectedAnnouncement?.Content}
                                       id={`announcement_${selectedAnnouncement?.Id}`}/>
                    }
                </PaddingBlock>
            </DrawerBottom>
        </>
    );
};

export default DashboardAnnouncements
