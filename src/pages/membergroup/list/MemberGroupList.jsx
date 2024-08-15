import styles from './MemberGroupList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function MemberGroupList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            MemberGroupList
        </div>
    )
}

export default MemberGroupList
