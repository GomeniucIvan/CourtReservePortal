import {equalString, toBoolean} from "../utils/Utils.jsx";
import {useRef, useState} from "react";
import {Form, Input, Typography} from "antd";
const { Paragraph } = Typography;

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
                       ...props }) => {

    let field = '';
    let meta = null;
    const isRequired = toBoolean(required);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputRef = useRef(null);

    if (form && typeof form.getFieldProps === 'function') {
        field = form.getFieldProps(name);
        meta = form.getFieldMeta(name);

        if (field.value === null) {
            field = { ...field, value: '' };
        }
    }
    
    let hasError = meta && meta.error && meta.touched;
    const addIconToSeePassowd = equalString(name, 'password');
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

    return (
        <div>
            <label htmlFor={name}>{label}</label>
            
            <Input
                {...props}
                {...field}
                onInput={handleInputChange}
                readOnly={disabled}
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
                <div className='form-invalid'>{meta.error}</div>
            ) : null}
        </div>
    )
};

export default FormInput;