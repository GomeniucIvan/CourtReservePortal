import React, { useState } from 'react';
import {SchedulerItem} from "./items/SchedulerItemDisplay.jsx";

const InnerSchedulerItem = (props) => {
    const {
        useCore,
    } = props;
    const dataItem = props.dataItem;

    const isLightVersionEventSlot = typeof dataItem.IsLightVersion !== 'undefined' ? dataItem.IsLightVersion : false;

    const [isHovered, setIsHovered] = useState(false);

    const renderTooltipInfoIcon = (dataItem) => {
        if (dataItem.ReservationId != 0 && (dataItem.IsCanceled || (canUserEditItem(dataItem) == false && toBoolean(dataItem.IsCanceled) == false) && !dataItem.IsComboReservation)) {
            return (
                <div className="pull-left kendoTooltip ml-15">
                    <span
                        className="infoBtn"
                        data-id={dataItem.ReservationId}
                        data-eventid={dataItem.EventId}
                        data-courtid={dataItem.CourtId}
                    >
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                </div>
            )
        } else if (dataItem.ReservationId != 0 && !dataItem.IsComboReservation) {
            return (
                <div className="pull-left kendoTooltip">
                    <span
                        className="infoBtn"
                        data-courtid={dataItem.CourtId}
                        data-eventid={dataItem.EventId}
                        data-id={dataItem.ReservationId}
                    >
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                </div>
            )
        }
        return null;
    }

    return (
        <SchedulerItem
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
            style={{
                ...props.style,
                zIndex: isHovered ? '2' : '1'
            }}
        >
            <span>
                {dataItem.IsWaitListSlot && dataItem.IsAvailableTemplate && (
                    <div style={{ backgroundColor: '#cdf5b6', color: '#3a3a3a' }} className={`main-reservation-container --waitlist-event`}>
                        <div className='reservation-container'>
                            <div>
                                <span style={{ fontWeight: 'bold', fontWize: 'larger' }}>
                                    {dataItem.Title}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {dataItem.IsWaitListSlot && !dataItem.IsAvailableTemplate && (
                    <div style={{ background: dataItem.ReservationColor, color: dataItem.ReservationTextColor, cursor: 'pointer' }} className="main-reservation-container --waitlist-event" onDoubleClick={() => onWaitlistMeClicked(dataItem.CourtId, dataItem.Start, dataItem.End)}>
                        <div
                            className="reservation-container">
                            <span style={{ fontWeight: 'bold', fontSize: '11px' }} onClick={() => onWaitlistMeClicked(dataItem.CourtId, dataItem.Start, dataItem.End)}>
                                Waitlist Player
                            </span>
                            {dataItem.ShowWaitList && (
                                <a
                                    style={{ color: 'red', fontSize: '10px' }}
                                    className="link-reservation-update"
                                    onClick={() => showQueuedMembers(dataItem.start, dataItem.end)}
                                >
                                    {dataItem.WaitListCount} waiting
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {!dataItem.IsWaitListSlot && isUsingCourtWaitListing && dataItem.ReservationQueueSlotId != null &&
                    <div className="main-reservation-container">
                        <span className="pull-left">
                            <i className="fa fa-lock reservation-lock-item"></i>
                        </span>
                        <div className="wl-reserved-body">
                            <span className="wl-reserved-title">Processing Waitlist</span>

                            <span>{dataItem.QueueMemberSlotToDisplay}</span>
                            <span>{dataItem.QueueMembersToDisplay}</span>
                        </div>
                    </div>
                }

                {!dataItem.IsWaitListSlot && dataItem.ReservationQueueSlotId == null &&
                    <div className="main-reservation-container" style={{ background: dataItem.ReservationColor, color: dataItem.ReservationTextColor }}>
                        {dataItem.IsCanceled && (
                            <div className="pull-left scheduler-ban-icon" data-toggle="tooltip" data-placement="top" title="Canceled">
                                <i className="fa fa-ban"></i>
                            </div>
                        )}

                        {canUserEditItem(dataItem) == false && dataItem.EventId == null && toBoolean(dataItem.IsCanceled) == false && (
                            <span className="pull-left">
                                <i className="fa fa-lock reservation-lock-item"></i>
                            </span>
                        )}
                        {canUserEditItem(dataItem) == false && dataItem.EventId != null && toBoolean(dataItem.IsCanceled) == false && (
                            <span className="pull-left">
                                <i className="fa fa-lock event-lock-item"></i>
                            </span>
                        )}

                        {renderTooltipInfoIcon(dataItem)}

                        {(dataItem.HasEventCoordinators ||
                            (isLightVersionEventSlot && !isNullOrEmpty(dataItem.InstructorInfoJson)) ||
                            (!isLightVersionEventSlot && dataItem.Instructors != null)) && (
                                <div className="row ">
                                    <div className="pull-right scheduler-badges light-instructor-badges" dangerouslySetInnerHTML={{ __html: displayInstructorsRow(dataItem, isLightVersionEventSlot) }}></div>
                                </div>
                            )}

                        {/* Start Open Reservation Region */}
                        {dataItem.IsOpenReservation && !dataItem.IsOpenMatchFinalize && (
                            <div className="row">
                                <div className="pull-right scheduler-badges">
                                    {dataItem.MatchMakerIsPrivateMatch && <span className="pull-left">
                                        <i className="fa fa-lock pull-left"></i>
                                    </span>}

                                    <span className="schedule-reservation-top-right-badge">
                                        <span className="badge badge-round-radius badge-info owner-badge text-uppercase pm-scheduler-badge" style={{ background: `${dataItem.ReservationTextColor}`, color: `${dataItem.ReservationColor}`, fontWeight: 'unset !important' }}>
                                            {dataItem.MatchMakerNumberOfPlayersToDisplay}
                                        </span>
                                        <span className="badge badge-round-radius badge-info owner-badge text-uppercase pm-scheduler-badge" style={{ background: `${dataItem.ReservationTextColor}`, color: `${dataItem.ReservationColor}`, fontWeight: 'unset !important' }}>
                                            OPEN
                                        </span>

                                        {/*{dataItem.ShowCustomRatings && (*/}
                                        {/*    <span className="badge badge-round-radius badge-info owner-badge text-uppercase pm-scheduler-badge" style={{ background: `${dataItem.ReservationTextColor}`, color: `${dataItem.ReservationColor}`, fontWeight: 'unset !important' }}>*/}
                                        {/*        {dataItem.CustomRatingNames}*/}
                                        {/*    </span>*/}
                                        {/*)}*/}
                                        {/*{dataItem.ShowMatchMakerType && (*/}
                                        {/*    <span className="badge badge-round-radius badge-info owner-badge text-uppercase pm-scheduler-badge" style={{ background: `${dataItem.ReservationTextColor}`, color: `${dataItem.ReservationColor}`, fontWeight: 'unset !important' }}>*/}
                                        {/*        {dataItem.MatchMakerTypeName}*/}
                                        {/*    </span>*/}
                                        {/*)}*/}
                                    </span>
                                </div>
                            </div>
                        )}

                        {dataItem.IsOrgClosed && <div className="orgClosed" style={{ width: '100%' }}>{dataItem.ReservationName}</div>}
                        {dataItem.IsCourtClosed && (
                            <div className="courtClosed" title={dataItem.CourtClosedReason}>
                                <p>{dataItem.ReservationName}</p>
                                {dataItem.ClosedUntil && <p>{dataItem.ClosedUntil}</p>}
                            </div>
                        )}

                        {!isNullOrEmpty(dataItem.ClosureTypeId) && dataItem.ClosureTypeId > 0 && (!dataItem.IsRecurring || !allowToEditRecurringReservationsAndClosures) && (
                            <div className="reservation-container" data-closuretypeid={dataItem.ClosureTypeId}>
                                <div style={{ marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {dataItem.ReservationType}
                                    </span>

                                    <a
                                        href={`/Closure/UpdateClosure?reservationId=${dataItem.ReservationId}`}
                                        className="link-reservation-update link-closure"
                                        style={{ color: `${dataItem.ReservationTextColor}`, cursor: 'pointer' }}
                                    >
                                        <div>
                                            {dataItem.ClosureDisplayDatesAndTimes}
                                            {dataItem.IsRecurring && <span className="fa fa-repeat">&nbsp;</span>}
                                        </div>
                                    </a>
                                    {showNotesOnSchedulers && (
                                        <>
                                            {dataItem.Note && (
                                                <div style={{ display: 'block' }}>{dataItem.Note}</div>
                                            )}
                                            {(dataItem.EventNote && isNullOrEmpty(dataItem.Note)) && (
                                                <div style={{ display: 'block' }}>{dataItem.EventNote}</div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {(dataItem.IsReservedByAnotherCourt && !dataItem.IsOrgClosed) && (
                            <div className="reservation-container" data-reservationid={dataItem.ReservationId}>
                                {dataItem.ResComboCourts.map((court, index) => (
                                    <div key={index} style={{ marginBottom: '5px' }}>
                                        <span style={{ fontWeight: 'bold' }}>{court.Title}</span>

                                        <a
                                            onClick={() => openModalDialog(`/Reservation/UpdateReservation?reservationId=${court.ReservationId}`, (dataItem.IsEvent ? 'lg' : 'xl'))}
                                            className="link-reservation-update"
                                            style={{ color: `${dataItem.ReservationTextColor}`, cursor: 'pointer' }}
                                        >
                                            <span>
                                                {court.StartDisplayTime} - {court.EndDisplayTime}
                                            </span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}

                        {dataItem.IsDynamicSlot && (
                            <div className="main-reservation-container dynamic-container" style={{ background: 'white', display: 'flex' }}>
                                <button
                                    type="button"
                                    style={isMobileLayout ? { maxHeight: '100% !important', height: '100% !important' } : null}
                                    className="btn btn-default slot-btn btn-xs btn-expanded-slot slot-tr-height"
                                    start={dataItem.Start}
                                    end={dataItem.End}
                                    courtid={dataItem.CourtId}
                                >
                                    {dataItem.ButtonName}
                                </button>
                            </div>
                        )}

                        {(!dataItem.IsDynamicSlot && !dataItem.IsOrgClosed && (isNullOrEmpty(dataItem.ClosureTypeId) || dataItem.ClosureTypeId <= 0) && !dataItem.IsCourtClosed) && (
                            <div
                                data-reservationid={dataItem.ReservationId}
                                className={`reservation-container ${dataItem.IsEvent ? '--event-event-item' : '--event-reservation-item'} ${dataItem.HasUnpaidItems ? '--unpaid-item' : ''}`}
                            >
                                <div className="reservation-number-container">
                                    <a
                                        onClick={() => openModalDialog(`/Reservation/UpdateReservation?reservationId=${dataItem.ReservationId}`, (dataItem.IsEvent ? 'lg' : 'xl'))}
                                        className="link-reservation-update"
                                        style={{ color: `${dataItem.ReservationTextColor}`, cursor: 'pointer' }}
                                    >
                                        {dataItem.IsEvent && dataItem.LeagueSessionId == null && (
                                            <span style={{ display: '' }}>{dataItem.EventCategory}</span>
                                        )}
                                    </a>
                                </div>

                                <span style={{ fontWeight: 'bold' }}>
                                    {dataItem.ReservationName && dataItem.ReservationName.length > 1 && (!useCore || useCore && !dataItem.IsComboReservation) && (
                                        <>
                                            {dataItem.ReservationName}
                                        </>
                                    )}
                                    {dataItem.ReservationName && dataItem.ReservationName.length > 1 && useCore && dataItem.IsComboReservation && (
                                        <>
                                            Combo Reservation
                                        </>
                                    )}
                                    {(!dataItem.ReservationName || dataItem.ReservationName.length <= 1) && (
                                        <>
                                            {dataItem.ReservationType}
                                        </>
                                    )}
                                </span>

                                {dataItem.DisplayResourcesList && (
                                    <div style={{ display: 'block' }}>{dataItem.DisplayResourcesList}</div>
                                )}

                                {useCore && dataItem.IsComboReservation && (
                                    <span>{dataItem.StartDisplayTime} - {dataItem.EndDisplayTime}</span>
                                )}

                                {(!useCore || !dataItem.IsComboReservation) && (
                                    <a
                                        onClick={() => openModalDialog(`/Reservation/UpdateReservation?reservationId=${dataItem.ReservationId}`, (dataItem.IsEvent ? 'lg' : 'xl'))}
                                        className="link-reservation-update"
                                        style={{ color: `${dataItem.ReservationTextColor}`, cursor: 'pointer' }}
                                    >
                                        <div>
                                            {dataItem.ClosureTypeId > 0 &&
                                                <>
                                                    {dataItem.ClosureDisplayDatesAndTimes}
                                                </>
                                            }

                                            {(dataItem.ClosureTypeId == null || dataItem.ClosureTypeId <= 0) &&
                                                <>
                                                    {dataItem.StartDisplayTime} - {dataItem.EndDisplayTime}
                                                </>
                                            }

                                            {dataItem.IsRecurring && <span className="fa fa-repeat">&nbsp;</span>}

                                        </div>
                                    </a>
                                )}

                                {dataItem.RegistrantsCountDisplay > 0 && !hideCheckInFromReservations && !dataItem.IsCanceled && !dataItem.IsOpenReservation && (
                                    <a
                                        className="check-in-button"
                                        onClick={() => openModalDialog(`/Reservation/GetReservationMembers?reservationId=${dataItem.ReservationId}`)}
                                        style={{ color: `${dataItem.ReservationTextColor}`, cursor: 'pointer', float: 'left' }}
                                    >
                                        {dataItem.HasMembersToCheckIn && (
                                            <i className="fa fa-exclamation-triangle scheduler-triangle" data-toggle="tooltip" data-placement="top" title={`You have ${Organization.MembersEntity.toLowerCase()} to check-in`}></i>
                                        )}
                                        {!dataItem.HasMembersToCheckIn && (
                                            <i className="fa fa-check-square scheduler-check" data-toggle="tooltip" data-placement="top" title={`All ${Organization.MembersEntity.toLowerCase()} are check-in`}></i>
                                        )}
                                    </a>
                                )}

                                {!hidePaymentInfoOnScheduler && dataItem.HasUnpaidItems && !dataItem.IsCanceled && (
                                    <a
                                        data-toggle="modal"
                                        data-target=".action-modal"
                                        style={{ cursor: 'pointer' }}
                                        data-remote={`/Reservation/GetReservationMembers?reservationId=${dataItem.ReservationId}`}
                                    >
                                        <i className={`${currencyIcon} unpaid-reservation scheduler-dollar`} style={{ color: `${dataItem.ReservationTextColor}` }} data-toggle="tooltip" data-placement="top" title={`${dataItem.IsEvent ? ' Has unpaid registrants ' : ' This reservation is unpaid '}`}></i>
                                    </a>
                                )}

                                {dataItem.IsCanceled && (
                                    <span className="canceled-res-icon">
                                        CANCELED
                                    </span>
                                )}

                                {donTrackMember != true && (
                                    <>
                                        {dataItem.IsEvent && (
                                            <a
                                                onClick={() => openModalDialog(`/Reservation/GetReservationMembers?reservationId=${dataItem.ReservationId}`)}
                                                data-width="xl"
                                                className="link-reservation-update link-slot-info"
                                                style={{ color: `${dataItem.ReservationTextColor}` }}
                                            >
                                                {dataItem.SlotsInfoForAdmin}
                                            </a>
                                        )}

                                        {dataItem.ShowIsFullInfoForAdmin && (
                                            <div style={{ display: 'block', paddingTop: '2px', paddingBottom: '1px' }}>
                                                <span className="label label-danger full-event">FULL</span>

                                                {dataItem.ShowWaitList && (
                                                    <a
                                                        className="link-reservation-update link-dwl-row"
                                                        style={{ color: `${dataItem.ReservationTextColor}` }}
                                                        onClick={() => displayWaitListFromScheduler(dataItem.ReservationId)}
                                                    >
                                                        {dataItem.DisplayWaitList}
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {!dataItem.ShowIsFullInfoForAdmin && dataItem.ShowWaitList && (
                                            <div style={{ display: 'block', paddingTop: '3px', paddingBottom: '1px' }}>
                                                <a
                                                    className="link-reservation-update link-dwl-row2"
                                                    style={{ color: `${dataItem.ReservationTextColor}` }}
                                                    onClick={() => displayWaitListFromScheduler(dataItem.ReservationId)}
                                                >
                                                    {dataItem.DisplayWaitList}
                                                </a>
                                            </div>
                                        )}

                                        {((!isLightVersionEventSlot && dataItem.MemberList != null && dataItem.MemberList.length > 0) || (isLightVersionEventSlot && !isNullOrEmpty(dataItem.MembersDisplay))) && (
                                            <>
                                                <a
                                                    onClick={() => openModalDialog(`/Reservation/GetReservationMembers?reservationId=${dataItem.ReservationId}`)}
                                                    data-width="xl"
                                                    className="link-reservation-update link-memberds-display-row"
                                                    style={{ color: `${dataItem.ReservationTextColor}` }}
                                                >
                                                    {displayPlayers(dataItem, isLightVersionEventSlot)}
                                                </a>
                                            </>
                                        )}

                                        <div dangerouslySetInnerHTML={{ __html: displayReservationUdfs(dataItem, isLightVersionEventSlot) }} />

                                        {showNotesOnSchedulers && (
                                            <>
                                                {dataItem.Note && (
                                                    <div style={{ display: 'block' }}>{dataItem.Note}</div>
                                                )}
                                                {dataItem.EventNote && (
                                                    <div style={{ display: 'block' }}>{dataItem.EventNote}</div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                }
            </span>
        </SchedulerItem>
    );
};


export default InnerSchedulerItem;