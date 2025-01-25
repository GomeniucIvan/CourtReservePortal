import React, {useState, useEffect, useRef} from "react";
import {Row, Col, Card, Typography, message, Flex, Segmented, Divider, Button} from "antd";
import {useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import Modal from "@/components/modal/Modal.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";

const { Text, Title } = Typography;

function DevModals() {
    const {token} = useApp();
    const [showModal, setShowModal] = useState(false);
    
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={16}>
                <Button onClick={() => {setShowModal(true)}}>Modal</Button>
                <Button onClick={() => {pNotify('Description')}}>pNotify success</Button>
                <Button onClick={() => {pNotify('Description', 'error')}}>pNotify error</Button>
                <Button onClick={() => {pNotify('Description', 'warning')}}>pNotify warning</Button>
                <Button onClick={() => {pNotify('Description', 'info')}}>pNotify info</Button>

                <Button onClick={() => {displayMessageModal({
                    title: "Success",
                    html: (onClose) => 'Html message',
                    type: "success",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })}}>
                    Swal Success
                </Button>

                <Button onClick={() => {displayMessageModal({
                    title: "Error",
                    html: (onClose) => 'Html message',
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })}}>
                    Swal Error
                </Button>
                
                <Button onClick={() => {displayMessageModal({
                    title: "Info",
                    html: (onClose) => 'Html message',
                    type: "info",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })}}>
                    Swal Info
                </Button>

                <Button onClick={() => {displayMessageModal({
                    title: "Warning",
                    html: (onClose) => 'Html message',
                    type: "warning",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })}}>
                    Swal Warning
                </Button>
            </Flex>
            
            <Modal show={showModal}
                   onClose={() => {setShowModal(null)}}
                   showConfirmButton={true}
                   onConfirm={() => {setShowModal(true)}}
                   onCancel={() => {setShowModal(null)}}
                   title={'Modal1'}>
                <PaddingBlock topBottom={true}>Body</PaddingBlock>
            </Modal>
        </PaddingBlock>
    );
}

export default DevModals;