import {Button, DatePicker, Flex, Input, Typography} from 'antd';
import * as React from "react";
import {useApp} from "../../context/AppProvider.jsx";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {CloseOutline} from "antd-mobile-icons";
import {Popup} from "antd-mobile";
import {useRef, useState} from "react";
import {useStyles} from "../../components/drawer/styles.jsx";

const {RangePicker} = DatePicker;

const {Title} = Typography;
import dayjs from 'dayjs';
import {dateFormatByUiCulture, fixDate} from "../../utils/DateUtils.jsx";
import {useTranslation} from "react-i18next";

const FormRangePicker = ({
                             start,
                             end,
                             hasError,
                             minDate,
                             maxDate,
                             dateFormat = dateFormatByUiCulture(),
                             intervalDays = 30, //days
                             onChange,
                             filterLabel = 'date.customDates',
                             startDateLabel = 'date.startDate',
                             endDateLabel = 'date.endDate'
                         }) => {
    const {token} = useApp();
    const [show, setShow] = useState(false);
    const [showPicker, setShowPicker] = useState();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const drawerContainerRef = useRef(null);
    const {styles} = useStyles();
    const {t} = useTranslation('');

    const getPopupContainer = () => {
        return drawerContainerRef.current || document.body;
    };

    const handleCloseClick = () => {
        setShow(false)
    }

    const onRangeChange = (dates) => {
        const [start, end] = dates || [];
        if (start) {
            setStartDate(start);
        }
        if (end) {
            setEndDate(end);
            setShow(false);
        }

        if (onChange && typeof onChange === 'function') {
            onChange(start?.$d, end?.$d);
        }
    };

    const disabledDaysDate = (current, {from}) => {
        return Math.abs(current.diff(from, 'days')) >= intervalDays;
    };

    const openDatesPicker = () => {
        setShow(true);
        setShowPicker(true);
    }

    const clearDates = () => {
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <>
            <Flex gap={token.padding} justify={'center'} align={'center'} className={styles.rangeDatePickerInput}>
                <RangePicker value={[startDate, endDate]}
                             onChange={onRangeChange}
                             allowClear={true}
                             minDate={minDate ? dayjs(fixDate(minDate)) : null}
                             maxDate={maxDate ? dayjs(fixDate(maxDate)) : null}
                             onClick={openDatesPicker}
                             disabledDate={disabledDaysDate}
                             format={dateFormat}
                             open={showPicker}
                             getPopupContainer={getPopupContainer}/>
            </Flex>

            <Popup
                visible={toBoolean(show)}
                onMaskClick={handleCloseClick}
                onClose={handleCloseClick}
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
                            <Title level={4} style={{margin: 0}}>{t(filterLabel)}</Title>

                            <Button type="default" icon={<CloseOutline/>} size={'middle'} onClick={handleCloseClick}/>
                        </Flex>
                    </Flex>

                    <div className={styles.datePickerDrawer} ref={drawerContainerRef}>

                    </div>

                    <div className={styles.drawerButton}>
                        <Flex gap={token.padding}>
                            <Button type='primary' block danger={true} onClick={clearDates}>
                                {t('clear')}
                            </Button>
                            <Button type='primary' block onClick={handleCloseClick}>
                                {t('select')}
                            </Button>
                        </Flex>
                    </div>
                </>
            </Popup>
        </>
    )
};

export default FormRangePicker;