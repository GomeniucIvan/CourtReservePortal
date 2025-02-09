import {useNavigate, useParams} from "react-router-dom";

function MembershipCard() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <>
            MembershipList
        </>
    )
}

export default MembershipList
