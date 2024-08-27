import * as React from "react";
import { useCollection, classNames  } from "@progress/kendo-react-common";
import { SchedulerViewContext } from "../context/SchedulerViewContext.mjs";
import { useItemsSelection, ITEMS_SELECT_ACTION } from "../hooks/use-items-selection.mjs";
import { useSlotsSelection, SLOTS_SELECT_ACTION } from "../hooks/use-slots-selection.mjs";
import { useCellSync} from "../hooks/useCellSync.mjs";
import { useItemsFocus } from "../hooks/use-items-focus.mjs";
import { useSlotsFocus } from "../hooks/use-slots-focus.mjs";

export const BaseView = React.forwardRef((props, ref) => {
    const element = React.useRef(null);
    React.useImperativeHandle(ref, () => element.current);

    const [items, dispatchItems] = useCollection([]);
    const [slots, dispatchSlots] = useCollection([]);

    const [focusedItems, dispatchFocusedItems] = useItemsFocus(items);
    const [focusedSlots, dispatchFocusedSlots] = useSlotsFocus(slots);

    const [selectedItems, dispatchSelectedItems] = useItemsSelection(items);
    const [selectedSlots, dispatchSelectedSlots] = useSlotsSelection(slots); // React.useState<React.RefObject<SchedulerSlotHandle>[]>([]);

    const handleSchedulerItemsSelectAction = React.useCallback(
        (action, event) => {
            dispatchSelectedSlots({ type: SLOTS_SELECT_ACTION.reset});
            dispatchSelectedItems(action, event);
        },
        [dispatchSelectedItems, dispatchSelectedSlots]
    );

    const handleSchedulerSlotsSelectAction = React.useCallback(
        (action, event) => {
            dispatchSelectedItems({ type: ITEMS_SELECT_ACTION.reset }, event);
            dispatchSelectedSlots(action);
        },
        [dispatchSelectedItems, dispatchSelectedSlots]
    );

    const className = React.useMemo(
        () => classNames('k-scheduler-layout k-scheduler-layout-flex', props.className),
        [props.className]
    );

    useCellSync({ element, selector: '.k-group-cell', attribute: 'data-depth-index', explicitDepth: true });
    useCellSync({ element, selector: '.k-side-cell', attribute: 'data-depth-index', explicitDepth: false });

    return (
        <SchedulerViewContext
            props={props.props}
            ranges={props.ranges}

            items={[items, dispatchItems]}
            slots={[slots, dispatchSlots]}

            selectedItems={[selectedItems, handleSchedulerItemsSelectAction]}
            selectedSlots={[selectedSlots, handleSchedulerSlotsSelectAction]}

            focusedItems={[focusedItems, dispatchFocusedItems]}
            focusedSlots={[focusedSlots, dispatchFocusedSlots]}
        >
            <div
                ref={element}
                style={props.style}
                className={className}
                role="presentation"
            >
                {props.children}
            </div>
        </SchedulerViewContext >
    );
});

BaseView.displayName = 'KendoReactSchedulerBaseView';

