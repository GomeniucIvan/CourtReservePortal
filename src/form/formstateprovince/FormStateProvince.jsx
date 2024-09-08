import React from 'react';
import {toBoolean} from "../../utils/Utils.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {isCanadaCulture} from "../../utils/OrganizationUtils.jsx";
import FormInput from "../input/FormInput.jsx";
import {cx} from "antd-style";
import {Skeleton} from "antd";
import {useApp} from "../../context/AppProvider.jsx";
import {useTranslation} from "react-i18next";
import {canadianProvincesList, usaStateList} from "../../utils/SelectUtils.jsx";

const FormStateProvince = ({
                               form,
                               dropdown,
                               name,
                               required,
                               loading
                           }) => {
    
    const {globalStyles} = useApp();
    const isCanada = isCanadaCulture();
    const {t} = useTranslation('');
    
    if (toBoolean(loading)) {
        return (
            <div className={cx(globalStyles.formBlock)}>
                <Skeleton.Input block active={true} className={cx(globalStyles.skeletonLabel)}/>
                <Skeleton.Input block active={true} className={cx(globalStyles.skeletonInput)}/>
            </div>
        )
    }
    
    if (toBoolean(dropdown)) {
        return (
            <FormSelect
                form={form}
                name={name}
                fetching={loading}
                label={isCanada ? t('province') : t('state')}
                options={isCanada ? canadianProvincesList : usaStateList}
                required={required}
                placeholder={isCanada ? t('province') : ''}
            />
        )
    }

    return (
        <FormInput label={isCanada ? t('province') : t('state')}
                   form={form}
                   name={name}
                   loading={loading}
                   placeholder={isCanada ? t('province') : t('state')}
                   required={required}
        />
    );
};

export default FormStateProvince;