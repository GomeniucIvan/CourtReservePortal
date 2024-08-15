import styles from './Login.module.less'
import {Button, Form, Input} from "antd-mobile";
import {useNavigate} from "react-router-dom";
import { useFormik } from 'formik';
import {useFormikContext} from "../../../context/FormikProvider.jsx";

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
