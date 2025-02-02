import React, {useRef, useState} from 'react';
import { useApp } from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {Button, DatePicker, Flex, Typography} from "antd";
import {cx} from "antd-style";
import Modal from "./Modal.jsx";
import dayjs from "dayjs";
import {dateFormatByUiCulture} from "../../utils/DateUtils.jsx";
import TimePicker from "@/components/timepicker/TimePicker.jsx";
import {toBoolean} from "@/utils/Utils.jsx";

const {Title} = Typography;

function ModalTimePicker({ show,
                             selectedDate,
                             minDate,
                             maxDate,
                             dateFormat = dateFormatByUiCulture(),
                             onChange,
                             twelveFormat,
                             onConfirm}) {
    const { token } = useApp();
    const {styles} = useStyles();
    const timePickerRef = useRef(null);

    const getPopupContainer = () => {
        return timePickerRef.current || document.body;
    };

    return (
        <Modal show={show} full={false} rootClass={cx(styles.datePickerModal)} hideFooter={true}>
            <div ref={timePickerRef}>
                <TimePicker twelveFormat={toBoolean(twelveFormat)} />
            </div>
            <Button block={true} type={'primary'} className={styles.datePickerButtonConfirm} onClick={onConfirm}>
                Confirm
            </Button>
        </Modal>
    )
}

export default ModalTimePicker;