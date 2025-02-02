import React, {useEffect, useState} from "react";
import {useStyles} from "./styles.jsx";
import FormInput from "./FormInput.jsx";
import ModalTimePicker from "@/components/modal/ModalTimePicker.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";

const FormInputsTimeInterval = ({ labelStart,
                                    labelEnd,
                                    formik,
                                    nameStart,
                                    nameEnd,
                                    className,
                                    hideLabels = false,
                                    ...props }) => {
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    
    let fieldStartTime = '';
    let fieldEndTime = '';

    const {styles} = useStyles();

    if (formik && typeof formik.getFieldProps === 'function') {
        fieldStartTime = formik.getFieldProps(nameStart);
        fieldEndTime = formik.getFieldProps(nameEnd);

        if (fieldStartTime.value === null) {
            fieldStartTime = { ...fieldStartTime, value: '' };

        }
        if (fieldEndTime.value === null) {
            fieldEndTime = { ...fieldEndTime, value: '' };
            setEndTime(fieldEndTime);
        }
    }

    useEffect(() => {
        setStartTime(fieldStartTime.value);
        setEndTime(fieldEndTime.value);
    }, [])

    const onStartChange = (e) => {

        formik.setFieldValue(nameStart, e);
    }

    const onEndChange = (e) => {
        
        formik.setFieldValue(nameEnd, e);
    }
    
    const onStartConfirm = (e) => {

        setShowStartDatePicker(false)
    }

    const onEndConfirm = (e) => {
        
        setShowEndDatePicker(false)
    }

    return (
        <>
            <div>
                <div onClick={() => setShowStartDatePicker(true)}>
                    <FormInput formik={formik}
                               name={nameStart}
                               label={''}
                               disabled={true}
                               suffix={<SVG icon={'clock'} size={18} />}
                               className={styles.activeBgInput}
                               placeholder={labelStart} />
                </div>

                <ModalTimePicker time={startTime}
                                 show={showStartDatePicker}
                                 onChange={onStartChange}
                                 twelveFormat={false}
                                 onConfirm={onStartConfirm}/>
            </div>

            <div>
                <div onClick={() => setShowEndDatePicker(true)}>
                    <FormInput formik={formik}
                               name={nameEnd}
                               label={''}
                               suffix={<SVG icon={'clock'} size={18} />}
                               disabled={true}
                               className={styles.activeBgInput}
                               placeholder={labelEnd} />
                </div>

                <ModalTimePicker time={endTime}
                                 show={showEndDatePicker}
                                 twelveFormat={false}
                                 onChange={onEndChange}
                                 onConfirm={onEndConfirm}/>
            </div>
        </>
    )
};

export default FormInputsTimeInterval;