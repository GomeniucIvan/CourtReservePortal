import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {theme, Typography, Col, Row, Button, Form} from "antd";
import PasscodeInput from "@/form/passcode/FormPasscodeInput.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import {equalString, focus, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import {ModalClose} from "@/utils/ModalUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import apiService, {setRequestData} from "@/api/api.jsx";
import * as React from "react";
import {useTranslation} from "react-i18next";
import {useStyles} from "./../styles.jsx";

const {Paragraph, Title, Text} = Typography;

function LoginVerificationCode({mainFormik, onPasswordVerify}) {
    const navigate = useNavigate();
    const { t } = useTranslation('login');
    const {
        isLoading,
        setIsLoading,
        setIsFooterVisible,
        globalStyles,
        setHeaderTitleKey
    } = useApp();
    
    const {spGuideId} = useAuth();
    const [resendCodeDisabled, setResendCodeDisabled] = useState(true);
    const {styles} = useStyles();
    
    const email = mainFormik?.email;

    const sendVerificationCode = async () => {
        setResendCodeDisabled(true);
        const response = await apiService.post(`/api/account-verification/request-code?initialAuthCode=${mainFormik.secretKey}&spGuideId=${mainFormik.spGuideId}`);

        setTimeout(function(){
            setResendCodeDisabled(false);
        }, 15000)
    }
    
    useEffect(() => {
        setIsFooterVisible(false);
        setHeaderTitleKey('verificationCode');
        
        sendVerificationCode();
        
        setTimeout(function(){
            setResendCodeDisabled(false);
        }, 15000)
    }, []);

    const initialValues = {
        email: email,
        passcode: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().required(t('common:requiredMessage', {label: t('getStarted.form.email')})),
        passcode: Yup.string()
            .required(t('common:requiredMessage', {label: t('verificationCode.form.passcode')}))
            .min(6, 'Passcode must be exactly 6 characters.')
            .max(6, 'Passcode must be exactly 6 characters.')
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            const response = await apiService.post(`/api/account-verification/verify-code?initialAuthCode=${mainFormik.secretKey}&code=${values.passcode}&spGuideId=${spGuideId}`);
            setIsLoading(false);

            if (response.IsValid) {
                let formikValues = {
                    email: values.email,
                    ssoKey: response.Data.SsoKey,
                    secretKey: mainFormik.secretKey,
                    maskedEmail: mainFormik?.maskedEmail
                };
                
                onPasswordVerify(formikValues)

            } else {
                ModalClose({
                    content: response.Message,
                    showIcon: false,
                    onOk: () => {
                        
                    }
                });
            }
        },
    });

    useEffect(() => {
        if (formik?.values?.passcode) {
            if (formik.values.passcode.length === 6) {
                formik.handleSubmit();
            }
        }
    }, [formik?.values?.passcode]);

    return (
        <>
            <PaddingBlock topBottom={true}>
                <Title level={1}>{t(`verificationCode.title`)}</Title>

                <Paragraph>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: t(`verificationCode.description`, { email: mainFormik?.maskedEmail }),
                        }}
                    />
                </Paragraph>

                <Form
                    layout={'vertical'}
                    autoComplete="off"
                    initialValues={{layout: 'vertical'}}
                >
                    <PasscodeInput seperated length={6} name={'passcode'} formik={formik}/>

                    <Row justify={'space-between'} className={globalStyles.inputBottomLink}>
                        <Col span={12}><Text type="secondary">{t('verificationCode.didntGetCode')}</Text></Col>

                        {/*//styles. not working use inline style*/}
                        <Col span={12} style={{textAlign: 'end'}}>
                            <Button color="default" variant="link"
                                    className={styles.resendCodeButton}
                                    disabled={resendCodeDisabled}
                                    onClick={sendVerificationCode}>
                                {t('verificationCode.resendCode')}
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Button type="primary"
                        block
                        htmlType="submit"
                        loading={isLoading}
                        onClick={formik.handleSubmit}>
                    {t('verificationCode.button.continue')}
                </Button>
            </PaddingBlock>
        </>
    )
}

export default LoginVerificationCode
