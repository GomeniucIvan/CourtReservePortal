import {Checkbox, Flex, Typography} from "antd";
import React from "react";
import {isNullOrEmpty} from "../../utils/Utils.jsx";
import {useApp} from "../../context/AppProvider.jsx";

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
                <label className={globalStyles.globalLabel}>
                    {label}
                </label>

                <Flex align={'center'}>
                    <Checkbox className={globalStyles.checkboxWithLink} onChange={(e) => {formik.setFieldValue(name, e.target.checked)}}>{text}</Checkbox>
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
                    <Paragraph
                        className={'ant-input-status-error'}
                        style={{color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart}}>
                        {meta.error}
                    </Paragraph>
                ) : null}
            </Flex>
        </>
    )
};

export default FormCheckbox;