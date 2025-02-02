import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cx } from 'antd-style';
import OutsideClickHandler from './OutsideClickHandler';
import timeHelper from './utils/time';
import languageHelper from './utils/language';
import { is } from './utils/func';
import TwelveHoursMode from "@/components/timepicker/npm/TwelveHoursMode.jsx";
import TwentyFourHoursMode from "@/components/timepicker/npm/TwentyFourHoursMode.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";

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
    closeOnOutsideClick: PropTypes.bool,
    timeConfig: PropTypes.object,
    disabled: PropTypes.bool,
    focusDropdownOnTime: PropTypes.bool,
};

const TimePickerInner = (props) => {
    let incTime = props.time;
    
    const {
        autoMode = true,
        autoClose = true,
        draggable = true,
        focused: propFocused = false,
        language = 'en',
        meridiem = TIME.meridiem,
        onFocusChange = Function.prototype,
        onTimeChange = Function.prototype,
        onTimezoneChange = Function.prototype,
        time = '',
        timeMode = TIME.mode,
        minuteStep = 5,
        limitDrag = false,
        timeFormat = '',
        timeFormatter = null,
        closeOnOutsideClick = true,
        timeConfig = { step: 5, unit: 'minutes' },
        disabled = false,
        focusDropdownOnTime = true,
    } = props;

    const [focused, setFocused] = useState(propFocused);
    const [timezoneData, setTimezoneData] = useState(timeHelper.time({ time:incTime, meridiem, timeMode, tz: props.timezone, useTz: false }));
    const [timeChanged, setTimeChanged] = useState(false);
    const [formattedTime, setFormattedTime] = useState('');
    
    useEffect(() => {
        if (propFocused !== focused) {
            setFocused(propFocused);
        }
    }, [propFocused]);

    const onBlur = () => {
        if (focused) {
            onFocusChange(!focused);
            setFocused(false);
        }
    };

    const timeData = (timeChanged) => {
        return timeHelper.time({
            time: timezoneData?.time,
            meridiem: timezoneData?.meridiem || meridiem,
            timeMode: timezoneData?.timeMode
        });
    };

    const languageData = {
        ...languageHelper.get(language),
        ...props.phrases
    };

    const meridiemData = () => {
        const timeDataResult = timeData(timeChanged);
        const localMessages = languageData;
        const m = !isNullOrEmpty(timezoneData?.meridiem) ? timezoneData?.meridiem : timeDataResult.meridiem;
        return m && !!(m.match(/^am|pm/i)) ? localMessages[m.toLowerCase()] : m;
    };

    const handleHourChange = (hour) => {
        const validateHour = timeHelper.validate(hour);
        //let minute = hourAndMinute()[1];
        let minute = timezoneData?.minute;
        handleTimeChange({ hour: validateHour, minute, meridiem: meridiemData() });
    };

    const handleMinuteChange = (minute) => {
        const validateMinute = timeHelper.validate(minute);
        //let hour = hourAndMinute()[0];

        let hour = timezoneData?.hour;
        handleTimeChange({ hour, minute: validateMinute, meridiem: meridiemData() });
    };

    const handleMeridiemChange = (meridiem) => {
        //const [hour, minute] = hourAndMinute();

        let hour = timezoneData?.hour;
        let minute = timezoneData?.minute;
        
        handleTimeChange({ hour, minute, meridiem });
    };

    const handleTimeChange = (options) => {
        onTimeChange(options);

        setTimezoneData(options);
        setTimeChanged(true);

        let hour = options?.hour;
        let minute = options?.minute;
        
        const validTimeMode = timeHelper.validateTimeMode(timeMode);

        if (typeof props.setTime === 'function') {
            let time = (validTimeMode === 12)
                ? `${hour}:${minute} ${meridiemData()}`
                : `${hour}:${minute}`;
            props.setTime(time);
        }
        
        if (timeFormatter && is.func(timeFormatter)) {
            return timeFormatter({ hour, minute, meridiem: meridiemData() });
        }
    };

    const renderDialPlate = () => {
        return (
            <div className="modal_container time_picker_modal_container" id="MaterialTheme">
                {toBoolean(props.twelveFormat) &&
                    <TwelveHoursMode
                        hour={timezoneData?.hour}
                        minute={timezoneData?.minute}
                        autoMode={autoMode}
                        autoClose={autoClose}
                        language={language}
                        draggable={draggable}
                        limitDrag={limitDrag}
                        timezone={timezoneData}
                        meridiem={meridiemData()}
                        timeConfig={timeConfig}
                        showTimezone={false}
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
                {!toBoolean(props.twelveFormat) &&
                    <TwentyFourHoursMode
                        hour={timezoneData?.hour}
                        minute={timezoneData?.minute}
                        autoMode={autoMode}
                        autoClose={autoClose}
                        language={language}
                        draggable={draggable}
                        limitDrag={limitDrag}
                        timezone={timezoneData}
                        meridiem={meridiemData()}
                        timeConfig={timeConfig}
                        showTimezone={false}
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

    const containerClass = cx(
        'time_picker_container'
    );

    return (
        <div className={containerClass}>
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