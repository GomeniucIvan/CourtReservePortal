import styles from './Header.module.less';
import {forwardRef, useEffect, useImperativeHandle} from "react";
import {getLastFromHistory, pushToHistory} from "../../toolkit/HistoryStack.js";
import { useLocation, useNavigate } from 'react-router-dom';
import {theme, Typography} from "antd";
const { Title } = Typography;
const { useToken } = theme;

const Header = forwardRef((props, ref) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useToken();
    
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
        <div className={styles.header} style={{borderColor: token.Form.colorBorder}}>
            <div className={styles.headerLoadingBar} style={{background: `linear-gradient(to right, transparent, ${token.colorPrimary}, transparent)`}}></div>
            <div onClick={backToPreviousPage} level={4} className={styles.headerBackIcon}>
                {'<'}
            </div>
            <Title level={4} className={styles.headerText}>
                {props.route.title}
            </Title>
        </div>
    );
})

export default Header;
