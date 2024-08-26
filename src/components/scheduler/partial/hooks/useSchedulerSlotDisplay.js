
import * as React from 'react';
import { COLLECTION_ACTION } from "@progress/kendo-react-common";
import { useSchedulerViewSlotsContext } from "../context/SchedulerViewContext.mjs";


export const useSchedulerSlot = (props, ref) => {
    const { _ref } = props;
    const slot = React.useRef(null);
    const element = React.useRef(null);

    const [, dispatchSlots] = useSchedulerViewSlotsContext();

    React.useImperativeHandle(slot, () => ({ element: element.current, props }));
    React.useImperativeHandle(ref, () => slot.current);
    React.useImperativeHandle(_ref, () => slot.current);

    React.useEffect(
        () => {
            dispatchSlots({
                type: COLLECTION_ACTION.add,
                item: slot
            });

            return () => {
                dispatchSlots({
                    type: COLLECTION_ACTION.remove,
                    item: slot
                });
            };
        }
    );

    return {
        slot,
        element
    };
};
