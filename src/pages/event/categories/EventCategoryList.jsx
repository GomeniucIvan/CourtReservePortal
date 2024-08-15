import styles from './EventCategoryList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function EventCategoryList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            EventCategoryList
        </div>
    )
}

export default EventCategoryList
