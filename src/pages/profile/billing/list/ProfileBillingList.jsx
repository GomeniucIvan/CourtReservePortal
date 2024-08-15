import styles from './ProfileBillingTransactionList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfileBillingTransactionList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfileBillingTransactionList
        </div>
    )
}

export default ProfileBillingTransactionList
