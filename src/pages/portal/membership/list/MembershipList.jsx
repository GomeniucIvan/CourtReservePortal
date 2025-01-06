import styles from './MembershipList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function MembershipList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            MembershipList
        </div>
    )
}

export default MembershipList
