import {useLocation, useNavigate, useParams} from "react-router-dom";
import {cx} from "antd-style";
import {selectedTabStorage, setTabStorage} from "@/storage/AppStorage.jsx";
import {Tabs} from "antd";
import {useEffect, useRef, useState} from "react";
import ProfileBillingTransactions from "./ProfileBillingTransactions.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {equalString, isNullOrEmpty} from "@/utils/Utils.jsx";
import {getQueryParameter} from "@/utils/RouteUtils.jsx";
import ProfileBillingInvoiceList from "@portal/profile/billing/invoice/list/ProfileBillingInvoiceList.jsx";
import ProfileBillingPackages from "@portal/profile/billing/packages/list/ProfileBillingPackages.jsx";

function ProfileBilling({tabKey}) {
    const navigate = useNavigate();
    const location = useLocation();
    const page = getQueryParameter(location, "page");
    let tabToShow = tabKey;
    
    if (isNullOrEmpty(tabToShow)) {
        tabToShow = page;
    }
    
    const [selectedTab, setSelectedTab] = useState(!isNullOrEmpty(tabToShow) ? tabToShow : selectedTabStorage('profilebilling', 'transactions'));
    const {token, globalStyles} = useApp();
    const [tabsHeight, setTabHeight] = useState(0);
    const tabsRef = useRef(null);

    useEffect(() => {
        if (tabsRef.current) {
            // Access the 'ant-tabs-nav' element within tabsRef
            const navElement = tabsRef.current.querySelector('.ant-tabs-nav');
            if (navElement) {
                //should include bottom margin as well
                // + token.padding
                setTabHeight(navElement.offsetHeight);
            }
        }
    }, [tabsRef]);

    useEffect(() => {
        if (selectedTab) {
            navigate(`?page=${selectedTab}`, { replace: true });
        }
    },[selectedTab])
    
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
