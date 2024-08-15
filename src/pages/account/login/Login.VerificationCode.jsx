import styles from './Login.module.less'
import {Button, Form, Input, Popup} from "antd-mobile";
import Header from "../../components/header/Header.jsx";
import {useFormikContext} from "../../context/FormikProvider.jsx";
import {useEffect} from "react";
import {useFooter} from "../../context/FooterProvider.jsx";
import {useNavigate} from "react-router-dom";

function LoginVerificationCode() {
    const navigate = useNavigate();
    const { setFormikData } = useFormikContext();

    const { setFooterContent, setIsFooterVisible } = useFooter();

    useEffect(() => {
        setFooterContent(<div>Custom Button</div>);
        setIsFooterVisible(true);
        return () => {
            setFooterContent(null);
            setIsFooterVisible(true);
        };
    }, [setFooterContent, setIsFooterVisible]);
    
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
