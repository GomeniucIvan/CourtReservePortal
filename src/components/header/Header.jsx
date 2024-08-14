import './Header.module.less';
import {NavBar} from "antd-mobile";
import {forwardRef, useEffect, useImperativeHandle} from "react";
import {getLastFromHistory, pushToHistory} from "../../toolkit/HistoryStack.js";
import { useLocation, useNavigate } from 'react-router-dom';

const Header = forwardRef((props, ref) => {
    const location = useLocation();
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
        navigateBack: () => {
            navigateBack();
        }
    }));

    useEffect(() => {
        pushToHistory(location.pathname, props.rootPage);
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
        <NavBar onBack={backToPreviousPage}>{props.title}</NavBar>
    );
})

export default Header;
