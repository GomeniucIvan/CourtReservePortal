import styles from './ProfileMyOrganizationList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfileMyOrganizationList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfileMyOrganizationList
        </div>
    )
}

export default ProfileMyOrganizationList
