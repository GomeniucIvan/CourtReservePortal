import styles from './Login.module.less'
import {Button, Form, Input, Popup} from "antd-mobile";
import Header from "../../components/header/Header.jsx";
import {useFormikContext} from "../../context/FormikProvider.jsx";
import {useNavigate} from "react-router-dom";

function LoginAccountVerification() {
    const { setFormikData } = useFormikContext();
    const navigate = useNavigate();
    
    return (
       <>
           <div>
               Login get started

               <Input placeholder='Email' value='Email todo' readOnly />

               <Form requiredMarkStyle='asterisk'>
                   <Form.Item name='password' label='Password'>
                       <Input placeholder='Enter your email' type={'password'} />
                   </Form.Item>
               </Form>
               
               <Button block color='primary' size='large' onClick={() => navigate('/login-verification-code')}>
                   Login
               </Button>
           </div>
       </>
    )
}

export default LoginAccountVerification
