import {useStyles} from "./styles.jsx";
import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {getLastFromHistory, pushToHistory} from "../../toolkit/HistoryStack.js";
import {useLocation, useNavigate} from 'react-router-dom';
import {useApp} from "../../context/AppProvider.jsx";
import {NavBar} from "antd-mobile";
import {useAuth} from "../../context/AuthProvider.jsx";
import {isNullOrEmpty} from "../../utils/Utils.jsx";
import {authMember} from "../../storage/AppStorage.jsx";
import {useTranslation} from "react-i18next";

const Header = forwardRef((props, ref) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {isLoading, headerRightIcons} = useApp();
    const {styles} = useStyles();
    const {t} = useTranslation('header');

    useImperativeHandle(ref, () => ({
        navigateBack: () => {
            navigateBack();
        }
    }));

    useEffect(() => {
        pushToHistory(location.pathname, props.route?.root);
    }, [location]);

    const navigateBack = () => {
        const lastPath = getLastFromHistory();
        if (lastPath) {
            navigate(`${lastPath.path}`);
        } else {
            if (!isNullOrEmpty(authMember())) {
                navigate(`/dashboard`);
            } else {
                navigate(`/`);
            }
        }
    };

    const backToPreviousPage = () => {
        if (props.onBack) {
            props.onBack();
        } else {
            navigateBack();
        }
    }

    const right = (
        <>
            {headerRightIcons}
        </>
    )

    if (isNullOrEmpty(props.route?.title)) {
        return (<></>);
    }

    return (
        <NavBar onBack={backToPreviousPage} className={styles.header}
                right={isNullOrEmpty(headerRightIcons) ? null : right}>
            {isLoading && <div className={styles.headerLoadingBar}></div>}
            {!isNullOrEmpty(props.route?.title) &&
                <>
                    {t(props.route?.title)}
                </>
            }
        </NavBar>
    );
})

export default Header;
