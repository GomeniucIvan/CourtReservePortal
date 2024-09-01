import {selectedTabStorage, setTabStorage} from "../../../../storage/AppStorage.jsx";
import {Segmented, Tabs} from "antd";
import {useState} from "react";
import {useApp} from "../../../../context/AppProvider.jsx";
import {useStyles} from "../styles.jsx";

function ProfileBillingTransactions() {
    const {token, globalStyles} = useApp();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('billing_transaction', 'Unpaid'))
    const {styles} = useStyles();

    return (
        <>
            <Segmented
                rootClassName={styles.transactionSegment}
                options={['Unpaid', 'Paid', 'Payments', 'Adjustments', 'All']}
                defaultValue={selectedTab}
                onChange={(e) => {
                    setTabStorage('billing_transaction', e, setSelectedTab)
                }}
                block
                style={{margin: `${token.padding}px`, marginBottom: 0}}/>
        </>
    )
}

export default ProfileBillingTransactions
