import {useStyles} from ".././styles.jsx";
import {Typography, Card, Flex, Button} from "antd";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import { toBoolean} from "@/utils/Utils.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import { cx } from 'antd-style';
import SVG from "@/components/svg/SVG.jsx";

const {Text, Title} = Typography;

const DashboardPourMyBev = ({dashboardData}) => {
    let {setDynamicPages, globalStyles, token} = useApp();
    let {orgId} = useAuth();
    const { t } = useTranslation('');
    const navigate = useNavigate();
    const {styles} = useStyles();
    const {buttonStyles} = useCombinedStyles();

    return (
        <>
            {toBoolean(dashboardData?.ShowPourMyBevRow) &&
                <>
                    <Card className={cx(styles.pourMyBevCard, globalStyles.cardNoPadding)}>
                        <Flex vertical={true} gap={token.paddingLG}>
                            <Flex vertical gap={token.paddingLG} justify="center" align="center">
                                <img width={150} height={28} src="/svg/branded/pourmybev.svg" alt="PourMyBev logo" />
                                <Title level={3}>Pour Your Drink in a Click!</Title>
                            </Flex>
                            <Button className={buttonStyles.buttonBlue}
                                    ghost={true}
                                    icon={<SVG icon='qrcode-light' color={'#0558d6'} />}
                                    onClick={() => {
                                        let route = toRoute(HomeRouteNames.POUR_MY_BEV_CODE, 'id', orgId);
                                        navigate(route);
                                    }}>
                                Scan to Pour
                            </Button>
                            {toBoolean(dashboardData?.ShowPourMyBevPayTab) &&
                                <>
                                    <Button type="link"
                                            className={buttonStyles.buttonBlue}
                                            icon={<SVG icon='money-bill-wave-regular' color={'white'}/>}
                                            onClick={() => {
                                                let route = toRoute(HomeRouteNames.POUR_MY_BEV_CART, 'id', orgId);
                                                navigate(route);
                                            }}>
                                        Pay Tab
                                    </Button>

                                </>
                            }
                        </Flex>
                    </Card>
                </>
            }
        </>
    );
};

export default DashboardPourMyBev
