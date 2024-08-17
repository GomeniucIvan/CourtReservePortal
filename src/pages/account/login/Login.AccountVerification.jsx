import styles from './Login.module.less'
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {Button, Divider, Form, Input, theme, Typography} from "antd";
import * as Yup from "yup";
import {useFormik} from "formik";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import {useEffect} from "react";
import {isNullOrEmpty} from "../../../utils/Utils.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
const { Paragraph, Title } = Typography;
const { useToken } = theme;

function LoginAccountVerification() {
    const { formikData, isLoading, setIsLoading, setFormikData } = useApp();
    const email = formikData?.email;
    const { token } = useToken();
    const navigate = useNavigate();

    const initialValues = {
        email: email,
        password: ''
    };

    useEffect(() => {
        if (isNullOrEmpty(email)){
            navigate(AuthRouteNames.LOGIN_GET_STARTED);
        }
    }, []);
    
    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required.'),
        password: Yup.string().required('Password is required.'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setIsLoading(true);

            setTimeout(function (){
                setFormikData(values);
                console.log('Form submitted:', values);
                navigate(AuthRouteNames.LOGIN_VERIFICATION_CODE);
                setIsLoading(false);
            }, 2000);
        },
    });
    
    return (
       <>
           <div>
               <Title level={4}>Please Check Your Email</Title>

               <Paragraph>
                   We've sent a 6-digit code to <strong>chr****@email.com</strong>. The code expires in 15 minutes. Please enter it below.
               </Paragraph>

               <Form
                   layout={'vertical'}
                   autoComplete="off"
                   initialValues={{ layout: 'vertical' }}
               >
                   <FormInput label="Email"
                              form={formik}
                              name='email'
                              disabled={true}
                              placeholder='Enter your email'
                   />

                   <FormInput label="Password"
                              form={formik}
                              name='password'
                              placeholder='Enter your password'
                              required='true'
                   />
                   
                   <Button type="primary"
                           block
                           htmlType="submit"
                           loading={isLoading}
                           onClick={formik.handleSubmit}>
                       Continue
                   </Button>

                   <Divider>or</Divider>
                   
                   <Button
                       disabled={isLoading}
                       block
                       htmlType="button"
                       onClick={() => {
                           alert('todo')
                       }}
                   >
                       Email a Log In Code
                   </Button>

                   <Button
                       block
                       htmlType="button"
                       disabled={isLoading}
                       onClick={() => {
                           alert('todo')
                       }}
                   >
                       Text a Code to ***-***-9650
                   </Button>
               </Form>

               <Paragraph className={'sm-padding'}>
                   By requesting a text code, you agree to receive texts from CourtReserve. Carrier rates may apply.
               </Paragraph>
           </div>
       </>
    )
}

export default LoginAccountVerification
