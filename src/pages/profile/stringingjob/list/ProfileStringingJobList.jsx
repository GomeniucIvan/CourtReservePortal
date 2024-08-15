import styles from './ProfileStringingJobList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfileStringingJobList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfileStringingJobList
        </div>
    )
}

export default ProfileStringingJobList
