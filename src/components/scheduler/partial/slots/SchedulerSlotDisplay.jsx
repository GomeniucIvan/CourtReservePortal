import * as React from 'react';
import { classNames } from "@progress/kendo-react-common";
import { useSchedulerSlot } from "../hooks/useSchedulerSlotDisplay.js";
import {equalString, toBoolean} from "../../../../utils/Utils.jsx";
import {Typography} from "antd";
import {inGroup} from "../services/itemsService.mjs";
import {schedulerSlotIntersects} from "../../../../utils/ListUtils.jsx";
const {Text} = Typography;

export const SchedulerSlot = React.forwardRef((
    props,
    ref
) => {
    const {
        // Focus
        onFocus,
        onBlur,

        // Mouse
        onClick,
        onMouseEnter,
        onMouseLeave,
        onMouseOut,
        onMouseOver,
        onDoubleClick,

        // Keyboard
        onKeyDown,
        onKeyPress,
        onKeyUp,
        useTextSchedulerSlot,
        openReservationCreateModal,
        events
    } = props;

    const { slot, element } = useSchedulerSlot(props, ref);
    let schedulerEvents = events || [];

    const tabIndex = props.tabIndex !== undefined
        ? props.tabIndex === null
            ? undefined
            : props.tabIndex
        : props.selected
            ? 0
            : -1;
    
    const className = React.useMemo(
        () => {
            const isWorkHour = props.isWorkHour ?? schedulerSlotDefaultProps.isWorkHour;
            const isWorkDay = props.isWorkDay ?? schedulerSlotDefaultProps.isWorkDay;

            const isPastStart = props.isPastStart;

            return classNames(
                props.className,
                'k-scheduler-cell k-slot-cell',
                {
                    'k-nonwork-hour': (!isWorkHour || !isWorkDay),
                    'k-selected': props.selected,
                    'k-past-start': isPastStart,
                }
            );
        },
        [props.className, props.selected, props.isWorkHour, props.isWorkDay, props.isPastStart]
    );


    
    const style = React.useMemo(
        () => ({
            userSelect: ('none'),
            ...props.style
        }),
        [props.style]
    );

    // Handlers

    // Focus Handlers
    const handleFocus = React.useCallback(
        (syntheticEvent) => {
            if (!onFocus) {
                return;
            }
            onFocus.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onFocus, slot]
    );

    const handleBlur = React.useCallback(
        (syntheticEvent) => {
            if (!onBlur) {
                return;
            }
            onBlur.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onBlur, slot]
    );

    // Mouse Handlers
    const handleClick = React.useCallback(
        (syntheticEvent) => {
            if (!onClick) {
                return;
            }
            onClick.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onClick, slot]
    );

    const handleMouseOver = React.useCallback(
        (syntheticEvent) => {
            if (!onMouseOver) {
                return;
            }
            onMouseOver.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onMouseOver, slot]
    );

    const handleMouseOut = React.useCallback(
        (syntheticEvent) => {
            if (!onMouseOut) {
                return;
            }
            onMouseOut.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onMouseOut, slot]
    );

    const handleMouseEnter = React.useCallback(
        (syntheticEvent) => {
            if (!onMouseEnter) {
                return;
            }
            onMouseEnter.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onMouseEnter, slot]
    );
    const handleMouseLeave = React.useCallback(
        (syntheticEvent) => {
            if (!onMouseLeave) {
                return;
            }
            onMouseLeave.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onMouseLeave, slot]
    );

    const handleDoubleClick = React.useCallback(
        (syntheticEvent) => {
            if (!onDoubleClick) {
                return;
            }
            onDoubleClick.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onDoubleClick, slot]
    );

    // Keyboard Handlers
    const handleKeyDown = React.useCallback(
        (syntheticEvent) => {
            if (!onKeyDown) {
                return;
            }
            onKeyDown.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onKeyDown, slot]
    );

    const handleKeyPress = React.useCallback(
        (syntheticEvent) => {
            if (!onKeyPress) {
                return;
            }
            onKeyPress.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onKeyPress, slot]
    );

    const handleKeyUp = React.useCallback(
        (syntheticEvent) => {
            if (!onKeyUp) {
                return;
            }
            onKeyUp.call(undefined, {
                syntheticEvent,
                target: slot.current
            });
        },
        [onKeyUp, slot]
    );
    
    //ignore consolidated
    // if (toBoolean(useTextSchedulerSlot)) {
    //     if (toBoolean(props?.group?.resources[0]?.IsWailitsingData)){
    //         return (<div ref={element} className={'k-scheduler-cell k-slot-cell'}></div>)
    //     }
    //
    //     if (toBoolean(props.isPastStart)){
    //         return (<div ref={element} className={className} id={props.id} tabIndex={tabIndex}></div>)
    //     }
    //
    //     if (toBoolean(props?.group?.resources[0]?.IsCourtClosed)){
    //         return (<div ref={element} className={'k-scheduler-cell k-slot-cell k-closed-slot'}></div>)
    //     }
    // }
    
    
    return (
        <div
            ref={element}
            id={props.id}
            style={style}
            className={className}
            tabIndex={tabIndex}

            // Aria
            aria-selected={props.selected || undefined}

            // Focus
            //onFocus={handleFocus}
            //onBlur={handleBlur}

            // Mouse
            onClick={handleClick}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            // onMouseOver={handleMouseOver}
            // onMouseOut={handleMouseOut}
            onDoubleClick={handleDoubleClick}

            // Keyboard
            //onKeyDown={handleKeyDown}
            //onKeyPress={handleKeyPress}
            //onKeyUp={handleKeyUp}

            data-slot={true}
            data-slot-allday={props.isAllDay}
            data-slot-start={props.start.getTime()}
            data-slot-end={props.end.getTime()}
            data-slot-group={props.group.index}
            data-slot-range={props.range.index}
            data-slot-index={props.index}
            data-start-date={props.start}
        >
            {(toBoolean(useTextSchedulerSlot) && 1 == 2) ?
                ( <div className={'k-scheduler-cell k-slot-cell'} style={{border: 'none'}}>
                    {schedulerSlotIntersects(props, schedulerEvents) ? (
                        <Text>
                            
                        </Text>
                    ) : (<Text
                            start={props.start.getTime()}
                            end={props.end.getTime()}
                            entytyid={props.group.resources[0].Value}
                            onClick={() => {openReservationCreateModal(props, props?.group?.resources[0])}}
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex'
                                //display: `${(shouldHideButton(courtId, props.zonedStart, props.zonedEnd) ? 'none' : 'flex')}`
                            }}
                        >
                            Reserve
                        </Text>)}
                </div>) :
                (<>{props.children}</>)
             }
        </div>
    );
});

export const schedulerSlotDefaultProps = {
    isWorkHour: true,
    isWorkDay: true
};

SchedulerSlot.displayName = 'KendoReactSchedulerSlot';
