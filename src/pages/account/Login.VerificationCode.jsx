import styles from './Login.module.less'
import {Button, Form, Input, Popup} from "antd-mobile";
import Header from "../../components/header/Header.jsx";
import {useFormikContext} from "../../context/FormikProvider.jsx";

function LoginVerificationCode() {
    const { setFormikData } = useFormikContext();
    
    return (
       <>
           <Header title={'Verification Code'}/>
           
           <div>
               Please Check your Email

               <Input placeholder='Email' value='Email todo' readOnly />

           </div>
       </>
    )
}

export default LoginVerificationCode
