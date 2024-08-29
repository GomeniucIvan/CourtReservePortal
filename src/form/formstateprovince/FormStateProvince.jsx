import React from 'react';
import {toBoolean} from "../../utils/Utils.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {isCanadaCulture} from "../../utils/OrganizationUtils.jsx";
import FormInput from "../input/FormInput.jsx";

const FormStateProvince = ({
                               form,
                               dropdown,
                               name,
                               required
                           }) => {

    const isCanada = isCanadaCulture();

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