import {useStyles} from "./mStyles.jsx";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {getLastFromHistory, pushToHistory} from "@/toolkit/HistoryStack.js";
import {useLocation, useNavigate} from 'react-router-dom';
import {useApp} from "../../context/AppProvider.jsx";
import {NavBar} from "antd-mobile";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {authMember} from "../../storage/AppStorage.jsx";
import {useTranslation} from "react-i18next";
import {HomeRouteNames} from "../../routes/HomeRoutes.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {eTranslate} from "@/utils/TranslateUtils.jsx";

const MobileHeader = forwardRef((props, ref) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {headerRightIcons, headerTitleKey, customHeader, onBack, headerTitle, hideHeader} = useHeader();
    const {isLoading} = useApp();
    const {styles} = useStyles();
    const {t} = useTranslation('header');

    useImperativeHandle(ref, () => ({
        navigateBack: () => {
            navigateBack();
        }
    }));

    useEffect(() => {
        const fullPath = `${location.pathname}${location.search}`;
        pushToHistory(fullPath, props.route?.root);
    }, [location]);

    const navigateBack = () => {
        const lastPath = getLastFromHistory();
        if (lastPath) {
            navigate(`${lastPath.path}`);
        } else {
            if (!isNullOrEmpty(authMember())) {
                navigate(HomeRouteNames.INDEX);
            } else {
                navigate(`/`);
            }
        }
    };

    useEffect(() => {
        const handleMessage = (event) => {
            //mobile back button click
            if (event.data === 'mobileNavigateBack') {
                navigateBack();
            }
        };

        window.addEventListener('message', handleMessage);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);
    const backToPreviousPage = () => {
        if (typeof onBack === 'function') {
            onBack();
        } else {
            navigateBack();
        }
    }

    const right = (
        <>
            {headerRightIcons}
        </>
    )

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
            {(isDashboardPage && !isNullOrEmpty(customHeader)) &&
                <div>{customHeader}</div>
            }

            {!isDashboardPage &&
                <div style={{opacity: isNullOrEmpty(title) ? 0 : 1}}>
                    <NavBar onBack={backToPreviousPage} className={styles.header}
                            right={isNullOrEmpty(headerRightIcons) ? null : right}>
                        {isLoading && <div className={styles.headerLoadingBar}></div>}
                        {!isNullOrEmpty(title) &&
                            <>
                                {useKey ? t(title) : title}
                            </>
                        }
                    </NavBar>
                </div>
            }
        </>
    );
})

export default MobileHeader;
