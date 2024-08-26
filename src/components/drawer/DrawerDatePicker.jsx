import React, {useRef} from 'react';
import {Button, DatePicker, Flex, Typography} from "antd";
import dayjs from "dayjs";
import {toBoolean} from "../../utils/Utils.jsx";
import {Popup} from "antd-mobile";
import {CloseOutline} from "antd-mobile-icons";
import {useStyles} from "./styles.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {dateFormatByUiCulture, fixDate} from "../../utils/DateUtils.jsx";

const {Title} = Typography;

const DrawerDatePicker = ({
                              show,
                              value = '2019-09-03',
                              minDate,
                              maxDate,
                              dateFormat = dateFormatByUiCulture(),
                              onClose,
                              hasError,
                              label = 'Date Picker',
                              allowClear,
                              onChange
                          }) => {

    const {token} = useApp();
    const {styles} = useStyles();

    const drawerContainerRef = useRef(null);
    const fixedDate = fixDate(value);

    const getPopupContainer = () => {
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
                    <Flex justify={'space-between'} align={'center'} style={{padding: `${token.padding}px`}}>
                        <Title level={4} style={{margin: 0}}>{label}</Title>

                        <Button type="default" icon={<CloseOutline/>} size={'middle'}
                                onClick={onClose}/>
                    </Flex>
                </Flex>

                <div className={styles.datePickerDrawer} ref={drawerContainerRef}>
                    <DatePicker
                        value={fixedDate ? dayjs(fixedDate) : null}
                        minDate={dayjs(fixDate(minDate))}
                        maxDate={dayjs(fixDate(maxDate))}
                        format={dateFormat}
                        status={hasError ? 'error' : ''}
                        open={true}
                        onChange={onChange}
                        getPopupContainer={getPopupContainer}
                    />
                </div>
            </>
        </Popup>
    )
}

export default DrawerDatePicker;