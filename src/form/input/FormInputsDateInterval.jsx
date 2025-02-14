import React, {useEffect, useRef, useState} from "react";
import {Input, Skeleton, Typography} from "antd";
const { Paragraph } = Typography;
import {calculateSkeletonLabelWidth, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useStyles} from "./styles.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {useTranslation} from "react-i18next";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import {logFormikErrors} from "../../utils/ConsoleUtils.jsx";
import FormInput from "./FormInput.jsx";
import ModalDatePicker from "../../components/modal/ModalDatePicker.jsx";
import dayjs from "dayjs";
import {dateFormatByUiCulture} from "../../utils/DateUtils.jsx";
import SVG from "@/components/svg/SVG.jsx";

const FormInputsDateInterval = ({ labelStart,
                                    labelEnd,
                                    formik,
                                    nameStart,
                                    nameEnd,
                                    className,
                                    interval = 30,
                                    minDate,
                                    maxDate,
                                    hideLabels = false,
                                    ...props }) => {
    const { token, globalStyles } = useApp();
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    
    const [startDate, setStartDate] = useState(formik.values[nameStart] || '');
    const [endDate, setEndDate] = useState(formik.values[nameEnd] || '');

    let fieldStart = '';
    let fieldEnd = '';

    const {styles} = useStyles();
    const {t} = useTranslation('');

    if (formik && typeof formik.getFieldProps === 'function') {
        fieldStart = formik.getFieldProps(nameStart);
        fieldEnd = formik.getFieldProps(nameEnd);

        if (fieldStart.value === null) {
            fieldStart = { ...fieldStart, value: '' };

        }
        if (fieldEnd.value === null) {
            fieldEnd = { ...fieldEnd, value: '' };
        }
    }

    useEffect(() => {
        setStartDate(fieldStart.value);
        setEndDate(fieldEnd.value);
    }, [fieldStart.value, fieldEnd.value])

    const updateDates = (start, end) => {
        const startDateObj = dayjs(start);
        const endDateObj = dayjs(end);

        let updatedEndDate = endDateObj;

        if (startDateObj.isAfter(endDateObj)) {
            updatedEndDate = startDateObj;
        } else if (startDateObj.add(interval, 'day').isBefore(endDateObj)) {
            updatedEndDate = startDateObj.add(interval, 'day');
        }

        setStartDate(startDateObj.format(dateFormat));
        setEndDate(updatedEndDate.format(dateFormat));
        formik.setFieldValue(nameStart, startDateObj.format(dateFormat));
        formik.setFieldValue(nameEnd, updatedEndDate.format(dateFormat));
    };

    const onStartChange = (date, dateString) => {
        setStartDate(dateString);
    }

    const onStartConfirm = (e) => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        let dateFormat = dateFormatByUiCulture();
        
        if (!equalString(fieldStart, startDate)) {
            if (end.diff(start, 'day') > interval) {
                setEndDate(start.add(interval, 'day').format(dateFormat));
                formik.setFieldValue(nameEnd, start.add(interval, 'day').format(dateFormat));
            } else if (start > end){
                setEndDate(startDate);
                formik.setFieldValue(nameEnd, startDate);
            }
            
            formik.setFieldValue(nameStart, startDate);
        }
        setShowStartDatePicker(false)
    }

    const onStartClose = (e) => {

    }

    const onEndChange = (date, dateString) => {
        setEndDate(dateString);
    }

    const onEndConfirm = (e) => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        let dateFormat = dateFormatByUiCulture();
        
        if (!equalString(fieldEnd, endDate)) {
            if (start.diff(end, 'day') > interval) {
                setStartDate(end.subtract(interval, 'day').format(dateFormat));
                formik.setFieldValue(nameStart, end.subtract(interval, 'day').format(dateFormat));
            } else if (end < start){
                setStartDate(endDate);
                formik.setFieldValue(nameStart, endDate);
            }
            
            formik.setFieldValue(nameEnd, endDate);
        }
        setShowEndDatePicker(false)
    }

    const onEndClose = (e) => {

    }

    return (
        <>
            <div>
                <div onClick={() => setShowStartDatePicker(true)}>
                    <FormInput formik={formik}
                               name={nameStart} 
                               label={''}
                               disabled={true}
                               suffix={<SVG icon={'calendar'} size={18} />}
                               className={styles.activeBgInput} 
                               placeholder={labelStart} />
                </div>

                <ModalDatePicker selectedDate={startDate}
                                 show={showStartDatePicker}
                                 onChange={onStartChange} 
                                 onConfirm={onStartConfirm} 
                                 onClose={onStartClose}
                                 minDate={minDate}
                                 maxDate={maxDate}  />
            </div>

            <div>
                <div onClick={() => setShowEndDatePicker(true)}>
                    <FormInput formik={formik} 
                               name={nameEnd} 
                               label={''} 
                               disabled={true}
                               suffix={<SVG icon={'calendar'} size={18} />}
                               className={styles.activeBgInput}
                               placeholder={labelEnd} />
                </div>

                <ModalDatePicker selectedDate={endDate}
                                 show={showEndDatePicker}
                                 onChange={onEndChange} 
                                 onConfirm={onEndConfirm} 
                                 onClose={onEndClose} 
                                 minDate={minDate} 
                                 maxDate={maxDate} 
                                 className={styles.activeBgInput} />
            </div>
        </>
    )
};

export default FormInputsDateInterval;