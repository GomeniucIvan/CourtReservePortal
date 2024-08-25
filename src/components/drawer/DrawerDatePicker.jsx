import React, { useRef } from 'react';
import { Button, DatePicker, Flex, Typography } from "antd";
import dayjs from "dayjs";
import { isNullOrEmpty, toBoolean } from "../../utils/Utils.jsx";
import { Popup } from "antd-mobile";
import { CloseOutline } from "antd-mobile-icons";
import {useStyles} from "./styles.jsx";
import { useApp } from "../../context/AppProvider.jsx";
const { Title } = Typography;

const DrawerDatePicker = ({
                              show,
                              value = '2019-09-03',
                              minDate,
                              maxDate,
                              dateFormat = 'YYYY-MM-DD',
                              onClose,
                              label = 'Date Picker',
                              allowClear,
                              onChange
                          }) => {

    const { token } = useApp();
    const {styles} = useStyles();
    
    // Create a ref for the drawer container
    const drawerContainerRef = useRef(null);

    const getPopupContainer = () => {
        // Return the ref's current DOM element as the container
        return drawerContainerRef.current || document.body;
    };

    return (
        <Popup
            visible={toBoolean(show)}
            onMaskClick={onClose}
            onClose={onClose}
            bodyStyle={{
                height: 'auto',
                maxHeight: `60vh`,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <>
                <Flex vertical>
                    <Flex justify={'space-between'} align={'center'} style={{ padding: `${token.padding}px` }}>
                        <Title level={4} style={{ margin: 0 }}>{label}</Title>

                        <Button type="default" icon={<CloseOutline />} size={'middle'}
                                onClick={onClose} />
                    </Flex>
                </Flex>

                {/* Attach the ref to the drawer container */}
                <div className={styles.datePickerDrawer} ref={drawerContainerRef}>
                    <DatePicker
                        defaultValue={isNullOrEmpty(value) ? null : dayjs(value, dateFormat)}
                        minDate={isNullOrEmpty(minDate) ? null : dayjs(minDate, dateFormat)}
                        open={true}
                        maxDate={isNullOrEmpty(maxDate) ? null : dayjs(maxDate, dateFormat)}
                        onChange={onChange}
                        getPopupContainer={getPopupContainer}
                    />
                </div>
            </>
        </Popup>
    )
}

export default DrawerDatePicker;