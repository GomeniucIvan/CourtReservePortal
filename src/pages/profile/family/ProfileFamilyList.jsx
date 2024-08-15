import styles from './ProfileFamilyList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfileFamilyList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfileFamilyList
        </div>
    )
}

export default ProfileFamilyList
