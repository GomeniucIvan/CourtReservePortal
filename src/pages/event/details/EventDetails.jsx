import styles from './EventDetails.module.less'
import {useNavigate, useParams} from "react-router-dom";

function EventDetails() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            EventDetails
        </div>
    )
}

export default EventDetails
