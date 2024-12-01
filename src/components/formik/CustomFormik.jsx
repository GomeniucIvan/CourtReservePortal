import {useEffect} from "react";
import {useFormik} from "formik";
import {logFormikErrors} from "../../utils/ConsoleUtils.jsx";

const useCustomFormik = (config) => {
    const { validation, validationSchema, ...formikConfig } = config;

    const formik = useFormik({
        ...formikConfig,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, actions) => {
            let allErrors = {};
            let isValidForm = true;

            try {
                await validationSchema.validate(values, { abortEarly: false });
            } catch (yupValidationErrors) {
                yupValidationErrors.inner.forEach((error) => {
                    allErrors[error.path] = error.message;
                });
            }
            
            if (Object.keys(allErrors).length > 0) {
                actions.setErrors(allErrors);
                actions.setSubmitting(false);
                isValidForm = false;
            }

            if (validation && typeof validation === "function") {
                const isValid = validation();
                if(!isValid) {
                    isValidForm = false;
                }
            }
            
            // Step 4: If no errors, proceed with submission
            if (isValidForm){
                if (formikConfig.onSubmit) {
                    formikConfig.onSubmit(values, actions);
                }
            } else {
                logFormikErrors();
                console.log(formik.errors);
                
                setTimeout(function(){
                    const errorElement = document.querySelector('.ant-input-status-error');
                    if (errorElement) {
                        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 50)
            }
        },
    });

    return formik;
};

export default useCustomFormik;