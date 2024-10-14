import {useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {Button, Divider, Flex, theme, Typography} from "antd";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useEffect} from "react";
import FormInput from "../../../form/input/FormInput.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
const { Title, Link, Text, Paragraph } = Typography;
const { useToken } = theme;
import PageForm from "../../../form/pageform/PageForm.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";

function LoginAuthorize() {
    const { formikData, isLoading, setIsLoading, setFormikData, isMockData, setIsFooterVisible, setHeaderRightIcons, globalStyles, token } = useApp();
    const email = formikData?.email;
    const navigate = useNavigate();

    const initialValues = {
        email: email,
        password: ''
    };

    useEffect(() => {
        setHeaderRightIcons('');
        setIsFooterVisible(false);
    }, []);
    
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

          
        },
    });
    
    return (
       <>
           <PaddingBlock>
               <Title level={4}>Log In to Access Your Account</Title>

               <PageForm formik={formik}>
                   <FormInput label="Email"
                              form={formik}
                              name='email'
                              placeholder='Enter your email'
                   />

                   <FormInput label="Password"
                              form={formik}
                              className={globalStyles.formNoBottomPadding}
                              name='password'
                              placeholder='Enter your password'
                              required='true'
                   />

                   <Flex justify={"start"} className={globalStyles.inputBottomLink}>
                       <Link style={{fontWeight: 600}} onClick={() => { }}>
                           Forgot Password?
                       </Link>
                   </Flex>

                   <Button type="primary"
                           block
                           htmlType="submit"
                           loading={isLoading}
                           onClick={formik.handleSubmit}>
                       Continue
                   </Button>

                   <Divider><Text style={{verticalAlign: 'top', color: token.colorTextSecondary}}>or</Text></Divider>

                   <Button htmlType="button"
                           block
                           disabled={isLoading}>
                       Request a Code
                   </Button>

                   <Paragraph>
                       By continuing, you agree to CourtReserve’s
                       <Link style={{ fontWeight: 600 }} href={'https://cr1.io/-1'} target={'_blank'}>
                           {' '}Terms of Service{' '}
                       </Link>
                       and
                       <Link style={{ fontWeight: 600 }} href={'https://cr1.io/-2'} target={'_blank'}>
                           {' '}Privacy Policy
                       </Link>
                   </Paragraph>
               </PageForm>
           </PaddingBlock>
       </>
    )
}

export default LoginAuthorize
