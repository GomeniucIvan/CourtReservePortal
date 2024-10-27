import * as React from "react";
import { useControlledState } from "../hooks/useControlledState.mjs";
import { findMaster } from "../utils/index.jsx";
import { DATA_ACTION } from "../constants/index.mjs";
import { useSchedulerFieldsContext, useSchedulerDataContext } from "../context/SchedulerContext.mjs";
import { SchedulerEditTaskContext } from "../context/SchedulerEditTaskContext.mjs";
import { useEditable } from "../hooks/useEditable.mjs";
import {setPage, toRoute} from "../../../../utils/RouteUtils.jsx";
import {EventRouteNames} from "../../../../routes/EventRoutes.jsx";
import {Flex} from "antd";

export const SchedulerEditTask = React.forwardRef((
    props,
    ref
) => {
    const {
        _ref,
        onDataAction,

        viewTask: viewTaskProp,

        removeDialog: propRemoveDialog,
        removeItem: propRemoveItem,
        onRemoveItemChange,

        occurrenceDialog: propOccurrenceDialog,
        showOccurrenceDialog: propShowOccurrenceDialog,
        onShowOccurrenceDialogChange,

        showRemoveDialog: propShowRemoveDialog,
        onShowRemoveDialogChange,

        ...taskProps
    } = props;

    const viewTask = React.useRef(null);

    React.useImperativeHandle(viewTask, () => ({ props, element: viewTask.current && viewTask.current.element }));
    React.useImperativeHandle(_ref, () => viewTask.current);
    React.useImperativeHandle(ref, () => viewTask.current);

    const VieTask = viewTaskProp || schedulerEditTaskDefaultProps.viewTask;
    const OccurrenceDialog = propOccurrenceDialog || schedulerEditTaskDefaultProps.occurrenceDialog;
    const RemoveDialog = propRemoveDialog || schedulerEditTaskDefaultProps.removeDialog;

    const editable = useEditable(props.editable);
    const fields = useSchedulerFieldsContext();

    const [data, dispatchData] = useSchedulerDataContext();

    const [series, setSeries] = React.useState(null);
    const [removeItem, setRemoveItem]
        = useControlledState(null, propRemoveItem, onRemoveItemChange);
    const [showRemoveDialog, setShowRemoveDialog]
        = useControlledState(false, propShowRemoveDialog, onShowRemoveDialogChange);
    const [showOccurrenceDialog, setShowOccurrenceDialog]
        = useControlledState(false, propShowOccurrenceDialog, onShowOccurrenceDialogChange);

    const handleRemoveClick = React.useCallback(
        (event) => {
            if (!editable.remove) { return; }

            setRemoveItem(props.dataItem, event);

            if (props.isRecurring) {
                setShowOccurrenceDialog(true, event);
            } else {
                setShowRemoveDialog(true, event);
            }
        },
        [
            setRemoveItem, props.dataItem,
            props.isRecurring,
            setShowOccurrenceDialog,
            setShowRemoveDialog
        ]
    );

    const handleCancel = React.useCallback(
        (event) => {
            setSeries(null);
            setRemoveItem(null, event);
            setShowRemoveDialog(false, event);
            setShowOccurrenceDialog(false, event);
        },
        [
            setSeries,
            setRemoveItem,
            setShowRemoveDialog,
            setShowOccurrenceDialog
        ]
    );

    const handleRemoveConfirm = React.useCallback(
        (event) => {
            if (onDataAction && removeItem) {
                onDataAction.call(undefined, {
                    type: DATA_ACTION.remove,
                    series,
                    dataItem: removeItem
                });
            }

            setRemoveItem(null, event);
            setShowRemoveDialog(false, event);
        },
        [
            removeItem,
            dispatchData,
            setShowRemoveDialog
        ]
    );

    const handleRemoveItemChange = React.useCallback(
        (value, event) => {
        if (!setRemoveItem) { return; }

        setRemoveItem(value, event);
    },
    [setRemoveItem]
);

    const handleRemoveDialogChange = React.useCallback(
        (value, event) => {
        if (!setShowRemoveDialog) { return; }

        setShowRemoveDialog(value, event);
    },
    [setShowRemoveDialog]
);

    const handleOccurrenceDialogChange = React.useCallback(
        (value, event) => {
        if (!setShowOccurrenceDialog) { return; }

        setShowOccurrenceDialog(value, event);
    },
    [setShowOccurrenceDialog]
);

    const handleOccurrenceClick = React.useCallback(
        (event) => {
            if (removeItem) {
                setSeries(false);
                setRemoveItem(props.dataItem, event);
                setShowRemoveDialog(true, event);
            }

            setShowOccurrenceDialog(false, event);
        },
        [
            setSeries,
            props.dataItem,
            removeItem,
            setRemoveItem,
            setShowRemoveDialog
        ]
    );

    const handleSeriesClick = React.useCallback(
        (event) => {
            if (removeItem) {
                setSeries(true);
                const dataItem = findMaster(removeItem, fields, data);

                setRemoveItem(dataItem, event);
                setShowRemoveDialog(true, event);
            }

            setShowOccurrenceDialog(false, event);
        },
        [
            fields,
            removeItem,
            setSeries,
            setRemoveItem,
            setShowRemoveDialog,
            setShowOccurrenceDialog
        ]
    );

    let dataItem = taskProps.dataItem;
    let showSignUpLink = true;
    let displayOrganziersOnCalendar = true;
    let showEventAvailableSlotsOnMemberPortal = true;
    let isMemberLoggedIn = true;
    
    return (
        <SchedulerEditTaskContext>
            <Flex align={'center'} justify={'center'}
                style={{ background: dataItem.EventTypeBgColor, color: dataItem.EventTypeTextColor, width: '100%' }}
            >
                <div style={{minHeight: '72px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center'}} 
                     onClick={() => {
                    let route = toRoute(EventRouteNames.EVENT_DETAILS, 'number', dataItem.Number);
                    setPage(setDynamicPages, dataItem.EventName, route);
                    navigate(route);
                }}>
                    <div style={{ color: dataItem.EventTypeTextColor }}>
                        <div>{dataItem.EventName}</div>
                        {displayOrganziersOnCalendar && dataItem.OranizersDisplay && (
                            <div>({dataItem.OranizersDisplay})</div>
                        )}
                    </div>

                    {dataItem.EventNote && (
                        <div> {dataItem.EventNote}</div>
                    )}

                    {!dataItem.InPast && (
                        <>
                            {dataItem.ShowSlotInfo && showEventAvailableSlotsOnMemberPortal && (
                                <div style={{ fontStyle: "italic" }}>{dataItem.SlotsInfo}</div>
                            )}
                            {dataItem.IsFull && showEventAvailableSlotsOnMemberPortal && (
                                <span className="label label-danger full-event">&nbsp;FULL&nbsp;</span>
                            )}

                            {/* Conditional rendering for registration or waitlist */}
                            {isMemberLoggedIn && (
                                <>
                                    {dataItem.AllowWaitList &&
                                    !dataItem.IsMemberInWaitList &&
                                    !dataItem.IsMemberRegistered &&
                                    dataItem.IsMemberRegistered ? (
                                        <div
                                            className="label"
                                            style={{
                                                fontSize: "75%",
                                                fontWeight: "normal",
                                                backgroundColor: "#9a9a9a",
                                            }}
                                        >
                                            Registered
                                        </div>
                                    ) : null}
                                </>
                            )}
                        </>
                    )}

                    {showSignUpLink && (
                        <div
                            style={{
                                textDecoration: "underline",
                                fontWeight: "bold",
                                color: dataItem.EventTypeTextColor
                            }}
                        >
                            {(dataItem.IsFull && dataItem. AllowWaitList)
                                ? dataItem.IsMemberInWaitList
                                    ? "EDIT WAITLIST"
                                    : "JOIN WAITLIST"
                                : dataItem.IsMemberRegistered
                                    ? "EDIT REGISTRATION"
                                    : "REGISTER"}
                        </div>
                    )}
                </div>
            </Flex>
        </SchedulerEditTaskContext>
    );
});

export const schedulerEditTaskDefaultProps = {
    viewTask: null,
    occurrenceDialog: null,
    removeDialog: null
};

SchedulerEditTask.displayName = 'KendoReactSchedulerEditTask';
