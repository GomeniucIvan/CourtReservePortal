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
                             onClear,
                             twelveFormat,
                             onConfirm}) {
    const { token } = useApp();
    const {styles} = useStyles();
    const timePickerRef = useRef(null);
    const [time, setTime] = useState('02:20 AM');
    
    return (
        <Modal show={show} full={false} rootClass={cx(styles.datePickerModal)} hideFooter={true}>
            <div ref={timePickerRef}>
                <TimePicker twelveFormat={toBoolean(twelveFormat)} time={time} setTime={setTime} onTimeSelect={() => {onConfirm(time)}} />
            </div>
            <Button block={true} type={'primary'} className={styles.datePickerButtonConfirm} onClick={() => {onConfirm(time)}}>
                Confirm
            </Button>
        </Modal>
    )
}

export default ModalTimePicker;