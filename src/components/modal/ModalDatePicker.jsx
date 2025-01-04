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
                             selectedDate,
                             minDate,
                             maxDate,
                             dateFormat = dateFormatByUiCulture(),
                             onChange,
                             onConfirm}) {
    const { token } = useApp();
    const {styles} = useStyles();
    const datePickerRef = useRef(null);
    
    const getPopupContainer = () => {
        return datePickerRef.current || document.body;
    };
    
    return (
        <Modal show={show} full={false} rootClass={cx(styles.datePickerModal)} hideFooter={true}>
            <div ref={datePickerRef}>
                <DatePicker
                    rootClassName={styles.datePicker}
                    value={selectedDate ? dayjs(selectedDate) : null}
                    minDate={minDate ? dayjs(minDate) : null}
                    maxDate={maxDate ? dayjs(maxDate) : null}
                    format={dateFormat}
                    open={true}
                    onChange={onChange}
                    getPopupContainer={getPopupContainer}
                />
            </div>
            <Button block={true} type={'primary'} className={styles.datePickerButtonConfirm} onClick={onConfirm}>
                Confirm
            </Button>
        </Modal>
    )
}

export default ModalDatePicker;