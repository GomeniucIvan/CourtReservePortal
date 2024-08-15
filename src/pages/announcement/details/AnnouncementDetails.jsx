import styles from './AnnouncementDetails.module.less'
import {useNavigate, useParams} from "react-router-dom";

function AnnouncementDetails() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            AnnouncementDetails
        </div>
    )
}

export default AnnouncementDetails
