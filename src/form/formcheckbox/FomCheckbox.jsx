import {Checkbox, Flex, Typography} from "antd";
import React from "react";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {addCypressTag} from "@/utils/TestUtils.jsx";
import { cx } from 'antd-style';
const {Paragraph} = Typography;

const FormCheckbox = ({label, text, formik, name, description, descriptionClick}) => {
    const {
        globalStyles,
        token,
    } = useApp();

    let field = '';
    let meta = null;

    if (formik && typeof formik.getFieldProps === 'function') {
        field = formik.getFieldProps(name);
        meta = formik.getFieldMeta(name);
    }

    let hasError = meta && meta.error && meta.touched;

    const onDescriptionClick = () => {
        if (typeof descriptionClick == 'function'){
            descriptionClick();
        }
    }

    return (
        <>
            <Flex vertical={true}>
                {!isNullOrEmpty(label) &&
                    <>
                        <label className={globalStyles.globalLabel}>
                            {label}
                        </label>
                    </>
                }

                <Flex align={'center'}>
                    <Checkbox className={cx(globalStyles.checkboxWithLink, globalStyles.checkbox)}
                              {...addCypressTag(name)}
                              defaultChecked={toBoolean(field?.value)}
                              onChange={(e) => {formik.setFieldValue(name, e.target.checked)}}>
                        {text}
                    </Checkbox>
                    
                    {!isNullOrEmpty(description) &&
                        <>
                            {isNullOrEmpty(descriptionClick) ? (
                                <u>{description}</u>
                            ) : (
                                <>
                                    <u style={{color: token.colorLink}} onClick={onDescriptionClick}>{description}</u>
                                </>
                            )}
                        </>
                    }
                </Flex>
                {hasError && meta && typeof meta.error === 'string' ? (
                    <Paragraph className={cx(globalStyles.formError, 'ant-input-status-error')}>
                        {meta.error}
                    </Paragraph>
                ) : null}
            </Flex>
        </>
    )
};

export default FormCheckbox;