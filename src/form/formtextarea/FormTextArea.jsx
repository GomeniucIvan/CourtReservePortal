import {Input, Typography} from 'antd';
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {addCypressTag} from "@/utils/TestUtils.jsx";
const { TextArea } = Input;
const { Paragraph } = Typography;

const FormTextarea = ({ formik, name, rows = 3, max = null, placeholder = '',isRequired, label }) => {
    const {token, globalStyles} = useApp();
    
    const height = rows * token.Input.controlHeight;

    let field = '';
    let meta = null;

    if (formik && typeof formik.getFieldProps === 'function') {
        field = formik.getFieldProps(name);
        meta = formik.getFieldMeta(name);

        if (field.value === null) {
            field = { ...field, value: '' };
        }
    }
    let hasError = meta && meta.error && meta.touched;
    
    const onChange = (e) => {
        formik.setFieldValue(name, e.target.value);
    }
    
    return (
        <div className={cx(globalStyles.formBlock)}>
            <label htmlFor={name} className={globalStyles.globalLabel}>
                {label}
                {isRequired &&
                    <span style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
            </label>
            <TextArea
                {...field}
                {...addCypressTag(name)}
                showCount={(isNullOrEmpty(max) || max === 0) ? false : true}
                maxLength={(isNullOrEmpty(max) || max === 0) ? undefined : max}
                onChange={onChange}
                onBlur={() => formik.setFieldTouched(name, true)}
                placeholder={placeholder}
                status={toBoolean(hasError) ? 'error' : ''}
                style={{height: height, resize: 'none'}}
            />

            {hasError && meta && typeof meta.error === 'string' ? (
                <Paragraph {...addCypressTag(`error-${name}`)} className={cx(globalStyles.formError, 'ant-input-status-error')}>
                    {meta.error}
                </Paragraph>
            ) : (
                formik.status && formik.status[name] && (
                    <Paragraph {...addCypressTag(`error-${name}`)} className={cx(globalStyles.formError, 'ant-input-status-error')}>
                        {formik.status[name]}
                    </Paragraph>
                )
            )}
        </div>
    )
};

export default FormTextarea;