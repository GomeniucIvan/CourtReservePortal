import styles from './Login.module.less'
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {theme, Typography, Col, Row, Button,Form} from "antd";
import PasscodeInput from "../../../form/passcode/FormPasscodeInput.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import {equalString, focus, isNullOrEmpty} from "../../../utils/Utils.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import mockData from "../../../mocks/auth-data.json";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {toAuthLocalStorage} from "../../../storage/AppStorage.jsx";
import apiService from "../../../api/api.jsx";
import appService from "../../../api/app.jsx";
import {useAntd} from "../../../context/AntdProvider.jsx";
const { Paragraph, Title, Text } = Typography;
const { useToken } = theme;

function LoginVerificationCode() {
    const navigate = useNavigate();
    const { token } = useToken();
    const { formikData, isLoading, setIsLoading, setFormikData, isMockData, setIsFooterVisible, globalStyles, setFooterContent } = useApp();
    const {setMemberId, setOrgId} = useAuth();
    const {setAuthData, setShouldLoadOrgData} = useAntd();
    
    const email = formikData?.email;
    const password = formikData?.password;
    
    useEffect(() => {
        setIsFooterVisible(false);
        
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

            if (isMockData) {
                setTimeout(function (){
                    const memberExists = mockData.login.started.member.email === values.email && 
                        mockData.login.started.member.password === values.password &&
                        mockData.login.started.member.passcode === values.passcode;

                    if (memberExists) {
                        setFormikData(null);
                        navigate(HomeRouteNames.INDEX);
                        toAuthLocalStorage('member', {email: values.email});
                    } else {
                        ModalClose({
                            title: 'Passcode',
                            content: 'Entered passcode is incorrect',
                            showIcon: false,
                            onOk: () => {
                                //focus('password');
                            }
                        });
                    }
                    setIsLoading(false);
                    
                }, 2000);
            } else{
                if (!equalString(values.passcode, 333444)){
                    ModalClose({
                        title: 'Passcode',
                        content: 'Entered passcode is incorrect',
                        showIcon: false,
                        onOk: () => {
                            //focus('password');
                        }
                    });

                    setIsLoading(false);
                } else{
                    appService.post('/app/Online/Account/Login', {
                        UserNameOrEmail: values.email,
                        Password: values.password
                    }).then(response => {
                        
                        if (response.IsValid){
                            setFormikData(null);
                            const responseData = response.Data;
                            setShouldLoadOrgData(false);
                            setOrgId(responseData.OrgId);
                            setMemberId(responseData.MemberId);

                            setAuthData({
                                timezone: responseData.Timezone,
                                uiCulture: responseData.UiCulture,
                                primaryColor: responseData.PrimaryColor
                            });

                            navigate(response.Path);
                            
                            toAuthLocalStorage('memberData', {
                                email: values.email,
                            }); 
                        }
                        
                        setIsLoading(false);
                    });
                }
            }
        },
    });

    useEffect(() => {
        if (formik?.values?.passcode){
            if (formik.values.passcode.length === 6){
                formik.handleSubmit();
            }
        }
    }, [formik?.values?.passcode]);

    useEffect(() => {
        setIsFooterVisible(false);
    }, []);
    
    return (
        <>
            <PaddingBlock>
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
