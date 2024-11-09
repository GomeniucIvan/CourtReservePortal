import {useStyles} from "./styles.jsx";
import {Badge, Button, Flex, Segmented} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import * as React from "react";
import {useState} from "react";
import DrawerBottom from "../drawer/DrawerBottom.jsx";
import FormDrawerRadio from "../../form/formradio/FormDrawerRadio.jsx";
import {toBoolean} from "../../utils/Utils.jsx";
import {useApp} from "../../context/AppProvider.jsx";

const HeaderFilter = ({count, onClick, showCalendarOptions, selectedView, onCalendarOptionChange}) => {
    const [selectedViewOptionValue, setSelectedViewOptionValue] = useState(selectedView);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { token} = useApp();
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

    const onCalendarViewOptionChange = (e) =>{
        onCalendarOptionChange(e.Value);
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
                            options={calendarViewOptions}
                            selectedCurrentValue={selectedViewOptionValue}
                            onValueSelect={onCalendarViewOptionChange}
                        />
                    </DrawerBottom>
                </>
            }

            <Badge count={count} size={'small'}>
                <Button type="default" icon={<FilterOutlined/>} size={'medium'} onClick={onClick}/>
            </Badge>
        </Flex>
    );
}

export default HeaderFilter;
