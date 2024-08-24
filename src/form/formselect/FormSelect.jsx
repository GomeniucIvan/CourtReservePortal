import {useEffect, useRef, useState} from "react";
import {Input, Select, Typography} from "antd";
import {useStyles} from "./styles.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import DrawerBottom from "../../components/drawer/DrawerBottom.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
const { Paragraph } = Typography;

const FormSelect = ({ label,
                        form,
                        propText = "Text",
                        propValue = "Value",
                        options,
                        name,
                        required,
                        disabled,
                        onValueChange,
                        placeholder,
                        sLoading,
                        menu,
                        type,
                        isMulti,
                        ...props }) => {

    if (toBoolean(isMulti) && toBoolean(isMobile)) {
        //todo fix multiple should be for web as well
        return (
            <HtmlMultiSelect
                label={label}
                name={name}
                suffix='Rating(s)'
                propText={propText}
                propValue={propValue}
                placeholder={placeholder}
                options={options}
                required={required}
                form={form}
            />
        )
    }


    //const [options, setOptions] = useState(list);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showClearButton, setShowClearButton] = useState(false);
    const [initValueInitialized, setInitialValueInitialized] = useState(false);
    const [innerPlaceholder, setInnerPlaceholder] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isRequired = toBoolean(required);
    const { token, globalStyles } = useApp();
    const {styles} = useStyles();
    
    let field = '';
    let meta = null;
    
    if (form && typeof form.getFieldProps === 'function') {
        field = form.getFieldProps(name);
        meta = form.getFieldMeta(name);
    }

    let hasError = meta && meta.error && meta.touched;

    if (isNullOrEmpty(options)) {
        options = [];
    }

    const selectRef = useRef(null);

    useEffect(() => {
        if (form && typeof form.getFieldProps === 'function' && !initValueInitialized) {
            field = form.getFieldProps(name);

            if (field && !isNullOrEmpty(field.value)) {
                setInitialValueInitialized(true);
                const selectedOptionInList = options.find(option => equalString(option[propValue], field.value));
                if (selectedOptionInList) {
                    onValueSelect(selectedOptionInList)
                }
            }
        }
    }, [field?.value]);

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    }

    const onValueSelect = (selectedOption) => {
        let selectedDropdownValue = null;

        if (isNullOrEmpty(selectedOption)) {
            selectedDropdownValue = null;
            form.setFieldValue(name, null);
        } else {
            let selectedOptionInList = options.find(option => equalString(option[propValue], selectedOption[propValue]));
            if (selectedOptionInList) {
                selectedDropdownValue = selectedOptionInList;
                form.setFieldValue(name, selectedOption[propValue]);
            } else {
                selectedDropdownValue = null;
                form.setFieldValue(name, null);
            }
        }

        setSelectedOption(selectedDropdownValue);
        if (onValueChange && typeof onValueChange === 'function') {
            onValueChange(selectedDropdownValue);
        }

        setIsDrawerOpen(false);
        setTimeout(function () {
            setShowClearButton(!isNullOrEmpty(selectedOption) && toBoolean(!isRequired));
        }, 500);
    }

    useEffect(() => {
        if (isNullOrEmpty(placeholder)) {
            setInnerPlaceholder(`Select ${label}`)
        } else {
            setInnerPlaceholder(placeholder);
        }
    }, [])

    return (
        <>
            <div className={cx(globalStyles.formBlock, styles.selectGlobal)}>
                <label htmlFor={name}
                       style={{
                           fontSize: token.Form.labelFontSize,
                           padding: token.Form.verticalLabelPadding,
                           marginLeft: token.Form.labelColonMarginInlineStart,
                           display: 'block'
                       }}>
                    {label}
                    {isRequired && <span
                        style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
                </label>

                <Select
                    {...props}
                    ref={selectRef}
                    placeholder={innerPlaceholder}
                    value={selectedOption?.[propValue]}
                    open={false}
                    onDropdownVisibleChange={() => !toBoolean(disabled) && setIsDrawerOpen(true)}
                    onChange={(value) => {
                        const selectedOptionInList = options.find(option => equalString(option[propValue], value));
                        onValueSelect(selectedOptionInList);
                    }}
                    disabled={disabled}
                    className={styles.select}
                    status={hasError ? 'error' : ''}
                >
                    {options.map((option) => (
                        <Select.Option key={option[propValue]} value={option[propValue]}>
                            {option[propText]}
                        </Select.Option>
                    ))}
                </Select>

                {hasError && meta && typeof meta.error === 'string' ? (
                    <div className='form-invalid'>{meta.error}</div>
                ) : null}
            </div>

            {!toBoolean(disabled) &&
                <DrawerBottom showDrawer={isDrawerOpen} closeDrawer={closeDrawer} label={label} showButton={showClearButton}
                              confirmButtonText={'Clear'} onConfirmButtonClick={() => setSelectedOption(null)}
                              selectedValue={selectedOption}>
                    <>
                        {options.map((option, index) => (
                            <div key={`${name}_${option[propValue]}`} onClick={() => onValueSelect(option)}
                                 className={`${equalString(option[propValue], (isNullOrEmpty(selectedOption) ? -99 : selectedOption[propValue])) ? 'drawer-item-selected' : ''}`}>
                                <div className='drawer-item'>
                                    {option[propText]}
                                </div>
                            </div>
                        ))}
                    </>
                </DrawerBottom>
            }
        </>
    );
};

export default FormSelect;