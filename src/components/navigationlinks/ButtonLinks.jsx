import {useStyles} from "./styles.jsx";
import {Badge, Button, Col, Flex, Row, Typography} from "antd";
const { Text } = Typography;
import {useApp} from "../../context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Card} from "antd";
import {Ellipsis} from "antd-mobile";
import SVG from "../svg/SVG.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthProvider.jsx";
import {setPage, toRoute} from "../../utils/RouteUtils.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import React from "react";
import {openMobileExternalBrowser} from "@/utils/MobileUtils.jsx";

function ButtonLinks({links}) {
    const {token, setDynamicPages, globalStyles, } = useApp();
    const {orgId} = useAuth();
    const { styles } = useStyles();
    const navigate = useNavigate();
    
    return (
        <>
            {anyInList(links) &&
                <Row gutter={[token.padding, token.padding]}>
                    {anyInList(links) &&
                        <>
                            {links.map((link, index) => (
                                <Col span={12} key={index}>
                                    <Card className={styles.cardButton}
                                          onClick={() => {
                                              if (toBoolean(link.TargetBlank)) {
                                                  openMobileExternalBrowser(link.Url);
                                              } else if (anyInList(link.Childrens)) {
                                                  let route = toRoute(HomeRouteNames.NAVIGATE, 'id', orgId);
                                                  route = toRoute(route, 'nodeId', link.Item);
                                                  setPage(setDynamicPages, link.Text, route);
                                                  navigate(route);
                                              } else {
                                                  navigate(link.Url);
                                              }
                                          }}>
                                        <Flex vertical={true} gap={token.paddingSM}>
                                            <SVG icon={`navigation/portal/${link.IconClass}`} size={24} color={token.colorPrimary}/>
                                            <Text style={{fontSize: `${token.fontSizeLG}px`}}>
                                                <Ellipsis direction='end' rows={1} content={link.Text}/>
                                            </Text>
                                        </Flex>
                                    </Card>
                                </Col>
                            ))}
                        </>
                    }
                </Row>
            }
        </>
    )
}

export default ButtonLinks
