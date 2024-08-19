import './Header.module.less';
import {useStyles} from "./styles.jsx";
import {forwardRef, useEffect, useImperativeHandle} from "react";
import {getLastFromHistory, pushToHistory} from "../../toolkit/HistoryStack.js";
import { useLocation, useNavigate } from 'react-router-dom';
import {theme, Typography} from "antd";
import {useApp} from "../../context/AppProvider.jsx";
import {NavBar} from "antd-mobile";
const { Title } = Typography;
const { useToken } = theme;

const Header = forwardRef((props, ref) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoading } = useApp();
    const { styles } = useStyles();
    
    useImperativeHandle(ref, () => ({
        navigateBack: () => {
            navigateBack();
        }
    }));

    useEffect(() => {
        pushToHistory(location.pathname, props.route.root);
    }, [location]);
    
    const navigateBack = () => {
        const lastPath = getLastFromHistory();
        if (lastPath) {
            navigate(`${lastPath.path}`);
        } else {
            navigate(`/`);
        }
    };

    const backToPreviousPage = () => {
        if (props.onBack) {
            props.onBack();
        } else {
            navigateBack();
        }
    }
    return (
        <NavBar onBack={backToPreviousPage} className={styles.header}>
            {isLoading && <div className={styles.headerLoadingBar}></div>}
            {props.route.title}
        </NavBar>
    );
})

export default Header;
