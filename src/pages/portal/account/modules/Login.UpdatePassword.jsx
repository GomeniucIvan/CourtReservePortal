import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {theme, Typography, Col, Row, Button, Form, Flex} from "antd";
import * as Yup from "yup";
import {useFormik} from "formik";
import {equalString, focus, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import apiService, {setRequestData} from "@/api/api.jsx";
import appService from "@/api/app.jsx";
import * as React from "react";
import PageForm from "@/form/pageform/PageForm.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import {requiredMessage} from "@/utils/TranslateUtils.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {useTranslation} from "react-i18next";
import portalService from "@/api/portal.jsx";

const {Paragraph, Title, Text} = Typography;
const {useToken} = theme;

function LoginUpdatePassword({mainFormik, onSkipPasswordUpdate }) {
    const navigate = useNavigate();
    const {
        formikData,
        isLoading,
        setIsLoading,
        token,
        setIsFooterVisible,
        setHeaderTitleKey
    } = useApp();
    
    const {setAuthorizationData, spGuideId} = useAuth();

    const email = mainFormik?.email;
    const secretKey = mainFormik?.secretKey;
    const maskedEmail = mainFormik?.maskedEmail;
    const ssoKey = mainFormik?.ssoKey;
    const[isLogin, setIsLogin] = useState(false);
    const {t} = useTranslation('login');


    useEffect(() => {
        setIsFooterVisible(false);
        setHeaderTitleKey('loginUpdatePassword');
    }, []);
    
    const initialValues = {
        email: email,
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
        setIsLoading(isUpdatePassword);
        setIsLogin(!isUpdatePassword);

        const loginResponse = await portalService.frictLogin(navigate, ssoKey, secretKey, spGuideId);
        if (loginResponse){
            let orgId = loginResponse.orgId;

            let requestData = await portalService.requestData(navigate, orgId);
            if (requestData.IsValid) {
                await setAuthorizationData(requestData.OrganizationData);
                setIsLoading(false);
                setIsLogin(false);
                onSkipPasswordUpdate();
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
