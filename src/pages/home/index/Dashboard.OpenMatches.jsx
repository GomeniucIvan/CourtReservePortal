﻿import {anyInList, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {SlickSlider} from "../../../components/slickslider/SlickSlider.jsx";
import EntityCard from "../../../components/entitycard/EntityCard.jsx";
import {t} from "../../../utils/OrganizationUtils.jsx";
import {Segmented} from "antd";
import {Card, NoticeBar} from "antd-mobile";
import {useStyles} from "./styles.jsx";

const DashboardOpenMatches = ({ dashboardData, isFetching }) => {
    let showOpenMatches = dashboardData?.ShowOpenMatches;
    let openMatches = dashboardData?.OpenMatches;
    const { styles } = useStyles();
    
    // if (!toBoolean(showOpenMatches)){
    //     return '';
    // }

    return (
        <EntityCard title={t('Open Matches')} link={'/openMatches'} isFetching={isFetching} addPadding={true}>
            <>
                <NoticeBar content='if no any registered move to following if no any to all' color='info' />
                
                <Card className={styles.segmentCard}>
                    <Segmented
                        options={['Registered', 'Following', 'All']}
                        block
                        onChange={(value) => {
                            console.log(value); // string
                        }}
                    />

                    {showOpenMatches &&
                        <>
                            {anyInList(openMatches) &&
                                <SlickSlider>
                                    {openMatches.map((booking, index) => (
                                        <div className="fn-slide-item" key={index}>
                                            <div className="modern-dashboard-shadow-card-margin">
                                                <div className="modern-dashboard-shadow-card fn-click-effect">
                                                    {booking.IsUnpaid &&
                                                        <div className="absolute-top-right">
                                                            <i className="fa-solid fa-circle-dollar red"></i>
                                                        </div>
                                                    }

                                                    <div className="modern-dashboard-shadow-icon-row  main-icon-row">
                                                        <div className="modern-dashboard-shadow-icon">
                                                            <i className="fa fa-circle" style={{ color: booking.TypeBgColor }}></i>
                                                        </div>

                                                        <div className="modern-dashboard-shadow-icon-row-text" style={{ display: 'grid' }}>
                                                            <div className="modern-dashboard-shadow-icon-row-text-main" style={{ textWrap: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {booking.Title}
                                                            </div>
                                                            <div className="modern-dashboard-shadow-icon-row-text-description">
                                                                {booking.Subtitle}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="modern-dashboard-shadow-icon-row">
                                                        <div className="modern-dashboard-shadow-icon">
                                                            <i className="fa-regular fa-calendar-clock"></i>
                                                        </div>

                                                        <div className="modern-dashboard-shadow-icon-row-text">
                                                            <div className="modern-dashboard-shadow-icon-row-value">
                                                                {booking.StartEndDateTimeDisplay}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modern-dashboard-shadow-icon-row">
                                                        <div className="modern-dashboard-shadow-icon">
                                                            <i className="fa-light fa-user"></i>
                                                        </div>

                                                        <div className="modern-dashboard-shadow-icon-row-text">
                                                            <div className="modern-dashboard-shadow-icon-row-value">
                                                                {booking.FamilyRegistrantNames}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="modern-dashboard-shadow-badges-row">
                                                        {!isNullOrEmpty(booking.CourtNamesDisplay) &&
                                                            <span className="modern-badge shadow-badge h24">{booking.CourtNamesDisplay}</span>
                                                        }
                                                        <span className="modern-badge shadow-badge h24">{booking.RegistrantsCount} {!isNullOrEmpty(booking.EventId) ? "Registrant(s)" : "Player(s)"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </SlickSlider>
                            }
                        </>
                    }
                </Card>
            </>
        </EntityCard>
    );
};

export default DashboardOpenMatches
