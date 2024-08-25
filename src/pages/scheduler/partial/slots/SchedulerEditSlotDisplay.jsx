import * as React from 'react';
import { Keys } from "@progress/kendo-react-common";
import { setField, isGroupped, getField, findFirstItem } from "../utils/index.mjs";
import { SchedulerForm } from "../components/SchedulerForm.mjs";
import { SchedulerViewSlot } from "./SchedulerViewSlotDisplay.jsx";
import { useControlledState } from "../hooks/useControlledState.mjs";
import { useSchedulerFieldsContext } from "../context/SchedulerContext.mjs";
import { SchedulerEditSlotContext } from "../context/SchedulerEditSlotContext.mjs";
import { SLOTS_SELECT_ACTION } from "../hooks/use-slots-selection.mjs";
import { DATA_ACTION } from "../constants/index.mjs";
import { useEditable } from "../hooks/useEditable.mjs";
import { useSchedulerViewSlotsContext, useSchedulerViewItemsContext, useSchedulerViewSelectedSlotsContext, useSchedulerViewFocusedSlotsContext } from "../context/SchedulerViewContext.mjs";
import { SLOTS_FOCUS_ACTION } from "../hooks/use-slots-focus.mjs";


export const SchedulerEditSlot = React.forwardRef((props, ref) => {
    const {
        _ref,
        onDataAction,
        viewSlot: propViewSlot,

        form: propForm,
        formItem: propFormItem,
        onFormItemChange,

        ...viewSlotProps
    } = props;

    const [tabIndex, setTabIndex] = React.useState(props.tabIndex);
    const slot = React.useRef(null);
    const editableSlot = React.useRef(null);

    React.useImperativeHandle(editableSlot, () => ({ props }));
    React.useImperativeHandle(ref, () => editableSlot.current);
    React.useImperativeHandle(_ref, () => slot.current);

    const editable = useEditable(props.editable);

    const fields = useSchedulerFieldsContext();
    const [slots] = useSchedulerViewSlotsContext();
    const [items] = useSchedulerViewItemsContext();
    const [selectedSlots, dispatchSlotsSelection] = useSchedulerViewSelectedSlotsContext();
    const [, dispatchFocusedSlots] = useSchedulerViewFocusedSlotsContext();

    const Form = propForm || schedulerEditSlotDefaultProps.form;
    const ViewSlot = propViewSlot || schedulerEditSlotDefaultProps.viewSlot;

    const [formItem, setFormItem]
        = useControlledState(null, propFormItem, props.onFormItemChange);

    const selected = selectedSlots.some((s) => Boolean(s.current
        && s.current.props.start.getTime() === props.start.getTime()
        && s.current.props.end.getTime() === props.end.getTime()
        && s.current.props.index === props.index
        && s.current.props.group.index === props.group.index
        && s.current.props.range.index === props.range.index
        && s.current.props.isAllDay === props.isAllDay));

    const createDataItemFromSlot = React.useCallback(
        () => {
            const dataItem = {};

            setField(dataItem, fields.start, new Date(props.start.getTime()));
            setField(dataItem, fields.end, new Date(props.end.getTime()));
            setField(dataItem, fields.isAllDay, props.isAllDay);

            if (props.group.resources.length) {
                for (let idx = 0; idx < props.group.resources.length; idx++) {
                    const resource = props.group.resources[idx];

                    if (isGroupped(props.group.resources)) {
                        const value = getField(props.group.resources[idx], resource.valueField);
                        setField(dataItem, resource.field, resource.multiple ? [value] : value);
                    } else {
                        setField(dataItem, resource.field, resource.multiple ? [] : undefined);
                    }
                }
            }

            return dataItem;
        },
        [
            fields.start,
            fields.end,
            fields.isAllDay,
            props.start,
            props.end,
            props.isAllDay,
            props.group.resources
        ]);

    // Handlers

    // Focus
    const handleFocus = React.useCallback(
        (event) => {
            if (editable.select) {
                dispatchSlotsSelection({
                    type: SLOTS_SELECT_ACTION.select,
                    slot: slot
                }, event.syntheticEvent);
            }
            if (props.onFocus) {
                props.onFocus.call(undefined, event);
            }
        },
        [
            dispatchSlotsSelection,
            editable.select,
            props.onFocus
        ]
    );

    // Mouse
    const handleDoubleClick = React.useCallback(
        (event) => {
            if (editable.add) {
                const dataItem = createDataItemFromSlot();
                setFormItem(dataItem, event);
            }
            if (props.onDoubleClick) {
                props.onDoubleClick.call(undefined, event);
            }
        },
        [
            createDataItemFromSlot,
            editable.add,
            props.onDoubleClick,
            setFormItem
        ]
    );

    const handleKeyDown = React.useCallback(
        (event) => {
            let nextItem;

            switch (event.syntheticEvent.keyCode) {
                case Keys.left:
                    if (!slots) { return; }
                    event.syntheticEvent.preventDefault();
                    dispatchFocusedSlots({ type: SLOTS_FOCUS_ACTION.left, slot }, event.syntheticEvent);
                    break;
                case Keys.right:
                    if (!slots) { return; }
                    event.syntheticEvent.preventDefault();
                    dispatchFocusedSlots({ type: SLOTS_FOCUS_ACTION.right, slot }, event.syntheticEvent);
                    break;
                case Keys.up:
                    if (!slots) { return; }
                    event.syntheticEvent.preventDefault();
                    dispatchFocusedSlots({ type: SLOTS_FOCUS_ACTION.up, slot }, event.syntheticEvent);
                    break;
                case Keys.down:
                    if (!slots) { return; }
                    event.syntheticEvent.preventDefault();
                    dispatchFocusedSlots({ type: SLOTS_FOCUS_ACTION.down, slot }, event.syntheticEvent);
                    break;
                case Keys.enter: {
                    if (!slots || !editable.add) { return; }
                    const dataItem = createDataItemFromSlot();
                    setFormItem(dataItem);
                    break;
                }
                case Keys.tab:
                    nextItem = findFirstItem(event.target);
                    break;
                default:
                    break;
            }
            if (nextItem) {
                event.syntheticEvent.preventDefault();

                if (nextItem.element) {
                    nextItem.element.focus();
                }
            }
        },
        [createDataItemFromSlot, dispatchFocusedSlots, editable.add, setFormItem, slots]
    );

    const handleEditFormSubmit = React.useCallback(
        (event) => {
            if (onDataAction) {
                onDataAction.call(
                    undefined,
                    {
                        type: DATA_ACTION.create,
                        series: false,
                        dataItem: event.value
                    },
                    event);
            }

            setFormItem(null, event.syntheticEvent);
        },
        [
            onDataAction,
            setFormItem
        ]
    );

    const handleEditFormCancel = React.useCallback(
        (event) => {
            setFormItem(null, event.syntheticEvent);
        },
        [setFormItem]
    );

    const handleEditFormClose = React.useCallback(
        (event) => {
            setFormItem(null, event);
        },
        [setFormItem]
    );

    const handleFormItemChange = React.useCallback(
        (value, event) => {
            if (!setFormItem) { return; }

            setFormItem(value, event);
        },
        [setFormItem]
    );


    React.useEffect(() => {
        const isFirst = slots.length && slots[0].current === slot.current;


        setTabIndex(props.tabIndex !== undefined
            ? props.tabIndex === null
                ? undefined
                : props.tabIndex
            : selectedSlots.length === 0
                ? isFirst && items.length === 0
                    ? 0
                    : undefined
                : undefined);
    }, [items, props.tabIndex, selectedSlots.length, slots]);

    return (
        <SchedulerEditSlotContext
            props={props}
            form={[formItem, handleFormItemChange]}
        >
            <ViewSlot
                {...viewSlotProps}
                _ref={slot}
                selected={selected}
                tabIndex={tabIndex}

                // Focus
                onFocus={handleFocus}

                // Mouse
                onDoubleClick={handleDoubleClick}

                // Keyboard
                onKeyDown={handleKeyDown}
            />
            {(formItem) && (
                <Form
                    dataItem={formItem}
                    onSubmit={handleEditFormSubmit}
                    onClose={handleEditFormClose}
                    onCancel={handleEditFormCancel}
                />)}
        </SchedulerEditSlotContext>
    );
});

export const schedulerEditSlotDefaultProps = {
    viewSlot: SchedulerViewSlot,
    form: SchedulerForm
};

SchedulerEditSlot.displayName = 'KendoReactSchedulerEditSlot';