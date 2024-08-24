import { Modal } from 'antd-mobile'
import {equalString} from "./Utils.jsx";

export const ModalRemove = (data) => {
    Modal.show({
        content: data.content,
        closeOnAction: true,
        onAction: (e) => {
            if (equalString(e?.key, 'remove')) {
                data.onRemove(e);
            }
        },
        actions: [
            {
                key: 'remove',
                text: 'Remove',
                primary: true,
            },
            {
                key: 'cancel',
                text: 'Cancel',
            },
        ],
    })
}

export const ModalClose = (data) => {
    Modal.show({
        content: data.content,
        closeOnAction: true,
        actions: [
            {
                key: 'close',
                text: 'Close',
                primary: true,
            }
        ],
    })
    
    // Modal.confirm({
    //     title: data.title,
    //     content: data.content,
    //     centered: true,
    //     okText: 'Close',
    //     cancelButtonProps: { style: { display: 'none' } },
    //     okType: 'primary',
    //     icon: data.showIcon ? undefined : null,
    //     onOk: data.onOk,
    // });
}

