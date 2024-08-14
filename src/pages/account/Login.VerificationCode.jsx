import styles from './Login.module.less'
import {Button, Form, Input, Popup} from "antd-mobile";
import Header from "../../components/header/Header.jsx";
import {useFormikContext} from "../../context/FormikProvider.jsx";

function LoginVerificationCode() {
    const { setFormikData } = useFormikContext();
    
    return (
       <>
           <div>
               Verification Code

               <Input placeholder='Email' value='Email todo' readOnly />

               <Button block color='primary' size='large' onClick={() => navigate('/dashboard')}>
                   Dashboard
               </Button>
           </div>
       </>
    )
}

export default LoginVerificationCode
