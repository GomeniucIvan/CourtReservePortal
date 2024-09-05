import {Button, DatePicker, Flex, Input, Typography} from 'antd';
import * as React from "react";
import {useApp} from "../../context/AppProvider.jsx";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {CloseOutline} from "antd-mobile-icons";
import {Popup} from "antd-mobile";
import {useRef, useState} from "react";
import {useStyles} from "../../components/drawer/styles.jsx";
const {Title} = Typography;
import dayjs from 'dayjs';
import {dateFormatByUiCulture, fixDate} from "../../utils/DateUtils.jsx";
import {useTranslation} from "react-i18next";

const FormRangePicker = ({minValue,
                             hasError, 
                             dateFormat = dateFormatByUiCulture(), 
                             interval = 30,
                         startDateLabel = 'date.startDate',
                         endDateLabel = 'date.endDate'}) => {
    const {token} = useApp();
    const [showStart, setShowStart] = useState(false);
    
    const getYearMonth = (date) => date.year() * 12 + date.month();
    const drawerContainerRef = useRef(null);
    const {styles} = useStyles();
    const { t } = useTranslation('');
    
    const getPopupContainer = () => {
        return drawerContainerRef.current || document.body;
    };

    const disabled7DaysDate = (current, { from, type }) => {
        if (from) {
            const minDate = from.add(-6, 'days');
            const maxDate = from.add(6, 'days');
            switch (type) {
                case 'year':
                    return current.year() < minDate.year() || current.year() > maxDate.year();
                case 'month':
                    return (
                        getYearMonth(current) < getYearMonth(minDate) ||
                        getYearMonth(current) > getYearMonth(maxDate)
                    );
                default:
                    return Math.abs(current.diff(from, 'days')) >= 7;
            }
        }
        return false;
    };
    
    const handleOnStartClick = () => {
        setShowStart(true)
    }

    const handleOnEndClick = () => {

    }
    
    const onClose =() =>{
        setShowStart(false)
    }

    const fixedMinDate = fixDate(minValue);
    
    const onMinDatePickerChange = (e) => {
        
    }
    
    return (
        <>
            <Flex gap={token.padding} justify={'center'} align={'center'}>
                <div onClick={handleOnStartClick} style={{width: '100%'}}><Input readOnly={true} placeholder={t(startDateLabel)}/></div>
                <div>—</div>
                <div onClick={handleOnEndClick} style={{width: '100%'}}><Input readOnly={true} placeholder={t(endDateLabel)}/></div>
            </Flex>

            <Popup
                visible={toBoolean(showStart)}
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
                            <Title level={4} style={{margin: 0}}>{t(startDateLabel)}</Title>

                            <Button type="default" icon={<CloseOutline/>} size={'middle'} onClick={onClose}/>
                        </Flex>
                    </Flex>

                    <div className={styles.datePickerDrawer} ref={drawerContainerRef}>
                        <DatePicker
                            value={fixedMinDate ? dayjs(fixedMinDate) : null}
                            // minDate={minDate ? dayjs(fixDate(minDate)) : null}
                            // maxDate={maxDate ? dayjs(fixDate(maxDate)) : null}
                            format={dateFormat}
                            status={hasError ? 'error' : ''}
                            open={true}
                            onChange={onMinDatePickerChange}
                            getPopupContainer={getPopupContainer}
                        />
                    </div>

                    <div className={styles.drawerButton}>
                        <Flex gap={token.padding}>
                            <Button type='primary' block danger={true} onClick={() => {
                                
                            }}>
                                {t('clear')}
                            </Button>
                            <Button type='primary' block onClick={() => {
                               
                            }}>
                                {t('next')}
                            </Button>
                        </Flex>
                    </div>
                </>
            </Popup>
        </>
    )
};

export default FormRangePicker;