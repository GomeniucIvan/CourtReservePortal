import styles from './Login.module.less'
import { Button, Popup, Form, Input } from 'antd-mobile';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useFooter} from "../../../context/FooterProvider.jsx";

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

            <Button block color='primary' size='large' onClick={() => navigate('/login-get-started')}>
                Login
            </Button>
        </div>
    )
}

export default Login
