import {useNavigate, useParams} from "react-router-dom";
import {cx} from "antd-style";
import {selectedTabStorage, setTabStorage} from "../../../../storage/AppStorage.jsx";
import {Tabs} from "antd";
import {useState} from "react";
import ProfileBillingTransactions from "./ProfileBillingTransactions.jsx";
import ProfileBillingPackages from "./ProfileBillingPackages.jsx";
import {useApp} from "../../../../context/AppProvider.jsx";

function ProfileBilling() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('profilebilling', 'transactions'));
    const {token, globalStyles} = useApp();
    
    return (
        <>
            <Tabs
                rootClassName={cx(globalStyles.tabs)}
                onChange={(e) => {setTabStorage('profilebilling', e, setSelectedTab)}}
                defaultActiveKey={selectedTab}
                items={[
                    {
                        key: 'transactions',
                        label: 'Transactions',
                        children: <ProfileBillingTransactions />,
                    },
                    {
                        key: 'packages',
                        label: 'Packages',
                        children: <ProfileBillingPackages />,
                    },
                    {
                        key: 'invoices',
                        label: 'Invoices',
                        children: 'Content of Tab Pane 3',
                    },
                ]}
            />
        </>
    )
}

export default ProfileBilling
