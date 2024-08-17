import styles from './Dashboard.module.less'
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {anyInList, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {SlickSlider} from "../../components/slickslider/SlickSlider.jsx";
import EntityCard from "../../components/entitycard/EntityCard.jsx";
import {t} from "../../utils/OrganizationUtils.jsx";

const DashboardReservations = ({ dashboardData, isFetching }) => {
    let showMyBookings = dashboardData?.ShowMyBookings;
    let bookings = dashboardData?.Bookings;
    if (!toBoolean(showMyBookings)){
        return '';
    }

    return (
        <EntityCard title={t('Reservations')} link={'/reservations/:orgId'} isFetching={isFetching}>
            {showMyBookings &&
                <div className='modern-dashboard-block modern-dashboard-slick-block'>
                    {!anyInList(bookings) &&
                        <div className="modern-empty-card">
                            You don't have any upcoming bookings
                        </div>
                    }

                    {anyInList(bookings) &&
                        <SlickSlider>
                            {bookings.map((booking, index) => (
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
                </div>
            }
        </EntityCard>
    );
};

export default DashboardReservations
