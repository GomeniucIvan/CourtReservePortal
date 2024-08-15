import styles from './AnnouncementList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function AnnouncementList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            AnnouncementList
        </div>
    )
}

export default AnnouncementList
