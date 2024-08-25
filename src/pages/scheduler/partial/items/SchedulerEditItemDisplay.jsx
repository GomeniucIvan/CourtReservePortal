import * as React from 'react';
import { SchedulerOccurrenceDialog } from "../components/SchedulerOccurrenceDialog.jsx";
import { SchedulerRemoveDialog } from "../components/SchedulerRemoveDialog.mjs";
import { useId, Keys } from "@progress/kendo-react-common";
import { SchedulerDrag } from "../views/common/SchedulerDrag.mjs";
import { SchedulerResize } from "../views/common/SchedulerResize.mjs";
import { SchedulerViewItem } from "./SchedulerViewItemDisplay.jsx";
import { SchedulerEditItemContext } from "../context/SchedulerEditItemContext.mjs";
import { useFormItem, FORM_ITEM_ACTION } from "./hooks/use-form-item.mjs";
import { useShowOccurrenceDialog, SHOW_OCCURRENCE_DIALOG_ACTION } from "./hooks/use-show-occurrence-dialog.mjs";
import { useRemoveItem, REMOVE_ITEM_ACTION } from "./hooks/use-remove-item.mjs";
import { useShowRemoveDialog , SHOW_REMOVE_DIALOG_ACTION } from "./hooks/use-show-remove-item-dialog.mjs";
import { useDragItem, DRAG_ITEM_ACTION } from "./hooks/use-drag-itemDisplay.js";
import { useResizeItem, RESIZE_ITEM_ACTION } from "./hooks/use-resize-itemDisplay.js";
import { useSeries, SERIES_ACTION } from "./hooks/use-series.mjs";
import { ITEMS_SELECT_ACTION } from "../hooks/use-items-selection.mjs";
import { useSchedulerViewSelectedItemsContext, useSchedulerViewItemsContext, useSchedulerViewFocusedItemsContext, useSchedulerViewFocusedSlotsContext } from "../context/SchedulerViewContext.mjs";
import { ITEMS_FOCUS_ACTION } from "../hooks/use-items-focus.mjs";
import { SchedulerItemSelectionContext } from "../context/SchedulerContext.mjs";
import { useEditable } from "../hooks/useEditable.mjs";
import { SLOTS_FOCUS_ACTION } from "../hooks/use-slots-focus.mjs";

/**
 * Represents the default `editItem` component rendered by the [KendoReact Scheduler component]({% slug overview_scheduler %}).
 *
 * This is a composite component of the [`SchedulerViewItem`]({% slug api_scheduler_schedulerviewitem %}), extending it to provide editing through drag, resize and external form.
 */
