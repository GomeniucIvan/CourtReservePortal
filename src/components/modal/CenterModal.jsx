import React, {useRef, useState} from 'react';
import { useApp } from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {Button, DatePicker, Flex, Typography, Modal as AntModal} from "antd";
import {cx} from "antd-style";
import Modal from "./Modal.jsx";
import {toBoolean} from "@/utils/Utils.jsx";

const {Title} = Typography;

function CenterModal({ show,
                         rootClass,
                         title,
                         hideFooter = false,
                         children,
                         onClose}) {
    const { token } = useApp();
    const {styles} = useStyles();

    return (
        <AntModal
            wrapClassName={cx(styles.centerModal, 'safe-area-top', rootClass)}
            title={title}
            className={'ant-center-modal'}
            open={toBoolean(show)}
            footer={null}
            centered={true}
            onCancel={onClose}
        >
            {children}
        </AntModal>
    )
}

export default CenterModal;