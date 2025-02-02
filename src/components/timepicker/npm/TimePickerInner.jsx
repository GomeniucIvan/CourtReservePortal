import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cx } from 'antd-style';
import OutsideClickHandler from './OutsideClickHandler';
import Button from './Common/Button';
import timeHelper from './utils/time';
import languageHelper from './utils/language';
import ICONS from './utils/icons';
import { is } from './utils/func';
import TwelveHoursMode from "@/components/timepicker/npm/TwelveHoursMode.jsx";
import TwentyFourHoursMode from "@/components/timepicker/npm/TwentyFourHoursMode.jsx";

// aliases for defaultProps readability
const TIME = timeHelper.time({ useTz: false });
TIME.current = timeHelper.current();

const propTypes = {
    autoMode: PropTypes.bool,
    autoClose: PropTypes.bool,
    colorPalette: PropTypes.string,
    draggable: PropTypes.bool,
    focused: PropTypes.bool,
    language: PropTypes.string,
    meridiem: PropTypes.string,
    onFocusChange: PropTypes.func,
    onTimeChange: PropTypes.func,
    onTimezoneChange: PropTypes.func,
    phrases: PropTypes.object,
    placeholder: PropTypes.string,
    showTimezone: PropTypes.bool,
    theme: PropTypes.string,
    time: PropTypes.string,
    timeMode: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    timezone: PropTypes.string,
    timezoneIsEditable: PropTypes.bool,
    trigger: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.object,
        PropTypes.element,
        PropTypes.array,
        PropTypes.node,
        PropTypes.instanceOf(React.Component),
        PropTypes.instanceOf(React.PureComponent)
    ]),
    withoutIcon: PropTypes.bool,
    minuteStep: PropTypes.number,
    limitDrag: PropTypes.bool,
    timeFormat: PropTypes.string,
    timeFormatter: PropTypes.func,
    useTz: PropTypes.bool,
    closeOnOutsideClick: PropTypes.bool,
    timeConfig: PropTypes.object,
    disabled: PropTypes.bool,
    focusDropdownOnTime: PropTypes.bool,
};

