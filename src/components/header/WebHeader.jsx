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
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import * as React from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {addCypressTag} from "@/utils/TestUtils.jsx";

const { Header, Content, Footer } = Layout;
const { Link } = Typography;

const WebHeader = forwardRef((props, ref) => {
    const location = useLocation();
    const { orgId, authData } = useAuth();
    const {headerRightIcons, headerTitleKey, customHeader, onBack, headerTitle, hideHeader} = useHeader();
    const [navigationItems, setNavigationItems] = useState(getNavigationStorage(orgId));
    const {isLoading} = useApp();
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
            onClick: () => {
                if (toBoolean(child.TargetBlank)) {
                    openMobileExternalBrowser(child.Url);
                } else {
                    navigate(child.Url);
                }
            }
        }))
    });
    
    return (
        <>
            {anyInList(navigationItems) &&
                <>
                    <Header style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="demo-logo" />
                        {navigationItems.map((link,index) => {

                                if (anyInList(link.Childrens)) {
                                    return (
                                        <Dropdown menu={linkDropdownItems(link.Childrens)} trigger={['click']}>
                                            <a onClick={(e) => e.preventDefault()}>
                                                <Space>
                                                    {link.Text}
                                                </Space>
                                            </a>
                                        </Dropdown>
                                    )
                                }

                                return (
                                    <Link key={index}
                                          {...addCypressTag(`header_${link.Item}`)}
                                          onClick={() => {
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
                                          }}>
                                        {link.Text}
                                    </Link>
                                )
                            })}
                    </Header>
                </>
            }
        </>
    );
})

export default WebHeader;
