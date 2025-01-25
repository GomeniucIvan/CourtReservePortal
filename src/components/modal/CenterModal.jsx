import React from 'react';
import { useApp } from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {Button, Flex, Modal as AntModal} from "antd";
import {cx} from "antd-style";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {Ellipsis} from "antd-mobile";
import SVG from "@/components/svg/SVG.jsx";


export const modalButtonType = {
    DEFAULT_CLOSE: "DEFAULT_CLOSE",
}

function CenterModal({ show,
                         rootClass,
                         title,
                         hideFooter = false,
                         buttonType,
                         type='',
                         children,
    zIndex,
                         onClose}) {
    
    const { token } = useApp();
    const {styles} = useStyles();

    const modalTitle = () => {
        if (isNullOrEmpty(title)) {
            return <></>;
        }
        
        if (isNullOrEmpty(type)) {
            return <Ellipsis direction='end' content={title}/>;
        }
        
        let iconName = 'circle-check';
        
        if (equalString(type, 'error')) {
            iconName = 'alert-triangle';
        } else if (equalString(type, 'warning')) {
            iconName = 'alert-custom';
        } else if (equalString(type, 'info')) {
            iconName = 'alert-info';
        }
        
        return (
            <Flex gap={token.paddingXS} align={'center'}>
                <SVG icon={iconName} size={22} preventFill={true}/>
                <Ellipsis direction='end' content={title}/>
            </Flex>
        )
    }
    
    return (
        <AntModal
            wrapClassName={cx(styles.centerModalWrap, 'safe-area-top', rootClass)}
            title={modalTitle()}
            className={cx(styles.centerModal,'ant-center-modal')}
            open={toBoolean(show)}
            footer={null}
            centered={true}
            zIndex={zIndex}
            onCancel={onClose}
        >
            {!isNullOrEmpty(buttonType) &&
                <Flex vertical={true} gap={token.padding * 2}>
                    {children}
                    
                    {equalString(buttonType, modalButtonType.DEFAULT_CLOSE) &&
                        <Button block={true} onClick={onClose}>Close</Button>
                    }
                </Flex>
            }
            
            {isNullOrEmpty(buttonType) &&
                <>{children}</>
            }
        </AntModal>
    )
}

export default CenterModal;