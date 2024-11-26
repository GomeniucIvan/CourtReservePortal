import {useFormik} from 'formik';
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect} from "react";
import {Button, Typography} from 'antd';
import FormInput from "../../../form/input/FormInput.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import {equalString, focus, isNullOrEmpty, isValidEmail, toBoolean} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import PageForm from "../../../form/pageform/PageForm.jsx";
import apiService, {getBearerToken, setBearerToken} from "../../../api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const {Paragraph, Link, Title} = Typography;

function LoginGetStarted() {
    const {setFormikData, isLoading, setIsLoading, isMockData, setIsFooterVisible, setFooterContent} = useApp();
    const { t } = useTranslation('login');
    const navigate = useNavigate();
    
    useEffect(() => {
        setIsFooterVisible(false);
        setFooterContent('');
        setFormikData(null);
    }, []);

    const startInitialValues = {
        email: '',
        isFromGetStarted: true
    };

    const startValidationSchema = Yup.object({
        email: Yup.string().required(t('common:requiredMessage', {label: t('getStarted.form.email')}))
    });

    const startFormik = useFormik({
        initialValues: startInitialValues,
        validationSchema: startValidationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            if (isMockData) {

            } else {
                let response = await apiService.post('/api/create-account/email-check', {
                    email: values.email,
                    spGuideId: ''
                });

                setIsLoading(false);
                if (toBoolean(response?.IsValid)) {
                    if (equalString(response.Data, 0)) {
                        if (isValidEmail(values.email)) {
                            //new email
                            setFormikData(values);
                            navigate(AuthRouteNames.LOGIN_CREATE_ACCOUNT);
                        } else{
                            //invalid email
                            setStatus({email: t(`getStarted.form.emailNotFound`)});
                            ModalClose({
                                title: t(`getStarted.form.emailNotFound`),
                                content: t(`getStarted.form.emailNotFoundDescription`),
                                showIcon: false,
                                onOk: () => {
                                    focus('email');
                                }
                            });
                        }
                    } else if (equalString(response.Data, 1)) {
                        //exists
                        setFormikData(values);
                        navigate(AuthRouteNames.LOGIN_AUTHORIZE);
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
            }
        },
    });

    return (
        <>
            <PaddingBlock topBottom={true}>
                <Title level={1}>{t(`getStarted.title`)}</Title>

                <Paragraph>
                    {t(`getStarted.description`)}
                </Paragraph>

                <PageForm
                    formik={startFormik}>
                    <FormInput label={t(`getStarted.form.email`)}
                               form={startFormik}
                               name='email'
                               placeholder={t(`getStarted.form.emailPlaceholder`)}
                               required='true'
                    />

                    <Button type="primary"
                            block htmlType="submit"
                            loading={isLoading}
                            onClick={startFormik.handleSubmit}
                    >
                        {t(`getStarted.button.login`)}
                    </Button>
                    <Paragraph className={'sm-padding'}>
                        {t(`getStarted.continueAgree`)}{' '}
                        <Link href="https://cr1.io/-1" target="_blank">
                            {t(`getStarted.termAndService`)}{' '}
                        </Link>
                        {t(`getStarted.and`)}{' '}
                        <Link href="https://cr1.io/-2" target="_blank">
                            {t(`getStarted.privacyPolicy`)}
                        </Link>
                    </Paragraph>
                </PageForm>
            </PaddingBlock>
        </>
    )
}

export default LoginGetStarted