export const SchedulerEditItem = React.forwardRef((
    props,
    ref
) => {
    // tslint:enable:max-line-length
    const {
        _ref,
        itemRef,

        onDataAction,

        ignoreIsAllDay,
        viewItem: propViewItem,

        series: propSeries,
        onSeriesChange,

        form: propForm,
        formItem: propFormItem,
        onFormItemChange,

        drag: propDrag,
        dragItem: propDragItem,
        onDragItemChange,

        resize: propResize,
        resizeItem: propResizeItem,
        onResizeItemChange,

        removeDialog: propRemoveDialog,
        removeItem: propRemoveItem,
        onRemoveItemChange,

        occurrenceDialog: propOccurrenceDialog,
        showOccurrenceDialog: propShowOccurrenceDialog,
        onShowOccurrenceDialogChange,

        showRemoveDialog: propShowRemoveDialog,
        onShowRemoveDialogChange,

        onFocus,
        onFocusAction,

        onMouseDown,
        onMouseDownAction,

        onMouseUp,
        onMouseUpAction,

        onClick,
        onClickAction,

        onDoubleClick,
        onDoubleClickAction,

        onRemoveClick,
        onRemoveClickAction,

        onPress,
        onPressAction,

        onDrag,
        onDragAction,

        onRelease,
        onReleaseAction,

        onResizePress,
        onResizePressAction,

        onResizeStartDrag,
        onResizeStartDragAction,

        onResizeEndDrag,
        onResizeEndDragAction,

        onResizeRelease,
        onResizeReleaseAction,

        onOccurrenceClick,
        onOccurrenceClickAction,

        onSeriesClick,
        onSeriesClickAction,

        onKeyDown,
        onKeyDownAction,

        onKeyUp,
        onKeyUpAction,

        onRemoveConfirm,
        onRemoveConfirmAction,

        onFormSubmit,
        onFormSubmitAction,

        onCancel,
        onCancelAction
    } = { ...schedulerEditItemDefaultProps, ...props };

    const [tabIndex, setTabIndex] = React.useState(props.tabIndex);
    const editItem = React.useRef(null);
    const item = React.useRef(null);
    const eventId = useId();

    React.useImperativeHandle(editItem, () => ({ props, element: item.current && item.current.element }));
    React.useImperativeHandle(ref, () => editItem.current);
    React.useImperativeHandle(_ref, () => item.current);
    React.useImperativeHandle(itemRef, () => item.current);

    const ViewItem = propViewItem || schedulerEditItemDefaultProps.viewItem;
    const Drag = propDrag || schedulerEditItemDefaultProps.drag;
    const Resize = propResize || schedulerEditItemDefaultProps.resize;
    const Form = propForm || schedulerEditItemDefaultProps.form;
    const OccurrenceDialog = propOccurrenceDialog || schedulerEditItemDefaultProps.occurrenceDialog;
    const RemoveDialog = propRemoveDialog || schedulerEditItemDefaultProps.removeDialog;

    const editable = useEditable(props.editable);

    const [selectedItems, dispatchItemSelection] = useSchedulerViewSelectedItemsContext();

    const [series, , dispatchSeries] = useSeries(null, propSeries, onSeriesChange);
    const [formItem, setFormItem, dispatchFormItem] = useFormItem(
        { series, onDataAction },
        [null, propFormItem, onFormItemChange]
    );
    const [dragItem, setDragItem, dispatchDragItem] = useDragItem(
        { dataItem: props.dataItem, ignoreIsAllDay: props.ignoreIsAllDay, isAllDay: props.isAllDay, onDataAction },
        [null, propDragItem, onDragItemChange]
    );
    const [resizeItem, setResizeItem, dispatchResizeItem] = useResizeItem(
        { dataItem: props.dataItem, onDataAction },
        [null, propResizeItem, onResizeItemChange]
    );

    const [removeItem, setRemoveItem, dispatchRemoveItem] = useRemoveItem(
        { series, onDataAction },
        [null, propRemoveItem, onRemoveItemChange]
    );

    const [showRemoveDialog, setShowRemoveDialog, dispatchShowRemoveDialog] = useShowRemoveDialog(false, propShowRemoveDialog, onShowRemoveDialogChange);
    const [showOccurrenceDialog, setShowOccurrenceDialog, dispatchShowOccurrenceDialog] = useShowOccurrenceDialog(false, propShowOccurrenceDialog, onShowOccurrenceDialogChange);

    const [items] = useSchedulerViewItemsContext();

    const [, dispatchViewItemsFocus] = useSchedulerViewFocusedItemsContext();
    const [, dispatchViewSlotsFocus] = useSchedulerViewFocusedSlotsContext();

    const selected = Boolean(item.current
        && selectedItems
        && selectedItems.some((si) => si.current === item.current));

    const state = React.useMemo(
        () => ({
            selected,
            series,
            formItem,
            dragItem,
            resizeItem,
            removeItem,
            showRemoveDialog,
            showOccurrenceDialog
        }),
        [dragItem, formItem, removeItem, resizeItem, selected, series, showOccurrenceDialog, showRemoveDialog]);

    const actionsReducerMap = React.useMemo(
        () => ({
            [SERIES_ACTION.set]: dispatchSeries,
            [SERIES_ACTION.toggle]: dispatchSeries,
            [SERIES_ACTION.reset]: dispatchSeries,
            [ITEMS_SELECT_ACTION.select]: dispatchItemSelection,
            [ITEMS_SELECT_ACTION.add]: dispatchItemSelection,
            [ITEMS_SELECT_ACTION.remove]: dispatchItemSelection,
            [ITEMS_SELECT_ACTION.reset]: dispatchItemSelection,
            [ITEMS_SELECT_ACTION.selectNext]: dispatchItemSelection,
            [ITEMS_SELECT_ACTION.selectPrev]: dispatchItemSelection,
            [FORM_ITEM_ACTION.set]: dispatchFormItem,
            [FORM_ITEM_ACTION.setMaster]: dispatchFormItem,
            [FORM_ITEM_ACTION.reset]: dispatchFormItem,
            [FORM_ITEM_ACTION.complete]: dispatchFormItem,
            [REMOVE_ITEM_ACTION.set]: dispatchRemoveItem,
            [REMOVE_ITEM_ACTION.reset]: dispatchRemoveItem,
            [REMOVE_ITEM_ACTION.complete]: dispatchRemoveItem,
            [SHOW_OCCURRENCE_DIALOG_ACTION.close]: dispatchShowOccurrenceDialog,
            [SHOW_OCCURRENCE_DIALOG_ACTION.open]: dispatchShowOccurrenceDialog,
            [SHOW_OCCURRENCE_DIALOG_ACTION.set]: dispatchShowOccurrenceDialog,
            [SHOW_OCCURRENCE_DIALOG_ACTION.toggle]: dispatchShowOccurrenceDialog,
            [SHOW_OCCURRENCE_DIALOG_ACTION.reset]: dispatchShowOccurrenceDialog,
            [SHOW_REMOVE_DIALOG_ACTION.close]: dispatchShowRemoveDialog,
            [SHOW_REMOVE_DIALOG_ACTION.open]: dispatchShowRemoveDialog,
            [SHOW_REMOVE_DIALOG_ACTION.set]: dispatchShowRemoveDialog,
            [SHOW_REMOVE_DIALOG_ACTION.toggle]: dispatchShowRemoveDialog,
            [SHOW_REMOVE_DIALOG_ACTION.reset]: dispatchShowRemoveDialog,
            [DRAG_ITEM_ACTION.start]: dispatchDragItem,
            [DRAG_ITEM_ACTION.drag]: dispatchDragItem,
            [DRAG_ITEM_ACTION.complete]: dispatchDragItem,
            [DRAG_ITEM_ACTION.completeOccurrence]: dispatchDragItem,
            [DRAG_ITEM_ACTION.completeSeries]: dispatchDragItem,
            [DRAG_ITEM_ACTION.set]: dispatchDragItem,
            [DRAG_ITEM_ACTION.reset]: dispatchDragItem,
            [DRAG_ITEM_ACTION.dragSelected]: dispatchDragItem,
            [RESIZE_ITEM_ACTION.start]: dispatchResizeItem,
            [RESIZE_ITEM_ACTION.startDrag]: dispatchResizeItem,
            [RESIZE_ITEM_ACTION.startDragSelected]: dispatchResizeItem,
            [RESIZE_ITEM_ACTION.endDrag]: dispatchResizeItem,
            [RESIZE_ITEM_ACTION.endDragSelected]: dispatchResizeItem,
            [RESIZE_ITEM_ACTION.complete]: dispatchResizeItem,
            [RESIZE_ITEM_ACTION.completeOccurrence]: dispatchResizeItem,
            [RESIZE_ITEM_ACTION.completeSeries]: dispatchResizeItem,
            [RESIZE_ITEM_ACTION.set]: dispatchResizeItem,
            [RESIZE_ITEM_ACTION.reset]: dispatchResizeItem,
            [ITEMS_FOCUS_ACTION.next]: dispatchViewItemsFocus,
            [ITEMS_FOCUS_ACTION.prev]: dispatchViewItemsFocus,
            [SLOTS_FOCUS_ACTION.left]: dispatchViewSlotsFocus,
            [SLOTS_FOCUS_ACTION.right]: dispatchViewSlotsFocus,
            [SLOTS_FOCUS_ACTION.up]: dispatchViewSlotsFocus,
            [SLOTS_FOCUS_ACTION.down]: dispatchViewSlotsFocus,
            null: () => {/** noop */ }
        }),
        [
            dispatchDragItem,
            dispatchFormItem,
            dispatchItemSelection,
            dispatchRemoveItem,
            dispatchResizeItem,
            dispatchSeries,
            dispatchShowOccurrenceDialog,
            dispatchShowRemoveDialog,
            dispatchViewItemsFocus,
            dispatchViewSlotsFocus
        ]
    );

    const handleFocus = React.useCallback(
        (event) => {
            if (onFocusAction) {
                const actions = onFocusAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item });
                }
            }

            if (onFocus) {
                onFocus.call(undefined, event);
            }
        },
        [actionsReducerMap, onFocus, onFocusAction, props, state]
    );

    const handleMouseDown = React.useCallback(
        (event) => {
            if (onMouseDownAction) {
                const actions = onMouseDownAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item });
                }
            }

            if (onMouseDown) {
                onMouseDown.call(undefined, event);
            }
        },
        [actionsReducerMap, onMouseDown, onMouseDownAction, props, state]
    );

    const handleMouseUp = React.useCallback(
        (event) => {
            if (onMouseUpAction) {
                const actions = onMouseUpAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item });
                }
            }

            if (onMouseUp) {
                onMouseUp.call(undefined, event);
            }
        },
        [actionsReducerMap, onMouseUp, onMouseUpAction, props, state]
    );

    const [, setSelectedItem] = React.useContext(SchedulerItemSelectionContext);

    const handleClick = React.useCallback(
        (event) => {
            if (onClickAction) {
                setSelectedItem(item.current);
                const actions = onClickAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item });
                }
            }

            if (onClick) {
                onClick.call(undefined, event);
            }
        },
        [actionsReducerMap, onClick, onClickAction, props, state]
    );

    const handleDoubleClick = React.useCallback(
        (event) => {
            if (onDoubleClickAction) {
                const actions = onDoubleClickAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter().map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item });
                }
            }

            if (onDoubleClick) {
                onDoubleClick.call(undefined, event);
            }
        },
        [onDoubleClickAction, onDoubleClick, props, actionsReducerMap, state]
    );

    const handleRemoveClick = React.useCallback(
        (event) => {
            if (onRemoveClickAction) {
                const actions = onRemoveClickAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item });
                }
            }

            if (onRemoveClick) {
                onRemoveClick.call(undefined, event);
            }
        },
        [onRemoveClickAction, onRemoveClick, props, actionsReducerMap, state]
    );

    const handlePress = React.useCallback(
        (event) => {
            if (onPressAction) {
                const actions = onPressAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event);
                }
            }

            if (onPress) {
                onPress.call(undefined, event);
            }
        },
        [onPressAction, onPress, props, actionsReducerMap, state]
    );

    const handleDrag = React.useCallback(
        (event) => {
            if (onDragAction) {
                const actions = onDragAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event.dragEvent.originalEvent))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event.dragEvent.originalEvent);
                }
            }

            if (onDrag) {
                onDrag.call(undefined, event);
            }
        },
        [onDragAction, onDrag, props, actionsReducerMap, state]
    );

    const handleRelease = React.useCallback(
        (event) => {
            if (onReleaseAction) {
                const actions = onReleaseAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event.dragEvent.originalEvent))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event.dragEvent.originalEvent);
                }
            }

            if (onRelease) {
                onRelease.call(undefined, event);
            }
        },
        [onReleaseAction, onRelease, props, actionsReducerMap, state]
    );

    const handleResizePress = React.useCallback(
        (event) => {
            if (onResizePressAction) {
                const actions = onResizePressAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event.dragEvent.originalEvent))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event.dragEvent.originalEvent);
                }
            }

            if (onResizePress) {
                onResizePress.call(undefined, event);
            }
        },
        [onResizePressAction, onResizePress, props, state, actionsReducerMap]
    );

    const handleResizeStartDrag = React.useCallback(
        (event) => {
            if (onResizeStartDragAction) {
                const actions = onResizeStartDragAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event.dragEvent.originalEvent))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event.dragEvent.originalEvent);
                }
            }

            if (onResizeStartDrag) {
                onResizeStartDrag.call(undefined, event);
            }
        },
        [onResizeStartDrag, onResizeStartDragAction, props, actionsReducerMap, state]
    );

    const handleResizeEndDrag = React.useCallback(
        (event) => {
            if (onResizeEndDragAction) {
                const actions = onResizeEndDragAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event.dragEvent.originalEvent))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event.dragEvent.originalEvent);
                }
            }

            if (onResizeEndDrag) {
                onResizeEndDrag.call(undefined, event);
            }
        },
        [onResizeEndDrag, onResizeEndDragAction, props, actionsReducerMap, state]
    );

    const handleResizeRelease = React.useCallback(
        (event) => {
            if (onResizeReleaseAction) {
                const actions = onResizeReleaseAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event.dragEvent.originalEvent))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event.dragEvent.originalEvent);
                }
            }

            if (onResizeRelease) {
                onResizeRelease.call(undefined, event);
            }
        },
        [onResizeReleaseAction, onResizeRelease, props, actionsReducerMap, state]
    );

    const handleFormSubmit = React.useCallback(
        (event) => {
            if (onFormSubmitAction) {
                const actions = onFormSubmitAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event);
                }
            }

            if (onFormSubmit) {
                onFormSubmit.call(undefined, event);
            }
        },
        [onFormSubmitAction, onFormSubmit, props, state, actionsReducerMap]
    );

    const handleCancel = React.useCallback(
        (event) => {
            if (onCancelAction) {
                const actions = onCancelAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event);
                }
            }

            if (onCancel) {
                onCancel.call(undefined, event);
            }
        },
        [onCancelAction, onCancel, props, state, actionsReducerMap]
    );

    const handleOccurrenceClick = React.useCallback(
        (event) => {
            if (onOccurrenceClickAction) {
                const actions = onOccurrenceClickAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event);
                }
            }

            if (onOccurrenceClick) {
                onOccurrenceClick.call(undefined, event);
            }
        },
        [onOccurrenceClickAction, onOccurrenceClick, props, state, actionsReducerMap]
    );

    const handleSeriesClick = React.useCallback(
        (event) => {
            if (onSeriesClickAction) {
                const actions = onSeriesClickAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event);
                }
            }

            if (onSeriesClick) {
                onSeriesClick.call(undefined, event);
            }
        },
        [onSeriesClickAction, onSeriesClick, props, state, actionsReducerMap]
    );

    const handleKeyDown = React.useCallback(
        (event) => {
            if (onKeyDownAction) {
                const actions = onKeyDownAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event.syntheticEvent))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event.syntheticEvent);
                }
            }

            if (onKeyDown) {
                onKeyDown.call(undefined, event);
            }
        },
        [onKeyDownAction, onKeyDown, props, state, actionsReducerMap]
    );

    const handleKeyUp = React.useCallback(
        (event) => {
            if (onKeyUpAction) {
                const actions = onKeyUpAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event.syntheticEvent))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event.syntheticEvent);
                }
            }

            if (onKeyUp) {
                onKeyUp.call(undefined, event);
            }
        },
        [onKeyUpAction, onKeyUp, props, state, actionsReducerMap]
    );

    const handleRemoveConfirm = React.useCallback(
        (event) => {
            if (onRemoveConfirmAction) {
                const actions = onRemoveConfirmAction(event, props, state);

                if (actions) {
                    Array.isArray(actions)
                        ? actions.filter(Boolean).map((action) => action && (actionsReducerMap)[action.type]({ ...action, item }, event.syntheticEvent))
                        : (actionsReducerMap)[actions.type]({ ...actions, item }, event.syntheticEvent);
                }
            }

            if (onRemoveConfirm) {
                onRemoveConfirm.call(undefined, event);
            }
        },
        [onRemoveConfirmAction, onRemoveConfirm, props, state, actionsReducerMap]
    );

    React.useEffect(() => {
        const isFirst = items.length && items[0].current === item.current;

        setTabIndex(props.tabIndex !== undefined
            ? props.tabIndex === null
                ? undefined
                : props.tabIndex
            : selectedItems.length === 0
                ? isFirst
                    ? 0
                    : undefined
                : undefined);
    }, [items, props.tabIndex, selectedItems.length]);

    return (
        <SchedulerEditItemContext
            props={props}
            form={[formItem, setFormItem, dispatchFormItem]}
            drag={[dragItem, setDragItem, dispatchDragItem]}
            resize={[resizeItem, setResizeItem, dispatchResizeItem]}
            remove={[removeItem, setRemoveItem, dispatchRemoveItem]}
            showRemoveDialog={[showRemoveDialog, setShowRemoveDialog, dispatchShowRemoveDialog]}
            showOccurrenceDialog={[showOccurrenceDialog, setShowOccurrenceDialog, dispatchShowOccurrenceDialog]}
        >
            <ViewItem
                {...props}
                _ref={item}
                itemRef={item}
                selected={selected}
                tabIndex={tabIndex}
                id={eventId}

                // Keyboard
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}

                // Focus
                onFocus={handleFocus}

                // Mouse
                onMouseUp={handleMouseUp}
                onMouseDown={handleMouseDown}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
                onRemoveClick={handleRemoveClick}

                // Drag
                onPress={handlePress}
                onDrag={handleDrag}
                onRelease={handleRelease}

                // Resize
                onResizePress={handleResizePress}
                onResizeEndDrag={handleResizeEndDrag}
                onResizeStartDrag={handleResizeStartDrag}
                onResizeRelease={handleResizeRelease}
            />
            {((dragItem && editable.drag)) && (Array.isArray(dragItem)
                ? dragItem.map((di, idx) => (
                    <Drag
                        key={idx}
                        ignoreIsAllDay={ignoreIsAllDay}
                        dataItem={di}
                        vertical={props.vertical}
                        viewItem={ViewItem}
                        item={props.item}
                    />
                ))
                : (<Drag
                    ignoreIsAllDay={ignoreIsAllDay}
                    dataItem={dragItem}
                    vertical={props.vertical}
                    viewItem={ViewItem}
                    item={props.item}
                />))}
            {((resizeItem && editable.resize)) && (Array.isArray(resizeItem)
                ? resizeItem.map((ri, idx) => (
                    <Resize
                        key={idx}
                        format={props.format}
                        ignoreIsAllDay={ignoreIsAllDay}
                        dataItem={ri}
                        viewItem={props.viewItem}
                        item={props.item}
                        vertical={props.vertical}
                    />
                ))
                : (
                    <Resize
                        format={props.format}
                        ignoreIsAllDay={ignoreIsAllDay}
                        dataItem={resizeItem}
                        viewItem={props.viewItem}
                        item={props.item}
                        vertical={props.vertical}
                    />
                ))}
            {(formItem && !showOccurrenceDialog && editable.edit) && (<Form
                dataItem={formItem}
                onSubmit={handleFormSubmit}
                onClose={handleCancel}
                onCancel={handleCancel}
            />)}
            {(showOccurrenceDialog) && (<OccurrenceDialog
                dataItem={formItem || dragItem || resizeItem || removeItem}
                isRemove={removeItem !== null}
                onClose={handleCancel}
                onOccurrenceClick={handleOccurrenceClick}
                onSeriesClick={handleSeriesClick}
            />)}
            {(showRemoveDialog && removeItem && editable.remove) && (<RemoveDialog
                dataItem={removeItem}
                onClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleRemoveConfirm}
            />)}
        </SchedulerEditItemContext>
    );
});

