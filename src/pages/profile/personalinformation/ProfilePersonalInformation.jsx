import {Tabs} from "antd";
import ProfilePersonalInformationDetails from "./ProfilePersonalInformationDetails.jsx";
import {cx} from "antd-style";
import {useApp} from "../../../context/AppProvider.jsx";

function ProfilePersonalInformation() {
    const {globalStyles} = useApp();
    
    return (
        <Tabs
            rootClassName={cx(globalStyles.tabs)}
            defaultActiveKey="pers"
            items={[
                {
                    key: 'pers',
                    label: 'Information',
                    children: <ProfilePersonalInformationDetails />,
                },
                {
                    key: 'notifications',
                    label: 'Notifications',
                    children: 'Content of Tab Pane 2',
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
