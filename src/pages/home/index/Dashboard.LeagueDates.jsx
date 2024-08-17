import {getValueOrDefault, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {SlickSlider} from "../../../components/slickslider/SlickSlider.jsx";
import {Skeleton} from "antd";

const ModernDashboardLeaguesDates = ({ leaguesDates, isFetching }) => {
    const buildDashboardOptInButton = () => {
        return '';
    }
    
    return (
        <SlickSlider>
            {leaguesDates.map((leagueSessionDate, index) => (
                <div className="fn-slide-item" key={index}>
                    <div className="modern-dashboard-shadow-card-margin">
                        <div className="modern-dashboard-shadow-card dashboard-league-date-card fn-league-date-card fn-click-effect">
                            {isFetching &&
                                <Skeleton.Input active={true} size={150} />
                            }

                            {!isFetching &&
                                <>
                                    <div onClick={() => {
                                        window.location.href = ``
                                    }}>
                                        <div className="modern-dashboard-shadow-icon-row  main-icon-row">
                                            <div className="modern-dashboard-shadow-icon">
                                                <i className="fa-solid fa-pickleball"></i>
                                            </div>

                                            <div className="modern-dashboard-shadow-icon-row-text">
                                                <div className="modern-dashboard-shadow-icon-row-text-main">
                                                    Game Day #{leagueSessionDate.GameDayNumber}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modern-dashboard-shadow-icon-row">
                                            <div className="modern-dashboard-shadow-icon">
                                                <i className="fa-regular fa-calendar-clock"></i>
                                            </div>

                                            <div className="modern-dashboard-shadow-icon-row-text">
                                                <div className="modern-dashboard-shadow-icon-row-value">
                                                    {leagueSessionDate.DisplayStartEndTime}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modern-dashboard-shadow-icon-row">
                                            <div className="modern-dashboard-shadow-icon">
                                                <i className="fa-solid fa-circle" style={{ color: 'green' }}></i>
                                            </div>

                                            <div className="modern-dashboard-shadow-icon-row-text">
                                                <div className="modern-dashboard-shadow-icon-row-value">
                                                    {leagueSessionDate.PlayingDisplay}
                                                </div>
                                            </div>
                                        </div>

                                        {(!isNullOrEmpty(leagueSessionDate.PriceToPay) && leagueSessionDate.PriceToPay > 0) &&
                                            <div className="modern-dashboard-shadow-icon-row">
                                                <div className="modern-dashboard-shadow-icon">
                                                    <i className="fa-light fa-dollar"></i>
                                                </div>

                                                <div className="modern-dashboard-shadow-icon-row-text">
                                                    <div className="modern-dashboard-shadow-icon-row-value">
                                                        {leagueSessionDate.PriceDisplay}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                        {!isNullOrEmpty(leagueSessionDate.ClosedMessage) &&
                                            <div className="modern-dashboard-shadow-icon-row">
                                                <div className="modern-dashboard-shadow-icon">
                                                    <i className="fa-solid fa-alarm-clock"></i>
                                                </div>

                                                <div className="modern-dashboard-shadow-icon-row-text">
                                                    <div className="modern-dashboard-shadow-icon-row-value red">
                                                        {leagueSessionDate.ClosedMessage}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div className="modern-dashboard-item-button-container fn-mobile-global-optin-container"
                                         id={`footerOptinButtonContainer_${leagueSessionDate.ReservationId}`}
                                         dangerouslySetInnerHTML={{
                                             __html: buildDashboardOptInButton(leagueSessionDate.ReservationId,
                                                 leagueSessionDate.LeagueId,
                                                 leagueSessionDate.LeagueSessionId,
                                                 leagueSessionDate.LeagueSessionRegistrationId,
                                                 (getValueOrDefault(leagueSessionDate.PriceToPay, 0) || toBoolean(leagueSessionDate.FamilyRegisteredMembersCount <= 1)),
                                                 leagueSessionDate.OrgMemberId,
                                                 leagueSessionDate.IsOptIn,
                                                 !leagueSessionDate.AllowToOptIn)
                                         }}>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            ))}
        </SlickSlider>
    );
};

export default ModernDashboardLeaguesDates
