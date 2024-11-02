import React from 'react';
import ReactDOM from 'react-dom';
import { useApp } from "../../context/AppProvider.jsx";
import { toBoolean } from "../../utils/Utils.jsx";
import {useStyles} from "./styles.jsx";
import {Button, Flex, Typography} from "antd";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";

const {Title} = Typography;

function Modal({ children, show, title, onClose, onConfirm, loading }) {
    const { token } = useApp();
    const {styles} = useStyles();

    if (!toBoolean(show)) {
        return null;
    }

    const modalContent = (
        <div className={styles.overlay}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <Flex align={'center'} justify={'center'} className={styles.title}>
                    <Title level={5}>{title}</Title>
                </Flex>
                <div className={styles.body}>
                    {children}
                </div>
                <PaddingBlock topBottom={true}>
                    <Flex align={'center'} justify={'space-between'} gap={token.padding}>
                        <Button type={'default'} disabled={loading} block onClick={onClose}>Close</Button>
                        <Button type={'primary'} loading={loading} block onClick={onConfirm}>Sign</Button>
                    </Flex>
                </PaddingBlock>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
}

export default Modal;