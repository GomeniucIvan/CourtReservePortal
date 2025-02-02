import {useStyles} from "./npm/styles.jsx";
import {useState} from "react";
import TimePickerInner from "@/components/timepicker/npm/TimePickerInner.jsx";
import {toBoolean} from "@/utils/Utils.jsx";

function TimePicker({twelveFormat}) {
    const [time, setTime] = useState('12:34pm');
    
    //TODO REWRITE TIMEPICKER INNER TO FUNCTION COMPONENT
    const { styles } = useStyles();
    
    return (
        <div className={styles.base}>
            <TimePickerInner time="11:20" twelveFormat={twelveFormat} meridiem={toBoolean(twelveFormat) ? 'AM' : undefined} />
        </div>
    )
}

export default TimePicker