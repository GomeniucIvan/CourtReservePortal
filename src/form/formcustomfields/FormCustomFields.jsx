import {Radio, Skeleton, Typography} from 'antd';
import {calculateSkeletonLabelWidth, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import FormInput from "../input/FormInput.jsx";
import FormTextArea from "../formtextarea/FormTextArea.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {cx} from "antd-style";
import {useApp} from "../../context/AppProvider.jsx";
import React from "react";
const {Title} = Typography;

const FormCustomFields = ({ customFields, form, keyPrefix, loading, index, name }) => {
    const {globalStyles} = useApp();
    
    if (isNullOrEmpty(customFields)) {
        return <></>;
    }

    if (toBoolean(loading)){
        return (
            <div className={cx(globalStyles.formBlock)}>
                <Skeleton.Input block
                                active={true}
                                className={cx(globalStyles.skeletonLabel)}
                                style={{
                                    width: `${calculateSkeletonLabelWidth()}`,
                                    minWidth: `${calculateSkeletonLabelWidth()}`
                                }}/>
                <Skeleton.Input block active={true} className={cx(globalStyles.skeletonInput) }/>
            </div>
        )
    }

    const onFieldChange = (Id, value) => {
        if (!isNullOrEmpty(index)){
            const fieldName = name
                .replace('{index}', index)
                .replace('{Id}', Id);
            
            form.setFieldValue(fieldName, value); 
        }
    };
    
    return customFields.map(({ UdfType, FieldType, Label, Id, IsRequired, Options }) => {
        const fieldName = name
            .replace('{index}', index)
            .replace('{Id}', Id);

        const type = UdfType || FieldType;
        
        console.log(fieldName)
        
        switch (type) {
            case 'Textbox':
                return (
                    <FormInput
                        key={Id}
                        label={Label}
                        name={fieldName}
                        loading={loading}
                        //placeholder={Label}
                        required={IsRequired}
                        form={form}
                        onInput={(e) => {
                            onFieldChange(Id, e.target.value)
                        }}
                    />
                );

            case 'TextArea':
                return (
                    <FormTextArea
                        key={Id}
                        label={Label}
                        name={fieldName}
                        loading={loading}
                        max={250}
                        //placeholder={Label}
                        required={IsRequired}
                        form={form}
                    />
                );

            case 'Dropdown':
                return (
                    <FormSelect
                        key={Id}
                        label={Label}
                        name={fieldName}
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