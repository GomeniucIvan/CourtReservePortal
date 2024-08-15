import styles from './ProfileMembershipDetails.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfileMembershipDetails() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfileMembershipDetails
        </div>
    )
}

export default ProfileMembershipDetails
