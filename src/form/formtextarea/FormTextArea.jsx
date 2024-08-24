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
        console.log(e)
        form.setFieldValue(name, e.value);
    }
    
    return (
        <div className={cx(globalStyles.formBlock)}>
            <label htmlFor={name}
                   style={{
                       fontSize: token.Form.labelFontSize,
                       padding: token.Form.verticalLabelPadding,
                       marginLeft: token.Form.labelColonMarginInlineStart,
                       display: 'block'
                   }}>
                {label}
                {isRequired &&
                    <span style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
            </label>
            <TextArea
                showCount
                maxLength={max}
                onChange={onChange}
                placeholder={placeholder}
                status={toBoolean(hasError) ? 'error' : ''}
                style={{height: height, resize: 'none'}}
            />

            {hasError && meta && typeof meta.error === 'string' &&
                <Paragraph style={{ color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart }}>
                    {meta.error}
                </Paragraph>
            }
        </div>
    )
};

export default FormTextarea;