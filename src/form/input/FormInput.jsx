import {useRef, useState} from "react";
import {Input, Skeleton, Typography} from "antd";
const { Paragraph } = Typography;
import {equalString, toBoolean} from "../../utils/Utils.jsx";
import {useStyles} from "./styles.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";

const FormInput = ({ label,
                       form,
                       name,
                       isSearch,
                       required,
                       onInput,
                       value,
                       disabled,
                       noBottomPadding,
                       addIconToSeePassword,
                       displayPassword,
                       onlyDigits,
                       style,
                       disableAutoCapitalize,
                       isExpiryDate,
                       className,
                        loading,
                       ...props }) => {
    const { token, globalStyles } = useApp();
    
    let field = '';
    let meta = null;
    const isRequired = toBoolean(required);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const {styles} = useStyles();
    
    const inputRef = useRef(null);

    if (form && typeof form.getFieldProps === 'function') {
        field = form.getFieldProps(name);
        meta = form.getFieldMeta(name);

        if (field.value === null) {
            field = { ...field, value: '' };
        }
    }

    let hasError = meta && meta.error && meta.touched;
    
    addIconToSeePassword = addIconToSeePassword || equalString(name, 'password');
    const handleInputChange = (event) => {
        let { value } = event.target;

        if (onlyDigits) {
            value = value.replace(/[^\d]/g, '');

            if (props.maxLength && value.length > props.maxLength) {
                value = value.slice(0, props.maxLength);
            }

            if (inputRef.current) {
                inputRef.current.value = value;
            }
        }

        if (typeof onInput === 'function') {
            onInput(event);
        }
    };

    const handeInputFocus = () => {
        setIsFocused(true);
    };

    const handleInputBlur = (e) => {
        setIsFocused(false);
        form.handleBlur(e);
    }

    if (toBoolean(loading)){
        return (
           <div className={cx(globalStyles.formBlock) }>
               <Skeleton.Input block active={true} className={cx(globalStyles.skeletonLabel) }/>
               <Skeleton.Input block active={true} className={cx(globalStyles.skeletonInput) }/>
           </div>
        )
    }
    
    return (
        <div className={cx(globalStyles.formBlock, className, styles.input) }>
            <label htmlFor={name}
                   style={{
                       fontSize: token.Form.labelFontSize,
                       padding: token.Form.verticalLabelPadding,
                       marginLeft: token.Form.labelColonMarginInlineStart,
                       display: 'block'
                   }}>
                {label}
                {isRequired && <span style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
            </label>
            
            <Input
                {...props}
                {...field}
                onInput={handleInputChange}
                disabled={disabled}
                onFocus={handeInputFocus}
                onBlur={handleInputBlur}
                name={name}
                autoCapitalize={toBoolean(disableAutoCapitalize) || equalString(props.type, 'password') ? "off" : "words"}
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                ref={inputRef}
                status={toBoolean(hasError) ? 'error' : ''}
                type={((addIconToSeePassword && !showPassword) || (!showPassword && equalString(props.type, 'password'))) ? 'password' : (toBoolean(onlyDigits) && !toBoolean(isExpiryDate) ? 'number' : 'text')}
                className={`form-control ${hasError ? 'is-invalid' : ''} ${disabled ? 'd-none' : ''} ${toBoolean(isExpiryDate) ? 'fn-card-date-mask' : ''}  ${isFocused ? 'item-focus' : ''}`}/>

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

export default FormInput;