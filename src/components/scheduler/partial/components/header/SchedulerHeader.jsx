import * as React from "react";
import {classNames} from "@progress/kendo-react-common";
import {Button, Flex, Radio} from "antd";
import {CaretLeftOutlined, CaretRightOutlined} from "@ant-design/icons";
import {NavigationDatePicker} from "./navigation/NavigationDatePicker.jsx";
import {messages, today} from "../../messages/index.mjs";
import {useLocalization} from "../../intl/index.mjs";
import {getToday} from "../../utils/index.jsx";
import {useEffect, useState} from "react";
import {addDays, addMonths} from "@progress/kendo-date-math";
import {isNullOrEmpty} from "../../../../../utils/Utils.jsx";

export const SchedulerHeader = React.forwardRef((props, ref) => {
    const {
        className,
        ...other
    } = props;
    const element = React.useRef(null);
    const header = React.useRef(null);
    const [headerDate, setHeaderDate] = useState(props.date);
    const [isPrevDisabled, setIsPrevDisabled] = useState(true);
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    
    useEffect(() => {
        if (isNullOrEmpty(props.scheduler.current.props?.minDate)){
            setIsPrevDisabled(false)
        } else{
            setIsPrevDisabled(headerDate <= props.scheduler.current.props.minDate);
        }
        
        if (isNullOrEmpty(props.scheduler.current.props?.maxDate)){
            setIsNextDisabled(false);
        } else{
            setIsNextDisabled(headerDate >= props.scheduler.current.props.maxDate);
        }
    }, [headerDate])
    
    React.useImperativeHandle(header, () => ({element: element.current, props}));
    React.useImperativeHandle(ref, () => header.current);

    const rootClassName = React.useMemo(() => classNames('k-scheduler-toolbar', className), [className]);
    const localization = useLocalization();
    const todayText = localization.toLanguageString(today, messages[today]);

    const handleTodayClick = React.useCallback(
        (syntheticEvent) => {
            syntheticEvent.preventDefault();

            props.setLoading(true);
            const newDate = getToday();
            // eslint-disable-next-line no-restricted-globals
            setHeaderDate(newDate);

            props.setLoading(true);
            
            setTimeout(function(){
                props.setDate(newDate)
            }, 300)
        },
        [setHeaderDate]
    );

    const handlePrevClick = React.useCallback(
        (syntheticEvent) => {
            syntheticEvent.preventDefault();

            props.setLoading(true);
            
            const offset = props.numberOfDays || 1;
            const isMonthView = offset > 27;
            const newDate = isMonthView
                ? addMonths(headerDate, -(Math.round(offset / 27)))
                : addDays(headerDate, -(offset));

            // eslint-disable-next-line no-restricted-globals
            setHeaderDate(newDate);

            props.setLoading(true);
            
            setTimeout(function(){
                props.setDate(newDate)
            }, 50)
        },
        [headerDate, setHeaderDate, props.numberOfDays]
    );

    const handleNextClick = React.useCallback(
        (syntheticEvent) => {
            syntheticEvent.preventDefault();

            setTimeout(function () {
                const offset = props.numberOfDays || 1;
                const isMonthView = offset > 27;
                const newDate = isMonthView
                    ? addMonths(headerDate, Math.round(offset / 27))
                    : addDays(headerDate, offset);
                
                // eslint-disable-next-line no-restricted-globals
                setHeaderDate(newDate);

                props.setLoading(true);
                
                setTimeout(function(){
                    props.setDate(newDate)
                }, 50)
                
            }, 50);
        },
        [headerDate, setHeaderDate, props.numberOfDays]
    );

    const handleDatePickerChange = React.useCallback(
        (event) => {
            if (!event.value) { return; }

            props.setLoading(true);

            setTimeout(function () {
                setHeaderDate(event.value);
            }, 50)

            setTimeout(function(){
                props.setDate(event.value)
            }, 300)
        },
        [
            setHeaderDate,
            props.scheduler
        ]
    );
    
    return (
        <div className={rootClassName}>
            <Flex justify={'space-between'} style={{width: '100%'}}>
                <Button type={'default'} onClick={handleTodayClick}>{todayText}</Button>

                <Radio.Group value={0} size={'large'}>
                    <Radio.Button onClick={handlePrevClick} disabled={isPrevDisabled}>
                        <CaretLeftOutlined />
                    </Radio.Button>
                    <NavigationDatePicker
                        value={headerDate}
                        onChange={handleDatePickerChange}
                    />
                    <Radio.Button onClick={handleNextClick} disabled={isNextDisabled}>
                        <CaretRightOutlined />
                    </Radio.Button>
                </Radio.Group>
            </Flex>
        </div>
    )

    // return (
    //     <Toolbar
    //         id={props.id}
    //         ref={(toolbar) => { if (toolbar) { element.current = toolbar.element; } }}
    //         className={rootClassName}
    //         {...other}
    //     >
    //         {props.children}
    //     </Toolbar>
    // );
});

SchedulerHeader.displayName = 'KendoReactSchedulerHeader';

