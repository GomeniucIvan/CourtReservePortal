import React from 'react';
import {toBoolean} from "../../utils/Utils.jsx";
import {Popup} from "antd-mobile";
import {Flex, Typography, Button} from "antd";
import {CloseOutline, SearchOutline} from "antd-mobile-icons";
import {useApp} from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
const {Title} = Typography;

const DrawerBottom = ({
                          showDrawer,
                          closeDrawer,
                          children,
                          label,
                          addSearch,
                          showButton,
                          confirmButtonText,
                          onConfirmButtonClick,
                          maxHeightVh = 60
                      }) => {
    const {token} = useApp();
    const {styles} = useStyles();
    
    return (
        <Popup
            visible={toBoolean(showDrawer)}
            onMaskClick={() => {
                closeDrawer();
            }}
            onClose={() => {
                closeDrawer();
            }}
            bodyStyle={{
                height: 'auto',
                maxHeight: `${maxHeightVh}vh`,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <>
                <Flex justify={'space-between'} align={'center'} style={{padding: `${token.padding}px`}}>
                    <Title level={4} style={{margin: 0}}>{label}</Title>

                    <Flex gap={token.Custom.buttonPadding}>
                        {addSearch && <Button type="default" icon={<SearchOutline/>} size={'middle'}/>}
                        <Button type="default" icon={<CloseOutline/>} size={'middle'} onClick={() => closeDrawer()}/>
                    </Flex>
                </Flex>
                
                <div className={styles.drawerBottom}>
                    {children}
                </div>

                {showButton &&
                    <div className={styles.drawerButton}>
                        <Button type='primary' block onClick={() => {
                            onConfirmButtonClick();
                        }}>
                            {confirmButtonText}
                        </Button>
                    </div>
                }
            </>
        </Popup>
    )
}

export default DrawerBottom