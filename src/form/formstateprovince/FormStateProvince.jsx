import React from 'react';
import {toBoolean} from "../../utils/Utils.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {isCanadaCulture} from "../../utils/OrganizationUtils.jsx";
import FormInput from "../input/FormInput.jsx";
import {cx} from "antd-style";
import {Skeleton} from "antd";
import {useApp} from "../../context/AppProvider.jsx";

const FormStateProvince = ({
                               form,
                               dropdown,
                               name,
                               required,
                               loading
                           }) => {
    
    const {globalStyles} = useApp();
    const isCanada = isCanadaCulture();
    
    if (toBoolean(loading)) {
        return (
            <div className={cx(globalStyles.formBlock)}>
                <Skeleton.Input block active={true} className={cx(globalStyles.skeletonLabel)}/>
                <Skeleton.Input block active={true} className={cx(globalStyles.skeletonInput)}/>
            </div>
        )
    }

    if (toBoolean(dropdown)) {
        const states = [];
        const canadianStates = [];

        return (
            <FormSelect
                form={form}
                name={name}
                label={isCanada ? 'Province' : 'State'}
                options={isCanada ? canadianStates : states}
                required={required}
                placeholder={isCanada ? 'Province' : ''}
            />
        )
    }

    return (
        <FormInput label={isCanada ? 'Province' : 'State'}
                   form={form}
                   name={name}
                   placeholder={isCanada ? 'Province' : 'State'}
                   required={required}
        />
    );
};

export default FormStateProvince;