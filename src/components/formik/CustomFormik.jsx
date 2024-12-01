import {useEffect} from "react";
import {useFormik} from "formik";

const useCustomFormik = (config) => {
    const { additionalValidation, validationSchema, ...formikConfig } = config;

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
                console.log("Validation failed:", allErrors);
                isValidForm = false;
            }

            if (additionalValidation && typeof additionalValidation === "function") {
                const isValid = additionalValidation();
                if(!isValid){
                    isValidForm = false;
                }
            }
            
            // Step 4: If no errors, proceed with submission
            if (isValidForm){
                if (formikConfig.onSubmit) {
                    formikConfig.onSubmit(values, actions);
                }
            } else{
                setTimeout(function(){
                    const errorElement = document.querySelector('.ant-input-status-error');
                    if (errorElement) {
                        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 50)
            }
        },
    });

    useEffect(() => {
        if (
            formik.isSubmitting &&
            Object.keys(formik.errors).length > 0 &&
            formik.submitCount > 0
        ) {

        }
    }, [formik.errors, formik.isSubmitting, formik.submitCount]);

    return formik;
};

export default useCustomFormik;