import styles from './EventList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function EventList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            EventList
        </div>
    )
}

export default EventList
