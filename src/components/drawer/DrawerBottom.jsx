import React, { Component } from 'react';
import {toBoolean } from "../../utils/Utils.jsx";
import {Popup} from "antd-mobile";
import {Flex, Typography, Button} from "antd";
import {CloseOutline, SearchOutline} from "antd-mobile-icons";
import {useApp} from "../../context/AppProvider.jsx";
import {useNavigate} from "react-router-dom";
const { Title } = Typography;

const DrawerBottom = ({ showDrawer, closeDrawer, children,label, addSearch, showButton, confirmButtonText,onConfirmButtonClick }) => {
    const {token} = useApp();
    
    return (
        <Popup
            visible={toBoolean(showDrawer)}
            onMaskClick={() => {
                closeDrawer();
            }}
            onClose={() => {
                closeDrawer();
            }}
            bodyStyle={{ maxHeight: '50vh' }}
        >
            <div> 
                <Flex justify={'space-between'} align={'center'} style={{padding: `${token.padding}px`}}>
                    <Title level={4} style={{margin: 0}}>{label}</Title>

                    <Flex gap={token.Custom.buttonPadding}>
                        {addSearch && <Button type="default" icon={<SearchOutline />} size={'middle'} />}
                        <Button type="default" icon={<CloseOutline />} size={'middle'} onClick={() => closeDrawer()} />
                    </Flex>
                </Flex>

                {children}

                {showButton &&
                    <div style={{padding: `${token.padding}px` }}>
                        <Button type='primary' block onClick={() => {
                            onConfirmButtonClick();
                        }}>{confirmButtonText}</Button>
                    </div>
                }
            </div>
        </Popup>
    )
}

export default DrawerBottom