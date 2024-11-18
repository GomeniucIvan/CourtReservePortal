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

function LoginReview() {
    const {formikData, setFormikData, setIsLoading, setIsFooterVisible, setFooterContent} = useApp();
    const { t } = useTranslation('login');
    const navigate = useNavigate();
    
    useEffect(() => {
        setIsFooterVisible(false);
        setFooterContent('');
    }, []);


    return (
        <>
            <PaddingBlock topBottom={true}>
              
            </PaddingBlock>
        </>
    )
}

export default LoginReview
