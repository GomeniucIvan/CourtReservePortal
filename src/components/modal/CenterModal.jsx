import React from 'react';
import { useApp } from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {Modal as AntModal} from "antd";
import {cx} from "antd-style";
import {toBoolean} from "@/utils/Utils.jsx";


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