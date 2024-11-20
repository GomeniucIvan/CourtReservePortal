import React, {useRef, useState} from "react";
import {Input, Skeleton, Typography} from "antd";
const { Paragraph } = Typography;
import {calculateSkeletonLabelWidth, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useStyles} from "./styles.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {useTranslation} from "react-i18next";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";

const FormInput = ({ label,
                       form,
                       name,
                       isSearch,
                       required,
                       onInputTimeout = 10,
                       onInput,
                       value,
                       disabled,
                       noBottomPadding,
                       addIconToSeePassword,
                       displayPassword,
                       onlyDigits,
                       style,
                       mask,
                       disableAutoCapitalize,
                       className,
                       loading,
                       isExpiryDate,
                        placeholder,
                        description,
                       ...props }) => {
    const { token, globalStyles } = useApp();
    
    let field = '';
    let meta = null;
    const isRequired = toBoolean(required);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const {styles} = useStyles();
    
    const inputRef = useRef(null);
    const timeoutRef = useRef(null);
    const {t} = useTranslation('');
    
    if (form && typeof form.getFieldProps === 'function') {
        field = form.getFieldProps(name);
        meta = form.getFieldMeta(name);

        if (field.value === null) {
            field = { ...field, value: '' };
        }
    }

    let hasError = meta && meta.error && meta.touched;
    
    addIconToSeePassword = addIconToSeePassword || equalString(name, 'password');

    const applyMask = (value, pattern) => {
        if (!pattern) return value;

        
        const cleanValue = value.replace(/\D+/g, '');
        let maskedValue = '';
        let maskIndex = 0, valueIndex = 0;

        while (valueIndex < cleanValue.length) {
            if (maskIndex >= pattern.length) break; 

            const currentMaskChar = pattern[maskIndex];
            const currentValueChar = cleanValue[valueIndex];

            if (currentMaskChar === "X") {
                maskedValue += currentValueChar;
                valueIndex++; 
            } else {
                maskedValue += currentMaskChar; 
                if (cleanValue.length > valueIndex) {
                    maskIndex++;
                    continue;
                }
            }

            maskIndex++;
        }

        return maskedValue;
    };
    
    
    const handleInputChange = (event) => {
        let { value } = event.target;

        value = applyMask(value, mask);

        if (!isNullOrEmpty(mask)){
            if (inputRef.current) {
                inputRef.current.value = value;
            }
        }
        else if (onlyDigits) {
            value = value.replace(/[^\d]/g, '');

            if (props.maxLength && value.length > props.maxLength) {
                value = value.slice(0, props.maxLength);
            }

            if (inputRef.current) {
                inputRef.current.value = value;
            }
        }
        
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (typeof onInput === 'function') {
                onInput(event.target.value);
            }

            if (form) {
                form.setFieldValue(name, value, false);
            }
        }, onInputTimeout);
    };

    const handeInputFocus = () => {
        setIsFocused(true);
    };

    const handleInputBlur = (e) => {
        setIsFocused(false);
        if (form){
            form.handleBlur(e); 
        }
    }

    
    if (toBoolean(loading)){
        return (
           <div className={cx(globalStyles.formBlock) }>
               <Skeleton.Input block
                               active={true}
                               className={cx(globalStyles.skeletonLabel)}
                               style={{
                                   width: `${calculateSkeletonLabelWidth(label)}`,
                                   minWidth: `${calculateSkeletonLabelWidth(label)}`
                               }}/>
               <Skeleton.Input block active={true} className={cx(globalStyles.skeletonInput) }/>
           </div>
        )
    }
    
    return (
        <div className={cx(globalStyles.formBlock, className, styles.input)}>
            <label htmlFor={name} className={globalStyles.globalLabel}>
                {label}
                {isRequired &&
                    <span style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
            </label>
            {toBoolean(addIconToSeePassword) ? 
                (<Input.Password
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
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        placeholder={isNullOrEmpty(placeholder) ? t('common:inputPlaceholder', {label: label}) : placeholder}
                        status={toBoolean(hasError) ? 'error' : ''}
                        type={((addIconToSeePassword && !showPassword) || (!showPassword && equalString(props.type, 'password'))) ? 'password' : (toBoolean(onlyDigits) && !toBoolean(isExpiryDate) ? 'number' : 'text')}
                        className={`form-control ${isFocused ? 'item-focus' : ''}`}/>
                ) :
                (<Input
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
                        placeholder={isNullOrEmpty(placeholder) ? t('common:inputPlaceholder', {label: label}) : placeholder}
                        status={toBoolean(hasError) ? 'error' : ''}
                        type={((addIconToSeePassword && !showPassword) || (!showPassword && equalString(props.type, 'password'))) ? 'password' : (toBoolean(onlyDigits) && !toBoolean(isExpiryDate) ? 'number' : 'text')}
                        className={`form-control ${isFocused ? 'item-focus' : ''}`}/>
                )}
            
            {hasError && meta && typeof meta.error === 'string' ? (
                <Paragraph style={{color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart}}>
                    {meta.error}
                </Paragraph>
            ) : (
                form && form.status && form.status[name] && (
                    <Paragraph
                        style={{color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart}}>
                        {form.status[name]}
                    </Paragraph>
                )
            )}
            {!isNullOrEmpty(description) &&
                <Paragraph
                    style={{color: token.colorTextTertiary, marginLeft: token.Form.labelColonMarginInlineStart, fontSize: token.fontSizeSM, marginBottom: token.paddingXS}}>
                    {description}
                </Paragraph>
            }
        </div>
    )
};

export default FormInput;