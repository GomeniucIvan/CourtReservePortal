import styles from './Login.module.less'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {Button} from "antd";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";

function Login() {
    const navigate = useNavigate();
    const { setIsFooterVisible, token, setHeaderRightIcons } = useApp();
    const {setAuthData, setOrgId, setMemberId} = useAuth();
    
    useEffect(() => {
        setIsFooterVisible(false);
        setHeaderRightIcons('');
        
        //should clear organization data on logout
        setOrgId(null);
        setMemberId(null);
        setAuthData({
            timezone: '',
            uiCulture: '',
            currency: '',
            primaryColor: '',
        });
    }, []);
    
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
