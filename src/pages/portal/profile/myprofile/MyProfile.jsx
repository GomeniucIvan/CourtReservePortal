import {Tabs} from "antd";
import {cx} from "antd-style";
import {useApp} from "@/context/AppProvider.jsx";
import {useEffect, useState} from "react";
import {selectedTabStorage, setTabStorage} from "@/storage/AppStorage.jsx";
import MyProfileNotification from "./MyProfileNotification.jsx";
import MyProfileDetails from "./MyProfileDetails.jsx";
import {useTranslation} from "react-i18next";
import MyProfileSettings from "./MyProfileSettings.jsx";

function MyProfile() {
    const {globalStyles} = useApp();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('myprofile', 'pers'));
    const {t} = useTranslation('');
    
    return (
        <Tabs
            rootClassName={cx(globalStyles.tabs)}
            onChange={(e) => {setTabStorage('myprofile', e, setSelectedTab)}}
            defaultActiveKey={selectedTab}
            items={[
                {
                    key: 'pers',
                    label: t('profile.information'),
                    children: <MyProfileDetails selectedTab={selectedTab} />,
                },
                {
                    key: 'notifications',
                    label: t('profile.notifications'),
                    children: <MyProfileNotification selectedTab={selectedTab} />,
                },
                {
                    key: 'settings',
                    label: t('profile.settings'),
                    children: <MyProfileSettings />,
                },
            ]}
        />
    )
}

export default MyProfile
