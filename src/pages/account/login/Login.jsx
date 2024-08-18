import styles from './Login.module.less'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {Button} from "antd";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";

function Login() {
    const navigate = useNavigate();
    const { setIsFooterVisible } = useApp();

    useEffect(() => {
        setIsFooterVisible(false);
    }, []);
    
    return (
        <div className={styles.loginBg}>
            <div>
                <div className={styles.loginIconText}>Cartoon</div>
            </div>

            <Button type="primary" block onClick={() => navigate(AuthRouteNames.LOGIN_GET_STARTED)}>
                Login
            </Button>
        </div>
    )
}

export default Login
