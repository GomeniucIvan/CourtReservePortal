import React, {useRef, useState} from 'react';
import { useApp } from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {Button, DatePicker, Flex, Typography} from "antd";
import {cx} from "antd-style";
import Modal from "./Modal.jsx";
import dayjs from "dayjs";
import {dateFormatByUiCulture} from "../../utils/DateUtils.jsx";

const {Title} = Typography;

function ModalDatePicker({ show, 
                             selectedDate: initialSelectedDate,
                             minDate,
                             maxDate,
                             dateFormat = dateFormatByUiCulture(),
                             onChange,
                             onConfirm}) {
    const { token } = useApp();
    const {styles} = useStyles();
    const datePickerWrapperRef = useRef(null);
    const datePickerRef = useRef(null);

    const [selectedDate, setSelectedDate] = useState(
        initialSelectedDate ? dayjs(initialSelectedDate) : null
    );
    
    const getPopupContainer = () => {
        return datePickerWrapperRef.current || document.body;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (onChange) {
            onChange(date);
        }
    };
    
    const onInnerConfirm = () => {
        onConfirm(selectedDate ? selectedDate.toDate() : null);
    }
    
    return (
        <Modal show={show} full={false} rootClass={cx(styles.datePickerModal)} hideFooter={true}>
            <div ref={datePickerWrapperRef}>
                <DatePicker
                    ref={datePickerRef}
                    rootClassName={styles.datePicker}
                    value={selectedDate ? dayjs(selectedDate) : null}
                    minDate={minDate ? dayjs(minDate) : null}
                    maxDate={maxDate ? dayjs(maxDate) : null}
                    format={dateFormat}
                    open={true}
                    onChange={handleDateChange}
                    getPopupContainer={getPopupContainer}
                />
            </div>
            <Button block={true} type={'primary'} className={styles.datePickerButtonConfirm} onClick={onInnerConfirm}>
                Confirm
            </Button>
        </Modal>
    )
}

export default ModalDatePicker;