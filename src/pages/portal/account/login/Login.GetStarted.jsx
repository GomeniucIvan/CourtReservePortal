import {useFormik} from 'formik';
import {useApp} from "@/context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect} from "react";
import {Button, Flex, Typography} from 'antd';
import FormInput from "@/form/input/FormInput.jsx";
import {equalString, focus, isNullOrEmpty, isValidEmail, toBoolean} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import PageForm from "@/form/pageform/PageForm.jsx";
import apiService, {getBearerToken, setBearerToken} from "@/api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";

const {Paragraph, Link, Title} = Typography;

function LoginGetStarted({ mainFormik, onNewEmail, onEmailExists }) {
    const {setHeaderTitleKey} = useHeader();
    const {isLoading, setIsLoading, isMockData, setIsFooterVisible, token } = useApp();
    const { t } = useTranslation('login');
    const {setHeaderRightIcons} = useHeader();
    
    useEffect(() => {
        setHeaderRightIcons('');
        setIsFooterVisible(false);
        setHeaderTitleKey('gettingStarted')
    }, []);
    
    const startInitialValues = {
        email: mainFormik?.value?.email
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
                            onNewEmail(values);
                        } else{
                            //invalid email
                            setStatus({email: t(`getStarted.form.emailNotFound`)});
                            displayMessageModal({
                                title: t(`getStarted.form.emailNotFound`),
                                html: (onClose) => t(`getStarted.form.emailNotFoundDescription`),
                                type: "error",
                                buttonType: modalButtonType.DEFAULT_CLOSE,
                                onClose: () => {
                                    focus('email');
                                },
                            })
                        }
                    } else if (equalString(response.Data, 1)) {
                        //exists
                        onEmailExists(values);
                    }
                } else {
                    displayMessageModal({
                        title: 'Error',
                        html: (onClose) => response.Message,
                        type: "error",
                        buttonType: modalButtonType.DEFAULT_CLOSE,
                        onClose: () => {
                            focus('email');
                        },
                    })
                }
            }
        },
    });

    return (
        <>
            <PaddingBlock topBottom={true}>
                <Flex vertical={true} gap={token.paddingXS}>
                    <Title level={1}>{t(`getStarted.title`)}</Title>

                    <Paragraph>
                        {t(`getStarted.description`)}
                    </Paragraph>
                </Flex>

                <PageForm formik={startFormik}>
                    <FormInput label={t(`getStarted.form.email`)}
                               formik={startFormik}
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
