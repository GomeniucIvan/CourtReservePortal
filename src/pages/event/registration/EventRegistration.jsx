import styles from './EventRegistration.module.less'
import {useNavigate, useParams} from "react-router-dom";

function EventRegistration() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            EventRegistration
        </div>
    )
}

export default EventRegistration
