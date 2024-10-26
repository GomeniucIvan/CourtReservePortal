"use client";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { cloneDate} from "@progress/kendo-date-math";
import { useDir, classNames } from "@progress/kendo-react-common";
import { intersects, isInTimeRange, first } from "../utils/index.jsx";
import { getRect } from "../views/common/utilsJava.js";
import { useSchedulerElementContext, useSchedulerPropsContext } from "../context/SchedulerContext.mjs";
import { useSchedulerViewSlotsContext } from "../context/SchedulerViewContext.mjs";

const combineWidths = (slots) => {
    let result = 0;
    slots.forEach(slot => {
        if(slot.current) {
            const rect = getRect(slot.current.element);
            result += rect.width;
        }
    });
    return result;
};
const combineHeights = (slots) => {
    let result = 0;
    slots.forEach(slot => {
        if(slot.current) {
            const rect = getRect(slot.current.element);
            result += rect.height;
        }
    });
    return result;
};

const setTime = (origin, candidate) => {
    const date = cloneDate(origin);
    date.setHours(
        candidate.getHours(),
        candidate.getMinutes(),
        candidate.getSeconds(),
        candidate.getMilliseconds()
    );
    return date;
};

/** @hidden */
export const CurrentTimeMarker = (props) => {
    const [show, setShow] = React.useState(false);
    const scheduler = useSchedulerElementContext();
    const schedulerProps = useSchedulerPropsContext();
    const interval = React.useRef(undefined);
    const arrowRef = React.useRef(null);
    const line = React.useRef(null);
    const updateInterval = props.updateInterval || currentTimeMarkerDefaultProps.updateInterval;
    const [, setForce] = React.useState(false);

    const dir = useDir(line, schedulerProps.rtl === true ? 'rtl' : undefined);

    const [slots] = useSchedulerViewSlotsContext();

    const position = React.useCallback(
        () => {
            if (!slots) { return; }
            const sameTimeSlots = slots
                .filter((s) => s.current
                    && (props.groupIndex === undefined || props.groupIndex === null || s.current.props.group.index === props.groupIndex)
                    && (props.vertical
                        ? intersects(new Date(), new Date(), s.current.props.start, s.current.props.end, true)
                        : isInTimeRange(new Date(), s.current.props.start, s.current.props.end))
                    && !s.current.props.isAllDay);

            if (sameTimeSlots && sameTimeSlots.length && arrowRef.current && line.current) {
                const firstSlot = first(sameTimeSlots);
                if(!firstSlot.current) {return;}

                const size = props.vertical
                    ? combineHeights(sameTimeSlots)
                    : combineWidths(sameTimeSlots);

                const rect = getRect(firstSlot.current.element);
                const arrowRect = getRect(arrowRef.current);
                const pxPerMillisecond = (props.vertical ? rect.width : rect.height)
                    / (firstSlot.current.props.end.getTime() - firstSlot.current.props.start.getTime());
                const offset = (Date.now() - setTime(new Date(), firstSlot.current.props.start).getTime()) * pxPerMillisecond;
                const rtl = dir === 'rtl';

                const top = props.vertical
                    ? rect.top
                    : rect.top + offset - (arrowRect.height / 2);
                
                const horizontalDimension = rtl ? 'right' : 'left';
                const horizontalMeasure = props.vertical
                    ? rect[horizontalDimension] + offset - (arrowRect.width / 2)
                    : rect[horizontalDimension];

                if (props.vertical) {
                    arrowRef.current.style[horizontalDimension] = `${horizontalMeasure}px`;
                } else {
                    arrowRef.current.style.top = `${top}px`;
                }

                line.current.style[horizontalDimension] = `${horizontalMeasure}px`;
                line.current.style.top = `${top}px`;
                line.current.style[props.vertical ? 'height' : 'width'] = `${size - 1}px`;

                setShow(true);
            } else {
                setShow(false);
            }
        },
        [slots, props.groupIndex, props.vertical, dir]);

    const refresh = React.useCallback(
        () => {
            position();
            setForce(f => !f);
        },
        [position]);

    React.useEffect(
        () => {
            if(!scheduler.current|| !window) {return;}

            clearInterval(interval.current);
            interval.current = window.setInterval(refresh, updateInterval);
            const resizeObserver = (window).ResizeObserver;
            const observer = resizeObserver && new resizeObserver(refresh);
            if(observer) {
                observer.observe(scheduler.current);
            }

            return () => {
                clearInterval(interval.current);
                if(observer) {
                    observer.disconnect();
                }
            };
        },
        [position, refresh, scheduler, updateInterval]);

    React.useEffect(position);

    const arrow = (
        <div
            ref={arrowRef}
            className={classNames(
                'k-current-time',
                {
                    'k-current-time-arrow-right': !props.vertical && dir !== 'rtl',
                    'k-current-time-arrow-left': !props.vertical && dir === 'rtl',
                    'k-current-time-arrow-down': props.vertical
                })}
            style={{
                transform: props.vertical
                    ? dir === 'rtl'
                        ? 'translateX(50%)'
                        : 'translateX(-50%)'
                    : 'translateY(-50%)',
                visibility: !show ? 'hidden' : undefined
            }}
        />
    );

    return (
        <React.Fragment>
            {(props.attachArrow && props.attachArrow.current) ? ReactDOM.createPortal(arrow, props.attachArrow.current) : arrow}
            <div
                className="k-current-time"
                ref={line}
                style={{
                    transform: props.vertical ? 'translateX(-50%)' : 'translateY(-50%)',
                    [props.vertical ? 'width' : 'height']: '1px',
                    visibility: !show ? 'hidden' : undefined
                }}
            />
        </React.Fragment>
    );
};

const currentTimeMarkerDefaultProps = {
    updateInterval: 60000
};