export const schedulerEditItemDefaultProps = {
    viewItem: SchedulerViewItem,
    drag: SchedulerDrag,
    resize: SchedulerResize,
    form: null, //todo iv
    occurrenceDialog: SchedulerOccurrenceDialog,
    removeDialog: SchedulerRemoveDialog,
    onClickAction: (event, _, state) => [
        {
            type: (event.syntheticEvent.metaKey || event.syntheticEvent.ctrlKey)
                ? (state.selected && !state.dragItem && !state.resizeItem)
                    ? ITEMS_SELECT_ACTION.remove
                    : ITEMS_SELECT_ACTION.add
                : ITEMS_SELECT_ACTION.select
        }],
    onDoubleClickAction: (_, props) => props.editable
        ? [
            { type: FORM_ITEM_ACTION.set, payload: props.dataItem },
            (props.isRecurring) && { type: SHOW_OCCURRENCE_DIALOG_ACTION.open }
        ].filter(Boolean)
        : [],
    onRemoveClickAction: (_, props) => props.editable
        ? [
            { type: REMOVE_ITEM_ACTION.set, payload: props.dataItem },
            props.isRecurring ? { type: SHOW_OCCURRENCE_DIALOG_ACTION.open } : { type: SHOW_REMOVE_DIALOG_ACTION.open }
        ]
        : [],
    onPressAction: (event, props) => props.editable
        ? { type: DRAG_ITEM_ACTION.start, payload: { x: event.dragEvent.clientX, y: event.dragEvent.clientY } }
        : [],
    onDragAction: (event, props) => props.editable
        ? {
            type: (event.dragEvent.originalEvent.metaKey || event.dragEvent.originalEvent.ctrlKey)
                ? DRAG_ITEM_ACTION.dragSelected
                : DRAG_ITEM_ACTION.drag,
            payload: { x: event.dragEvent.clientX, y: event.dragEvent.clientY }
        }
        : [],
    onReleaseAction: (event, props, state) => (props.editable && state.dragItem)
        ? (props.isRecurring && !props.isException && state.series === null)
            ? { type: SHOW_OCCURRENCE_DIALOG_ACTION.open }
            : {
                type: props.isRecurring
                    ? state.series
                        ? DRAG_ITEM_ACTION.completeSeries
                        : DRAG_ITEM_ACTION.completeOccurrence
                    : DRAG_ITEM_ACTION.complete,
                payload: { x: event.dragEvent.clientX, y: event.dragEvent.clientY }
            }
        : [],
    onResizePressAction: (event, props) => props.editable
        ? { type: RESIZE_ITEM_ACTION.start, payload: { x: event.dragEvent.clientX, y: event.dragEvent.clientY } }
        : [],
    onResizeStartDragAction: (event, props) => props.editable
        ? {
            type: (event.dragEvent.originalEvent.metaKey || event.dragEvent.originalEvent.ctrlKey)
                ? RESIZE_ITEM_ACTION.startDragSelected
                : RESIZE_ITEM_ACTION.startDrag,
            payload: { x: event.dragEvent.clientX, y: event.dragEvent.clientY }
        }
        : [],
    onResizeEndDragAction: (event, props) => props.editable
        ? {
            type: (event.dragEvent.originalEvent.metaKey || event.dragEvent.originalEvent.ctrlKey)
                ? RESIZE_ITEM_ACTION.endDragSelected
                : RESIZE_ITEM_ACTION.endDrag,
            payload: { x: event.dragEvent.clientX, y: event.dragEvent.clientY }
        }
        : [],
    onResizeReleaseAction: (event, props, state) => (props.editable && state.resizeItem)
        ? (props.isRecurring && !props.isException && state.series === null)
            ? { type: SHOW_OCCURRENCE_DIALOG_ACTION.open }
            : {
                type: props.isRecurring
                    ? state.series
                        ? RESIZE_ITEM_ACTION.completeSeries
                        : RESIZE_ITEM_ACTION.completeOccurrence
                    : RESIZE_ITEM_ACTION.complete,
                payload: { x: event.dragEvent.clientX, y: event.dragEvent.clientY }
            }
        : [],
    onOccurrenceClickAction: (_event, props, state) => {
        if (state.dragItem) {
            return [
                { type: DRAG_ITEM_ACTION.completeOccurrence },
                { type: SHOW_OCCURRENCE_DIALOG_ACTION.close }
            ];
        }

        if (state.resizeItem) {
            return [
                { type: RESIZE_ITEM_ACTION.completeOccurrence },
                { type: SHOW_OCCURRENCE_DIALOG_ACTION.close }
            ];
        }

        if (state.formItem) {
            return [
                { type: SERIES_ACTION.set, payload: false },
                { type: FORM_ITEM_ACTION.set, payload: props.dataItem },
                { type: SHOW_OCCURRENCE_DIALOG_ACTION.close }
            ];
        }

        if (state.removeItem) {
            return [
                { type: SERIES_ACTION.set, payload: false },
                { type: REMOVE_ITEM_ACTION.set, payload: props.dataItem },
                { type: SHOW_REMOVE_DIALOG_ACTION.open },
                { type: SHOW_OCCURRENCE_DIALOG_ACTION.close }
            ];
        }

        return [];
    },
    onSeriesClickAction: (_event, props, state) => {
        if (state.dragItem) {
            return [
                { type: DRAG_ITEM_ACTION.completeSeries },
                { type: SHOW_OCCURRENCE_DIALOG_ACTION.close }
            ];
        }

        if (state.resizeItem) {
            return [
                { type: RESIZE_ITEM_ACTION.completeSeries },
                { type: SHOW_OCCURRENCE_DIALOG_ACTION.close }
            ];
        }

        if (state.formItem) {
            return [
                { type: SERIES_ACTION.set, payload: true },
                { type: FORM_ITEM_ACTION.setMaster, payload: props.dataItem },
                { type: SHOW_OCCURRENCE_DIALOG_ACTION.close }
            ];
        }

        if (state.removeItem) {
            return [
                { type: SERIES_ACTION.set, payload: true },
                { type: REMOVE_ITEM_ACTION.set, payload: props.dataItem },
                { type: SHOW_REMOVE_DIALOG_ACTION.open },
                { type: SHOW_OCCURRENCE_DIALOG_ACTION.close }
            ];
        }

        return [];
    },
    onKeyDownAction: (event, props) => {
        switch (event.syntheticEvent.keyCode) {
            case Keys.enter:
                return [
                    { type: FORM_ITEM_ACTION.set, payload: props.dataItem },
                    (props.isRecurring) && { type: SHOW_OCCURRENCE_DIALOG_ACTION.open }
                ];
            case Keys.tab:
                return [
                    { type: event.syntheticEvent.shiftKey ? ITEMS_FOCUS_ACTION.prev : ITEMS_FOCUS_ACTION.next, ignoreIsAllDay: props.ignoreIsAllDay },
                    { type: event.syntheticEvent.shiftKey ? ITEMS_SELECT_ACTION.selectPrev : ITEMS_SELECT_ACTION.selectNext, ignoreIsAllDay: props.ignoreIsAllDay }
                ];
            case Keys.up:
                return [
                    Boolean(props.slots.length && props.slots[0]._ref.current) && { type: SLOTS_FOCUS_ACTION.up, slot: props.slots[0]._ref }
                ];
            case Keys.right:
                return [
                    Boolean(props.slots.length && props.slots[0]._ref.current) && { type: SLOTS_FOCUS_ACTION.right, slot: props.slots[0]._ref }
                ];
            case Keys.down:
                return [
                    Boolean(props.slots.length && props.slots[props.slots.length - 1]._ref.current) && { type: SLOTS_FOCUS_ACTION.down, slot: props.slots[props.slots.length - 1]._ref }
                ];
            case Keys.left:
                return [
                    Boolean(props.slots.length && props.slots[0]._ref.current) && { type: SLOTS_FOCUS_ACTION.left, slot: props.slots[0]._ref }
                ];
            default:
                return;
        }
    },
    onFormSubmitAction: (event) => ([
        { type: FORM_ITEM_ACTION.complete, payload: event.value }
    ]),
    onRemoveConfirmAction: () => [
        { type: REMOVE_ITEM_ACTION.complete },
        { type: SHOW_OCCURRENCE_DIALOG_ACTION.close }
    ],
    onCancelAction: () => [
        { type: SERIES_ACTION.reset },
        { type: REMOVE_ITEM_ACTION.reset },
        { type: FORM_ITEM_ACTION.reset },
        { type: DRAG_ITEM_ACTION.reset },
        { type: RESIZE_ITEM_ACTION.reset },
        { type: SHOW_REMOVE_DIALOG_ACTION.reset },
        { type: SHOW_OCCURRENCE_DIALOG_ACTION.reset }
    ]
};

SchedulerEditItem.displayName = 'KendoReactSchedulerEditItem';
