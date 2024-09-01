﻿import {useStyles} from "./styles.jsx";
import {useNavigate} from 'react-router-dom';
import {Skeleton} from "antd-mobile";
import {
    AppOutline,
    MessageOutline,
    MessageFill,
    UnorderedListOutline,
    UserOutline,
} from 'antd-mobile-icons'
import {TabBar} from "antd-mobile";
import {useState} from "react";
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {Flex} from "antd";
import {useApp} from "../../context/AppProvider.jsx";

const Footer = ({isFooterVisible, footerContent, isFetching}) => {
    const {styles} = useStyles();
    const navigate = useNavigate();
    const {token} = useApp();
    
    const [activeKey, setActiveKey] = useState('home');

    const onTabBarChange = (key) => {
        if (isFetching){
            return;
        }
        
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

    if (!toBoolean(isFooterVisible)){
        return <></>
    }
    
    if (!isNullOrEmpty(footerContent)){
        return (<>{footerContent}</>)
    }

    if (isFetching) {
        return (
            <PaddingBlock topBottom={true}>
                <Flex gap={token.padding}>
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                </Flex>
            </PaddingBlock>
        );
    }

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
