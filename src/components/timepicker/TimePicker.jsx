import {useStyles} from "./npm/styles.jsx";
import {useState} from "react";
import TimePickerInner from "@/components/timepicker/npm/TimePickerInner.jsx";
import {toBoolean} from "@/utils/Utils.jsx";

function TimePicker({twelveFormat, time, setTime, onTimeSelect}) {
    //TODO REWRITE TIMEPICKER INNER TO FUNCTION COMPONENT
    const { styles } = useStyles();
    
    return (
        <div className={styles.base}>
            <TimePickerInner time={time} 
                             twelveFormat={twelveFormat}
                             meridiem={toBoolean(twelveFormat) ? 'AM' : undefined}
                             setTime={setTime}
                             timeMode={toBoolean(twelveFormat)? 12 : 24}
                             onTimeSelect={onTimeSelect}/>
        </div>
    )
}

export default TimePicker