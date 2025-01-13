import styles from './Login.module.less'
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {Button, Carousel, Flex, Typography} from "antd";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import { Swiper } from 'antd-mobile'
import SVG from "@/components/svg/SVG.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useTranslation} from "react-i18next";
import {useHeader} from "@/context/HeaderProvider.jsx";
const {Title, Text, Paragraph, Link} = Typography;

function LoginSpGuide({ onGetStartedClick, onLoginClick }) {
    const navigate = useNavigate();
    const {setHeaderRightIcons, setHeaderTitleKey} = useHeader();
    const {token, globalStyles, setIsFooterVisible} = useApp();
    const {t} = useTranslation('login');

    useEffect(() => {
        setIsFooterVisible(false);
        setHeaderRightIcons('');
        setHeaderTitleKey('');
    }, []);
    
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} justify={'space-between'} gap={token.padding} style={{paddingTop: `calc(${token.padding}px + 5%)`}}>

                <Flex justify={'center'}>
                    <SVG preventFill={true} icon={'court-reserve'} style={'width: 210px'} />
                </Flex>

                <Swiper autoplay={false} className={globalStyles.swiper}>
                    {emptyArray(4).map((item, index) => (
                        <Swiper.Item key={index}>
                            <Title style={{fontSize: '30px'}} level={1} className={globalStyles.textCenter}>{t(`slide${index+1}Text`)} </Title>
                            <Flex align={'center'} justify={'center'}>
                                <Text style={{fontSize: '20px'}} className={globalStyles.textCenter}>{t(`slide${index+1}Description`)}</Text>
                            </Flex>

                           <Flex style={{height: '440px'}} vertical={true} justify={'center'}>
                               <SVG icon={`login-slide-${index+1}`} preventFill={true} style={'max-height: 80vh;width:100%'} replaceColor={true}/>
                           </Flex>
                        </Swiper.Item>
                    ))}
                </Swiper>
                
                <Flex vertical={true} gap={token.padding}>
                    <Button type="primary"
                            className={styles.loginButton}
                            block
                            onClick={onGetStartedClick}>
                        {t(`button.getStarted`)}
                    </Button>

                    <Paragraph className={globalStyles.textCenter}>
                        {t(`haveAnAccount`)}
                        
                        <Link style={{ fontWeight: 600 }} onClick={onLoginClick}>
                            {' '}{t(`link.login`)}
                        </Link>
                    </Paragraph>
                </Flex>
            </Flex>
        </PaddingBlock>
    )
}

export default LoginSpGuide
