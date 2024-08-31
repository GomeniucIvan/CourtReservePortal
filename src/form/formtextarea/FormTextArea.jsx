import {Input, Typography} from 'antd';
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {toBoolean} from "../../utils/Utils.jsx";
const { TextArea } = Input;
const { Paragraph } = Typography;

const FormTextarea = ({ form, name, rows = 3, max = null, placeholder = '',isRequired, label }) => {
    const {token, globalStyles} = useApp();
    
    const height = rows * token.Input.controlHeight;

    let field = '';
    let meta = null;

    if (form && typeof form.getFieldProps === 'function') {
        field = form.getFieldProps(name);
        meta = form.getFieldMeta(name);

        if (field.value === null) {
            field = { ...field, value: '' };
        }
    }
    let hasError = meta && meta.error && meta.touched;
    
    const onChange = (e) => {
        form.setFieldValue(name, e.target.value);
    }
    
    return (
        <div className={cx(globalStyles.formBlock)}>
            <label htmlFor={name}
                   style={{
                       fontSize: token.Form.labelFontSize,
                       padding: token.Form.verticalLabelPadding,
                       marginLeft: token.Form.labelColonMarginInlineStart,
                       color: token.colorText,
                       display: 'block'
                   }}>
                {label}
                {isRequired &&
                    <span style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
            </label>
            <TextArea
                {...field}
                showCount
                maxLength={max}
                onChange={onChange}
                onBlur={() => form.setFieldTouched(name, true)}
                placeholder={placeholder}
                status={toBoolean(hasError) ? 'error' : ''}
                style={{height: height, resize: 'none'}}
            />

            {hasError && meta && typeof meta.error === 'string' ? (
                <Paragraph style={{ color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart }}>
                    {meta.error}
                </Paragraph>
            ) : (
                form.status && form.status[name] && (
                    <Paragraph style={{ color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart }}>
                        {form.status[name]}
                    </Paragraph>
                )
            )}
        </div>
    )
};

export default FormTextarea;