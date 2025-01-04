import React from 'react';
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
                             onConfirm,
                             onClose,
                             onChange }) {
    const { token } = useApp();
    const {styles} = useStyles();

    return (
        <Modal show={show}>
            <>
                <DatePicker
                    value={null}
                    minDate={minDate ? dayjs(minDate) : null}
                    maxDate={maxDate ? dayjs(maxDate) : null}
                    format={dateFormat}
                    open={true}
                    onChange={onChange}
                />
            </>
        </Modal>
    )
}

export default ModalDatePicker;