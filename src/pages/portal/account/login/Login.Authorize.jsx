import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {Button, Divider, Flex, Typography} from "antd";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useEffect} from "react";
import FormInput from "@/form/input/FormInput.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import PageForm from "@/form/pageform/PageForm.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import apiService, {setRequestData} from "@/api/api.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useTranslation} from "react-i18next";
import portalService from "@/api/portal.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {useDevice} from "@/context/DeviceProvider.jsx";

const {Title, Link, Text, Paragraph} = Typography;

function LoginAuthorize({ isFromGetStarted, mainFormik, onRequestACode }) {
    const {setHeaderRightIcons, setHeaderTitleKey} = useHeader();
    const {
        isLoading,
        setIsLoading,
        setIsFooterVisible,
        globalStyles,
        token
    } = useApp();
    
    const {spGuideId, setAuthorizationData} = useAuth();
    const email = mainFormik?.values?.email;
    const navigate = useNavigate();
    const {t} = useTranslation('login');
    const {isMobile} = useDevice();
    
    const initialValues = {
        email: email,
        password: ''
    };

    useEffect(() => {
        setHeaderRightIcons('');
        setIsFooterVisible(false);
        setHeaderTitleKey('loginAuthorize')
    }, []);

    const validationSchema = Yup.object({
        email: Yup.string().required(t('common:requiredMessage', {label: t('authorize.form.email')})),
        password: Yup.string().required(t('common:requiredMessage', {label: t('authorize.form.password')})),
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
                displayMessageModal({
                    title: "Login Error",
                    html: (onClose) => loginResponse.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })
                setIsLoading(false);
                return; 
            }

            const resultData = loginResponse.Data;

            if (equalString(resultData.LoginStatus, 0)) {
                displayMessageModal({
                    title: "User Not Found",
                    html: (onClose) => `<b>${values.email}</b> does not exist on our system, would you like to create a new account?`,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })
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
                    displayMessageModal({
                        title: "Login Error",
                        html: (onClose) => loginApiResponse.Message,
                        type: "error",
                        buttonType: modalButtonType.DEFAULT_CLOSE,
                        onClose: () => {},
                    })
                    setIsLoading(false);
                    return;  
                }

                const responseData = loginApiResponse.Data;
                setRequestData(responseData.RequestData);
                const authResponse = await portalService.requestData(navigate, responseData.OrgId, isMobile);
                
                if (toBoolean(authResponse?.IsValid)) {

                    await setAuthorizationData(authResponse.OrganizationData);
                    setIsLoading(false);

                    //should set orgId before pending disclosures is called

                    if (!isNullOrEmpty(authResponse?.BaseRedirectPath) && typeof navigate === 'function'){
                        navigate(authResponse?.BaseRedirectPath);
                    } else {
                        navigate(loginApiResponse.Path);
                    }
                }
                setIsLoading(false);
            }
        },
    });

    const navigateToRequestACode = () => {
        onRequestACode(formik?.values);
    }
    
    return (
        <>
            <PaddingBlock topBottom={true}>
               <Flex vertical={true} gap={token.padding}>
                   <Title level={3} style={{paddingBottom: token.paddingSM}}>{t('authorize.title')}</Title>

                   <PageForm formik={formik}>
                       <FormInput label={t('authorize.form.email')}
                                  formik={formik}
                                  disabled={isFromGetStarted}
                                  required={!isFromGetStarted}
                                  name='email'
                                  placeholder={t('authorize.form.emailPlaceholder')}
                       />

                       <Flex vertical={true}>
                           <FormInput label={t('authorize.form.password')}
                                      formik={formik}
                                      className={globalStyles.formNoBottomPadding}
                                      name='password'
                                      placeholder={t('authorize.form.passwordPlaceholder')}
                                      required={true}
                           />

                           <Flex justify={"start"} className={globalStyles.inputBottomLink}>
                               <Link style={{fontWeight: 600}} onClick={() => {
                                   navigate(AuthRouteNames.LOGIN_FORGOT_PASSWORD);
                               }}>
                                   {t('authorize.forgotPassword')}
                               </Link>
                           </Flex>
                       </Flex>

                       <Flex vertical={true}>
                           <Button type="primary"
                                   block
                                   htmlType="submit"
                                   loading={isLoading}
                                   onClick={formik.handleSubmit}>
                               {t('authorize.button.continue')}
                           </Button>

                           <Divider><Text style={{verticalAlign: 'top', color: token.colorTextSecondary}}>or</Text></Divider>

                           <Button htmlType="button"
                                   block
                                   onClick={navigateToRequestACode}
                                   disabled={isLoading}>
                               {t('authorize.button.requestACode')}
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
                       </Flex>
                   </PageForm>
               </Flex>
            </PaddingBlock>
        </>
    )
}

export default LoginAuthorize
