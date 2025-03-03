import {Radio, Skeleton, Typography} from 'antd';
import {anyInList, calculateSkeletonLabelWidth, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import FormInput from "../input/FormInput.jsx";
import FormTextArea from "../formtextarea/FormTextArea.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {cx} from "antd-style";
import {useApp} from "../../context/AppProvider.jsx";
import React from "react";
const {Title} = Typography;

const FormCustomFields = ({ customFields, formik, loading, index, name }) => {
    const { globalStyles, token } = useApp();

    if (isNullOrEmpty(customFields) || !anyInList(customFields)) {
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

    return (
        <>
            {anyInList(customFields) &&
                <>
                    {customFields.map(({ UdfType, FieldType, Label, Id, IsRequired, Options }, udfIndex) => {
                        const fieldName = name
                            .replace('{index}', index)
                            .replace('{udfIndex}', udfIndex);

                        const type = UdfType || FieldType;

                        switch (type) {
                            case 'Textbox':
                                return (
                                    <FormInput
                                        key={fieldName}
                                        label={Label}
                                        name={fieldName}
                                        loading={loading}
                                        //placeholder={Label}
                                        required={IsRequired}
                                        formik={formik}
                                    />
                                );

                            case 'TextArea':
                                return (
                                    <div style={{paddingBottom: `${token.paddingSM}px`}}>
                                        <FormTextArea
                                            key={fieldName}
                                            label={Label}
                                            name={fieldName}
                                            loading={loading}
                                            max={250}
                                            //placeholder={Label}
                                            required={IsRequired}
                                            formik={formik}
                                        />
                                    </div>
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
                                        propText='Text'
                                        propValue='Value'
                                        fetching={loading}
                                        required={IsRequired}
                                        formik={formik}
                                    />
                                );
                        }
                    })}
                </>
            }
        </>
    );
};


export default FormCustomFields;