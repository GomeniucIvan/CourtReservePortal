import styles from './Login.module.less'
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useFormikContext} from "../../../context/FormikProvider.jsx";
import {useFooter} from "../../../context/FooterProvider.jsx";
import {theme, Typography, Col, Row, Button,Form} from "antd";
import PasscodeInput from "../../../form/passcode/FormPasscodeInput.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import {isNullOrEmpty} from "../../../utils/Utils.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
const { Paragraph, Title, Text } = Typography;
const { useToken } = theme;

function LoginVerificationCode() {
    const navigate = useNavigate();
    const { token } = useToken();

    const { formikData, isLoading, setIsLoading, setFormikData } = useFormikContext();
    const { setFooterContent, setIsFooterVisible } = useFooter();

    const email = formikData?.email;
    const password = formikData?.password;

    useEffect(() => {
        if (isNullOrEmpty(email) || isNullOrEmpty(password)){
            navigate(AuthRouteNames.LOGIN_GET_STARTED);
        }
    }, []);

    const initialValues = {
        email: email,
        password: password,
        passcode: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required.'),
        password: Yup.string().required('Password is required.'),
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
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setIsLoading(true);

            setTimeout(function (){
                setFormikData(values);
                console.log('Form submitted:', values);
                navigate(HomeRouteNames.INDEX);
                setIsLoading(false);
            }, 2000);
        },
    });

    useEffect(() => {
        if (formik?.values?.passcode){
            if (formik.values.passcode.length === 6){
                formik.handleSubmit();
            }
        }
    }, [formik?.values?.passcode]);
    
    return (
        <>
            <div>
                <Title level={4}>Please Check Your Phone</Title>

                <Paragraph>
                    We've sent a 6-digit code to <strong>***-***-9650</strong>. The code expires in 15 minutes. Please enter it below.
                </Paragraph>

                <Form
                    layout={'vertical'}
                    autoComplete="off"
                    initialValues={{ layout: 'vertical' }}
                >
                    <PasscodeInput seperated length={6} name={'passcode'} form={formik} />

                    <Row justify={'space-between'} className={styles.verificationCodeLinksRow}>
                        <Col span={12}><Text type="secondary">Didn't get the code?</Text></Col>

                        {/*//styles. not working use inline style*/}
                        <Col span={12} style={{textAlign: 'end'}}>
                            <Text type="primary">Resend Code</Text>
                        </Col>
                    </Row>

                    <Button type="primary"
                            block
                            htmlType="submit"
                            loading={isLoading}
                            onClick={formik.handleSubmit}>
                        Continue
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default LoginVerificationCode
