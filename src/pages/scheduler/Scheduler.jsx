import styles from './Scheduler.module.less'
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

function Scheduler() {
    const navigate = useNavigate();
    let { orgId } = useParams();
    
    return (
        <div>
            Scheduler
        </div>
    )
}

export default Scheduler
