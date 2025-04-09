import {useStyles} from ".././styles.jsx";
import {Typography, Badge, Flex, Button} from "antd";
import {Ellipsis, ErrorBlock, Swiper} from 'antd-mobile'
import {Card} from 'antd-mobile'
import {cx} from "antd-style";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {countListItems, stringToJson} from "@/utils/ListUtils.jsx";
import {anyInList, isNullOrEmpty, oneListItem, textFromHTML, toBoolean} from "@/utils/Utils.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import EntityCardWrapper from "@/components/entitycard/EntityCardWrapper.jsx";
import {SlickSlider} from "@/components/slickslider/SlickSlider.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import SwiperSlider from "@/components/swiperslider/SwiperSlider.jsx";
import EntityEmptyBlock from "@/components/entitycard/EntityEmptyBlock.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";

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
            <Card className={cx(globalStyles.card)}
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
            <EntityCardWrapper title={t('announcement.title')}
                               onClick={() => {
                                   let route = toRoute(HomeRouteNames.ANNOUNCEMENT_LIST, 'id', orgId);
                                   navigate(route);
                               }}
                               isFetching={isFetching}
                               addPadding={true}>
                {isFetching &&
                    <SlickSlider>
                        <CardSkeleton type={SkeletonEnum.DASHBOARD_ANNOUNCEMENT} count={1} marginBottom={true}/>
                     </SlickSlider>
                }

                {(!isFetching && anyInList(announcements)) ? (
                    <SwiperSlider count={countListItems(announcements)}>
                        {announcements.map((globalAnn, index) => {
                            const isLastItem = index === announcements.length - 1;
                            const isOneItem = oneListItem(announcements);

                            return (
                                <Swiper.Item key={index}
                                             className={cx((!isOneItem && !isLastItem) && globalStyles.swiperItem, (!isOneItem && isLastItem) && globalStyles.swiperLastItem)}>
                                    <>
                                        {toBoolean(globalAnn.IsUrgent) ? (
                                            <Badge.Ribbon text={t('urgent')} color="red" className={globalStyles.urgentRibbon}>
                                                {announcementCard(globalAnn, true)}
                                            </Badge.Ribbon>
                                        ) : (
                                            <>{announcementCard(globalAnn)}</>
                                        )}
                                    </>
                                </Swiper.Item>
                            )
                        })}
                    </SwiperSlider>
                ) : (
                    <EntityEmptyBlock text='You have no new announcements' height={144} />
                )}
            </EntityCardWrapper>

            <DrawerBottom showDrawer={!isNullOrEmpty(selectedAnnouncement)}
                          closeDrawer={() => setSelectedAnnouncement(null)}
                          showButton={true}
                          maxHeightVh={80}
                          customFooter={<Flex gap={token.padding}>
                              <Button type={'primary'} danger block onClick={() => {
                                  displayMessageModal({
                                      title: 'Remove',
                                      html: (onClose) => <Flex vertical={true} gap={token.padding * 2}>
                                          <Text>{t('announcement.dashboardRemove', { title: selectedAnnouncement?.Title })}</Text>

                                          <Flex vertical={true} gap={token.padding}>
                                              <Button block={true} danger={true} type={'primary'} onClick={() => {
                                                  removeAnnouncementFromDashboard(selectedAnnouncement);
                                                  onClose();
                                              }}>
                                                  Remove
                                              </Button>

                                              <Button block={true} onClick={() => {
                                                  onClose();
                                              }}>
                                                  Close
                                              </Button>
                                          </Flex>
                                      </Flex>,
                                      type: "warning",
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
