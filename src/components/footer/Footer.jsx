import styles from './Footer.module.less';
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
        
        <div>
            {tabs.map(item => (
                <div key={item.key} icon={item.icon}>{item.title}</div>
            ))}
        </div>
    )
}

export default Footer;
