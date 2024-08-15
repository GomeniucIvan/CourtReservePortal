import styles from './ProfileBillingInvoiceList.module.less'
import {useNavigate, useParams} from "react-router-dom";

function ProfileBillingInvoiceList() {
    const navigate = useNavigate();
    let { orgId } = useParams();

    return (
        <div>
            ProfileBillingInvoiceList
        </div>
    )
}

export default ProfileBillingInvoiceList
