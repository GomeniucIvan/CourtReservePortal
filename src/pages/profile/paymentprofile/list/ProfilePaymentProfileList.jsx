import styles from './ProfilePaymentProfileList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfilePaymentProfileList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfilePaymentProfileList
        </div>
    )
}

export default ProfilePaymentProfileList
