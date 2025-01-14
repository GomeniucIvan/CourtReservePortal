
import { Modal } from 'antd-mobile'
import {equalString} from "./Utils.jsx";

export const ModalDelete = (data) => {
    Modal.show({
        content: (
            <div
                dangerouslySetInnerHTML={{
                    __html: data.content
                }}
            />
        ),
        closeOnAction: true,
        onAction: (e) => {
            if (equalString(e?.key, 'delete')) {
                data.onDelete(e);
            }
        },
        actions: [
            {
                key: 'delete',
                text: 'Delete',
                danger: true,
                primary: true,
            },
            {
                key: 'cancel',
                text: 'Cancel',
            },
        ],
    })
}

export const ModalConfirm = (data) => {
    Modal.show({
        content: (
            <div
                dangerouslySetInnerHTML={{
                    __html: data.content
                }}
            />
        ),
        closeOnAction: true,
        onAction: (e) => {
            if (equalString(e?.key, 'confirm')) {
                data.onConfirm(e);
            }
        },
        actions: [
            {
                key: 'confirm',
                text: 'Confirm',
                primary: true,
            },
            {
                key: 'cancel',
                text: 'Cancel',
            },
        ],
    })
}

export const ModalRemove = (data) => {
    Modal.show({
        content: (
            <div
                dangerouslySetInnerHTML={{
                    __html: data.content
                }}
            />
        ),
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

export const ModalLogout = (data) => {
    Modal.show({
        content: (
            <div
                dangerouslySetInnerHTML={{
                    __html: 'Are you sure you want to logout?'
                }}
            />
        ),
        closeOnAction: true,
        onAction: (e) => {
            if (equalString(e?.key, 'logout')) {
                data.onLogout(e);
            }
        },
        actions: [
            {
                key: 'logout',
                text: 'Logout',
                primary: true,
            },
            {
                key: 'cancel',
                text: 'Cancel',
            },
        ],
    })
}

