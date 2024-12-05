import {useFormik} from 'formik';
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect} from "react";
import {Button, Typography} from 'antd';
import FormInput from "../../../form/input/FormInput.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import mockData from "../../../mocks/auth-data.json";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import {equalString, focus, isNullOrEmpty, isValidEmail, toBoolean} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import PageForm from "../../../form/pageform/PageForm.jsx";
import apiService, {getBearerToken, setBearerToken} from "../../../api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/AuthProvider.jsx";
import appService from "../../../api/app.jsx";
import {useTranslation} from "react-i18next";

const {Paragraph, Link, Title} = Typography;

function LoginCreateAccount() {
    const {setFormikData, isLoading, setIsLoading, formikData, setIsFooterVisible, setFooterContent} = useApp();
    const email = formikData?.email;
    const {t} = useTranslation('login');
    const navigate = useNavigate();

    useEffect(() => {
        setIsFooterVisible(false);
        setFooterContent('');
    }, []);

    const initialValues = {
        email: email,
        password: '',
        confirmPassword: ''
    };

    useEffect(() => {
        if (isNullOrEmpty(email)){
            navigate(AuthRouteNames.LOGIN_GET_STARTED);
        }
    }, []);

    const validationSchema = Yup.object({
        email: Yup.string().required(t('common:requiredMessage', {label: t('getStarted.form.email')})),
        password: Yup.string().required(t('common:requiredMessage', {label: t('createAccount.form.password')}))
            .min(6, t(`createAccount.form.passwordMinLength`)),
        confirmPassword: Yup.string().required(t('common:requiredMessage', {label: t('createAccount.form.confirmPassword')}))
            .oneOf([Yup.ref('password'), null], t(`createAccount.form.passwordMatch`)),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            setFormikData(values);
            navigate(AuthRouteNames.LOGIN_ORGANIZATION);
            
            setIsLoading(false);
        },
    });

    return (
        <>
            <PaddingBlock topBottom={true}>
                <Title level={1}>{t(`createAccount.title`)}</Title>

                <Paragraph>
                    {t(`createAccount.description`)}
                </Paragraph>

                <PageForm formik={formik}>
                    <FormInput label={t(`getStarted.form.email`)}
                               formik={formik}
                               name='email'
                               disabled={true}
                               placeholder={t(`getStarted.form.emailPlaceholder`)}
                    />

                    <FormInput label={t(`createAccount.form.password`)}
                               formik={formik}
                               name='password'
                               required={true}
                               addIconToSeePassword={true}
                               placeholder={t(`createAccount.form.passwordPlaceholder`)}
                    />

                    <FormInput label={t(`createAccount.form.confirmPassword`)}
                               formik={formik}
                               name='confirmPassword'
                               required={true}
                               addIconToSeePassword={true}
                               placeholder={t(`createAccount.form.confirmPasswordPlaceholder`)}
                    />
                    
                    <Button type="primary"
                            block htmlType="submit"
                            loading={isLoading}
                            onClick={formik.handleSubmit}
                    >
                        {t(`createAccount.button.continue`)}
                    </Button>
                </PageForm>
            </PaddingBlock>
        </>
    )
}

export default LoginCreateAccount
