import {useEffect, useRef, useState} from "react";
import {Select, Skeleton, Typography} from "antd";
import {useStyles} from "./styles.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import DrawerBottom from "../../components/drawer/DrawerBottom.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import FormDrawerRadio from "../formradio/FormDrawerRadio.jsx";
import {useTranslation} from "react-i18next";
const { Paragraph } = Typography;

const FormSelect = ({
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
                        isMulti,
                        ...props
                    }) => {

    if (toBoolean(isMulti)) {
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

    const [selectedOption, setSelectedOption] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showClearButton, setShowClearButton] = useState(false);
    const [initValueInitialized, setInitialValueInitialized] = useState(false);
    const [innerPlaceholder, setInnerPlaceholder] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isRequired = toBoolean(required);
    const {token, globalStyles} = useApp();
    const {styles} = useStyles();
    const {t} = useTranslation('');
    
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
        if (!fetching){
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
            setInnerPlaceholder(t('selectPlaceholder', {label: label}))
        } else {
            setInnerPlaceholder(placeholder);
        }
    }, [])

    if (toBoolean(loading)){
        return (
            <div className={cx(globalStyles.formBlock) }>
                <Skeleton.Input block active={true} className={cx(globalStyles.skeletonLabel) }/>
                <Skeleton.Input block active={true} className={cx(globalStyles.skeletonInput) }/>
            </div>
        )
    }
    
    return (
        <>
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
                    value={selectedOption?.[propValue]}
                    open={false}
                    loading={toBoolean(fetching)}
                    onDropdownVisibleChange={() => !toBoolean(disabled) && setIsDrawerOpen(true)}
                    onChange={(value) => {
                        const selectedOptionInList = options.find(option => equalString(option[propValue], value));
                        onValueSelect(selectedOptionInList);
                    }}
                    disabled={disabled}
                    className={styles.select}
                    status={hasError ? 'error' : ''}
                >
                    {options.map((option, index) => (
                        <Select.Option
                            key={index}
                            value={option[propValue]}
                        >
                            {toBoolean(option?.translate) ? t(option[propText]) : option[propText]}
                        </Select.Option>
                    ))}
                </Select>

                {hasError && meta && typeof meta.error === 'string' ? (
                    <Paragraph style={{ color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart }}>
                        {meta.error}
                    </Paragraph>
                ) : null}
            </div>

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
                        selectedCurrentValue={selectedOption?.[propValue]}
                        onValueSelect={onValueSelect}
                        propText={propText}
                        propValue={propValue}
                        name={name}
                    />
                </DrawerBottom>
            }
        </>
    );
};

export default FormSelect;