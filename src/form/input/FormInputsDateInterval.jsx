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
                                    ...props }) => {
    const { token, globalStyles } = useApp();
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    
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

    const onStartChange = (e) => {
        console.log(e)
    }
    
    const onStartConfirm = (e) => {
        console.log(e)
    }

    const onStartClose = (e) => {
        console.log(e)
    }
    
    
    
    return (
        <>
            <div>
                <div onClick={() => setShowStartDatePicker(true)}>
                    <FormInput formik={formik} name={nameStart} label={labelStart} />
                </div>
                
                <ModalDatePicker show={showStartDatePicker} onChange={onStartChange} onConfirm={onStartConfirm} onClose={onStartClose} />
            </div>

            <div>
                <div onClick={() => setShowEndDatePicker(true)}>
                    <FormInput formik={formik} name={nameEnd} label={labelEnd}/>
                </div>

                <ModalDatePicker show={showEndDatePicker} onChange={onStartChange} onConfirm={onStartConfirm}
                                 onClose={onStartClose}/>
            </div>
        </>
    )
};

export default FormInputsDateInterval;