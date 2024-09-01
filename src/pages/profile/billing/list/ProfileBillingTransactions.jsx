import {selectedTabStorage, setTabStorage} from "../../../../storage/AppStorage.jsx";
import {Segmented, Tabs} from "antd";
import {useState} from "react";
import {useApp} from "../../../../context/AppProvider.jsx";

function ProfileBillingTransactions() {
    const {token, globalStyles} = useApp();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('billing_transaction', 'Unpaid'))
    
    return (
        <>
            <Segmented 
                options={['Unpaid', 'Paid', 'Payments', 'Adjustments', 'All']}
                 defaultValue={selectedTab}
                onChange={(e) => {setTabStorage('billing_transaction', e, setSelectedTab)}}
                block
                style={{margin : `${token.padding}px`, marginBottom: 0 }}/>
        </>
    )
}

export default ProfileBillingTransactions
