import { useFormik } from "formik";
import { useEffect } from "react";
import { logFormikErrors } from "../../utils/ConsoleUtils.jsx";

const useCustomFormik = (config) => {
    const { validationSchema, ...restConfig } = config;

    const validate = validationSchema
        ? (values) => {
            try {
                validationSchema.parse(values); // Zod validation
                return {}; // No errors
            } catch (err) {
                return err.errors.reduce((acc, error) => {
                    acc[error.path.join(".")] = error.message;
                    return acc;
                }, {});
            }
        }
        : undefined;

    const formik = useFormik({ ...restConfig, validate });

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