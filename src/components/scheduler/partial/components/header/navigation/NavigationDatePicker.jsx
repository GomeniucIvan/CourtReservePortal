import * as React from "react";
import {useInternationalization} from "@progress/kendo-react-intl";
import {Button} from "@progress/kendo-react-buttons";
import {ZonedDate, getDate, MS_PER_DAY} from "@progress/kendo-date-math";
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
import {Radio} from "antd";
import DrawerDatePicker from "../../../../../../components/drawer/DrawerDatePicker.jsx";
import {Calendar} from "@progress/kendo-react-dateinputs";

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
            console.log(event)
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
        <>
            <Radio.Button onClick={handleClick}>
                {media === 'desktop' ? text : shortText}
            </Radio.Button>

            <DrawerDatePicker show={show}
                              value={value}
                              onChange={(e) => {
                                  handleChange({
                                      value: e
                                  });
                              }}
                              onClose={() => {
                                  setShow(false);
                              }}/>
        </>
    )
});

NavigationDatePicker.displayName = 'KendoReactSchedulerNavigationDatePicker';
