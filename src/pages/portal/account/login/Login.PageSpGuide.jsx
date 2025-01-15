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
    const {token, globalStyles, setIsFooterVisible, availableHeight} = useApp();
    const {t} = useTranslation('login');
    const [dashboardType, setDashboardType] = useState('default-block');
    
    useEffect(() => {
        setIsFooterVisible(false);
        setHeaderRightIcons('');
        setHeaderTitleKey('');
    }, []);

    useEffect(() => {
        // Set background image for body
        document.body.style.backgroundImage = "url('https://tgcstorage.blob.core.windows.net/subscription-plus-oldcoast7411/oldcoast7411_splash-ocp.png')";
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';

        // Cleanup on unmount
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundPosition = '';
        };
    }, []);
    
    return (
        <>
            {equalString(dashboardType, 'default-block') &&
                <PaddingBlock topBottom={true}>
                    <div style={{height: `${availableHeight}px`}}>
                        <Flex vertical={true} justify={'end'} style={{height: '100%'}}>
                           <Flex vertical={true} align={'center'} style={{paddingBottom: '50px'}} gap={22}>
                               <Button type={'primary'} block={true} onClick={onGetStartedClick}>Get Started</Button>
                               <Flex vertical={true} gap={4} align={'center'}>
                                   <Text>Already have an account? <b onClick={onLoginClick}>LOG IN</b></Text>
                                   <Text style={{fontSize: `${token.fontSizeXS}px`}}>Powered by CourtReserve</Text>
                               </Flex>
                           </Flex>
                        </Flex>
                    </div>
                </PaddingBlock>
            }
        </>
    )
}

export default LoginSpGuide
