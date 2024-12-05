import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {theme, Typography, Col, Row, Button, Form, Flex} from "antd";
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
import PageForm from "../../../form/pageform/PageForm.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import {requiredMessage} from "../../../utils/TranslateUtils.jsx";
import {ProfileRouteNames} from "../../../routes/ProfileRoutes.jsx";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import {useTranslation} from "react-i18next";

const {Paragraph, Title, Text} = Typography;
const {useToken} = theme;

function LoginUpdatePassword() {
    const navigate = useNavigate();
    const {
        formikData,
        isLoading,
        setIsLoading,
        setFormikData,
        setIsFooterVisible,
        globalStyles,
        token
    } = useApp();
    
    const {setShouldLoadOrgData, setAuthorizationData} = useAuth();

    const email = formikData?.email;
    const secretKey = formikData?.secretKey;
    const maskedEmail = formikData?.maskedEmail;
    const spGuideId = formikData?.spGuideId;
    const ssoKey = formikData?.ssoKey;
    const[isLogin, setIsLogin] = useState(false);
    const {t} = useTranslation('login');
    
    useEffect(() => {
        
        if (isNullOrEmpty(email) ||
            isNullOrEmpty(secretKey) ||
            isNullOrEmpty(maskedEmail)){
            navigate(AuthRouteNames.LOGIN);
        }
    }, []);
    
    const initialValues = {
        email: email,
        spGuideId: spGuideId,
        secretKey: secretKey,
        maskedEmail: maskedEmail,
        password: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object({
        password: Yup.string().required(requiredMessage(t, 'createAccount.form.password'))
            .min(6, t(`createAccount.form.passwordMinLength`)),
        confirmPassword: Yup.string().required(requiredMessage(t, 'createAccount.form.confirmPassword'))
            .oneOf([Yup.ref('password'), null], t(`createAccount.form.passwordMatch`)),
    });

    const frictLogin = async (isUpdatePassword) => {

        debugger;
        setIsLoading(isUpdatePassword);
        setIsLogin(!isUpdatePassword);

        const loginResponse = await appService.get(navigate, `/app/MobileSso/FrictLogin?ssoKey=${ssoKey}&initialAuthCode=${secretKey}&spGuideId=${spGuideId}&loaded=true`)
        if (loginResponse){
            let orgId = loginResponse.orgId;
            let memberId = loginResponse.memberId;

            let requestData = await appService.get(navigate, `/app/Online/Account/RequestData?id=${orgId}&memberId=${memberId}`);

            if (requestData.IsValid) {
                const responseData = requestData.Data;
                setRequestData(responseData.RequestData);

                let authResponse = await apiService.authData(orgId);

                if (toBoolean(authResponse?.IsValid)) {
                    await setAuthorizationData(authResponse.Data);

                    setIsLoading(false);
                    setIsLogin(false);
                    navigate(HomeRouteNames.INDEX);
                }
            }
        }

        setIsLoading(false);
        setIsLogin(false);
    }
    
    
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            const response = await apiService.post(`/api/create-account/update-password?ssoKey=${ssoKey}&initialAuthCode=${secretKey}&currentPassword=${values.password}&confirmPassword=${values.confirmPassword}&spGuideId=${spGuideId}`);
        
            if (response.IsValid) {
               await frictLogin(true);
            }
            
            setIsLoading(false);
        },
    });
    
    return (
        <>
            <PaddingBlock topBottom={true}>
                <Title level={1}>{t(`updatePassword.title`)}</Title>

                <Paragraph>
                    {t(`updatePassword.description`, {email: formikData?.maskedEmail})}
                </Paragraph>

                <PageForm formik={formik}>
                    <FormInput label={t(`updatePassword.form.password`)}
                               formik={formik}
                               addIconToSeePassword={true}
                               name='password'
                               required='true'
                    />

                    <FormInput label={t(`updatePassword.form.confirmPassword`)}
                               formik={formik}
                               addIconToSeePassword={true}
                               name='confirmPassword'
                               required='true'
                    />
                    
                   <Flex vertical={true} gap={token.padding}> 
                       <Button type="primary"
                               block htmlType="submit"
                               loading={isLoading}
                               disabled={isLogin}
                               onClick={formik.handleSubmit}
                       >
                           {t(`updatePassword.button.updatePassword`)}
                       </Button>

                       <Button block htmlType="button"
                               loading={isLogin}
                               disabled={isLoading}
                               onClick={frictLogin}
                       >
                           {t(`updatePassword.button.skip`)}
                       </Button>
                   </Flex>
                </PageForm>
            </PaddingBlock>
        </>
    )
}

export default LoginUpdatePassword
