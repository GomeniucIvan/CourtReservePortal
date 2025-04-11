import {useStyles} from "./wStyles.jsx";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import {useApp} from "../../context/AppProvider.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {authMember, getNavigationStorage} from "../../storage/AppStorage.jsx";
import {useTranslation} from "react-i18next";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {eTranslate} from "@/utils/TranslateUtils.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {Button, Flex, Layout, Typography, Dropdown, Space} from "antd";
import {openMobileExternalBrowser} from "@/utils/MobileUtils.jsx";
import {setPageTitle, toRoute} from "@/utils/RouteUtils.jsx";
import * as React from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {addCypressTag} from "@/utils/TestUtils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {Ellipsis} from "antd-mobile";

const { Header, Content, Footer } = Layout;
const { Link,Text } = Typography;

const WebHeader = forwardRef((props, ref) => {
    const location = useLocation();
    const { orgId, authData } = useAuth();
    const {headerRightIcons, headerTitleKey, customHeader, onBack, headerTitle, hideHeader} = useHeader();
    const [navigationItems, setNavigationItems] = useState(getNavigationStorage(orgId));
    const {isLoading, token} = useApp();
    const {styles} = useStyles();
    const {t} = useTranslation('header');
    const navigate = useNavigate();

    useEffect(() => {
        if (!toBoolean(props?.isFetching)){
            setNavigationItems(getNavigationStorage(orgId));
        }
    }, [props?.isFetching]);

    let title = props.route?.title;
    let isDashboardPage = toBoolean(props.route?.root);
    let useKey = true;

    if (isNullOrEmpty(title) && toBoolean(props.route?.header)) {
        title = headerTitle;
        useKey = false;
    }

    if (isNullOrEmpty(title) && !isNullOrEmpty(headerTitleKey) || (toBoolean(props.route?.useHeaderKeys) && !isNullOrEmpty(headerTitleKey))) {
        title = headerTitleKey;
        useKey = true;
    }

    if (toBoolean(props.route?.entityTitle)){
        title = useKey ? eTranslate(t(title)) : eTranslate(title);
    }
    setPageTitle(title);

    const linkDropdownItems = (items) => ({
        items: items.map((child, idx) => ({
            label: child.Text,
            key: `${child.Item}${idx.toString()}`,
            icon: <div className={'ant-dropdown-menu-item-icon'}><SVG icon={`navigation/portal/${child.IconClass}`} size={16} color={token.colorText} /></div> ,
            onClick: () => {
                if (toBoolean(child.TargetBlank)) {
                    openMobileExternalBrowser(child.Url);
                } else {
                    navigate(child.Url);
                }
            }
        }))
    });

    const renderMenuItem = (link) => {
        return (
            <Link {...addCypressTag(`header_${link.Item}`)}
                  onClick={() => {
                      if (!anyInList(link.Childrens)) {
                          if (toBoolean(link.TargetBlank)) {
                              displayMessageModal({
                                  title: "External Link",
                                  html: (onClose) => <Flex vertical={true}>
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
                          } else {
                              navigate(link.Url);
                          }
                      }
                  }}
                  className={styles.mainHeaderItem}>
                <Flex vertical={true} justify="center">
                    <div style={{margin: 'auto'}}>
                        <SVG icon={`navigation/portal/${link.IconClass}`} size={20} color={token.colorHeaderText} />
                    </div>
                    <Text style={{color: token.colorHeaderText, fontSize: 12, maxWidth: 100, paddingTop: '0.25rem'}}>
                        <Ellipsis direction='end' rows={1} content={link.Text}/>
                    </Text>
                </Flex>
            </Link>
        )
    }

    return (
        <>
            {anyInList(navigationItems) &&
                <>
                    <Header className={styles.header}>
                        <Flex justify="space-between">
                            <Flex align="center">
                                <div className="demo-logo" />
                                {navigationItems.map((link,index) => {

                                    if (anyInList(link.Childrens)) {
                                        return (
                                            <Dropdown menu={linkDropdownItems(link.Childrens)}
                                                      trigger={['click']}
                                                      key={`dd_${index}`}
                                                      overlayClassName={styles.headerDropdown}
                                                      arrow>
                                                {renderMenuItem(link)}
                                            </Dropdown>
                                        )
                                    }

                                    return (
                                        <React.Fragment key={`dd_${index}`}>
                                            {renderMenuItem(link)}
                                        </React.Fragment>
                                    )
                                })}
                            </Flex>

                            <Flex>
                                <div>test</div>
                            </Flex>
                        </Flex>
                    </Header>
                </>
            }
        </>
    );
})

export default WebHeader;
