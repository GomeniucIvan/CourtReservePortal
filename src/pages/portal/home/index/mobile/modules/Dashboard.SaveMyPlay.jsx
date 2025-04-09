import {useStyles} from ".././styles.jsx";
import {Typography, Badge, Flex, Button, Card} from "antd";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import { toBoolean} from "@/utils/Utils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import { cx } from 'antd-style';

const {Text, Title} = Typography;

const DashboardSaveMyPlay = ({dashboardData, isFetching}) => {
    let {setDynamicPages, globalStyles, token} = useApp();
    let {orgId} = useAuth();
    const { t } = useTranslation('');
    const navigate = useNavigate();
    const {styles} = useStyles();
    const {buttonStyles} = useCombinedStyles();
    
    return (
        <>
            {toBoolean(dashboardData?.ShowSaveMyPlayRow) &&
                <>
                    <Card className={cx(styles.saveMyPlayCard, globalStyles.cardNoPadding)}>
                        <Flex vertical={true} gap={token.paddingLG} align={'center'}>
                            <img
                                width={150}
                                height={28}
                                src="/svg/branded/savemyplay.svg"
                                alt="Save My Play Logo"
                            />
                            <Text style={{color: '#ffffff', textAlign: 'center'}}>
                                Record your next session to review<br/> 
                                and improve your gameplay
                            </Text>
                            
                            <Button
                                htmlType='button'
                                type="primary"
                                block={true}
                                className={buttonStyles.lightGreen}
                                icon={<SVG icon='video-light'/>}
                                onClick={() => {
                                    let route = toRoute(HomeRouteNames.SAVE_MY_PLAY, 'id', orgId);
                                    navigate(route);
                                }}
                            >
                                Record My Session
                            </Button>
                        </Flex>
                    </Card>
                </>
            }
        </>
    );
};

export default DashboardSaveMyPlay
