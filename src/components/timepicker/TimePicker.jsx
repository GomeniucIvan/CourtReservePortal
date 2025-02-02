import {useStyles} from "./npm/styles.jsx";
import {useState} from "react";
import TimePickerInner from "@/components/timepicker/npm/TimePickerInner.jsx";

function TimePicker({filter}) {
    const [time, setTime] = useState('12:34pm');
    
    //TODO REWRITE TIMEPICKER INNER TO FUNCTION COMPONENT
    const { styles } = useStyles();
    
    return (
        <div className={styles.base}>
            <TimePickerInner />
        </div>
    )
}

export default TimePicker