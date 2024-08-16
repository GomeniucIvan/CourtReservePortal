import styles from './Login.module.less'
import {useNavigate} from "react-router-dom";
import { useFormik } from 'formik';
import {useFormikContext} from "../../../context/FormikProvider.jsx";
import * as Yup from "yup";
import {useState} from "react";
import {Button, Form, theme, Typography} from 'antd';
import FormInput from "../../../form/FormInput.jsx";
const { Paragraph, Link, Title } = Typography;
const { useToken } = theme;

function LoginGetStarted() {
    const { setFormikData, isLoading, setIsLoading } = useFormikContext();
    const navigate = useNavigate();
    const { token } = useToken();
    
    const startInitialValues = {
        email: '',
        password: ''
    };

    const startValidationSchema = Yup.object({
        email: Yup.string().required('Email or Username is required.')
    });
    
    const startFormik = useFormik({
        initialValues: startInitialValues,
        validationSchema: startValidationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setIsLoading(true);
            
            setTimeout(function (){
                
                setFormikData(values);
                console.log('Form submitted:', values);
                navigate('/login-account-verification');

                setIsLoading(false);
            }, 2000);
        },
    });
    
    return (
        <>
            <div>
                <Title level={4}>Let’s get started!</Title>
                
                <Paragraph>
                    Enter your email to get started. If you don't have
                    an account yet, you will be prompted to create one.
                </Paragraph>

                <Form
                    layout={'vertical'}
                    autoComplete="off"
                    initialValues={{ layout: 'vertical' }}
                >
                    <FormInput label="Email"
                               form={startFormik}
                               name='email'
                               placeholder='Email'
                               required='true'
                    />

                    <Button type="primary" 
                            block htmlType="button"
                            loading={isLoading}
                            style={{marginBottom: token.Button.marginXS}}
                            onClick={startFormik.handleSubmit}>
                        Login
                    </Button>
                </Form>
                
                <Paragraph>
                    By continuing, you agree to CourtReserve’s{' '}
                    <Link href="https://ant.design" target="_blank">
                        Terms of Service{' '}
                    </Link>
                    and{' '}
                    <Link href="https://ant.design" target="_blank">
                        Privacy Policy
                    </Link>
                </Paragraph>
            </div>
        </>
    )
}

export default LoginGetStarted
