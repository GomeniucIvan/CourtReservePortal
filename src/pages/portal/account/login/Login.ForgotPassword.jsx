import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {Button, Divider, Flex, theme, Typography} from "antd";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useEffect} from "react";
import FormInput from "@/form/input/FormInput.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";

const {Title, Link, Text, Paragraph} = Typography;
import PageForm from "@/form/pageform/PageForm.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import {equalString, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import * as React from "react";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useTranslation} from "react-i18next";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";

function LoginForgotPassword({  }) {
    const {
        isLoading,
        setIsLoading,
    } = useApp();
    
    const navigate = useNavigate();
    const {t} = useTranslation('login');
    
    const initialValues = {
        email: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().required(t('common:requiredMessage', {label: t('forgotPassword.email')}))
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            let postModel = {
                Username: values.email,
                IsApiCall: true
            };

            let result = await appService.post('/app/Account/ForgotPasswordNoT', postModel);
            
            if (!toBoolean(result?.IsValid)) {
                displayMessageModal({
                    title: "Error",
                    html: (onClose) => result.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })
                setIsLoading(false);
                return; 
            }

            pNotify(result.message);
            navigate(AuthRouteNames.LOGIN)
            setIsLoading(false);
        },
    });
    
    return (
        <>
            <PaddingBlock topBottom={true}>
                <Title level={1}>{t(`forgotPassword.title`)}</Title>

                <Paragraph>
                    {t(`forgotPassword.description`)}
                </Paragraph>

                <PageForm formik={formik}>
                    <FormInput label={t('forgotPassword.email')}
                               formik={formik}
                               name='email'
                               required={true}
                    />

                    <Button type="primary"
                            block
                            htmlType="submit"
                            loading={isLoading}
                            onClick={formik.handleSubmit}
                    >
                        {t(`forgotPassword.button.submit`)}
                    </Button>
                </PageForm>
            </PaddingBlock>
        </>
    )
}

export default LoginForgotPassword
