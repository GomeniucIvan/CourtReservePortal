import * as React from 'react';
import { SchedulerItem } from "./SchedulerItemDisplay.jsx";
import { first, calculateOrder, intersects, findMissing } from "../utils/index.jsx";
import { getRect, setRect } from "../views/common/utilsJava.js";
import { BORDER_WIDTH } from "../constants/index.mjs";
import { useInternationalization } from "../intl/index.mjs";
import { SchedulerItemContent } from "./SchedulerItemContent.mjs";
import { useDir, IconWrap } from "@progress/kendo-react-common";
import { useRowSync } from "../hooks/useRowSync.mjs";
import { useEditable } from "../hooks/useEditable.mjs";
import { useSchedulerViewItemsContext, useSchedulerViewSlotsContext } from "../context/SchedulerViewContext.mjs";
import { useSchedulerElementContext } from "../context/SchedulerContext.mjs";

const ITEMS_SPACING = 1;

export const SchedulerViewItem = React.forwardRef((props, ref) => {
    // tslint:enable:max-line-length
    const { item: itemProp,  _ref, itemRef, ...itemProps } = props;

    const timeout = React.useRef();
    const item = React.useRef(null);
    const viewItem = React.useRef(null);
    const schedulerRect = React.useRef(null);
    const editable = useEditable(props.editable);

    React.useImperativeHandle(viewItem, () => ({ props, element: item.current && item.current.element }));
    React.useImperativeHandle(ref, () => viewItem.current);
    React.useImperativeHandle(_ref, () => item.current);
    React.useImperativeHandle(itemRef, () => item.current);

    const Item = itemProp || schedulerViewItemDefaultProps.item;

    const intl = useInternationalization();
    const [viewItems] = useSchedulerViewItemsContext();
    const [viewSlots] = useSchedulerViewSlotsContext();
    const scheduler = useSchedulerElementContext();
    const [display, setDisplay] = React.useState(true);
    const [visible, setVisible] = React.useState(false);
    const [maxSiblingsPerSlot, setMaxSiblingsPerSlot] = React.useState(0);

    const dir = useDir(scheduler);

    const itemTime = React.useMemo(
        () => props.isAllDay
            ? intl.toString(props.zonedStart, 't')
            : intl.format('{0:t} - {1:t}', props.zonedStart, props.zonedEnd),
        [intl, props.isAllDay, props.zonedEnd, props.zonedStart]);

    const itemTitle = React.useMemo(() => `(${itemTime}): ${props.title}`, [itemTime, props.title]);

    const calculateMostSiblings = (slots, items) => {
        let most = 1;

        slots.forEach((slot) => {
            const itemsInSlot = items.filter((i) => inSlot(slot.current.props, i.props));
            if (itemsInSlot.length > most) {
                most = itemsInSlot.length;
            }
        });

        return most;
    };

    const getSiblingsInAllSlots = (slots, items) => {
        const siblings = slots.map((slot) => {
            return items.filter((i) => inSlot(slot.current.props, i.props));
        });

        return siblings;
    };

    const inSlot = (slot, current) => {
        return intersects(slot.start, slot.end, current.start, current.end)
            && slot.group.index === current.group.index
            && slot.range.index === current.range.index
            && (props.ignoreIsAllDay || slot.isAllDay === current.isAllDay);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const align = () => {
        const slots = (viewSlots || []).filter((slot) =>  slot.current && inSlot(slot.current.props, props));

        if (slots.length === 0) {
            setDisplay(false);
            return;
        }

        const firstSlot = first(slots);
        if (!firstSlot.current || !item.current) { return; }

        const rect = getRect(firstSlot.current.element);
        setRect(item.current.element, rect );

    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const position = () => {
        const element = item.current && item.current.element;
        if (!element) { return; }


        const slots = (viewSlots || []).filter((slot) => slot.current && inSlot(slot.current.props, props));
        const items = [];
        const dragItems = [];
        const resizeItems = [];

        (viewItems || []).forEach((i) => {
            if(!i.current) { return; }

            if(i.current.props.dragHint) {
                dragItems.push(i.current);
            } else if(i.current.props.resizeHint) {
                resizeItems.push(i.current);
            } else {
                items.push(i.current);
            }
        });

        const order = (props.dragHint || props.resizeHint)
            ? calculateOrder(item.current, props.dragHint ? dragItems : resizeItems , slots, props.ignoreIsAllDay)
    : (props.order || 0);

        let mostSiblingsInSlot = props.dragHint || props.resizeHint
            ? calculateMostSiblings(slots, props.dragHint ? dragItems : resizeItems)
            : calculateMostSiblings(slots, items);

        const siblingsPerSlot = getSiblingsInAllSlots(slots, items);

        let topOffset = 0;
        const rect = getRect(element);

        siblingsPerSlot.forEach((slot) => {
            let currentOffset = 0;
            slot.forEach((current) => {
                if(intersects(current.props.start ,current.props.end, props.start, props.end)
                    && !(props.dragHint || props.resizeHint)
                    && current.props._maxSiblingsPerSlot
                    && current.props._maxSiblingsPerSlot > mostSiblingsInSlot
                    && current.element !== element) {
                    mostSiblingsInSlot = current.props._maxSiblingsPerSlot;
                }
                const currentRect = getRect(current.element);
                if(current.props.order !== null && current.props.order < order) {
                    currentOffset = ((currentRect.top + currentRect.height) - rect.top) - (BORDER_WIDTH * order) + ITEMS_SPACING;
                }
            });

            if(currentOffset > topOffset) {
                topOffset = currentOffset;
            }
        });

        if (slots.length === 0) {
            setDisplay(false);
            return;
        }

        const OFFSET = editable.add ? 20 : 0;
        rect.width = (props.vertical
            ? ((rect.width / mostSiblingsInSlot) - BORDER_WIDTH - (OFFSET / mostSiblingsInSlot))
            : ((rect.width * slots.length) - (BORDER_WIDTH)));

        rect.height = props.vertical
            ? ((rect.height * slots.length) - (BORDER_WIDTH))
            : ((props.resizeHint || props.dragHint) && mostSiblingsInSlot <= 1)
                ? rect.height
                : (props.style && props.style.height ? props.style.height : 25);

        rect.left = props.vertical
            ? (rect.left + (order * rect.width) + (BORDER_WIDTH * order))
            : rect.left;

        rect.top = props.vertical
            ? rect.top
            : (rect.top + topOffset + (BORDER_WIDTH * order));

        setMaxSiblingsPerSlot(mostSiblingsInSlot);
        setRect(element, rect);
        setVisible(true);
        setDisplay(true);
    };

    const handleResize = React.useCallback(
        (entries) => {
            const entry = entries && entries[0];
            const rect = schedulerRect.current;

            if(timeout.current !== undefined) {
                window.cancelAnimationFrame(timeout.current);
            }

            if(rect && entry &&
                (rect.width !== entry.contentRect.width ||
                    rect.height !== entry.contentRect.height)) {
                timeout.current = window.requestAnimationFrame(() => {
                    align();
                    position();
                });
            }

            schedulerRect.current = {width: entry.contentRect.width, height: entry.contentRect.height};
        },
        [align, position]
    );

    React.useEffect(align);
    React.useEffect(position);

    const schedulerElement = item.current && item.current.element
        ? item.current.element.closest('.k-scheduler-layout') : null;
    useRowSync({
        element: schedulerElement,
        selector: '.k-resource-row',
        horizontalAttribute: 'data-depth-index',
        verticalAttribute: 'data-resource-index',
        applyTo: '.k-resource-cell',
        syncHeight: props.isLast
    });

    React.useEffect(
        () => {
            if(!scheduler.current) {return;}
            const resizeObserver = (window).ResizeObserver;
            const observer = resizeObserver && new resizeObserver(handleResize);
            if(observer) {
                observer.observe(scheduler.current);
            }

            return () => {
                if(observer) {
                    observer.disconnect();
                }
            };
        },
        [handleResize, scheduler]);

    return (
        <Item
            {...itemProps}
            _ref={item}
            _maxSiblingsPerSlot={maxSiblingsPerSlot}
            itemRef={item}
            style={{
                visibility: visible ? undefined : 'hidden',
                display: display ? undefined : 'none',
                ...props.style
            }}
        >
            {(!props.resizeHint) && <span className="k-event-actions">
            {/*{props.tail &&*/}
            {/*    <IconWrap*/}
            {/*        name={dir === 'rtl' ? 'caret-alt-right' : 'caret-alt-left'}*/}
            {/*        icon={dir === 'rtl' ? caretAltRightIcon : caretAltLeftIcon}*/}
            {/*    />*/}
            {/*}*/}
                {(props.isRecurring && !props.isException) && <IconWrap name="arrow-rotate-cw" icon={arrowRotateCwIcon} />}
                {(!props.isRecurring && props.isException) && <IconWrap name="arrows-no-repeat" icon={arrowsNoRepeatIcon} />}
        </span>}
            {(!props.resizeHint) && (<div title={itemTitle}>
                {!props.isAllDay && (<SchedulerItemContent className="k-event-template k-event-time ">{itemTitle}</SchedulerItemContent>)}
                <SchedulerItemContent className="k-event-template k-event-month-week">{props.title}</SchedulerItemContent>
            </div>)}
        </Item>
    );
});

export const schedulerViewItemDefaultProps = {
    item: SchedulerItem
};

SchedulerViewItem.displayName = 'KendoReactSchedulerViewItem';
