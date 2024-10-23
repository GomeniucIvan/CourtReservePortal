import * as React from "react";
import {useInternationalization} from "../../../intl/index.mjs";
import {ZonedDate, getDate, MS_PER_DAY} from "@progress/kendo-date-math";
import {useWindow, useAsyncFocusBlur} from "@progress/kendo-react-common";
import dayjs from 'dayjs';

import {
    useSchedulerPropsContext,
    useSchedulerElementContext,
    useSchedulerDateFormatContext,
    useSchedulerDateRangeContext,
    useSchedulerDateContext
} from "../../../context/SchedulerContext.mjs";
import {toUTCDateTime} from "../../../utils/index.jsx";
import {Radio} from "antd";
import DrawerDatePicker from "../../../../../../components/drawer/DrawerDatePicker.jsx";

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

    const {timezone, minDate, maxDate} = useSchedulerPropsContext();

    
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
    const isWeekOrAgenda = !isMonthView && dateRange.end.getTime() - dateRange.start.getTime() === MS_PER_DAY * 7;
    
    const text = intl.format(
        dateFormat,
        isMonthView
            ? date
            : dateRange.zonedStart,
        isMonthView
            ? date
            : dateRange.zonedEnd.addDays(-1)
    );

    const shortText = isMonthView ? dayjs(date).format('MMMM YYYY') : isWeekOrAgenda ? (`${dayjs(dateRange.start).format('MMM D')} - ${dayjs(dateRange.end).format('MMM D')}`) : dayjs(props.value).format('ddd, MMM D');
    
    // const shortText = intl.format(
    //     '{0: ddd, MMM D}',
    //         isMonthView
    //             ? date
    //             : dateRange.zonedStart,
    //         isMonthView
    //             ? date
    //             : dateRange.zonedEnd.addDays(-1)
    //     );

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
                    value: normalizedValue,
                    isMonthView: isMonthView,
                    isWeekOrAgenda: isWeekOrAgenda,
                    dateRangeStart: isWeekOrAgenda ? ZonedDate.fromUTCDate(toUTCDateTime(dateRange.start), timezone) : null,
                    dateRangeEnd: isWeekOrAgenda ? ZonedDate.fromUTCDate(toUTCDateTime(dateRange.end), timezone) : null,
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

    // React.useEffect(
    //     () => {
    //         if (show && focused) {
    //             if (calendar.current) {
    //                 calendar.current.focus();
    //             }
    //         }
    //     },
    //     [focused, show]
    // );

    // const {onFocus, onBlur} = useAsyncFocusBlur({onFocus: handleFocus, onBlur: handleBlur});
    //            //media === 'desktop' ? text :
    return (
        <>

            <Radio.Button
                onClick={handleClick}
                style={{
                    minWidth: '130px',
                    textAlign: 'center'
                }}>
                {shortText}
            </Radio.Button>

            <DrawerDatePicker show={show}
                              value={value}
                              minDate={minDate}
                              maxDate={maxDate}
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
