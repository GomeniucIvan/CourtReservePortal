import {Tabs} from "antd";
import ProfilePersonalInformationDetails from "./ProfilePersonalInformationDetails.jsx";
import {cx} from "antd-style";
import {useApp} from "../../../context/AppProvider.jsx";
import ProfilePersonalInformationNotification from "./ProfilePersonalInformationNotification.jsx";
import {useEffect, useState} from "react";
import {selectedTabStorage, setTabStorage} from "../../../storage/AppStorage.jsx";

function ProfilePersonalInformation() {
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
                    children: <ProfilePersonalInformationDetails selectedTab={selectedTab} />,
                },
                {
                    key: 'notifications',
                    label: 'Notifications',
                    children: <ProfilePersonalInformationNotification selectedTab={selectedTab} />,
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

export default ProfilePersonalInformation
