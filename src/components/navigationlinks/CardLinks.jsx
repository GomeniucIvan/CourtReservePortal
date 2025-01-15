import {useStyles} from "./styles.jsx";
import {Col, Row, Typography} from "antd";
const { Text } = Typography;
import {useApp} from "../../context/AppProvider.jsx";
import {anyInList, equalString, toBoolean} from "../../utils/Utils.jsx";
import {Card} from "antd";
import {e} from "../../utils/TranslateUtils.jsx";
import {Ellipsis} from "antd-mobile";
import SVG from "../svg/SVG.jsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthProvider.jsx";
import {setPage, toRoute} from "../../utils/RouteUtils.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import React from "react";
import {openMobileExternalBrowser} from "@/utils/MobileUtils.jsx";

function    CardLinks({links}) {
    const {token, setDynamicPages, globalStyles} = useApp();
    const {logout} = useAuth();
    const { styles } = useStyles();
    const navigate = useNavigate();
    
    return (
        <Row gutter={[token.padding, token.padding]}>
            {anyInList(links) &&
                <>
                    {links.map((link, index) => (
                        <Col span={8} key={index}>
                            <Card className={styles.cardPrimary}
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
                                <Text className={styles.cardName}>
                                    <Ellipsis direction='end' rows={2} content={link.Text}/>
                                </Text>
                                <Text disabled className={styles.cardType}>
                                    {e(link.Type)}
                                </Text>

                                <div className={styles.bottomBg} />
                                
                                <div className={styles.svgItem}>
                                    <SVG icon={`navigation/portal/${link.IconClass}`} size={55} color={token.colorPrimary}/>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </>
            }
        </Row>
    )
}

export default CardLinks
