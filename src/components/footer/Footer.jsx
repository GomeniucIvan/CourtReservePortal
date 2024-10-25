import {useStyles} from "./styles.jsx";
import {useNavigate} from 'react-router-dom';
import {Skeleton} from "antd-mobile";
import {TabBar} from "antd-mobile";
import {useEffect, useRef, useState} from "react";
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {Flex} from "antd";
import {useApp} from "../../context/AppProvider.jsx";
import SGV from "../svg/SVG.jsx";

import {HomeOutlined, PlusSquareOutlined, CalendarOutlined, MenuOutlined} from "@ant-design/icons";
import {MessageOutline} from "antd-mobile-icons";

const Footer = ({isFooterVisible, footerContent, isFetching}) => {
    const {styles} = useStyles();
    const navigate = useNavigate();
    const {token} = useApp();
    
    const [activeKey, setActiveKey] = useState('home');
    const footerRef = useRef();
    const [footerHeight, setFooterHeight] = useState();
    
    useEffect(() => {
        if (footerRef.current){
            setFooterHeight(footerRef.current.getBoundingClientRect().height);
        }
    }, [footerRef]);
    
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
            icon: <HomeOutlined />,
            onClick: (key) => {
                console.log(22)
            },
        },
        {
            key: 'reserve',
            title: 'Reserve',
            icon: <PlusSquareOutlined />
        },
        {
            key: 'register',
            title: 'Register',
            icon: <CalendarOutlined />
        },
        {
            key: 'notifications',
            title: 'Notifications',
            icon: <MessageOutline />,
            badge: '99+',
        },
        {
            key: 'navigation',
            title: 'More',
            icon: <MenuOutlined />
        },
    ]

    if (!toBoolean(isFooterVisible)){
        return <></>
    }
    
    if (!isNullOrEmpty(footerContent)){
        return (<>{footerContent}</>)
    }

    const footerComponent = () => {
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
    
    if (isFetching) {
        return (
            <>
                <div style={{height: `${footerHeight}px`}}>
                    <PaddingBlock>
                        <Flex gap={token.padding} justify={'center'}>
                            <Skeleton animated className={styles.skeleton}/>
                            <Skeleton animated className={styles.skeleton}/>
                            <Skeleton animated className={styles.skeleton}/>
                            <Skeleton animated className={styles.skeleton}/>
                        </Flex>
                    </PaddingBlock>
                </div>

                {/*required for consistent padding*/}
                <div style={{opacity: 0, position: 'absolute', top: '-100vh'}} ref={footerRef}>
                    {footerComponent()}
                </div>
            </>
        );
    }

    return (
        footerComponent()
    )
}

export default Footer;
