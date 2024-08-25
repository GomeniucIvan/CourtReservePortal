import * as React from "react";
import {Calendar} from "@progress/kendo-react-dateinputs";
import {useInternationalization} from "@progress/kendo-react-intl";
import {Button} from "@progress/kendo-react-buttons";
import {ZonedDate, getDate, MS_PER_DAY} from "@progress/kendo-date-math";
import {Popup} from "@progress/kendo-react-popup";
import {useWindow, useAsyncFocusBlur} from "@progress/kendo-react-common";
import {calendarIcon} from "@progress/kendo-svg-icons";
import {
    useSchedulerPropsContext,
    useSchedulerElementContext,
    useSchedulerDateFormatContext,
    useSchedulerDateRangeContext,
    useSchedulerDateContext
} from "../../../context/SchedulerContext.mjs";
import {toUTCDateTime} from "../../../utils/index.mjs";

export const NavigationDatePicker = React.forwardRef((
    props,
    ref
) => {
    const button = React.useRef(null);
    const calendar = React.useRef(null);

    React.useImperativeHandle(
        ref,
        () => button.current
    );

    const {timezone} = useSchedulerPropsContext();
    const normalized = ZonedDate.fromLocalDate(props.value, timezone);
    const value = getDate(normalized);
    const element = useSchedulerElementContext();
    const getWindow = useWindow(element);
    const [media, setMedia] = React.useState('desktop');

    const [show, setShow] = React.useState(false);
    const [focused, setFocused] = React.useState(false);

    const intl = useInternationalization();
    const {dateFormat, shortDateFormat} = useSchedulerDateFormatContext();
    const dateRange = useSchedulerDateRangeContext();
    const [date] = useSchedulerDateContext();

    const isMonthView = dateRange.end.getTime() - dateRange.start.getTime() > MS_PER_DAY * 27;


    const text = intl.format(
        dateFormat,
        isMonthView
            ? date
            : dateRange.zonedStart,
        isMonthView
            ? date
            : dateRange.zonedEnd.addDays(-1)
    );

    const shortText = intl.format(
        shortDateFormat,
        isMonthView
            ? date
            : dateRange.zonedStart,
        isMonthView
            ? date
            : dateRange.zonedEnd.addDays(-1)
    );

    const handleClick = React.useCallback(
        () => {
            setShow(!show);
        },
        [show]
    );

    const handleFocus = React.useCallback(
        () => {
            setFocused(true);
        },
        []
    );

    const handleBlur = React.useCallback(
        () => {
            setShow(false);
            setFocused(false);
        },
        []
    );

    const handleChange = React.useCallback(
        (event) => {
            if (props.onChange) {
                const normalizedValue = ZonedDate.fromUTCDate(toUTCDateTime(event.value), timezone);

                props.onChange.call(undefined, {
                    ...event,
                    value: normalizedValue
                });
            }

            setShow(false);
        },
        [props.onChange, timezone]
    );

    const calculateMedia = React.useCallback(() => {
        if (getWindow().matchMedia) {
            setMedia(getWindow().matchMedia('(min-width: 1024px)').matches
                ? 'desktop'
                : 'mobile');
        }
    }, [getWindow]);

    React.useEffect(() => {
        calculateMedia();
        const resizeObserver = (getWindow()).ResizeObserver;
        const observer = resizeObserver && new resizeObserver(calculateMedia);
        if (observer) {
            observer.observe(element.current);
        }

        return () => {
            if (resizeObserver) {
                observer.disconnect();
            }

        };
    }, [calculateMedia, element, getWindow]);

    React.useEffect(
        () => {
            if (show && focused) {
                if (calendar.current) {
                    calendar.current.focus();
                }
            }
        },
        [focused, show]
    );

    const {onFocus, onBlur} = useAsyncFocusBlur({onFocus: handleFocus, onBlur: handleBlur});

    return (
        <React.Fragment>
            <Button
                ref={button}
                onFocus={onFocus}
                onBlur={onBlur}
                fillMode={'flat'}
                className={'k-nav-current'}
                icon="calendar"
                svgIcon={calendarIcon}
                aria-live="polite"
                tabIndex={-1}
                onClick={handleClick}
            >
                {media === 'desktop'
                    ? text
                    : shortText}
            </Button>
            <Popup
                anchor={button.current?.element}
                show={show}
            >
                <Calendar
                    ref={calendar}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={handleChange}
                    value={value}
                />
            </Popup>
        </React.Fragment>

    );
});

NavigationDatePicker.displayName = 'KendoReactSchedulerNavigationDatePicker';
