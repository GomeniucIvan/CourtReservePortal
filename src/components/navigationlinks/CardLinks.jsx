import {useStyles} from "./styles.jsx";
import {Button, Col, Flex, Row, Typography} from "antd";
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
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";

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
                                          displayMessageModal({
                                              title: "External Link",
                                              html: (onClose) => <Flex vertical={true} gap={token.padding * 2}>
                                                  <Text>{'You are about to leave our platform and access an external website. Open external link?'}</Text>

                                                  <Flex vertical={true} gap={token.padding}>
                                                      <Button block={true} type={'primary'} onClick={() => {
                                                          openMobileExternalBrowser(link.Url);
                                                          onClose();
                                                      }}>
                                                          Open
                                                      </Button>

                                                      <Button block={true} onClick={() => {
                                                          onClose();
                                                      }}>
                                                          Close
                                                      </Button>
                                                  </Flex>
                                              </Flex>,
                                              type: "warning",
                                              onClose: () => {},
                                          })
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
                                <Text className={styles.cardType} style={{fontSize: `${token.fontSizeSM}px`, color: token.colorSecondary}}>
                                    {toBoolean(link.TargetBlank) &&
                                        <>External link</>
                                    }
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
