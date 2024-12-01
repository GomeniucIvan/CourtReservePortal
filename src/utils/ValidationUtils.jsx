import { anyInList, toBoolean } from "./Utils.jsx";

export const validateUdfs = (formik) => {
    let formikUdfs = formik?.values?.Udfs;

    if (!anyInList(formikUdfs)) {
        return true;
    }

    let isValid = true;

    for (let i = 0; i < formikUdfs.length; i++) {
        let currentUdf = formikUdfs[i];

        if (toBoolean(currentUdf?.IsRequired) && !currentUdf?.Value?.trim()) {
            let fieldName = `Udfs[${i}].Value`;

            formik.setFieldError(fieldName, `${currentUdf.Label} is required.`);
            formik.setFieldTouched(fieldName, true, false);

            isValid = false; 
        }
    }

    return isValid;
};