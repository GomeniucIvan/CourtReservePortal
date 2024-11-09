import React from 'react';
import ReactDOM from 'react-dom';
import { useApp } from "../../context/AppProvider.jsx";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useStyles} from "./styles.jsx";
import {Button, Flex, Typography} from "antd";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {cx} from "antd-style";

const {Title} = Typography;

function Modal({ children,
                   show,
                   title,
                   onClose,
                   onConfirm,
                   loading,
                   showConfirmButton = false,
                   confirmButtonText = 'Confirm'}) {
    const { token } = useApp();
    const {styles} = useStyles();

    if (!toBoolean(show)) {
        return null;
    }

    const modalContent = (
        <div className={styles.overlay}>
            <div className={cx(styles.container, 'safe-area-top')} onClick={(e) => e.stopPropagation()}>
                {!isNullOrEmpty(title) &&
                    <Flex align={'center'} justify={'center'} className={styles.title}>
                        <Title level={5}>{title}</Title>
                    </Flex>
                }
                <div className={styles.body}>
                    {children}
                </div>
                <PaddingBlock topBottom={true}>
                    <Flex align={'center'} justify={'space-between'} gap={token.padding}>
                        <Button type={showConfirmButton ? 'default' : 'primary'} disabled={loading} block onClick={onClose}>Close</Button>

                        {showConfirmButton &&
                            <Button type={'primary'} loading={loading} block onClick={onConfirm}>{confirmButtonText}</Button>                    
                        }
                    </Flex>
                </PaddingBlock>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
}

export default Modal;