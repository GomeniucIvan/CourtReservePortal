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

const FormInputsDateInterval = ({ labelStart,
                                    labelEnd,
                                    formik,
                                    nameStart,
                                    nameEnd,
                                    className,
                                    interval = 90,
                                    minDate,
                                    maxDate,
                                    ...props }) => {
    const { token, globalStyles } = useApp();
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


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
            setEndDate(fieldEnd);
        }
    }

    useEffect(() => {
        setStartDate(fieldStart.value);
        setEndDate(fieldEnd.value);
    }, [])
    
    const onStartChange = (date, dateString) => {
        setStartDate(dateString);
    }

    const onStartConfirm = (e) => {
        if (!equalString(fieldStart, startDate)) {
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
        if (!equalString(fieldEnd, endDate)) {
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
                    <FormInput formik={formik} name={nameStart} label={labelStart} disabled={true} className={styles.activeBgInput} />
                </div>

                <ModalDatePicker selectedDate={startDate} show={showStartDatePicker} onChange={onStartChange} onConfirm={onStartConfirm} onClose={onStartClose} minDate={minDate} maxDate={maxDate}  />
            </div>

            <div>
                <div onClick={() => setShowEndDatePicker(true)}>
                    <FormInput formik={formik} name={nameEnd} label={labelEnd} disabled={true} className={styles.activeBgInput} />
                </div>

                <ModalDatePicker selectedDate={endDate} show={showEndDatePicker} onChange={onEndChange} onConfirm={onEndConfirm} onClose={onEndClose} minDate={minDate} maxDate={maxDate} className={styles.activeBgInput} />
            </div>
        </>
    )
};

export default FormInputsDateInterval;