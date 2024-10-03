import {useStyles} from "./styles.jsx";
import {Col, Row, Typography} from "antd";
const { Text } = Typography;
import {useApp} from "../../context/AppProvider.jsx";
import {anyInList, equalString} from "../../utils/Utils.jsx";
import {Card} from "antd";
import {e} from "../../utils/OrganizationUtils.jsx";
import {Ellipsis} from "antd-mobile";
import SVG from "../svg/SVG.jsx";
import {useNavigate} from "react-router-dom";
import {ModalDelete, ModalLogout} from "../../utils/ModalUtils.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {AuthRouteNames} from "../../routes/AuthRoutes.jsx";
import {setPage, toRoute} from "../../utils/RouteUtils.jsx";
import {ProfileRouteNames} from "../../routes/ProfileRoutes.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";

function CardLinks({links}) {
    const {token, setDynamicPages, globalStyles} = useApp();
    const {logout} = useAuth();
    const { styles } = useStyles();
    const navigate = useNavigate();
    
    return (
        <Row gutter={[token.padding, token.padding]} style={{padding: `0 ${token.padding}px`}}>
            {anyInList(links) &&
                <>
                    {links.map((link, index) => (
                        <Col span={8} key={index}>
                            <Card className={styles.cardPrimary} 
                                  onClick={() => {
                                      if (equalString(link.Url, '/logout')) {
                                          ModalLogout({
                                              onLogout: (e) => {
                                                  logout().then(r => {
                                                      navigate(AuthRouteNames.LOGIN);
                                                  });
                                              }
                                          })
                                      } else {
                                          if (equalString(link.Type, 'membergroup')) {
                                              let route = toRoute(HomeRouteNames.MEMBER_GROUP, 'id', link.Id);
                                              setPage(setDynamicPages, link.Name, route);
                                              navigate(link.Url);
                                          } else {
                                              navigate(link.Url);
                                          }
                                      }
                                  }}>
                                <Text className={styles.cardName}>
                                    <Ellipsis direction='end' rows={2} content={link.Name}/>
                                </Text>
                                <Text disabled className={styles.cardType}>
                                    {e(link.Type)}
                                </Text>

                                <div className={styles.bottomBg} />
                                
                                <div className={styles.svgItem}>
                                    <SVG icon={link.Icon} size={55} color={token.colorPrimary}/>
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
