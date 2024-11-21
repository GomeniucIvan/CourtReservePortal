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
import PageForm from "../../../form/pageform/PageForm.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import {requiredMessage} from "../../../utils/TranslateUtils.jsx";

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
        globalStyles
    } = useApp();
    const {setShouldLoadOrgData, setAuthorizationData} = useAuth();

    const email = formikData?.email;
    const secretKey = formikData?.secretKey;
    const maskedEmail = formikData?.maskedEmail;
    const spGuideId = formikData?.spGuideId;
    const ssoKey = formikData?.ssoKey;

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

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            const response = await apiService.post(`/api/create-account/update-password?ssoKey=${ssoKey}&initialAuthCode=${secretKey}&currentPassword=${values.password}&confirmPassword=${values.confirmPassword}&spGuideId=${spGuideId}`);
            if (response.IsValid) {
                setIsLoading(false);
                frictLogin();
            }
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
                               form={formik}
                               addIconToSeePassword={true}
                               name='password'
                               required='true'
                    />

                    <FormInput label={t(`updatePassword.form.confirmPassword`)}
                               form={formik}
                               addIconToSeePassword={true}
                               name='confirmPassword'
                               required='true'
                    />
                    
                    <Button type="primary"
                            block htmlType="submit"
                            loading={isLoading}
                            onClick={formik.handleSubmit}
                    >
                        {t(`requestCode.button.continue`)}
                    </Button>
                </PageForm>
            </PaddingBlock>
        </>
    )
}

export default LoginUpdatePassword