const TimePickerInner = (props) => {
    const {
        autoMode = true,
        autoClose = true,
        colorPalette = 'light',
        draggable = true,
        focused: propFocused = false,
        language = 'en',
        meridiem = TIME.meridiem,
        onFocusChange = Function.prototype,
        onTimeChange = Function.prototype,
        onTimezoneChange = Function.prototype,
        placeholder = '',
        showTimezone = false,
        theme = 'material',
        time = '',
        timeMode = TIME.mode,
        trigger = null,
        withoutIcon = false,
        minuteStep = 5,
        limitDrag = false,
        timeFormat = '',
        timeFormatter = null,
        useTz = true,
        closeOnOutsideClick = true,
        timeConfig = { step: 30, unit: 'minutes' },
        disabled = false,
        focusDropdownOnTime = true,
    } = props;

    const [focused, setFocused] = useState(propFocused);
    const [timezoneData, setTimezoneData] = useState(timeHelper.tzForName(timeHelper.time({ time, meridiem, timeMode, tz: props.timezone, useTz: !time && useTz }).timezone));
    const [timeChanged, setTimeChanged] = useState(false);
    const [timeOptions, setTimeOptions] = useState({});
    const [formattedTime, setFormattedTime] = useState('');
    
    
    useEffect(() => {
        if (propFocused !== focused) {
            setFocused(propFocused);
        }
    }, [propFocused]);

    const onFocus = () => {
        if (!focused) {
            onFocusChange(!focused);
            setFocused(true);
        }
    };

    const onBlur = () => {
        if (focused) {
            onFocusChange(!focused);
            setFocused(false);
        }
    };

    const timeData = (timeChanged) => {
        return timeHelper.time({
            time: timeOptions?.time,
            meridiem: timeOptions?.meridiem,
            timeMode: timeOptions?.timeMode,
            tz: props.timezone,
            useTz: !time && !timeChanged && useTz
        });
    };

    const languageData = {
        ...languageHelper.get(language),
        ...props.phrases
    };

    const hourAndMinute = () => {
        const timeDataResult = timeData(timeChanged);
        const hour = (parseInt(timeMode, 10) === 12)
            ? (parseInt(timeDataResult.hour12, 10) === 12 ? '00' : timeDataResult.hour12)
            : (parseInt(timeDataResult.hour24, 10) === 24 ? '00' : timeDataResult.hour24);
        const minute = timeDataResult.minute;
        return [hour, minute];
    };

    const meridiemData = () => {
        const timeDataResult = timeData(timeChanged);
        const localMessages = languageData;
        const m = meridiem ? meridiem : timeDataResult.meridiem;
        return m && !!(m.match(/^am|pm/i)) ? localMessages[m.toLowerCase()] : m;
    };

    const handleHourChange = (hour) => {
        const validateHour = timeHelper.validate(hour);
        const minute = hourAndMinute()[1];
        handleTimeChange({ hour: validateHour, minute, meridiem: meridiemData() });
    };

    const handleMinuteChange = (minute) => {
        const validateMinute = timeHelper.validate(minute);
        const hour = hourAndMinute()[0];
        handleTimeChange({ hour, minute: validateMinute, meridiem: meridiemData() });
    };

    const handleMeridiemChange = (meridiem) => {
        const [hour, minute] = hourAndMinute();
        handleTimeChange({ hour, minute, meridiem });
    };

    const handleTimeChange = (options) => {
        onTimeChange(options);
        console.log(options)
        setTimeOptions(options);
        setTimeChanged(true);

        const [hour, minute] = hourAndMinute();
        const validTimeMode = timeHelper.validateTimeMode(timeMode);

        if (timeFormatter && is.func(timeFormatter)) {
            return timeFormatter({ hour, minute, meridiem: meridiemData() });
        } else if (timeFormat && is.string(timeFormat)) {
            let times = timeFormat;
            if (/HH?/.test(times) || /MM?/.test(times)) {
                if (validTimeMode === 12) {
                    console.warn('It seems you are using 12 hours mode with 24 hours time format. Please check your timeMode and timeFormat props');
                }
            } else if (/hh?/.test(times) || /mm?/.test(times)) {
                if (validTimeMode === 24) {
                    console.warn('It seems you are using 24 hours mode with 12 hours time format. Please check your timeMode and timeFormat props');
                }
            }
            times = times.replace(/(HH|hh)/g, hour);
            times = times.replace(/(MM|mm)/g, minute);
            times = times.replace(/(H|h)/g, Number(hour));
            times = times.replace(/(M|m)/g, Number(minute));
            setFormattedTime(times);
        } else {
            let time = (validTimeMode === 12)
                ? `${hour} : ${minute} ${meridiemData()}`
                : `${hour} : ${minute}`;

            setFormattedTime(time);
        }
    };

    const handleHourAndMinuteChange = (time) => {
        setTimeChanged(true);
        if (autoClose) onBlur();
        return onTimeChange && onTimeChange(time);
    };

    const renderDialPlate = () => {
        if (disabled) return null;

        const [hour, minute] = hourAndMinute();

        return (
            <div className="modal_container time_picker_modal_container" id="MaterialTheme">
                {1 == 1 &&
                    <TwelveHoursMode
                        hour={timeOptions?.hour || hour}
                        minute={timeOptions?.minute || minute}
                        autoMode={autoMode}
                        autoClose={autoClose}
                        language={language}
                        draggable={draggable}
                        limitDrag={limitDrag}
                        timezone={timezoneData}
                        meridiem={meridiemData()}
                        timeConfig={timeConfig}
                        showTimezone={showTimezone}
                        phrases={languageData}
                        clearFocus={onBlur}
                        timeMode={parseInt(timeMode, 10)}
                        onTimezoneChange={onTimezoneChange}
                        minuteStep={parseInt(minuteStep, 10)}
                        timezoneIsEditable={false}
                        handleHourChange={handleHourChange}
                        handleTimeChange={handleTimeChange}
                        handleMinuteChange={handleMinuteChange}
                        handleMeridiemChange={handleMeridiemChange}
                        focusDropdownOnTime={focusDropdownOnTime}
                    />
                }
                {1 == 2 &&
                    <TwentyFourHoursMode
                        hour={timeOptions?.hour || hour}
                        minute={timeOptions?.minute || minute}
                        autoMode={autoMode}
                        autoClose={autoClose}
                        language={language}
                        draggable={draggable}
                        limitDrag={limitDrag}
                        timezone={timezoneData}
                        meridiem={meridiemData()}
                        timeConfig={timeConfig}
                        showTimezone={showTimezone}
                        phrases={languageData}
                        clearFocus={onBlur}
                        timeMode={parseInt(timeMode, 10)}
                        onTimezoneChange={onTimezoneChange}
                        minuteStep={parseInt(minuteStep, 10)}
                        timezoneIsEditable={false}
                        handleHourChange={handleHourChange}
                        handleTimeChange={handleTimeChange}
                        handleMinuteChange={handleMinuteChange}
                        handleMeridiemChange={handleMeridiemChange}
                        focusDropdownOnTime={focusDropdownOnTime}
                    />
                }
            </div>
        );
    };

    const pickerPreviewClass = cx(
        'time_picker_preview',
        focused && 'active',
        disabled && 'disabled'
    );
    const containerClass = cx(
        'time_picker_container',
        colorPalette === 'dark' && 'dark'
    );
    const previewContainerClass = cx(
        'preview_container',
        withoutIcon && 'without_icon'
    );

    return (
        <div className={containerClass}>
            {trigger || (
                <Button
                    onClick={onFocus}
                    className={pickerPreviewClass}
                >
                    <div className={previewContainerClass}>
                        {withoutIcon ? '' : (ICONS.time)}
                        {placeholder || formattedTime}
                    </div>
                </Button>
            )}
            <OutsideClickHandler
                focused={focused}
                onOutsideClick={onBlur}
                closeOnOutsideClick={disabled ? false : closeOnOutsideClick}
            >
                {renderDialPlate()}
            </OutsideClickHandler>
        </div>
    );
};

TimePickerInner.propTypes = propTypes;

export default TimePickerInner;