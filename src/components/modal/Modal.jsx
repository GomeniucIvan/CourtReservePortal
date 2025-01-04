import React from 'react';
import ReactDOM from 'react-dom';
import { useApp } from "../../context/AppProvider.jsx";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useStyles} from "./styles.jsx";
import {Button, Flex, Typography, Modal as AntModal} from "antd";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {cx} from "antd-style";

const {Title} = Typography;

function Modal({ children,
                   show,
                   title,
                   full = true,
                   onClose,
                   onConfirm,
                   loading,
                   hideFooter,
                   dangerConfirm = false,
                   showConfirmButton = false,
                   rootClass,
                   confirmButtonText = 'Confirm'}) {
    const { token } = useApp();
    const {styles} = useStyles();

    return (
        <AntModal
            wrapClassName={cx(styles.wrapperContainer, 'safe-area-top', rootClass)}
            className={styles.modalContainer}
            title={null}
            open={toBoolean(show)}
            footer={null}
            centered={true}
            onCancel={onClose}
        >
            <>
                {!isNullOrEmpty(title) &&
                    <Flex align={'center'} justify={'center'} className={styles.title}>
                        <Title level={1}>{title}</Title>
                    </Flex>
                }
                <div className={cx(styles.body)}>
                    {children}
                </div>

                {!hideFooter &&
                    <PaddingBlock topBottom={true}>
                        <Flex align={'center'} justify={'space-between'} gap={token.padding}>
                            <Button type={showConfirmButton ? 'default' : 'primary'} disabled={loading} block onClick={onClose}>Close</Button>

                            {showConfirmButton &&
                                <Button type={'primary'} danger={dangerConfirm} loading={loading} block onClick={onConfirm}>{confirmButtonText}</Button>
                            }
                        </Flex>
                    </PaddingBlock>
                }
            </>
        </AntModal>
    )
}

export default Modal;