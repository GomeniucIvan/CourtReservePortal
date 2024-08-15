import styles from './LeagueList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function LeagueList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            LeagueList
        </div>
    )
}

export default LeagueList
