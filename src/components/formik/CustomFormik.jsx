import { useFormik } from 'formik';
import { useEffect } from 'react';
import {logFormikErrors} from "../../utils/ConsoleUtils.jsx";

const useCustomFormik = (config) => {
    const formik = useFormik(config);

    useEffect(() => {
        if (
            formik.isSubmitting &&
            Object.keys(formik.errors).length > 0 &&
            formik.submitCount > 0
        ) {

            logFormikErrors();
            console.log(formik.errors);
            
            const errorElement = document.querySelector('.ant-input-status-error');
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [formik.errors, formik.isSubmitting, formik.submitCount]);

    return formik;
};

export default useCustomFormik;