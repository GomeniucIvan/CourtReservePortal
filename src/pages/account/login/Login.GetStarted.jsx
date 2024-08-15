import styles from './Login.module.less'
import {useNavigate} from "react-router-dom";
import { useFormik } from 'formik';
import {useFormikContext} from "../../../context/FormikProvider.jsx";
import * as Yup from "yup";
import {useState} from "react";
import { Button, Form, Input } from 'antd';

function LoginGetStarted() {
    const { setFormikData } = useFormikContext();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setIsSubmitting(true);
            
            setTimeout(function (){
                
                setFormikData(values);
                console.log('Form submitted:', values);
                navigate('/login-account-verification');

                setIsSubmitting(false);
            }, 2000);
        },
    });
    
    return (
        <>
            <div>
                Login get started

                <Form
                    onSubmit={startFormik.handleSubmit}
                    layout={'vertical'}
                    initialValues={{ layout: 'vertical' }}
                >
                    <Form.Item label="Field A">
                        <Input placeholder="input placeholder" />
                    </Form.Item>

                    <Button type="primary" block type="submit" loading={isSubmitting}>
                        Primary
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default LoginGetStarted
