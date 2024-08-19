import {useStyles} from "./styles.jsx";
import {forwardRef, useEffect, useImperativeHandle} from "react";
import {getLastFromHistory, pushToHistory} from "../../toolkit/HistoryStack.js";
import { useLocation, useNavigate } from 'react-router-dom';
import {useApp} from "../../context/AppProvider.jsx";
import {NavBar} from "antd-mobile";
import {MoreOutline, SearchOutline} from "antd-mobile-icons";
import {Space} from "antd";
import {useAuth} from "../../context/AuthProvider.jsx";

const Header = forwardRef((props, ref) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoading } = useApp();
    const { styles } = useStyles();
    const {isLoggedIn} = useAuth();
    
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
            if (isLoggedIn){
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
        <div style={{ fontSize: 24 }}>
            {/*<Space style={{ '--gap': '16px' }}>*/}
            {/*    <SearchOutline />*/}
            {/*    <MoreOutline />*/}
            {/*</Space>*/}
        </div>
    )
    
    
    return (
        <NavBar onBack={backToPreviousPage} className={styles.header} right={right}>
            {isLoading && <div className={styles.headerLoadingBar}></div>}
            {props.route.title}
        </NavBar>
    );
})

export default Header;
