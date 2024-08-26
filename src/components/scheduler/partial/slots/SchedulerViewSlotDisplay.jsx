"use client";
import * as React from 'react';
import { SchedulerSlot } from "./SchedulerSlotDisplay.jsx";
import { useSlotExpand } from "../hooks/useSlotExpand.mjs";

export const SchedulerViewSlot = React.forwardRef((props, ref) => {
    const { slot: propSlot, _ref, ...slotProps } = props;
    const Slot = propSlot || schedulerViewSlotDefaultProps.slot;

    const viewSlot = React.useRef(null);
    const slot = React.useRef(null);

    React.useImperativeHandle(viewSlot, () => ({ props }));
    React.useImperativeHandle(_ref, () => slot.current);
    React.useImperativeHandle(ref, () => viewSlot.current);

    useSlotExpand(slot, props.expandable ?? schedulerViewSlotDefaultProps.expandable);

    return (<Slot {...slotProps} _ref={slot} />);
});

export const schedulerViewSlotDefaultProps = {
    slot: SchedulerSlot,
    expandable: false
};

SchedulerViewSlot.displayName = 'KendoReactSchedulerViewSlot';