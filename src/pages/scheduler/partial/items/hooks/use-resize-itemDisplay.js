import { clone } from "@progress/kendo-react-common";
import * as React from "react";
import { useControlledState } from "../../hooks/useControlledState.mjs";
import { setField, getField, slotDive } from "../../utils/index.mjs";
import { DATA_ACTION } from "../../constants/index.mjs";
import { useSchedulerViewSelectedItemsContext } from "../../context/SchedulerViewContext.mjs";
import { useSchedulerFieldsContext } from "../../context/SchedulerContext.mjs";
import moment from 'moment-timezone';

export const RESIZE_ITEM_ACTION = {
    set: 'RESIZE_ITEM_SET',
    start: 'RESIZE_ITEM_START',
    startDrag: 'RESIZE_ITEM_START_DRAG',
    startDragSelected: 'RESIZE_ITEM_START_DRAG_SELECTED',
    endDrag: 'RESIZE_ITEM_END_DRAG',
    endDragSelected: 'RESIZE_ITEM_END_DRAG_SELECTED',
    complete: 'RESIZE_ITEM_COMPLETE',
    completeOccurrence: 'RESIZE_ITEM_COMPLETE_OCCURRENCE',
    completeSeries: 'RESIZE_ITEM_COMPLETE_SERIES',
    reset: 'RESIZE_ITEM_RESET',
}

