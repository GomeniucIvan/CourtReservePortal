import styles from './Login.module.less'
import {useNavigate} from "react-router-dom";
import {useFormikContext} from "../../../context/FormikProvider.jsx";
import {Button, Input} from "antd";

function LoginAccountVerification() {
    const { formikData } = useFormikContext();

    const email = formikData?.email;
    
    console.log(email)
    
    return (
       <>
           <div>
               Login get started

               <Input placeholder='Email' value='Email todo' readOnly />

               <Input placeholder='Enter your email' type={'password'} />
               
               <Button block color='primary' size='large' onClick={() => navigate('/login-verification-code')}>
                   Login
               </Button>
           </div>
       </>
    )
}

export default LoginAccountVerification
