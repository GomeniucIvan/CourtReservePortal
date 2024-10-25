import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { useDir, classNames, useDraggable, IconWrap} from "@progress/kendo-react-common";
import { useInternationalization, useLocalization} from "../intl/index.mjs";
import { deleteTitle, messages} from "../messages/index.mjs";
import { formatEventTime} from "../utils/index.jsx";
import { useSchedulerItem} from "../hooks/useSchedulerItem.mjs";
import { useEditable } from "../hooks/useEditable.mjs";

export const SchedulerItem = forwardRef((props, ref) => {
    const {
        // Focus
        onFocus,
        onBlur,

        // Mouse
        onMouseDown,
        onClick,
        onMouseUp,
        onMouseOut,
        onMouseOver,
        onMouseEnter,
        onMouseLeave,
        onDoubleClick,
        onRemoveClick,

        // Keyboard
        onKeyUp,
        onKeyDown,
        onKeyPress,

        // Drag
        onPress,
        onDrag,
        onRelease,

        // Resize
        onResizePress,
        onResizeEndDrag,
        onResizeRelease,
        onResizeStartDrag
    } = props;

    const { item, element } = useSchedulerItem(props, ref);
    const dir = useDir(element);

    const resizeEast = useRef(null);
    const resizeWest = useRef(null);
    const resizeNorth = useRef(null);
    const resizeSouth = useRef(null);

    const editable = useEditable(props.editable);
    const intl = useInternationalization();
    const localization = useLocalization();
    const deleteMessage = localization.toLanguageString(deleteTitle, messages[deleteTitle]);

    const resource  = props.group.resources.find((r) => Boolean(r.colorField && r[r.colorField] !== '' && r[r.colorField] !== undefined));
    let color = resource && resource.colorField && resource[resource.colorField];

    if (item && item.current && item.current.props && item.current.props.dataItem && item.current.props.dataItem.ReservationColor) {
        color = item.current.props.dataItem.ReservationColor;
    }

    const tabIndex = props.tabIndex !== undefined
        ? props.tabIndex === null
            ? undefined
            : props.tabIndex
        : props.selected
            ? 0
            : -1;

    console.log(item)
    
    const className = useMemo(
        () => classNames(
            {
                'k-event k-event-no-hint k-event-month': !props.resizeHint,
                'k-selected': props.selected && editable.select,
                'k-event-drag-hint': props.dragHint,
                'k-scheduler-marquee': props.resizeHint,
                'k-marquee': props.resizeHint,
                'k-first': (props.resizeHint && !props.tail),
                'k-last': (props.resizeHint && !props.head)
            },
            props.className
        ),
        [
            props.resizeHint,
            props.selected,
            props.dragHint,
            props.tail,
            props.head,
            props.className,
            editable.select
        ]);

    const eventLabel = useMemo(
        () => `${formatEventTime(intl, props.zonedStart, props.zonedEnd, props.isAllDay)}, ${props.title}`,
        [intl, props.isAllDay, props.title, props.zonedEnd, props.zonedStart]
    );

    const style = useMemo(
        () => ({
            cursor: 'pointer',
            userSelect: ('none'),
            borderColor: !props.resizeHint ? color : undefined,
            backgroundColor: !props.resizeHint ? color : undefined,
            touchAction: 'none',
            ...props.style
        }),
        [color, props.style, props.resizeHint]);

    // Handlers

    // Focus Handlers
    const handleFocus = useCallback(
        (syntheticEvent) => {
            if (!onFocus) { return; }
            onFocus.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onFocus, item]
    );

    const handleBlur = useCallback(
        (syntheticEvent) => {
            if (!onBlur) { return; }
            onBlur.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onBlur, item]
    );

    // Mouse Handlers
    const handleMouseDown = useCallback(
        (syntheticEvent) => {
            if (!onMouseDown) { return; }
            onMouseDown.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onMouseDown, item]
    );

    const handleClick = useCallback(
        (syntheticEvent) => {
            if (!onClick) { return; }
            onClick.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onClick, item]
    );

    const handleMouseUp = useCallback(
        (syntheticEvent) => {
            if (!onMouseUp) { return; }
            onMouseUp.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onMouseUp, item]
    );

    const handleMouseOver = useCallback(
        (syntheticEvent) => {
            if (!onMouseOver) { return; }
            onMouseOver.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onMouseOver, item]
    );

    const handleMouseOut = useCallback(
        (syntheticEvent) => {
            if (!onMouseOut) { return; }
            onMouseOut.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onMouseOut, item]
    );

    const handleMouseEnter = useCallback(
        (syntheticEvent) => {
            if (!onMouseEnter) { return; }
            onMouseEnter.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onMouseEnter, item]
    );
    const handleMouseLeave = useCallback(
        (syntheticEvent) => {
            if (!onMouseLeave) { return; }
            onMouseLeave.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onMouseLeave, item]
    );

    const handleDoubleClick = useCallback(
        (syntheticEvent) => {
            if (!onDoubleClick) { return; }
            onDoubleClick.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onDoubleClick, item]
    );

    const handleRemoveClick = useCallback(
        (syntheticEvent) => {
            if (!onRemoveClick) { return; }
            onRemoveClick.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onRemoveClick, item]
    );

    // Keyboard Handlers
    const handleKeyDown = useCallback(
        (syntheticEvent) => {
            if (!onKeyDown) { return; }
            onKeyDown.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onKeyDown, item]
    );

    const handleKeyPress = useCallback(
        (syntheticEvent) => {
            if (!onKeyPress) { return; }
            onKeyPress.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onKeyPress, item]
    );

    const handleKeyUp = useCallback(
        (syntheticEvent) => {
            if (!onKeyUp) { return; }
            onKeyUp.call(undefined, {
                syntheticEvent,
                target: item.current
            });
        },
        [onKeyUp, item]
    );

    // Drag Handlers
    const handlePress = useCallback(
        (dragEvent) => {
            if (!onPress) { return; }
            onPress.call(undefined, {
                dragEvent,
                target: item.current
            });
        },
        [onPress, item]
    );

    const handleDrag = useCallback(
        (dragEvent) => {
            if (!onDrag) { return; }
            onDrag.call(undefined, {
                dragEvent,
                target: item.current
            });
        },
        [onDrag, item]
    );

    const handleRelease = useCallback(
        (dragEvent) => {
            if (!onRelease) { return; }
            onRelease.call(undefined, {
                dragEvent,
                target: item.current
            });
        },
        [onRelease, item]
    );

    // Resize Handlers
    const handleResizePress = useCallback(
        (dragEvent) => {
            if (!onResizePress) { return; }
            onResizePress.call(undefined, {
                dragEvent,
                target: item.current
            });
        },
        [onResizePress, item]
    );

    const handleResizeStartDrag = useCallback(
        (dragEvent) => {
            if (!onResizeStartDrag) { return; }
            onResizeStartDrag.call(undefined, {
                dragEvent,
                target: item.current
            });
        },
        [onResizeStartDrag, item]
    );

    const handleResizeEndDrag = useCallback(
        (dragEvent) => {
            if (!onResizeEndDrag) { return; }
            onResizeEndDrag.call(undefined, {
                dragEvent,
                target: item.current
            });
        },
        [onResizeEndDrag, item]
    );

    const handleResizeRelease = useCallback(
        (dragEvent) => {
            if (!onResizeRelease) { return; }
            onResizeRelease.call(undefined, {
                dragEvent,
                target: item.current
            });
        },
        [onResizeRelease, item]
    );

    // Effects

    // Drag Effects
    useDraggable(element, {
        onPress: handlePress,
        onDrag: handleDrag,
        onRelease: handleRelease
    });

    // Resize Effects
    useDraggable(resizeEast, {
        onPress: handleResizePress,
        onDrag: handleResizeEndDrag,
        onRelease: handleResizeRelease
    });
    useDraggable(resizeWest, {
        onPress: handleResizePress,
        onDrag: handleResizeStartDrag,
        onRelease: handleResizeRelease
    });
    useDraggable(resizeNorth, {
        onPress: handleResizePress,
        onDrag: handleResizeStartDrag,
        onRelease: handleResizeRelease
    });
    useDraggable(resizeSouth, {
        onPress: handleResizePress,
        onDrag: handleResizeEndDrag,
        onRelease: handleResizeRelease
    });



    return (
        <div
            ref={element}
            id={props.id}
            style={style}
            tabIndex={tabIndex}
            className={className}

            // Aria
            role={'button'}
            aria-label={eventLabel}

            // Focus
            onFocus={handleFocus}
            onBlur={handleBlur}

            // Mouse
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            //onClick={handleClick}
            //onMouseOver={handleMouseOver}
            //onMouseOut={handleMouseOut}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={handleDoubleClick}

            // Keyboard
            onKeyDown={handleKeyDown}
            onKeyPress={handleKeyPress}
            onKeyUp={handleKeyUp}

            data-group-index={props.group.index}
            data-range-index={props.range.index}
        >
            {props.children}
            {(!props.resizeHint) && <span className="k-event-actions">
                
            </span>}
            {(editable.resize && props.vertical)
                && (<>
                    <span className="k-resize-handle k-resize-n" ref={resizeNorth} />
                    <span className="k-resize-handle k-resize-s" ref={resizeSouth} />
                </>)}
            {(editable.resize && !props.vertical)
                && (<>
                    <span className="k-resize-handle k-resize-w" ref={resizeWest} />
                    <span className="k-resize-handle k-resize-e" ref={resizeEast} />
                </>)}
            {props.resizeHint && (
                <>
                    <div
                        className="k-marquee-color"
                        style={{ borderColor: color, backgroundColor: color }}
                    />
                    <div className="k-marquee-text">
                        {!props.tail && <div className="k-label-top">{intl.formatDate(props.zonedStart, props.format)}</div>}
                        {!props.head && <div className="k-label-bottom">{intl.formatDate(props.zonedEnd, props.format)}</div>}
                    </div>
                </>
            )}
        </div>
    );
});

SchedulerItem.displayName = 'KendoReactSchedulerItem';
