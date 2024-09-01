import {Tabs} from "antd";
import {cx} from "antd-style";
import {useApp} from "../../../context/AppProvider.jsx";
import {useEffect, useState} from "react";
import {selectedTabStorage, setTabStorage} from "../../../storage/AppStorage.jsx";
import MyProfileNotification from "./MyProfileNotification.jsx";
import MyProfileDetails from "./MyProfileDetails.jsx";

function MyProfile() {
    const {globalStyles} = useApp();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('myprofile', 'pers'));
    
    return (
        <Tabs
            rootClassName={cx(globalStyles.tabs)}
            onChange={(e) => {setTabStorage('myprofile', e, setSelectedTab)}}
            defaultActiveKey={selectedTab}
            items={[
                {
                    key: 'pers',
                    label: 'Information',
                    children: <MyProfileDetails selectedTab={selectedTab} />,
                },
                {
                    key: 'notifications',
                    label: 'Notifications',
                    children: <MyProfileNotification selectedTab={selectedTab} />,
                },
                {
                    key: 'settings',
                    label: 'Settings',
                    children: 'Content of Tab Pane 3',
                },
            ]}
        />
    )
}

export default MyProfile
