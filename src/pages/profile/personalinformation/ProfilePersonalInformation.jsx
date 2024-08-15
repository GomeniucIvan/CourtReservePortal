import styles from './ProfilePersonalInformation.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfilePersonalInformation() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfilePersonalInformation
        </div>
    )
}

export default ProfilePersonalInformation
