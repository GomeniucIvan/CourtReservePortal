import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {theme, Typography, Col, Row, Button, Form} from "antd";
import PasscodeInput from "../../../form/passcode/FormPasscodeInput.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import {equalString, focus, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import mockData from "../../../mocks/auth-data.json";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {toAuthLocalStorage, toLocalStorage} from "../../../storage/AppStorage.jsx";
import apiService, {setRequestData} from "../../../api/api.jsx";
import appService from "../../../api/app.jsx";
import {useAntd} from "../../../context/AntdProvider.jsx";
import * as React from "react";

const {Paragraph, Title, Text} = Typography;
const {useToken} = theme;

function LoginVerificationCode() {
    const navigate = useNavigate();
    const {
        formikData,
        isLoading,
        setIsLoading,
        setFormikData,
        setIsFooterVisible,
        globalStyles
    } = useApp();
    const {setShouldLoadOrgData, setAuthorizationData} = useAuth();

    const email = formikData?.email;

    const sendVerificationCode = async () => {
        const response = await apiService.post(`/api/account-verification/request-code?initialAuthCode=${formikData.secretKey}&spGuideId=${formikData.spGuideId}`);
    }
    
    useEffect(() => {
        setIsFooterVisible(false);

        if (isNullOrEmpty(email)) {
            navigate(AuthRouteNames.LOGIN);
        } else{
            sendVerificationCode();
        }
    }, []);

    const initialValues = {
        email: email,
        passcode: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required.'),
        passcode: Yup.string()
            .required('Passcode is required.')
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

            const response = await apiService.post(`/api/account-verification/verify-code?initialAuthCode=${formikData.secretKey}&code=${values.passCode}&spGuideId=${formikData.spGuideId}`);
            setIsLoading(false);

            if (response.IsValid) {
                let formikValues = {
                    email: values.email,
                    ssoKey: response.Data.SsoKey,
                    spGuideId: formikData.spGuideId,
                    secretKey: formikData.secretKey,
                };
                
                setFormikData(formikValues);
                navigate(AuthRouteNames.LOGIN_UPDATE_PASSWORD);
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
                    {t(`verificationCode.description`, {email: formikData?.maskedEmail})}
                </Paragraph>

                <Form
                    layout={'vertical'}
                    autoComplete="off"
                    initialValues={{layout: 'vertical'}}
                >
                    <PasscodeInput seperated length={6} name={'passcode'} form={formik}/>

                    <Row justify={'space-between'} className={globalStyles.inputBottomLink}>
                        <Col span={12}><Text type="secondary">Didn't get the code?</Text></Col>

                        {/*//styles. not working use inline style*/}
                        <Col span={12} style={{textAlign: 'end'}}>
                            <Text type="primary">Resend Code</Text>
                        </Col>
                    </Row>
                </Form>

                <Button type="primary"
                        block
                        htmlType="submit"
                        loading={isLoading}
                        onClick={formik.handleSubmit}>
                    Continue
                </Button>
            </PaddingBlock>
        </>
    )
}

export default LoginVerificationCode
