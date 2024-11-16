import {useFormik} from 'formik';
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import {Button, Flex, Skeleton, Typography} from 'antd';
import FormInput from "../../../form/input/FormInput.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import mockData from "../../../mocks/auth-data.json";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import {
    equalString,
    focus,
    isNullOrEmpty,
    isValidEmail,
    nullToEmpty,
    randomNumber,
    toBoolean
} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import PageForm from "../../../form/pageform/PageForm.jsx";
import apiService, {getBearerToken, setBearerToken} from "../../../api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/AuthProvider.jsx";
import appService from "../../../api/app.jsx";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {isCanadaCulture} from "../../../utils/OrganizationUtils.jsx";
import {isNonUsCulture} from "../../../utils/DateUtils.jsx";

const {Paragraph, Link, Title} = Typography;

function LoginAdditionalInfo() {
    const {setFormikData, formikData, isLoading, setIsLoading, isMockData, setIsFooterVisible, setFooterContent} = useApp();
    const [isFetching, setIsFetching] = useState(true);
    const [additionInfoData, setAdditionInfoData] = useState(null);
    const {t} = useTranslation('login');
    const navigate = useNavigate();

    const email = formikData?.email;
    const password = formikData?.password;
    const confirmPassword = formikData?.confirmPassword;
    const selectedOrgId = formikData?.selectedOrgId;
    const spGuideId = formikData?.spGuideId;
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                {t('additionalInfo.button.continue')}
            </Button>
        </PaddingBlock>);
    }, [isFetching, isLoading]);

    const initialValues = {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        selectedOrgId: selectedOrgId,
        spGuideId: spGuideId,

        firstName: '',
        lastName: '',
        streetAddress: '',
        phoneNumber: '',
        dateOfBirthString: '',
        DateOfBirth: null, //(IV) uppercase first
        membershipNumber: '',
        gender: '',
        city: '',
        state: '',
        zipCode: ''
    };
    
    useEffect(() => {
        if (isNullOrEmpty(email) ||
            isNullOrEmpty(password) ||
            isNullOrEmpty(confirmPassword) ||
            isNullOrEmpty(selectedOrgId)){
            navigate(AuthRouteNames.LOGIN_GET_STARTED);
        }
    }, []);

    const getValidationSchema = (signupForm) => {
        let schemaFields = {
            email: Yup.string().required(t(`getStarted.form.emailRequired`)),
            password: Yup.string().required(t(`createAccount.form.passwordRequired`))
                .min(6, t(`createAccount.form.passwordMinLength`)),
            confirmPassword: Yup.string().required(t(`createAccount.form.confirmPasswordRequired`))
                .oneOf([Yup.ref('password'), null], t(`createAccount.form.passwordMatch`)),
            selectedOrgId:  Yup.string().required('Organization is required.')
        };

        if (signupForm) {
            if (signupForm.IncludeAddressBlock && signupForm.IsAddressBlockRequired) {
                schemaFields.streetAddress = Yup.string().required(t(`additionalInfo.form.streetAddressRequired`));
                schemaFields.city = Yup.string().requiredt(t(`additionalInfo.form.cityRequired`));
                schemaFields.state = Yup.string().required(isCanadaCulture(signupForm.UiCulture) ? 'Province is required.' : 'State is required.');
                schemaFields.zipCode = Yup.string().required(isNonUsCulture(signupForm.UiCulture) ? 'Postal Code is required.' : 'Zip Code is required.');
            }
            if (signupForm.IncludePhoneNumberBlock && signupForm.IsPhoneNumberRequired) {
                schemaFields.phoneNumber = Yup.string().required('Phone Number is required.');
            }
            if (signupForm.IncludeDateOfBirthBlock && signupForm.IsDateOfBirthRequired) {
                schemaFields.dateOfBirthString = Yup.string().required('Date of Birth is required.');
            }
            if (signupForm.IncludeMembershipNumber && signupForm.IsMembershipNumberRequired) {
                schemaFields.membershipNumber = Yup.string().required('Membership Number is required.');
            }
            if (signupForm.IncludeGender && signupForm.IsGenderRequired) {
                schemaFields.gender = Yup.string().required('Gender is required.');
            }

            // Add validation for rating categories
            if (signupForm.RatingCategories) {
                signupForm.RatingCategories.forEach(category => {
                    if (category.IsRequired) {
                        if (category.AllowMultipleRatingValues) {
                            schemaFields[`rat_${category.Id}`] = Yup.array().min(1, `${category.Name} is required.`).required(`${category.Name} is required.`)
                        } else {
                            schemaFields[`rat_${category.Id}`] = Yup.string().required(`${category.Name} is required.`);
                        }
                    }
                });
            }

            if (signupForm.UserDefinedFields) {
                signupForm.UserDefinedFields.forEach(udf => {
                    if (udf.IsRequired) {
                        schemaFields[`udf_${udf.Id}`] = Yup.string().required(`${udf.Label} is required.`);
                    }
                });
            }
        }

        return Yup.object(schemaFields);
    };
    
    const validationSchema = Yup.object({

    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
           
        },
    });

    const loadData = async () => {
        setIsFetching(true);
        setIsLoading(true);
        
        const response = await apiService.get(`create-account/signup-form?orgId=${nullToEmpty(formik?.values?.selectedOrgId)}&spGuideId=${formik?.values?.spGuideId}`);
        if (toBoolean(response?.IsValid)){
            const data = response.Data;
            setAdditionInfoData(data);

        }

        setIsFetching(false);
        setIsLoading(false);
    }
    
    return (
        <>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={16}>
                        {emptyArray(15).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block style={{height: `${token.Input.controlHeight}px`}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <PaddingBlock topBottom={true}>

                    <PageForm
                        formik={formik}>
                        <FormInput label={t(`additionalInfo.form.firstName`)}
                                   form={formik}
                                   name='firstName'
                                   placeholder={t(`additionalInfo.form.firstNamePlaceholder`)}
                                   required='true'
                        />
                        <FormInput label={t(`additionalInfo.form.lastName`)}
                                   form={formik}
                                   name='lastName'
                                   placeholder={t(`additionalInfo.form.lastNamePlaceholder`)}
                                   required='true'
                        />

                       
                    </PageForm>
                </PaddingBlock>
            }
        </>
    )
}

export default LoginAdditionalInfo
