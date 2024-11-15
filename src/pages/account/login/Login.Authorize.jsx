import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {Button, Divider, Flex, theme, Typography} from "antd";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useEffect} from "react";
import FormInput from "../../../form/input/FormInput.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";

const {Title, Link, Text, Paragraph} = Typography;
const {useToken} = theme;
import PageForm from "../../../form/pageform/PageForm.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import apiService, {setBearerToken, setRequestData} from "../../../api/api.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import appService from "../../../api/app.jsx";
import {toAuthLocalStorage, toLocalStorage} from "../../../storage/AppStorage.jsx";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import {useAntd} from "../../../context/AntdProvider.jsx";

function LoginAuthorize() {
    const {
        formikData,
        isLoading,
        setIsLoading,
        setIsFooterVisible,
        setHeaderRightIcons,
        globalStyles,
        token
    } = useApp();
    const {spGuideId, setAuthorizationData} = useAuth();
    const email = formikData?.email;
    const isFromGetStarted = toBoolean(formikData?.isFromGetStarted);
    const navigate = useNavigate();

    const initialValues = {
        email: email,
        password: ''
    };

    useEffect(() => {
        setHeaderRightIcons('');
        setIsFooterVisible(false);
    }, []);

    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required.'),
        password: Yup.string().required('Password is required.'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            let postModel = {
                UserNameOrEmail: values.email,
                Password: values.password,
                SpGuideId: spGuideId
            };

            const loginResponse = await apiService.post('/api/create-account/login', postModel);

            if (!toBoolean(loginResponse?.IsValid)) {
                ModalClose({
                    title: 'Login Error',
                    content: loginResponse.Message,
                    showIcon: false,
                    onOk: () => {}
                });
                setIsLoading(false);
                return; 
            }

            const resultData = loginResponse.Data;

            if (equalString(resultData.LoginStatus, 0)) {
                ModalClose({
                    title: 'User Not Found',
                    content: `<b>${values.email}</b> does not exist on our system, would you like to create a new account?`,
                    showIcon: false,
                    onOk: () => {}
                });
                setIsLoading(false);
                return;
            }

            if (equalString(resultData.LoginStatus, 1)) {
                const loginModel = {
                    UserNameOrEmail: values.email,
                    Password: values.password
                };

                const loginApiResponse = await appService.post('/app/Online/Account/Login', loginModel);

                if (!toBoolean(loginApiResponse?.IsValid)) {
                    ModalClose({
                        title: 'Login Error',
                        content: loginApiResponse.Message,
                        showIcon: false,
                        onOk: () => {}
                    });
                    setIsLoading(false);
                    return;  
                }

                
                const responseData = loginApiResponse.Data;
                setRequestData(responseData.RequestData);
                const authResponse = await apiService.authData(responseData.OrgId);

                if (toBoolean(authResponse?.IsValid)) {
                    await setAuthorizationData(authResponse.Data);
                    navigate(loginApiResponse.Path);
                }
            }
        },
    });

    return (
        <>
            <PaddingBlock>
                <Title level={3}>Log In to Access Your Account</Title>

                <PageForm formik={formik}>
                    <FormInput label="Email"
                               form={formik}
                               disabled={isFromGetStarted}
                               required={!isFromGetStarted}
                               name='email'
                               placeholder='Enter your email'
                    />

                    <FormInput label="Password"
                               form={formik}
                               className={globalStyles.formNoBottomPadding}
                               name='password'
                               placeholder='Enter your password'
                               required={true}
                    />

                    <Flex justify={"start"} className={globalStyles.inputBottomLink}>
                        <Link style={{fontWeight: 600}} onClick={() => {
                        }}>
                            Forgot Password?
                        </Link>
                    </Flex>

                    <Button type="primary"
                            block
                            htmlType="submit"
                            loading={isLoading}
                            onClick={formik.handleSubmit}>
                        Continue
                    </Button>

                    <Divider><Text style={{verticalAlign: 'top', color: token.colorTextSecondary}}>or</Text></Divider>

                    <Button htmlType="button"
                            block
                            disabled={isLoading}>
                        Request a Code
                    </Button>

                    <Paragraph>
                        By continuing, you agree to CourtReserve’s
                        <Link style={{fontWeight: 600}} href={'https://cr1.io/-1'} target={'_blank'}>
                            {' '}Terms of Service{' '}
                        </Link>
                        and
                        <Link style={{fontWeight: 600}} href={'https://cr1.io/-2'} target={'_blank'}>
                            {' '}Privacy Policy
                        </Link>
                    </Paragraph>
                </PageForm>
            </PaddingBlock>
        </>
    )
}

export default LoginAuthorize
