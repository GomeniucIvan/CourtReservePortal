import {useFormik} from 'formik';
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect} from "react";
import {Button, Typography} from 'antd';
import FormInput from "../../../form/input/FormInput.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import mockData from "../../../mocks/auth-data.json";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import {equalString, focus, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import PageForm from "../../../form/pageform/PageForm.jsx";
import apiService, {getBearerToken, setBearerToken} from "../../../api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/AuthProvider.jsx";
import appService from "../../../api/app.jsx";

const {Paragraph, Link, Title} = Typography;

function LoginGetStarted() {
    const {setFormikData, isLoading, setIsLoading, isMockData, setIsFooterVisible, setFooterContent} = useApp();
    
    const navigate = useNavigate();
    useEffect(() => {
        setIsFooterVisible(false);
        setFooterContent('');
        
        if (isNullOrEmpty(getBearerToken())){
            appService.post('/app/MobileSso/ValidateAndCreateToken').then(r => {
                if (toBoolean(r?.IsValid)){
                    setBearerToken(r.Token);
                }
            })
        }
    }, []);

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
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            if (isMockData) {
                setTimeout(function () {
                    const emailExists = mockData.login.started.member.email === values.email;

                    if (emailExists) {
                        setFormikData(values);
                        navigate(AuthRouteNames.LOGIN_ACCOUNT_VERIFICATION);
                    } else {
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
            } else {
                apiService.post('/api/create-account/email-check', {
                    email: values.email,
                    spGuideId: ''
                }).then(response => {
                    if (toBoolean(response?.IsValid)) {
                        if (equalString(response.Data, 0)) {
                            setStatus({email: 'Email not found.'});
                            ModalClose({
                                title: 'Not Found',
                                content: 'Player with such email not found.',
                                showIcon: false,
                                onOk: () => {
                                    focus('email');
                                }
                            });
                        } else if (equalString(response.Data, 1)) {
                            setFormikData(values);
                            navigate(AuthRouteNames.LOGIN_ACCOUNT_VERIFICATION);
                        }
                    } else {
                        ModalClose({
                            title: 'Error',
                            content: response.Message,
                            showIcon: false,
                            onOk: () => {
                                focus('email');
                            }
                        });
                    }

                    setIsLoading(false);
                });
            }
        },
    });

    return (
        <>
            <PaddingBlock>
                <Title level={4}>Let’s Get Started!</Title>

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
                </PageForm>
            </PaddingBlock>
        </>
    )
}

export default LoginGetStarted
