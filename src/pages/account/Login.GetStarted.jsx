import styles from './Login.module.less'
import {Button, Form, Input, Popup} from "antd-mobile";
import {useState} from "react";
import Header from "../../components/header/Header.jsx";
import {useFormikContext} from "../../context/FormikProvider.jsx";
import {useNavigate} from "react-router-dom";

function LoginGetStarted() {
    const { setFormikData } = useFormikContext();
    const navigate = useNavigate();
    
    return (
       <>
           <div>
               Login get started

               <Form requiredMarkStyle='asterisk'>
                   <Form.Item name='email' label='Email'>
                       <Input placeholder='Enter your email' />
                   </Form.Item>
               </Form>

               <Button block color='primary' size='large' onClick={() => navigate('/login-account-verification')}>
                   Continue
               </Button>
           </div>
       </>
    )
}

export default LoginGetStarted
