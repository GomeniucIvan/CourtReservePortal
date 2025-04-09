import {useStyles} from "./mStyles.jsx";
import {Badge, Button, Flex, Segmented} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import * as React from "react";
import {useState} from "react";
import DrawerBottom from "../drawer/DrawerBottom.jsx";
import FormDrawerRadio from "../../form/formradio/FormDrawerRadio.jsx";
import {toBoolean} from "../../utils/Utils.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import { cx } from 'antd-style';

const HeaderFilter = ({count, onClick, showCalendarOptions, selectedView, onOptionChange, showSchedulerOptions}) => {
    const [selectedViewOptionValue, setSelectedViewOptionValue] = useState(selectedView);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { token, globalStyles} = useApp();
    const {styles} = useStyles();
    
    let calendarViewOptions= [{
        Text: 'Day',
        Value: 'Day'
    },{
        Text: 'Week',
        Value: 'Week'
    },{
        Text: 'Month',
        Value: 'Month'
    },{
        Text: 'Agenda',
        Value: 'Agenda',
    }];

    let schedulerViewOptions= [{
        Text: 'Expanded',
        Value: 'expanded'
    },{
        Text: 'Consolidated',
        Value: 'consolidated'
    }];
    
    const onCalendarViewOptionChange = (e) => {
        onOptionChange(e.Value);
        setSelectedViewOptionValue(e.Value);
        setIsDrawerOpen(false);
    }
    
    return (
        <Flex gap={token.paddingXS}>
            {toBoolean(showCalendarOptions) &&
                <>
                    <Button size={'small'}
                            className={styles.headerFilterButton}
                            onClick={() => {setIsDrawerOpen(true)}}>
                        {selectedViewOptionValue}
                    </Button>

                    <DrawerBottom
                        showDrawer={isDrawerOpen}
                        closeDrawer={() => {setIsDrawerOpen(false)}}
                        label={'View Type'}
                        showButton={true}
                        confirmButtonText={'Close'}
                        onConfirmButtonClick={() => {setIsDrawerOpen(false)}}
                        selectedValue={selectedViewOptionValue}
                    >
                        <FormDrawerRadio
                            show={isDrawerOpen}
                            options={calendarViewOptions}
                            selectedCurrentValue={selectedViewOptionValue}
                            onValueSelect={onCalendarViewOptionChange}
                        />
                    </DrawerBottom>
                </>
            }

            {toBoolean(showSchedulerOptions) &&
                <>
                    <Button size={'small'}
                            className={cx(styles.headerFilterButton, globalStyles.textCapitalize)}
                            onClick={() => {setIsDrawerOpen(true)}}>
                        {selectedViewOptionValue}
                    </Button>

                    <DrawerBottom
                        showDrawer={isDrawerOpen}
                        closeDrawer={() => {setIsDrawerOpen(false)}}
                        label={'Scheduler Type'}
                        showButton={true}
                        confirmButtonText={'Close'}
                        onConfirmButtonClick={() => {setIsDrawerOpen(false)}}
                        selectedValue={selectedViewOptionValue}
                    >
                        <FormDrawerRadio
                            show={isDrawerOpen}
                            options={schedulerViewOptions}
                            selectedCurrentValue={selectedViewOptionValue}
                            onValueSelect={onCalendarViewOptionChange}
                        />
                    </DrawerBottom>
                </>
            }
            {!showSchedulerOptions &&
                <Badge count={count} size={'small'}>
                    <Button type="default" icon={<FilterOutlined/>} size={'medium'} onClick={onClick}/>
                </Badge>
            }
        </Flex>
    );
}

export default HeaderFilter;
