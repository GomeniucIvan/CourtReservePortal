import styles from './Login.module.less'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useFooter} from "../../../context/FooterProvider.jsx";
import {Button} from "antd";

function Login() {
    const navigate = useNavigate();
    const { setIsFooterVisible } = useFooter();

    useEffect(() => {
        setIsFooterVisible(false);
        return () => {
            setIsFooterVisible(true);
        };
    }, []);
    
    return (
        <div className={styles.loginBg}>
            <div>
                <div className={styles.loginIconText}>Cartoon</div>
            </div>

            <Button type="primary" block onClick={() => navigate('/login-get-started')}>
                Login
            </Button>
        </div>
    )
}

export default Login
