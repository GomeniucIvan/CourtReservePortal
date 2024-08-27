import {useStyles} from "./styles.jsx";
import { useLocation, useNavigate } from 'react-router-dom';

import {
    AppOutline,
    MessageOutline,
    MessageFill,
    UnorderedListOutline,
    UserOutline,
} from 'antd-mobile-icons'
import {TabBar, Badge} from "antd-mobile";

const Footer = (props) => {
const {styles} = useStyles();
    
    const tabs = [
        {
            key: 'home',
            title: 'Home',
            icon: <AppOutline />
        },
        {
            key: 'reserve',
            title: 'Reserve',
            icon: <UnorderedListOutline />
        },
        {
            key: 'notifications',
            title: 'Notifications',
            icon: (active) =>
                active ? <MessageFill /> : <MessageOutline />,
            badge: '99+',
        },
        {
            key: 'account',
            title: 'Account',
            icon: <UserOutline />,
        },
    ]

    return (
        <TabBar className={styles.footer}>
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
