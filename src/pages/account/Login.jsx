import styles from './Login.module.less'
import { Button, Popup, Form, Input } from 'antd-mobile';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    
  return (
      <div className={styles.loginBg}>
         <div className={styles.loginIcon}>
             <div className={styles.loginIconText}>Cartoon</div>
         </div>

          <Button block color='primary' size='large' onClick={() => navigate('/login-get-started')}>
              Login
          </Button>
      </div>
  )
}

export default Login
