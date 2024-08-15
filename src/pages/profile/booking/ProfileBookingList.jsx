import styles from './ProfileBookingList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfileBookingList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfileBookingList
        </div>
    )
}

export default ProfileBookingList
