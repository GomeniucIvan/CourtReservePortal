import styles from './ProfileCalendarList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfileCalendarList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfileCalendarList
        </div>
    )
}

export default ProfileCalendarList
