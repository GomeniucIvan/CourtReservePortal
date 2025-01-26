import {useFormik} from "formik";
import {logFormikErrors} from "../../utils/ConsoleUtils.jsx";
import {useEffect, useRef} from "react";
import {isNullOrEmpty} from "@/utils/Utils.jsx";

const useCustomFormik = (config) => {
    const { validation, validationSchema, ...formikConfig } = config;
    const isSettingFieldValue = useRef(false);
    
    const formik = useFormik({
        ...formikConfig,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async (values, actions) => {
            let allErrors = {};
            let isValidForm = true;

            // Check if validationSchema and validate function exist
            if (validationSchema && typeof validationSchema.validate === "function") {
                try {
                    await validationSchema.validate(values, { abortEarly: false });
                } catch (yupValidationErrors) {
                    // Process Yup validation errors
                    yupValidationErrors.inner.forEach((error) => {
                        allErrors[error.path] = error.message;
                    });
                    isValidForm = false;
                }
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

    useEffect(() => {
        if (isSettingFieldValue.current) {
            isSettingFieldValue.current = false; // Reset the flag
            return;
        }
        
        // Loop through all fields with errors and revalidate them when values change
        Object.keys(formik.errors).forEach((field) => {
            if (formik.touched[field]) {
                const currentValue = formik.values[field];

                // Combine Yup and custom validation for the field
                const combinedValidateField = async () => {
                    let fieldError = null;

                    // Check if field exists in the validation schema
                    if (validationSchema) {
                        const schemaDescription = validationSchema.describe();
                        const isFieldInSchema = schemaDescription.fields[field] !== undefined;

                        if (isFieldInSchema && typeof validationSchema.validateAt === "function") {
                            try {
                                await validationSchema.validateAt(field, formik.values);
                            } catch (yupError) {
                                fieldError = yupError.message;
                            }
                        }
                    }

                    // Run custom validation if provided
                    if (validation && typeof validation === "function") {
                        const customFieldErrors = validation({ [field]: currentValue });
                        if (customFieldErrors && customFieldErrors[field]) {
                            fieldError = customFieldErrors[field];
                        }
                    }

                    if (isNullOrEmpty(fieldError)) {
                        //should check if value is still empty
                        //double fire event
                        if (isNullOrEmpty(formik.values[field])) {
                            fieldError = formik.errors[field];
                        }
                    }
                    
                    if (fieldError !== formik.errors[field]) {
                        isSettingFieldValue.current = true; // Prevent loop
                        formik.setFieldError(field, fieldError || ''); // Update or clear error
                    }
                };

                combinedValidateField();
            }
        });
    }, [formik.values]);
    
    return { ...formik };
};



export default useCustomFormik;