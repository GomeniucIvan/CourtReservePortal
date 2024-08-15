import styles from './EventCalendar.module.less'
import {useNavigate, useParams} from "react-router-dom";

function EventCalendar() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            EventCategoryList
        </div>
    )
}

export default EventCalendar
