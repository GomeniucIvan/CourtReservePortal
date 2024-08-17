import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { bound } from "../../utils/Utils.jsx";
import {useStyles} from "./HtmlPasscodeInput.styles.jsx";
import { cx } from 'antd-style';

const classPrefix = 'ant-passcode-input';

const defaultProps = {
    defaultValue: '',
    length: 6,
    plain: true,
    error: false,
    seperated: false,
    caret: true,
    fontSize: 26
};

function mergeProps(defaultProps, props) {
    return { ...defaultProps, ...props };
}

function usePropsValue({ value, defaultValue, onChange }) {
    const [internalValue, setInternalValue] = useState(defaultValue);

    const isControlled = value !== undefined;

    const finalValue = isControlled ? value : internalValue;

    const setValue = (newValue) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        if (onChange) {
            onChange(newValue);
        }
    };

    useEffect(() => {
        if (isControlled && value !== internalValue) {
            setInternalValue(value);
        }
    }, [value]);

    return [finalValue, setValue];
}

const PasscodeInput = forwardRef((props, ref) => {
    const mergedProps = mergeProps(defaultProps, props);
    const cellLength = mergedProps.length > 0 && mergedProps.length < Infinity
        ? Math.floor(mergedProps.length)
        : defaultProps.length;
    
    const [focused, setFocused] = useState(false);
    const [value, setValue] = usePropsValue(mergedProps);
    const rootRef = useRef(null);
    const nativeInputRef = useRef(null);
    const { styles } = useStyles();

    let field = '';
    let meta = null;
    const { name, form } = props;
    
    if (form && typeof form.getFieldProps === 'function') {
        field = form.getFieldProps(name);
        meta = form.getFieldMeta(name);

        if (field.value === null) {
            field = { ...field, value: '' };
        }
    }

    let hasError = meta && meta.touched && focused === false && meta.error && Object.keys(meta.error).length > 0;
    
    useEffect(() => {
        if (value.length >= cellLength) {
            mergedProps.onFill?.(value);
        }
    }, [value, cellLength]);

    const onFocus = () => {
        if (!mergedProps.keyboard) {
            nativeInputRef.current?.focus();
        }
        setFocused(true);
        mergedProps.onFocus?.();
    };

    useEffect(() => {
        if (!focused) return;
        const timeout = window.setTimeout(() => {
            rootRef.current?.scrollIntoView({
                block: 'center',
                inline: 'center',
                behavior: 'smooth',
            });
        }, 100);
        return () => {
            window.clearTimeout(timeout);
        };
    }, [focused]);

    const onBlur = () => {
        setFocused(false);
        mergedProps.onBlur?.();
    };

    useImperativeHandle(ref, () => ({
        focus: () => rootRef.current?.focus(),
        blur: () => {
            rootRef.current?.blur();
            nativeInputRef.current?.blur();
        },
    }));

    const renderCells = () => {
        const cells = [];
        const chars = value.split('');
        const caretIndex = chars.length;
        const focusedIndex = bound(chars.length, 0, cellLength - 1);

        for (let i = 0; i < cellLength; i++) {
            const isEmpty = !chars[i];
            const cellErrorClass = isEmpty && hasError ? ' cell-error' : '';
            
            cells.push(
                <div
                    className={`cell` +
                        (mergedProps.caret && caretIndex === i && focused ? ` cell-caret` : '') +
                        (focusedIndex === i && focused ? ` cell-focused` : '') +
                        (cellErrorClass && !focused ? ` cell-error` : '') +
                        (chars[i] ? ` cell-dot` : '')
                    }
                    style={{fontSize: `${mergedProps.fontSize}px`}}
                    key={i}
                >
                    {chars[i] && mergedProps.plain ? chars[i] : ''}
                </div>
            );
        }
        return cells;
    };

    const allCellsFilled = value.length === cellLength;

    const cls = `${classPrefix}` +
        (focused ? ` -focused` : '') +
        (allCellsFilled && hasError ? ` -error` : '') + 
        (mergedProps.seperated ? ` -seperated` : '');

    return (
        <div className={cx(styles.root)}>
            <div
                ref={rootRef}
                tabIndex={0}
                className={cls}
                onFocus={onFocus}
                onBlur={onBlur}
                role="button"
                aria-label="passcode"
            >
                <div className={`cell-container`}>
                    {renderCells()}
                </div>
                <input
                    ref={nativeInputRef}
                    className={`native-input`}
                    value={value}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '');
                        setValue(digitsOnly.slice(0, mergedProps.length));
                        if (form && typeof form.setFieldValue === 'function') {
                            form.setFieldValue(name, digitsOnly.slice(0, mergedProps.length));
                        }
                    }}
                />
            </div>
        </div>
    );
});

export default PasscodeInput;