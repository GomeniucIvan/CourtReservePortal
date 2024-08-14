import styles from './Login.module.less'
import {Button, Form, Input, Popup} from "antd-mobile";
import {useState} from "react";
import Header from "../../components/header/Header.jsx";
import {useFormikContext} from "../../context/FormikProvider.jsx";
import {useNavigate} from "react-router-dom";
import { useFormik } from 'formik';

function LoginGetStarted() {
    const { setFormikData } = useFormikContext();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: (values) => {
            setFormikData(values);
            console.log('Form submitted:', values);
            navigate('/login-account-verification')
        }
    });

    return (
        <>
            <div>
                Login get started

                <Form requiredMarkStyle='asterisk' onSubmit={formik.handleSubmit}>
                    <Form.Item name='email' label='Email'>
                        <Input
                            placeholder='Enter your email'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            name="email" 
                        />
                    </Form.Item>

                    <Button block color='primary' type="submit" size='large'>
                        Continue
                    </Button>
                    
                </Form>
            </div>
        </>
    )
}

export default LoginGetStarted
