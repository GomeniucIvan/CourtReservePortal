import {useStyles} from "./styles.jsx";
import {useNavigate} from 'react-router-dom';
import {Skeleton} from "antd-mobile";
import {useEffect, useRef, useState} from "react";
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {Flex, Typography} from "antd";
import {useApp} from "../../context/AppProvider.jsx";
import SVG from "@/components/svg/SVG.jsx";
import { cx } from 'antd-style';

const {Text} = Typography;
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
        } else if(equalString(key, 'more')){
            navigate(HomeRouteNames.MORE_NAVIGATION);
        }
    }
    
    const tabs = [
        {
            key: 'home',
            title: 'Home'
        },
        {
            key: 'calendar',
            title: 'Calendar'
        },
        {
            key: 'reserve',
            title: 'Reserve'
        },
        {
            key: 'alerts',
            title: 'Alerts'
        },
        {
            key: 'more',
            title: 'More'
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
            <>
                <Flex align="center" justify="space-around" className={styles.footer}>
                    {tabs.map((tab, index) => {
                        if (equalString(tab.key, 'reserve')){
                            return (
                                <Flex key={tab.key} align="center" className={cx(styles.plusIconWrapper, styles.minWidth)}>
                                    <div className={styles.plusIcon}>
                                        <SVG icon={`navigation/portal/footer/footer-${tab.key}`}
                                             size={56}
                                             preventFill={true}
                                             replaceColor={true}
                                             preventRects={false}
                                             preventPaths={true} />
                                    </div>
                                </Flex>
                            )
                        }
                        
                        return (
                            <div key={tab.key}>
                                <Flex align="center" justify={'center'} className={cx(styles.minWidth)} onClick={() => onTabBarChange(tab.key)}>
                                    <Flex vertical={true} gap={token.paddingXS} align={'center'}>
                                        <SVG icon={`navigation/portal/footer/footer-${tab.key}${equalString(tab.key, activeKey) ? '-selected' : ''}`} size={20} color={equalString(tab.key, activeKey) ? token.colorPrimary : undefined} />
                                        <Text style={{fontSize: `${token.fontSizeXS}px`, lineHeight: '10px', color: (equalString(tab.key, activeKey) ? token.colorPrimary : undefined)}}>{tab.title}</Text>
                                    </Flex>
                                </Flex>
                            </div>
                        )
                    })}
                </Flex>
            </>
        )
    }
    
    if (isFetching) {
        return (
            <>
                <Flex style={{height: `${footerHeight}px`}} 
                      gap={token.padding}
                      className={cx(styles.footer, styles.footerSkeletonWrapper)}
                      align="center" 
                      justify="space-around">
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                    <Skeleton animated className={styles.skeleton}/>
                </Flex>

                {/*required for consistent padding*/}
                <div className={styles.footer} style={{opacity: 0, position: 'absolute', top: '-100vh'}} ref={footerRef}>
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
