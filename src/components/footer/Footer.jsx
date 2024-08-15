import './Footer.module.less';
import {TabBar} from "antd-mobile";
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = (props) => {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        {
            key: '/home',
            title: 'Home',
        },
        {
            key: '/todo',
            title: 'Todo',
        },
        {
            key: '/message',
            title: 'Message',
        },
        {
            key: '/me',
            title: 'Me'
        },
    ]

    return (
        <TabBar>
            {tabs.map(item => (
                <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
            ))}
        </TabBar>
    )
}

export default Footer;
