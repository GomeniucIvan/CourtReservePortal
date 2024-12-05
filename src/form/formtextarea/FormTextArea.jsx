import {Input, Typography} from 'antd';
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {toBoolean} from "../../utils/Utils.jsx";
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
                showCount
                maxLength={max}
                onChange={onChange}
                onBlur={() => formik.setFieldTouched(name, true)}
                placeholder={placeholder}
                status={toBoolean(hasError) ? 'error' : ''}
                style={{height: height, resize: 'none'}}
            />

            {hasError && meta && typeof meta.error === 'string' ? (
                <Paragraph style={{color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart}}>
                    {meta.error}
                </Paragraph>
            ) : (
                formik.status && formik.status[name] && (
                    <Paragraph
                        style={{color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart}}>
                        {formik.status[name]}
                    </Paragraph>
                )
            )}
        </div>
    )
};

export default FormTextarea;