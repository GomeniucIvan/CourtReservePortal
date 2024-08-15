import styles from './Login.module.less'
import {Button, Form, Input} from "antd-mobile";
import {useNavigate} from "react-router-dom";
import { useFormik } from 'formik';
import {useFormikContext} from "../../../context/FormikProvider.jsx";
import * as Yup from "yup";

function LoginGetStarted() {
    const { setFormikData } = useFormikContext();
    const navigate = useNavigate();

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
            setSubmitting(true);
            
            setTimeout(function (){
                setSubmitting(true);
                
                setFormikData(values);
                console.log('Form submitted:', values);
                navigate('/login-account-verification');
                
                setSubmitting(false);
            }, 2000);
        },
    });

    console.log(startFormik.isSubmitting)
    
    return (
        <>
            <div>
                Login get started

                <form onSubmit={startFormik.handleSubmit}>
                    <input
                        placeholder='Enter your email'
                        onChange={startFormik.handleChange}
                        value={startFormik.values.email}
                        name="email"
                    />

                    <Button
                        block
                        color='primary'
                        type="submit"
                        size='large'
                        disabled={startFormik.isSubmitting}
                    >
                        {startFormik.isSubmitting ? 'Submitting...' : 'Continue'}
                    </Button>
                </form>
            </div>
        </>
    )
}

export default LoginGetStarted
