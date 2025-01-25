import React, {useEffect, useRef, useState} from "react";
import {Input, Skeleton, Typography} from "antd";
const { Paragraph } = Typography;
import {calculateSkeletonLabelWidth, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useStyles} from "./styles.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {useTranslation} from "react-i18next";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import SVG from "@/components/svg/SVG.jsx";
import {addCypressTag} from "@/utils/TestUtils.jsx";

const FormInput = ({ label,
                       formik,
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
    const [showErrorIcon, setShowErrorIcon] = useState(false);
    const {styles} = useStyles();

    const inputRef = useRef(null);
    const timeoutRef = useRef(null);
    const {t} = useTranslation('');

    if (formik && typeof formik.getFieldProps === 'function') {
        field = formik.getFieldProps(name);
        meta = formik.getFieldMeta(name);

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

        if (equalString(name, 'phoneNumber')) {
            handlePhoneNumberInputChange(event);
        } else {
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

                if (formik) {
                    formik.setFieldValue(name, value, false);
                }
            }, onInputTimeout);
        }
    };

    const handlePhoneNumberInputChange = (event) => {
        let { value } = event.target;
        const valueOrig = value;
        value = value.replace(/[^0-9\+\-\(\)\s]/g, '');
        const plusCount = (value.match(/\+/g) || []).length;
        if (plusCount > 1) {
            value = value.replace(/\+/g, (match, offset) => {
                return offset === value.indexOf('+') ? match : '';
            });
        }
        const openBracketCount = (value.match(/\(/g) || []).length;
        if (openBracketCount > 1) {
            value = value.replace(/\(/g, (match, offset) => {
                return offset === value.indexOf('(') ? match : '';
            });
        }
        const closeBracketCount = (value.match(/\)/g) || []).length;
        if (closeBracketCount > 1) {
            value = value.replace(/\)/g, (match, offset) => {
                return offset === value.indexOf(')') ? match : '';
            });
        }
        if (/--+/g.test(value)) {
            value = value.replace(/-+/g, '-');
        }
        const invalidSequence = plusCount > 1 || openBracketCount > 1 || closeBracketCount > 1 || /--+/g.test(valueOrig);
        if (/[^\d\+\-\(\)\s]/.test(valueOrig) || invalidSequence) {
            setShowErrorIcon(true);
            setTimeout(() => {
                setShowErrorIcon(false);
            }, 100);
        } else {
            setShowErrorIcon(false);
        }
        event.target.value = value;
        if (typeof onInput === 'function') {
            onInput(event);
        }

        if (formik) {
            formik.setFieldValue(name, value, false);
        }
    };
    
    const handeInputFocus = () => {
        setIsFocused(true);
    };

    const handleInputBlur = (e) => {
        setIsFocused(false);
        if (formik){
            formik.handleBlur(e);
        }
    }

    return (
        <div className={cx(globalStyles.formBlock, className, styles.inputWrap)}>
            <label htmlFor={name} className={globalStyles.globalLabel}>
                {label}
                {isRequired &&
                    <span style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
            </label>
            <div className={cx(disabled && styles.disabledInput)}>
                {disabled &&
                    <div className={cx(disabled && styles.disabledFakeInput)}>
                        
                    </div>
                }
                {toBoolean(addIconToSeePassword) ?
                    (<Input.Password
                            {...props}
                            {...field}
                            {...addCypressTag(name)}
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
                            className={cx(`form-control`, isFocused && 'item-focus', styles.input)}/>
                    ) :
                    (<Input
                            {...props}
                            {...field}
                            {...addCypressTag(name)}
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
                            suffix={equalString(name, 'phoneNumber') ? <div style={{opacity: (showErrorIcon ? 1 : 0)}}><SVG size={18} preventFill={true} icon={'alert-triangle'} /></div> : undefined}
                            placeholder={isNullOrEmpty(placeholder) ? t('common:inputPlaceholder', {label: label}) : placeholder}
                            status={toBoolean(hasError) ? 'error' : ''}
                            type={((addIconToSeePassword && !showPassword) || (!showPassword && equalString(props.type, 'password'))) ? 'password' : (toBoolean(onlyDigits) && !toBoolean(isExpiryDate) ? 'number' : 'text')}
                            className={cx(`form-control`, isFocused && 'item-focus', styles.input)}/>
                    )}
            </div>

            {hasError && meta && typeof meta.error === 'string' ? (
                <Paragraph style={{color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart}}>
                    {meta.error}
                </Paragraph>
            ) : (
                formik && formik.status && formik.status[name] && (
                    <Paragraph
                        style={{color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart}}>
                        {formik.status[name]}
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