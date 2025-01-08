import {useStyles} from "./styles.jsx";
import {Col, Flex, Row, Typography} from "antd";
const { Text } = Typography;
import {useApp} from "../../context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty} from "../../utils/Utils.jsx";
import {Card} from "antd";
import {e} from "../../utils/TranslateUtils.jsx";
import {Ellipsis} from "antd-mobile";
import SVG from "../svg/SVG.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {ModalDelete, ModalLogout} from "../../utils/ModalUtils.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {AuthRouteNames} from "../../routes/AuthRoutes.jsx";
import {setPage, toRoute} from "../../utils/RouteUtils.jsx";
import {ProfileRouteNames} from "../../routes/ProfileRoutes.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";

function ListLinks({links, className, classNameLi, hideChevron}) {
    const {token, setDynamicPages, globalStyles, } = useApp();
    const {logout, orgId} = useAuth();
    const { styles } = useStyles();
    const navigate = useNavigate();
    
    return (
        <>
            {anyInList(links) &&
                <Flex vertical={true} className={className}>
                    {links.map((link, index) => (
                        <Flex justify={'space-between'}
                              key={index}
                              className={classNameLi}
                              onClick={() => {
                                  if (anyInList(link.Childrens)) {
                                      let route = toRoute(HomeRouteNames.NAVIGATE, 'id', orgId);
                                      route = toRoute(route, 'nodeId', link.Item);
                                      setPage(setDynamicPages, link.Text, route);
                                      navigate(route);
                                  } else {
                                      navigate(link.Url);
                                  }
                              }}
                              style={{minHeight: '52px'}} 
                              align={'center'}>
                            <Flex gap={token.paddingLG} flex={1}>
                                <SVG icon={`/navigation/portal/${link.IconClass}`} size={24}/>

                                <Text style={{fontSize: `${token.fontSizeLG}px`}}>
                                    <Ellipsis direction='end' rows={1} content={link.Text}/>
                                </Text>
                            </Flex>

                            {(anyInList(link.Childrens) && !hideChevron) &&
                                <SVG icon={'chevron-right'} size={token.fontSizeLG} />
                            }
                        </Flex>
                    ))}
                </Flex>
            }
        </>
    )
}

export default ListLinks
