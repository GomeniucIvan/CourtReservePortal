import styles from './Login.module.less'
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {Button} from "antd";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {equalString, isNullOrEmpty} from "../../../utils/Utils.jsx";

function Login() {
    const navigate = useNavigate();
    const { setIsFooterVisible, token, setHeaderRightIcons } = useApp();
    const {memberId, logout} = useAuth();
    const location = useLocation();
    
    useEffect(() => {
        setIsFooterVisible(false);
        setHeaderRightIcons('');
    }, []);

    useEffect(() => {
        if (equalString(location.pathname, AuthRouteNames.LOGIN)){
            //should clear organization data on logout
            // logout();
        }
    }, [location]);
    
    return (
        <div className={styles.loginBg} style={{backgroundImage: `url('/mock/images/cartoon-banner.png')`}}>
            <div>
                <div className={styles.loginIconText}>Cartoon</div>
            </div>

            <div className={styles.loginButtonBlock} >
                <Button type="primary"
                        className={styles.loginButton}
                        block
                        onClick={() => navigate(AuthRouteNames.LOGIN_GET_STARTED)} style={{width: `calc(100% - ${token.padding}px - ${token.padding}px)`}}>
                    Login
                </Button>
            </div>
        </div>
    )
}

export default Login
