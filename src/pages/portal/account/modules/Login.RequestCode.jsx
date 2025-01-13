import {useApp} from "@/context/AppProvider.jsx";
import {Button, Typography} from 'antd';
import {useTranslation} from "react-i18next";
import * as React from "react";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import PageForm from "@/form/pageform/PageForm.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import {useEffect} from "react";
import * as Yup from "yup";
import {useFormik} from "formik";
import apiService from "@/api/api.jsx";
import {equalString, focus, isNullOrEmpty, nullToEmpty, toBoolean} from "@/utils/Utils.jsx";
import {ModalClose} from "@/utils/ModalUtils.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import {useNavigate} from "react-router-dom";
import {requiredMessage} from "@/utils/TranslateUtils.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";

const {Paragraph, Link, Title} = Typography;

function LoginRequestCode({mainFormik, onRequestCodeResult}) {
    const {isLoading, setIsLoading, setIsFooterVisible, setFooterContent} = useApp();
    const {spGuideId} = useAuth();
    const {t} = useTranslation('login');
    
    const startInitialValues = {
        email: mainFormik?.email,
        spGuideId: nullToEmpty(spGuideId),
        secretKey: '',
        maskedEmail: ''
    };

    const startValidationSchema = Yup.object({
        email: Yup.string().required(t('common:requiredMessage', {label: t('requestCode.form.email')})),
    });

    const formik = useFormik({
        initialValues: startInitialValues,
        validationSchema: startValidationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            
            const postModel = {
                spGuideId: nullToEmpty(spGuideId),
                Email: values?.email,
                IsVerificationProcess: true,
                scope: 'login'
            };

            const result = await apiService.post('/api/create-account/email-check', postModel);

            setIsLoading(false);
            
            if (equalString(result.Status, 0)){
                ModalClose({
                    title: 'Password',
                    content: 'Email not found in system.',
                    showIcon: false,
                    onOk: () => {
                        focus('email');
                    }
                });
            } else {
                onRequestCodeResult(result);
            }
        },
    });

    return (
        <PaddingBlock topBottom={true}>
            <Title level={1}>{t(`requestCode.title`)}</Title>

            <Paragraph>
                {t(`requestCode.description`)}
            </Paragraph>

            <PageForm
                formik={formik}>
                <FormInput label={t(`requestCode.form.email`)}
                           formik={formik}
                           name='email'
                           placeholder={t(`requestCode.form.emailPlaceholder`)}
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
    )
}

export default LoginRequestCode
