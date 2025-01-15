import {useStyles} from "./styles.jsx";
import {Badge, Button, Col, Flex, Row, Typography} from "antd";
const { Text } = Typography;
import {useApp} from "../../context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Card} from "antd";
import {e} from "../../utils/TranslateUtils.jsx";
import {Ellipsis} from "antd-mobile";
import SVG from "../svg/SVG.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthProvider.jsx";
import {AuthRouteNames} from "../../routes/AuthRoutes.jsx";
import {setPage, toRoute} from "../../utils/RouteUtils.jsx";
import {ProfileRouteNames} from "../../routes/ProfileRoutes.jsx";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import React from "react";
import {openMobileExternalBrowser} from "@/utils/MobileUtils.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";

function ListLinks({links, className, classNameLi, hideChevron, announcementsCount}) {
    const {token, setDynamicPages, globalStyles, } = useApp();
    const {logout, orgId} = useAuth();
    const { styles } = useStyles();
    const navigate = useNavigate();
    
    const onLogoutSubmit = (onClose) => {
        logout();
        onClose();
        navigate(AuthRouteNames.LOGIN);
    }
    
    const onLogoutClick = async () => {
        const logoutHtml = (onClose) => {
            
            return (
                <Flex vertical={true} gap={token.padding}>
                    <Text>Are you sure you want to log out?</Text>

                    <Flex vertical={true} gap={token.paddingSM}>
                        <Button type={'primary'} danger={true} block={true} onClick={() => {onLogoutSubmit(onClose)}}>Logout</Button>
                        <Button block={true} onClick={onClose}>Cancel</Button>
                    </Flex>
                </Flex>
            )
        }
        
        displayMessageModal({
            title: "Logout",
            html: (onClose) => logoutHtml(onClose),
            onClose: () => {},
        })
    }
    
    return (
        <>
            {anyInList(links) &&
                <Flex vertical={true} className={className}>
                    {links.map((link, index) => (
                        <Flex justify={'space-between'}
                              key={index}
                              className={classNameLi}
                              onClick={() => {
                                  console.log(link)
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
                                  } else if (equalString(38, link.Item)) {
                                      //logout
                                      onLogoutClick();
                                  } else {
                                      if (anyInList(link.Childrens)) {
                                          let route = toRoute(HomeRouteNames.NAVIGATE, 'id', orgId);
                                          route = toRoute(route, 'nodeId', link.Item);
                                          setPage(setDynamicPages, link.Text, route);
                                          navigate(route);
                                      } else {
                                          navigate(link.Url);
                                      }
                                  }
                              }}
                              style={{minHeight: '52px'}} 
                              align={'center'}>
                            <Flex gap={token.paddingLG} flex={1}>
                                <SVG icon={`navigation/portal/${link.IconClass}`} size={24}/>

                                <Flex gap={token.paddingXS} flex={1} align={'center'}>
                                    <Text style={{fontSize: `${token.fontSizeLG}px`}}>
                                        <Ellipsis direction='end' rows={1} content={link.Text}/>
                                    </Text>
                                    {(equalString(link.Item, 16) && !isNullOrEmpty(announcementsCount)) &&
                                        <Badge count={announcementsCount} />
                                    }
                                </Flex>
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
