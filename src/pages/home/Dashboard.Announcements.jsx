import styles from './Dashboard.module.less'
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {anyInList, extractTextFromHTML, toBoolean} from "../../utils/Utils.jsx";
import {SlickSlider} from "../../components/slickslider/SlickSlider.jsx";
import EntityCard from "../../components/entitycard/EntityCard.jsx";

const DashboardAnnouncements = ({ dashboardData, isFetching }) => {
    
    let announcements = dashboardData?.GlobalAnnouncements;
    let showAnnouncementsBlock = dashboardData?.ShowAnnouncementsBlock;
    
    if (!toBoolean(showAnnouncementsBlock)){
        return '';
    }
    
    const handleAfterChange = (currentSlide) => {

    }
    
    return (
        <EntityCard title={'Announcements'} link={'/announcements/:orgId'} isFetching={isFetching}>
            <div className='modern-dashboard-block modern-dashboard-slick-block'>
                {anyInList(announcements) &&
                    <SlickSlider afterChange={handleAfterChange}>
                        {announcements.map((globalAnn, index) => (
                            <div className={`fn-slide-item fn-slider-ann-${globalAnn.Id}`} key={index}>
                                <div className="modern-dashboard-shadow-card-margin">
                                    <div
                                        className={`modern-dashboard-shadow-card fn-announcement-data-item fn-click-effect ${(toBoolean(globalAnn.IsUrgent) ? " red" : "")}`}
                                        data-isnew={(globalAnn.IsNew)}
                                        data-id={globalAnn.Id}>
                                        <div className="modern-dashboard-ann-title">
                                            <span className="modern-dashboard-ann-title-header">{globalAnn.Title}</span>
                                            <span className="remove-icon fn-remove-announcement"><i
                                                className="fa fa-xmark"></i></span>
                                        </div>

                                        <div className="modern-dashboard-ann-description">
                                            {extractTextFromHTML((globalAnn.Content || globalAnn.ContextText), 90)}
                                        </div>

                                        <div className="modern-dashboard-ann-footer">
                                            <div className="modern-dashboard-ann-footer-date">
                                                {globalAnn.UpdatedOnDisplay}
                                            </div>

                                            {globalAnn.IsUrgent &&
                                                <div>
                                                    <span className="modern-badge modern-badge-danger">Urgent</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </SlickSlider>
                }
            </div>
        </EntityCard>
    );
};

export default DashboardAnnouncements
