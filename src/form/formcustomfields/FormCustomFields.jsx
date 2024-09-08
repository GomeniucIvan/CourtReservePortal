import {Radio, Typography} from 'antd';
import {isNullOrEmpty} from "../../utils/Utils.jsx";
import FormInput from "../input/FormInput.jsx";
import FormTextArea from "../formtextarea/FormTextArea.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
const {Title} = Typography;

const FormCustomFields = ({ customFields, form, keyPrefix, loading }) => {
    if (isNullOrEmpty(customFields)) {
        return null;
    }

    return customFields.map(({ UdfType, FieldType, Label, Id, IsRequired, Options }) => {
        const name = isNullOrEmpty(keyPrefix) ? `udf_${Id}` : `${keyPrefix}.udf_${Id}`;
        const type = UdfType || FieldType;
        
        switch (type) {
            case 'Textbox':
                return (
                    <FormInput
                        key={Id}
                        label={Label}
                        name={name}
                        loading={loading}
                        placeholder={Label}
                        required={IsRequired}
                        form={form}
                    />
                );

            case 'TextArea':
                return (
                    <FormTextArea
                        key={Id}
                        label={Label}
                        name={name}
                        loading={loading}
                        placeholder={Label}
                        required={IsRequired}
                        form={form}
                    />
                );

            case 'Dropdown':
                return (
                    <FormSelect
                        key={Id}
                        label={Label}
                        name={name}
                        options={Options.map(udfVal => ({
                            Text: udfVal,
                            Value: udfVal
                        }))}
                        propText='Value'
                        propValue='Value'
                        fetching={loading}
                        required={IsRequired}
                        form={form}
                    />
                );
        }
    });
};


export default FormCustomFields;