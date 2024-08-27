import * as React from 'react';
import { clone } from "@progress/kendo-react-common";
import moment from 'moment-timezone';
import { useControlledState } from "../../hooks/useControlledState.mjs";
import { setField, getField, slotDive } from "../../utils/index.jsx";
import { DATA_ACTION } from "../../constants/index.mjs";
import { useSchedulerViewSelectedItemsContext } from "../../context/SchedulerViewContext.mjs";
import { useSchedulerFieldsContext, useSchedulerGroupsContext } from "../../context/SchedulerContext.mjs";

export const DRAG_ITEM_ACTION = {
    set: 'DRAG_ITEM_SET',
    start: 'DRAG_ITEM_START',
    drag: 'DRAG_ITEM_DRAG',
    complete: 'DRAG_ITEM_COMPLETE',
    completeOccurrence: 'DRAG_ITEM_COMPLETE_OCCURRENCE',
    completeSeries: 'DRAG_ITEM_COMPLETE_SERIES',
    reset: 'DRAG_ITEM_RESET',
    dragSelected: 'DRAG_ITEM_DRAG_SELECTED'
};

export const useDragItem = (config, state) => {
    const offset = React.useRef(0);
    const initialXRef = React.useRef(0);
    const initialYRef = React.useRef(0);
    const oldSlot = React.useRef(null);

    const [dragItem, setDragItem] = useControlledState(...state);
    const [selectedItems] = useSchedulerViewSelectedItemsContext();

    const fields = useSchedulerFieldsContext();
    const groups = useSchedulerGroupsContext();

    const handleDragItemAction = (action) => {
        switch (action.type) {
            case DRAG_ITEM_ACTION.set: {
                setDragItem(action.payload);
                break;
            }
            case DRAG_ITEM_ACTION.reset: {
                setDragItem(null);
                break;
            }
            case DRAG_ITEM_ACTION.dragSelected: {
                if (
                    Math.abs(initialXRef.current - action.payload.x) < 10
                    && Math.abs(initialYRef.current - action.payload.y) < 10
                ) {
                    return;
                }

                const slot = slotDive(action.payload.x, action.payload.y, 7);
                if (!slot) { return; }
                if (slot === oldSlot.current) { return; }

                const dataItem = clone(config.dataItem);

                const slotStart = slot.getAttribute('data-slot-start');
                const slotIsAllDay = slot.getAttribute('data-slot-allday') === 'true';

                if (!config.ignoreIsAllDay && slotIsAllDay !== config.isAllDay) { return; }

                const itemStart = new Date(getField(dataItem, fields.start));

                const distance = Number(slotStart) - itemStart.getTime();

                const newDragItems = selectedItems.map((si) => {
                    if (!si.current) { return null; }
                    const selectedDataItem = clone(si.current.props.dataItem);
                    const selectedStart = new Date(si.current.props.start.getTime() + distance);
                    const selectedEnd = new Date(si.current.props.end.getTime() + distance);

                    setField(selectedDataItem, fields.start, selectedStart);
                    setField(selectedDataItem, fields.end, selectedEnd);

                    return selectedDataItem;
                }).filter(Boolean);

                oldSlot.current = slot;

                setDragItem([...newDragItems]);
                break;
            }
            case DRAG_ITEM_ACTION.start: {
                const clientX = action.payload.x;
                const clientY = action.payload.y;
                initialXRef.current = clientX;
                initialYRef.current = clientY;

                const slot = slotDive(clientX, clientY, 7);
                if (!slot) { return; }

                const dataItem = clone(config.dataItem);

                const slotStart = slot.getAttribute('data-slot-start');
                const itemStart = getField(dataItem, fields.start);

                if (slotStart === null) { return; }

                offset.current = Number(slotStart) - new Date(itemStart).getTime();

                break;
            }
            case DRAG_ITEM_ACTION.drag: {
                if (
                    Math.abs(initialXRef.current - action.payload.x) < 10
                    && Math.abs(initialYRef.current - action.payload.y) < 10
                ) {
                    return;
                }

                const slot = slotDive(action.payload.x, action.payload.y, 7);

                if (!slot) { return; }
                if (slot === oldSlot.current) { return; }

                const dataItem = clone(config.dataItem);

                let slotStart = slot.getAttribute('data-slot-start');
                const slotGroupIndex = slot.getAttribute('data-slot-group');
                const slotIsAllDay = slot.getAttribute('data-slot-allday') === 'true';

                if (!config.ignoreIsAllDay && slotIsAllDay !== config.isAllDay) { return; }

                const itemStart = new Date(getField(dataItem, fields.start));
                const itemEnd = new Date(getField(dataItem, fields.end));

                const duration = itemEnd.getTime() - itemStart.getTime();
                let start = new Date(Number(slotStart) - Number(offset.current));
                let end = new Date(Number(slotStart) - Number(offset.current) + duration);
                const group = groups.find((g) => g.index === Number(slotGroupIndex));

                let timeZoneStart = moment(Number(start)).tz(timeZone);
                let timeZoneEnd = moment(Number(end)).tz(timeZone);
                let formatString = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)';

                setField(dataItem, fields.reserveStart, timeZoneStart.format(formatString));
                setField(dataItem, fields.reserveEnd, timeZoneEnd.format(formatString));

                setField(dataItem, fields.start, start);
                setField(dataItem, fields.end, end);

                if (group && groups.length > 1) {
                    group.resources.forEach((resource) => {
                        if (!resource.multiple) {
                            setField(dataItem, resource.field, resource[resource.valueField]);
                        }
                    });
                }

                oldSlot.current = slot;

                if (dataItem) {
                    setDragItem(dataItem);
                }
                break;
            }
            case DRAG_ITEM_ACTION.complete: {
                setDragItem(null);
                if (config.onDataAction && dragItem) {

                    config.onDataAction.call(undefined, {
                        type: DATA_ACTION.update,
                        series: false,
                        dataItem: dragItem
                    });
                }

                break;
            }
            case DRAG_ITEM_ACTION.completeOccurrence: {
                const newDataItem = Array.isArray(dragItem) ? dragItem.slice() : clone(dragItem);

                setDragItem(null);
                if (config.onDataAction && dragItem) {
                    config.onDataAction.call(undefined, {
                        type: DATA_ACTION.update,
                        series: false,
                        dataItem: newDataItem
                    });
                }

                break;
            }
            case DRAG_ITEM_ACTION.completeSeries: {
                let newDataItems;

                if (Array.isArray(dragItem)) {
                    newDataItems = dragItem.map((di) => {
                        const updated = clone(di);

                        setField(updated, fields.start, getField(di, fields.start));
                        setField(updated, fields.end, getField(di, fields.end));

                        return updated;
                    });
                } else {
                    const updated = clone(dragItem);

                    setField(updated, fields.start, getField(dragItem, fields.start));
                    setField(updated, fields.end, getField(dragItem, fields.end));

                    newDataItems = updated;
                }

                setDragItem(null);
                if (config.onDataAction && newDataItems) {
                    config.onDataAction.call(undefined, {
                        type: DATA_ACTION.update,
                        series: true,
                        dataItem: newDataItems
                    });
                }

                break;
            }
            default:
                setDragItem(dragItem);
                break;
        }
    };

    return [dragItem, setDragItem, handleDragItemAction];
};