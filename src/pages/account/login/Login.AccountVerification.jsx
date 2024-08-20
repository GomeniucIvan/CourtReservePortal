import styles from './Login.module.less'
import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {Button, Divider, Flex, Form, Input, theme, Typography} from "antd";
import * as Yup from "yup";
import {useFormik} from "formik";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import {useEffect} from "react";
import {focus, isNullOrEmpty} from "../../../utils/Utils.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import mockData from "../../../mocks/auth-data.json";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
const { Paragraph, Title, Link } = Typography;
const { useToken } = theme;
import { Modal } from 'antd-mobile'
import PageForm from "../../../form/pageform/PageForm.jsx";

function LoginAccountVerification() {
    const { formikData, isLoading, setIsLoading, setFormikData, isMockData, setIsFooterVisible, setFooterContent, globalStyles } = useApp();
    const email = formikData?.email;
    const { token } = useToken();
    const navigate = useNavigate();

    const initialValues = {
        email: email,
        password: ''
    };

    useEffect(() => {
        if (isNullOrEmpty(email)){
            navigate(AuthRouteNames.LOGIN_GET_STARTED);
        }
    }, []);

    useEffect(() => {
        setIsFooterVisible(true);
        
        setFooterContent(
            <PaddingBlock topBottom={true}>
                <Button type="primary"
                        block
                        htmlType="submit"
                        loading={isLoading}
                        onClick={formik.handleSubmit}>
                    Continue
                </Button>
            </PaddingBlock>
        );
    }, [isLoading]);
    
    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required.'),
        password: Yup.string().required('Password is required.'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setIsLoading(true);

            if (isMockData){
                
                setTimeout(function (){
                    const memberExists = mockData.login.started.member.email === values.email && mockData.login.started.member.password === values.password;

                    if (memberExists) {
                        setFormikData(values);
                        navigate(AuthRouteNames.LOGIN_VERIFICATION_CODE);
                    } else {
                        ModalClose({
                            title: 'Password',
                            content: 'The email and password combination you entered is incorrect',
                            showIcon: false,
                            onOk: () => {
                                focus('password');
                            }
                        });
                    }
                    setIsLoading(false);
                }, 2000);
            } else{
                //todo
                alert('todo verification')
            }
        },
    });
    
    return (
       <>
           <PaddingBlock>
               <Title level={4}>Please Check Your Email</Title>

               <Paragraph>
                   We've sent a 6-digit code to <strong>chr****@email.com</strong>. The code expires in 15 minutes. Please enter it below.
               </Paragraph>

               <PageForm formik={formik}>
                   <FormInput label="Email"
                              form={formik}
                              name='email'
                              disabled={true}
                              placeholder='Enter your email'
                   />

                   <FormInput label="Password"
                              form={formik}
                              className={globalStyles.formNoBottomPadding}
                              name='password'
                              placeholder='Enter your password'
                              required='true'
                   />

                   <Flex justify={"end"} className={globalStyles.inputBottomLink}>
                       <Link onClick={() => {
                           Modal.show({
                               content: 'By requesting a text code, you agree to receive texts from CourtReserve. Carrier rates may apply.',
                               closeOnAction: true,
                               actions: [
                                   {
                                       key: 'email',
                                       text: 'Email login code',
                                       primary: true,
                                   },
                                   {
                                       key: 'text',
                                       text: 'Text code to *9650',
                                       primary: true,
                                   },
                                   {
                                       key: 'close',
                                       text: 'Close',
                                   },
                               ],
                           })
                       }}>
                           Forgot Password
                       </Link>
                   </Flex>
               </PageForm>
           </PaddingBlock>
       </>
    )
}

export default LoginAccountVerification
