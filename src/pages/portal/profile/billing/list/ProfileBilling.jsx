﻿import {useNavigate, useParams} from "react-router-dom";
import {cx} from "antd-style";
import {selectedTabStorage, setTabStorage} from "@/storage/AppStorage.jsx";
import {Tabs} from "antd";
import {useEffect, useRef, useState} from "react";
import ProfileBillingTransactions from "./ProfileBillingTransactions.jsx";
import ProfileBillingPackages from "./ProfileBillingPackages.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import ProfileBillingInvoiceList from "../invoice/ProfileBillingInvoiceList.jsx";

function ProfileBilling() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('profilebilling', 'transactions'));
    const {token, globalStyles} = useApp();
    const [tabsHeight, setTabHeight] = useState(0);
    const tabsRef = useRef();

    useEffect(() => {
        if (tabsRef.current) {
            // Access the 'ant-tabs-nav' element within tabsRef
            const navElement = tabsRef.current.querySelector('.ant-tabs-nav');
            if (navElement) {
                //should include bottom margin as well
                setTabHeight(navElement.offsetHeight + token.padding);
            }
        }
    }, [tabsRef]);

    return (
        <div ref={tabsRef} style={{display: 'block'}}>
            <Tabs
                rootClassName={cx(globalStyles.tabs)}
                onChange={(e) => {
                    setTabStorage('profilebilling', e, setSelectedTab)
                }}
                defaultActiveKey={selectedTab}
                items={[
                    {
                        key: 'transactions',
                        label: 'Transactions',
                        children: <ProfileBillingTransactions selectedTab={selectedTab} tabsHeight={tabsHeight}/>,
                    },
                    {
                        key: 'packages',
                        label: 'Packages',
                        children: <ProfileBillingPackages selectedTab={selectedTab} tabsHeight={tabsHeight}/>,
                    },
                    {
                        key: 'invoices',
                        label: 'Invoices',
                        children: <ProfileBillingInvoiceList selectedTab={selectedTab} tabsHeight={tabsHeight} />
                    },
                ]}
            />
        </div>
    )
}

export default ProfileBilling
