import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Select, Skeleton, Typography} from "antd";
import {useStyles} from "./styles.jsx";
import {calculateSkeletonLabelWidth, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import DrawerBottom from "../../components/drawer/DrawerBottom.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import FormDrawerRadio from "../formradio/FormDrawerRadio.jsx";
import {useTranslation} from "react-i18next";

const {Paragraph} = Typography;

const FormSelect = forwardRef(({
                        label,
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
                        loading,
                        fetching,
                        multi,
                        ...props
                    }, ref) => {

    const [selectedOption, setSelectedOption] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showClearButton, setShowClearButton] = useState(false);
    const [initValueInitialized, setInitialValueInitialized] = useState(false);
    const [innerPlaceholder, setInnerPlaceholder] = useState('');
    const isRequired = toBoolean(required);
    const {token, globalStyles} = useApp();
    const {styles} = useStyles();
    const {t} = useTranslation('');
    const [multiSelectedValues, setMultiSelectedValues] = useState([]);

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
        if (!fetching) {
            if (form && typeof form.getFieldProps === 'function' && !initValueInitialized) {
                field = form.getFieldProps(name);

                if (field && !isNullOrEmpty(field.value)){
                    setInitialValueInitialized(true);

                    if (toBoolean(multi)) {
                        setMultiSelectedValues(field.value);
                    } else {
                        const selectedOptionInList = options.find(option => equalString(option[propValue], field.value));
                        if (selectedOptionInList) {
                            onValueSelect(selectedOptionInList, true)
                        }
                    }
                }
            }
        }
    }, [fetching, initValueInitialized, multi, name, options]);

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    }

    useImperativeHandle(ref, () => ({
        open: () => {
            setIsDrawerOpen(true);
        },
    }));
    
    useEffect(() => {
        if (!multi){
            if (!equalString(selectedOption, field?.value)){
                let selectedOptionInList = options.find(option => equalString(option[propValue], field?.value));

                if (selectedOptionInList) {
                    setSelectedOption(selectedOptionInList);
                }
            }  
        }
    }, [field?.value]);
    
    const onValueSelect = (selectedOption, forceReload) => {
        let selectedDropdownValue = null;

        if (!equalString(selectedOption[propValue], field?.value) || forceReload ){
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
        }
        
        setIsDrawerOpen(false);
        setTimeout(function () {
            setShowClearButton(!isNullOrEmpty(selectedOption) && toBoolean(!isRequired));
        }, 500);
    }

    useEffect(() => {
        if (!fetching){
            if (isNullOrEmpty(placeholder)) {
                setInnerPlaceholder(t('selectPlaceholder', {label: label}))
            } else {
                setInnerPlaceholder(placeholder);
            }
        }
    }, [fetching, label, placeholder, t])

    useEffect(() => {
        if (toBoolean(multi) && form && !fetching){
            const currentValue = field?.value;

            if (initValueInitialized){
                if (JSON.stringify(currentValue) !== JSON.stringify(multiSelectedValues)) {
                    form.setFieldValue(name, multiSelectedValues);
                }
            }
        }
    }, [multiSelectedValues, fetching, field, form, initValueInitialized, multi, name]);
    
    return (
        <>
            {toBoolean(fetching) ? (
                <div className={cx(globalStyles.formBlock)}>
                    <Skeleton.Input block
                                    active={true}
                                    className={cx(globalStyles.skeletonLabel)}
                                    style={{
                                        width: `${calculateSkeletonLabelWidth(label)}`,
                                        minWidth: `${calculateSkeletonLabelWidth(label)}`
                                    }}/>
                    <Skeleton.Input block active={true} className={cx(globalStyles.skeletonInput)}/>
                </div>
            ) : (
                <div className={cx(globalStyles.formBlock, styles.selectGlobal)}>
                    <label htmlFor={name}
                           style={{
                               fontSize: token.Form.labelFontSize,
                               padding: token.Form.verticalLabelPadding,
                               marginLeft: token.Form.labelColonMarginInlineStart,
                               color: token.colorText,
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
                        value={toBoolean(multi) ? multiSelectedValues : selectedOption?.[propValue]}
                        open={false}
                        mode={toBoolean(multi) ? 'multiple' : undefined}
                        loading={toBoolean(loading)}
                        onDropdownVisibleChange={() => !toBoolean(disabled) && setIsDrawerOpen(true)}
                        onChange={(value) => {
                            if (multi) {
                                //nothing
                            } else {
                                const selectedOptionInList = options.find(option => equalString(option[propValue], value));
                                onValueSelect(selectedOptionInList);
                            }
                        }}
                        disabled={disabled}
                        className={styles.select}
                        status={hasError ? 'error' : ''}
                    >
                        {options.map((option, index) => {
                            return (
                                <Select.Option
                                    key={index}
                                    value={option[propValue]}
                                >
                                    {toBoolean(option?.translate) ? t(option[propText]) : option[propText]}
                                </Select.Option>
                            )
                        })}
                    </Select>

                    {hasError && meta && typeof meta.error === 'string' ? (
                        <Paragraph
                            style={{color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart}}>
                            {meta.error}
                        </Paragraph>
                    ) : null}
                </div>
            )}

            {!toBoolean(disabled) &&
                <DrawerBottom
                    showDrawer={isDrawerOpen}
                    closeDrawer={closeDrawer}
                    label={label}
                    showButton={showClearButton}
                    confirmButtonText={'Clear'}
                    onConfirmButtonClick={() => setSelectedOption(null)}
                    selectedValue={selectedOption}
                >
                    <FormDrawerRadio
                        options={options}
                        multi={toBoolean(multi)}
                        selectedCurrentValue={selectedOption?.[propValue]}
                        multiSelectedValues={multiSelectedValues}
                        onValueSelect={onValueSelect}
                        setMultiSelectedValues={setMultiSelectedValues}
                        propText={propText}
                        propValue={propValue}
                        name={name}
                    />
                </DrawerBottom>
            }
        </>
    );
});

export default FormSelect;