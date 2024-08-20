import styles from './Login.module.less'
import {useNavigate} from "react-router-dom";
import { useFormik } from 'formik';
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import {Button, Form, theme, Typography, Modal} from 'antd';
import FormInput from "../../../form/input/FormInput.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import mockData from "../../../mocks/auth-data.json";
import {ModalClose, ModalWarning} from "../../../utils/ModalUtils.jsx";
import {focus} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import PageForm from "../../../form/pageform/PageForm.jsx";
const { Paragraph, Link, Title } = Typography;
const { useToken } = theme;

function LoginGetStarted() {
    const { setFormikData, isLoading, setIsLoading, isMockData, setIsFooterVisible, setFooterContent } = useApp();
    const navigate = useNavigate();
    const { token } = useToken();

    useEffect(() => {
        setIsFooterVisible(true);

        setFooterContent(
            <PaddingBlock topBottom={true}>
                <Button type="primary"
                        block htmlType="submit"
                        loading={isLoading}
                        onClick={startFormik.handleSubmit}
                >
                    Login
                </Button>
                <Paragraph className={'sm-padding'}>
                    By continuing, you agree to CourtReserve’s{' '}
                    <Link href="https://ant.design" target="_blank">
                        Terms of Service{' '}
                    </Link>
                    and{' '}
                    <Link href="https://ant.design" target="_blank">
                        Privacy Policy
                    </Link>
                </Paragraph>
            </PaddingBlock>
        );
    }, [isLoading]);

    const startInitialValues = {
        email: ''
    };

    const startValidationSchema = Yup.object({
        email: Yup.string().required('Email is required.')
    });

    const startFormik = useFormik({
        initialValues: startInitialValues,
        validationSchema: startValidationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setIsLoading(true);
            if (isMockData){
                setTimeout(function (){
                    const emailExists = mockData.login.started.member.email === values.email;

                    if (emailExists) {
                        setFormikData(values);
                        navigate(AuthRouteNames.LOGIN_ACCOUNT_VERIFICATION);
                    } else {
                        //setStatus({ email: 'Email not found.' });

                        ModalClose({
                            title: 'Not Found',
                            content: 'Player with such email not found.',
                            showIcon: false,
                            onOk: () => {
                                focus('email');
                            }
                        });
                    }
                    setIsLoading(false);
                }, 1000);
            } else{
                //todo
                alert('todo started')
            }
        },
    });

    return (
        <>
            <PaddingBlock>
                <Title level={4}>Let’s get started!</Title>

                <Paragraph>
                    Enter your email to get started. If you don't have
                    an account yet, you will be prompted to create one.
                </Paragraph>

                <PageForm
                    formik={startFormik}>
                    <FormInput label="Email"
                               form={startFormik}
                               name='email'
                               placeholder='Enter your email'
                               required='true'
                    />
                </PageForm>
            </PaddingBlock>
        </>
    )
}

export default LoginGetStarted
