import {useNavigate} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {Button, Typography} from "antd";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useEffect} from "react";
import FormInput from "@/form/input/FormInput.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
const { Paragraph, Title, Link } = Typography;
import PageForm from "@/form/pageform/PageForm.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";

function LoginAccountIdentification() {
    const { formikData, isLoading, setIsLoading, setFormikData, setIsFooterVisible, setFooterContent, globalStyles } = useApp();
    const navigate = useNavigate();

    const initialValues = {
        email: formikData?.email
    };

    useEffect(() => {
        setIsFooterVisible(false);
        setFooterContent(null);
    }, []);
    
    const validationSchema = Yup.object({
        email: Yup.string().required('Email is required.')
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setIsLoading(true);
            navigate(AuthRouteNames.LOGIN_VERIFICATION_CODE);

            setIsLoading(true);
        },
    });
    
    return (
       <>
           <PaddingBlock>
               <Title level={3}>Let's Find Your Account</Title>

               <Paragraph>
                   Enter your email to get started. If you don't have an account yet, you will be prompted to create one.
               </Paragraph>

               <PageForm formik={formik}>
                   <FormInput label="Email"
                              formik={formik}
                              name='email'
                              disabled={true}
                              placeholder='Enter your email'
                   />

                   <Button type="primary"
                           block
                           htmlType="submit"
                           loading={isLoading}
                           onClick={formik.handleSubmit}>
                       Continue
                   </Button>

                   <Paragraph className={'sm-padding'}>
                       By continuing, you agree to CourtReserve’s{' '}
                       <Link href="https://ant.design" target="_blank">
                           Terms of Service{' '}
                       </Link>
                       and{' '}
                       <Link href="https://ant.design" target="_blank">
                           Privacy Policy
                       </Link>
                   </Paragraph>
               </PageForm>
           </PaddingBlock>
       </>
    )
}

export default LoginAccountIdentification
