import styles from './Dashboard.module.less'
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {anyInList, equalString, extractTextFromHTML, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {SlickSlider} from "../../components/slickslider/SlickSlider.jsx";
import EntityCard from "../../components/entitycard/EntityCard.jsx";
import {t} from "../../utils/OrganizationUtils.jsx";
import {DrawerBottom} from "../../components/drawer/DrawerBottom.jsx";
import ModernDashboardLeaguesDates from "./Dashboard.LeagueDates.jsx";

const DashboardLeagues = ({ dashboardData, isFetching }) => {
    let [showLeaguesDrawer, setShowLeaguesDrawer] = useState(false);
    
    let myLeaguesDropdown = dashboardData?.MyLeaguesDropdown;
    let showLeaguesBlock = dashboardData?.ShowLeaguesBlock;
    let hideLeagues = !anyInList(dashboardData?.MyLeaguesDropdown) || isNullOrEmpty(dashboardData?.SelectedLeagueSessionId);

    if (!toBoolean(showLeaguesBlock)){
        return '';
    }

    return (
        <EntityCard title={t('Events')} link={'/reservations/:orgId'} isFetching={isFetching}>
            {showLeaguesBlock &&
                <div className='modern-dashboard-block modern-dashboard-slick-block'>
                    <div className="modern-dashboard-block-header">
                        <div className="modern-dashboard-block-header-title">
                            My Leagues
                        </div>

                        {!toBoolean(hideLeagues) &&
                            <div className="modern-dashboard-block-header-link">
                                <a href={``}>
                                    Standings
                                </a>
                            </div>
                        }


                    </div>
                    {toBoolean(hideLeagues) &&
                        <div className="modern-empty-card with-button">
                            You aren’t participating in any leagues

                            <div>
                                <a href={``} className="btn btn-green-shadow fn-disable">Join Now</a>
                            </div>
                        </div>
                    }

                    {!toBoolean(hideLeagues) &&
                        <>
                            <div style={{ margin: '0px', paddingBottom: '16px'  }}>
                                <div className="mobile-session-play-date-dd">
                                    <label>Select League</label>
                                    <a className="k-picker k-dropdown k-widget form-control k-picker-solid k-picker-md k-rounded-md">
                            <span className="k-input-inner" style={{ display: 'contents' }}>
                                <span className="k-input-value-text" id="leagueDropdownValue" style={{ fontSize: '13px' }} >
                                    test
                                </span>
                            </span>
                                        <button type="button" disabled="disabled" style={{ opacity: 1 }} className="k-select k-input-button k-button k-button-md k-button-solid k-button-solid-base k-icon-button">
                                            <span className="k-icon k-i-arrow-s k-button-icon"></span>
                                        </button>
                                    </a>
                                </div>
                            </div>

                            <DrawerBottom open={showLeaguesDrawer} redirect={true} closeDrawer={() => setShowLeaguesDrawer(false)} showButton={true} confirmButtonText={'Join A League'} label='Leagues' onConfirmButtonClick={() => { window.location.href =`` }}>
                                <>
                                    {myLeaguesDropdown.map((gameDay, index) => {
                                        return (
                                            <div key={index} className={`modal-footer-row with-bb fn-day-selection green-bg-selection`} style={{ justifyContent: 'space-between', padding: '0px 16px' }} >
                                                <div className="modal-icon-badge-wrapper">
                                                    <a data-name={gameDay.Name}>{gameDay.Name}</a>
                                                </div>

                                                <div style={{ paddingRight: '8px' }}>
                                                    <span className="fa fa-check fn-day-checkmark" style={{ display: 'none' }}></span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                            </DrawerBottom>

                            <div id="myleagues-slick-wrapper-html">
                                <ModernDashboardLeaguesDates leaguesDates={leaguesDates} orgId={orgId} leagueDatesLoading={leagueDatesLoading} />
                            </div>
                        </>
                    }
                </div>
            }
        </EntityCard>
    );
};

export default DashboardLeagues
