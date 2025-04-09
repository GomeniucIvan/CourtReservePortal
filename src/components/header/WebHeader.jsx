import {useStyles} from "./wStyles.jsx";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import {useApp} from "../../context/AppProvider.jsx";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {authMember} from "../../storage/AppStorage.jsx";
import {useTranslation} from "react-i18next";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {eTranslate} from "@/utils/TranslateUtils.jsx";

const WebHeader = forwardRef((props, ref) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {headerRightIcons, headerTitleKey, customHeader, onBack, headerTitle, hideHeader} = useHeader();
    const {isLoading} = useApp();
    const {styles} = useStyles();
    const {t} = useTranslation('header');

    let title = props.route?.title;
    let isDashboardPage = toBoolean(props.route?.root);
    let useKey = true;

    if (toBoolean(hideHeader)) {
        return (<></>)
    }

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
    
    return (
        <>
            
        </>
    );
})

export default WebHeader;
