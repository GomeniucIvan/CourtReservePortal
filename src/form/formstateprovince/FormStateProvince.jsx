import React from 'react';
import {toBoolean} from "../../utils/Utils.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {isCanadaCulture} from "../../utils/OrganizationUtils.jsx";
import FormInput from "../input/FormInput.jsx";
import {useTranslation} from "react-i18next";
import {canadianProvincesList, usaStateList} from "../../utils/SelectUtils.jsx";

const FormStateProvince = ({
                               formik,
                               dropdown,
                               name,
                               required,
                               loading,
                               uiCulture,
                           }) => {

    const isCanada = isCanadaCulture(uiCulture);
    const {t} = useTranslation('');

    if (toBoolean(dropdown)) {
        return (
            <FormSelect
                formik={formik}
                name={name}
                fetching={loading}
                label={isCanada ? t('province') : t('state')}
                options={isCanada ? canadianProvincesList : usaStateList}
                required={required}
            />
        )
    }

    return (
        <FormInput label={isCanada ? t('province') : t('state')}
                   formik={formik}
                   name={name}
                   loading={loading}
                   required={required}
        />
    );
};

export default FormStateProvince;