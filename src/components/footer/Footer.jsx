import {useStyles} from "./styles.jsx";
import {useLocation, useNavigate} from 'react-router-dom';

import {
    AppOutline,
    MessageOutline,
    MessageFill,
    UnorderedListOutline,
    UserOutline,
} from 'antd-mobile-icons'
import {TabBar, Badge} from "antd-mobile";
import {useState} from "react";
import {equalString} from "../../utils/Utils.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";

const Footer = (props) => {
    const {styles} = useStyles();
    const navigate = useNavigate();
    
    const [activeKey, setActiveKey] = useState('home');

    const onTabBarChange = (key) => {
        setActiveKey(key);
        
        if (equalString(key, 'home')){
            navigate(HomeRouteNames.INDEX);
        } else if(equalString(key, 'navigation')){
            navigate(HomeRouteNames.MORE_NAVIGATION);
        }
    }
    
    const tabs = [
        {
            key: 'home',
            title: 'Home',
            icon: <AppOutline/>
        },
        {
            key: 'notifications',
            title: 'Notifications',
            icon: (active) =>
                active ? <MessageFill/> : <MessageOutline/>,
            badge: '99+',
        },
        {
            key: 'account',
            title: 'Account',
            icon: <UserOutline/>,
        },
        {
            key: 'navigation',
            title: 'More',
            icon: <UnorderedListOutline/>
        },
    ]

    return (
        <TabBar className={styles.footer} activeKey={activeKey} onChange={onTabBarChange}>
            {tabs.map(item => (
                <TabBar.Item
                    key={item.key}
                    icon={item.icon}
                    //title={item.title}
                    badge={item.badge}
                />
            ))}
        </TabBar>
    )
}

export default Footer;
