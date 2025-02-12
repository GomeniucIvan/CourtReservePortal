import {useStyles} from "./../styles.jsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Flex, List, Skeleton, Tabs, Tag, Typography} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import BrowserBlock from "@/components/browserblock/BrowserBlock.jsx";
import {getQueryParameter} from "@/utils/RouteUtils.jsx";
import {imageSrc} from "@/utils/ImageUtils.jsx";
import {Ellipsis} from "antd-mobile";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {cx} from "antd-style";
import {selectedTabStorage, setTabStorage} from "@/storage/AppStorage.jsx";
import ProfileBillingTransactions from "@portal/profile/billing/list/ProfileBillingTransactions.jsx";
import ProfileBillingPackages from "@portal/profile/billing/packages/list/ProfileBillingPackages.jsx";
import ProfileBillingInvoiceList from "@portal/profile/billing/invoice/list/ProfileBillingInvoiceList.jsx";
import SaveMyPlayStartRecordingTab from "@portal/savemyplay/sessionrecording/SaveMyPlay.StartRecordingTab.jsx";
import SaveMyPlayMyRecordingsTab from "@portal/savemyplay/sessionrecording/SaveMyPlay.MyRecordingsTab.jsx";
const {Title} = Typography;

function SaveMyPlaySessionRecording() {
    const tabsRef = useRef();
    const [selectedTab, setSelectedTab] = useState(selectedTabStorage('savemyplaysessionrecoring', 'startrecording'));
    const {setHeaderRightIcons} = useHeader();
    const{setIsFooterVisible, setFooterContent, token, globalStyles} = useApp();
    const [tabsHeight, setTabHeight] = useState(0);

    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('')
        setHeaderRightIcons(null);
    }, []);

    useEffect(() => {
        if (tabsRef.current) {
            // Access the 'ant-tabs-nav' element within tabsRef
            const navElement = tabsRef.current.querySelector('.ant-tabs-nav');
            if (navElement) {
                setTabHeight(navElement.offsetHeight);
            }
        }
    }, [tabsRef]);

    return (
        <>
            <div ref={tabsRef} style={{display: 'block'}}>
                <Tabs
                    rootClassName={cx(globalStyles.tabs)}
                    onChange={(e) => {
                        setTabStorage('savemyplaysessionrecoring', e, setSelectedTab)
                    }}
                    defaultActiveKey={selectedTab}
                    items={[
                        {
                            key: 'startrecording',
                            label: 'Start Recording',
                            children: <SaveMyPlayStartRecordingTab selectedTab={selectedTab} tabsHeight={tabsHeight}/>,
                        },
                        {
                            key: 'myrecording',
                            label: 'My Recording(s)',
                            children: <SaveMyPlayMyRecordingsTab selectedTab={selectedTab} tabsHeight={tabsHeight}/>,
                        }
                    ]}
                />
            </div>
        </>
    )
}

export default SaveMyPlaySessionRecording
