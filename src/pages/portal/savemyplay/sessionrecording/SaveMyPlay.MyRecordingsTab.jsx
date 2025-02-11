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
const {Title} = Typography;

function SaveMyPlayMyRecordingsTab({selectedTab, tabsHeight}) {
    const {token, globalStyles, availableHeight, isMockData, setIsFooterVisible, setFooterContent} = useApp();
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    
    return (
        <>

        </>
    )
}

export default SaveMyPlayMyRecordingsTab
