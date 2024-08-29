import {Tabs} from "antd";
import ProfilePersonalInformationDetails from "./ProfilePersonalInformationDetails.jsx";
import {cx} from "antd-style";
import {useApp} from "../../../context/AppProvider.jsx";
import ProfilePersonalInformationNotification from "./ProfilePersonalInformationNotification.jsx";
import {useState} from "react";

function ProfilePersonalInformation() {
    const {globalStyles} = useApp();
    const [selectedTab, setSelectedTab] = useState('pers');
    
    return (
        <Tabs
            rootClassName={cx(globalStyles.tabs)}
            onChange={(e) => {setSelectedTab(e)}}
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
