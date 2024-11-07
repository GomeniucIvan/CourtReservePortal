import {useNavigate, useParams} from "react-router-dom";

function LeagueRegistration() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            LeagueRegistration
        </div>
    )
}

export default LeagueRegistration
