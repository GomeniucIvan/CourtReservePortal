import React, {useRef} from 'react';
import { useApp } from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {Button, Typography} from "antd";
import {cx} from "antd-style";
import Modal from "./Modal.jsx";
import TimePicker from "@/components/timepicker/TimePicker.jsx";
import {toBoolean} from "@/utils/Utils.jsx";

function ModalTimePicker({ show,
                             time,
                             onClear,
                             onChange,
                             twelveFormat,
                             onConfirm}) {
    const { token } = useApp();
    const {styles} = useStyles();
    const timePickerRef = useRef(null);

    return (
        <>
            <Modal show={show} full={false} rootClass={cx(styles.datePickerModal)} hideFooter={true}>
                {show &&
                    <>
                        <div ref={timePickerRef}>
                            <TimePicker twelveFormat={toBoolean(twelveFormat)}
                                        time={time}
                                        show={show} 
                                        setTime={onChange}
                                        onTimeSelect={() => {
                                            onConfirm(time)
                                        }}/>
                        </div>
                        <Button block={true} type={'primary'} className={styles.datePickerButtonConfirm}
                                onClick={() => {
                                    onConfirm(time)
                                }}>
                            Confirm
                        </Button>
                    </>
                }
            </Modal>
        </>
    )
}

export default ModalTimePicker;