export const useResizeItem = (config, state) => {
    const oldSlot = React.useRef(null);

    const [resizeItem, setResizeItem] = useControlledState(...state);
    const [selectedItems] = useSchedulerViewSelectedItemsContext();

    const fields = useSchedulerFieldsContext();

    const handleDragItemAction = (action, event) => {
        let newResizeItem = resizeItem;

        switch (action.type) {
            case RESIZE_ITEM_ACTION.set:
                newResizeItem = action.payload;
                break;
            case RESIZE_ITEM_ACTION.reset:
                newResizeItem = null;
                break;
            case RESIZE_ITEM_ACTION.start: {
                event.stopPropagation();

                if (!newResizeItem) { return; };

                const clientX = action.payload.x;
                const clientY = action.payload.y;

                const slot = slotDive(clientX, clientY, 7);

                if (!slot) { return; };
                if (slot === oldSlot.current) { return; };

                const slotStart = slot.getAttribute('data-slot-start');

                const newStart = new Date(Number(slotStart));

                const dataItem = clone(config.dataItem);

                if (newStart >= getField(dataItem, fields.end)) { return; }

                setField(dataItem, fields.start, newStart);

                oldSlot.current = slot;

                newResizeItem = dataItem;
                break;
            }
            case RESIZE_ITEM_ACTION.startDragSelected: {
                event.stopPropagation();

                const clientX = action.payload.x;
                const clientY = action.payload.y;

                const dataItem = clone(config.dataItem);

                const slot = slotDive(clientX, clientY, 7);

                if (!slot) { return; }
                if (slot === oldSlot.current) { return; }

                const slotStart = slot.getAttribute('data-slot-start');
                const itemStart = new Date(getField(dataItem, fields.start));

                const newStart = new Date(Number(slotStart));
                const distance = newStart.getTime() - itemStart.getTime();

                let unreachable = false;

                const newResizeItems = selectedItems.map((si) => {
                    if (!si.current) { return null; }
                    const selectedDataItem = clone(si.current.props.dataItem);
                    const selectedStart = new Date(si.current.props.start.getTime() + distance);

                    if (selectedStart >= getField(selectedDataItem, fields.end)) {
                        unreachable = true;
                        return;
                    }

                    setField(selectedDataItem, fields.start, selectedStart);

                    return selectedDataItem;
                }).filter(Boolean);

                if (!unreachable) {
                    newResizeItem = [...newResizeItems];
                }
                break;
            }
            case RESIZE_ITEM_ACTION.startDrag: {
                const clientX = action.payload.x;
                const clientY = action.payload.y;

                const slot = slotDive(clientX, clientY, 7);

                if (!slot) { return; }
                if (slot === oldSlot.current) { return; }

                const slotStart = slot.getAttribute('data-slot-start');
                const slotEnd = slot.getAttribute('data-slot-end');

                const newStart = new Date(Number(slotStart));
                const newEnd = new Date(Number(slotEnd));

                const dataItem = clone(config.dataItem);

                if (newStart >= dataItem.end) { return; }

                let timeZoneStart = moment(Number(newStart)).tz(timeZone);

                let timeZoneEnd = moment(Number(new Date(Number(dataItem.end)))).tz(timeZone);
                let formatString = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)';

                setField(dataItem, fields.reserveStart, timeZoneStart.format(formatString));
                setField(dataItem, fields.reserveEnd, timeZoneEnd.format(formatString));

                setField(dataItem, fields.start, newStart);

                oldSlot.current = slot;

                newResizeItem = dataItem;
                break;
            }
            case RESIZE_ITEM_ACTION.endDrag: {
                const clientX = action.payload.x;
                const clientY = action.payload.y;

                const slot = slotDive(clientX, clientY, 7);
                if (!slot) { return; }
                if (slot === oldSlot.current) { return; }

                const slotEnd = slot.getAttribute('data-slot-end');
                const newEnd = new Date(Number(slotEnd));

                const dataItem = clone(config.dataItem);
                if (newEnd <= dataItem.start) { return; }
                let timeZoneStart = moment(Number(new Date(Number(dataItem.start)))).tz(timeZone);

                let timeZoneEnd = moment(Number(newEnd)).tz(timeZone);
                let formatString = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)';

                setField(dataItem, fields.reserveStart, timeZoneStart.format(formatString));
                setField(dataItem, fields.reserveEnd, timeZoneEnd.format(formatString));

                setField(dataItem, fields.end, newEnd);

                oldSlot.current = slot;

                newResizeItem = dataItem;
                break;
            }

            case RESIZE_ITEM_ACTION.endDragSelected: {
                event.stopPropagation();

                const clientX = action.payload.x;
                const clientY = action.payload.y;

                const dataItem = clone(config.dataItem);

                const slot = slotDive(clientX, clientY, 7);
                if (!slot) { return; }
                if (slot === oldSlot.current) { return; }

                const slotEnd = slot.getAttribute('data-slot-start');
                const itemEnd = new Date(getField(dataItem, fields.end));

                const newEnd = new Date(Number(slotEnd));
                const distance = newEnd.getTime() - itemEnd.getTime();

                let unreachable;

                const newResizeItems = selectedItems.map((si) => {
                    if (!si.current) { return null; }
                    const selectedDataItem = clone(si.current.props.dataItem);
                    const selectedEnd = new Date(si.current.props.end.getTime() + distance);

                    if (selectedEnd <= getField(selectedDataItem, fields.start)) {
                        unreachable = true;
                        return;
                    }

                    setField(selectedDataItem, fields.end, selectedEnd);

                    return selectedDataItem;
                }).filter(Boolean);

                if (!unreachable) {
                    newResizeItem = [...newResizeItems];
                }
                break;
            }
            case RESIZE_ITEM_ACTION.complete: {
                newResizeItem = null;

                if (config.onDataAction && resizeItem) {
                    config.onDataAction.call(undefined, {
                        type: DATA_ACTION.update,
                        series: false,
                        dataItem: resizeItem
                    });
                }

                break;
            }
            case RESIZE_ITEM_ACTION.completeOccurrence: {
                newResizeItem = null;

                if (config.onDataAction && resizeItem) {
                    config.onDataAction.call(undefined, {
                        type: DATA_ACTION.update,
                        series: false,
                        dataItem: resizeItem
                    });
                }

                break;
            }
            case RESIZE_ITEM_ACTION.completeSeries: {
                newResizeItem = null;

                let newDataItem;

                if (Array.isArray(resizeItem)) {
                    newDataItem = resizeItem.map((item) => {
                        const newItem = clone(item);

                        setField(newItem, fields.start, getField(item, fields.start));
                        setField(newItem, fields.end, getField(item, fields.end));

                        return newItem;
                    });
                } else {
                    const newItem = clone(resizeItem);

                    setField(newItem, fields.start, getField(resizeItem, fields.start));
                    setField(newItem, fields.end, getField(resizeItem, fields.end));

                    newDataItem = newItem;
                }

                if (config.onDataAction && newDataItem) {
                    config.onDataAction.call(undefined, {
                        type: DATA_ACTION.update,
                        series: true,
                        dataItem: newDataItem
                    });
                }

                break;
            }
            default:
                newResizeItem = null;
                break;
        }

        setResizeItem(newResizeItem);
    };

    return [resizeItem, setResizeItem, handleDragItemAction];
};
