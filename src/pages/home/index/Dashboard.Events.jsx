import {anyInList, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {SlickSlider} from "../../../components/slickslider/SlickSlider.jsx";
import EntityCard from "../../../components/entitycard/EntityCard.jsx";
import {e} from "../../../utils/OrganizationUtils.jsx";
import { Button } from 'antd'
import { ErrorBlock } from 'antd-mobile'
import {EventRouteNames} from "../../../routes/EventRoutes.jsx";

const DashboardEvents = ({ dashboardData, isFetching }) => {
    let events = dashboardData?.Events;
    let showEvents = dashboardData?.ShowEvents;
    
    // if (!toBoolean(showEvents)){
    //     return '';
    // }
    
    return (
        <EntityCard title={e('Events')} link={EventRouteNames.EVENT_LIST} isFetching={isFetching} addPadding={true}>
            {anyInList(events) ? (
                <SlickSlider>
                    {events.map((booking, index) => (
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
            ) : (
                <ErrorBlock status='empty' title='You dont signup to any events' description={''} >
                    <Button type='primary'>Signup Now</Button>
                </ErrorBlock>
            )}
        </EntityCard>
    );
};

export default DashboardEvents
