import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Select, Skeleton, Typography} from "antd";
import {useStyles} from "./styles.jsx";
import {calculateSkeletonLabelWidth, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import DrawerBottom from "../../components/drawer/DrawerBottom.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import FormDrawerRadio from "../formradio/FormDrawerRadio.jsx";
import {useTranslation} from "react-i18next";
import {addCypressTag} from "@/utils/TestUtils.jsx";

const {Paragraph} = Typography;

const FormSelect = forwardRef(({
                        label,
                        formik,
                        propText = "Text",
                        propValue = "Value",
                        options,
                        name,
                        required,
                        disabled,
                        placeholder,
                        type,
                        loading,
                        fetching,
                        className,
                        multi,
                        ...props
                    }, ref) => {

    const isRequired = toBoolean(required);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showClearButton, setShowClearButton] = useState(false);
    const [innerPlaceholder, setInnerPlaceholder] = useState('');
    const {token, globalStyles} = useApp();
    const {styles} = useStyles();
    const {t} = useTranslation('');

    let field = '';
    let meta = null;

    if (formik && typeof formik.getFieldProps === 'function') {
        field = formik.getFieldProps(name);
        meta = formik.getFieldMeta(name);
    }

    let hasError = meta && meta.error && meta.touched;
    
    if (isNullOrEmpty(options)) {
        options = [];
    }

    const selectRef = useRef(null);

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    }

    const clearAndCloseDrawer = () => {
        formik.setFieldValue(name, null);
        closeDrawer();

        setTimeout(function () {
            setShowClearButton(false);
        }, 500);
    }
    
    useImperativeHandle(ref, () => ({
        open: () => {
            setIsDrawerOpen(true);
        },
    }));
    
    useEffect(() => {
        if (!toBoolean(fetching)){
            if (isNullOrEmpty(placeholder)) {
                setInnerPlaceholder(t('selectPlaceholder', {label: label}))
            } else {
                setInnerPlaceholder(placeholder);
            }
        }
    }, [fetching, label, placeholder, t])

    const onDrawerOptionSelect = (selectedOption) => {
        let selectedDropdownValue = selectedOption[propValue];
        formik.setFieldValue(name, selectedDropdownValue);

        setIsDrawerOpen(false);
        setTimeout(function () {
            setShowClearButton(!isNullOrEmpty(selectedOption) && toBoolean(!isRequired));
        }, 500);
    }
    
    useEffect(() => {
        if (!isNullOrEmpty(field.value) && !toBoolean(isRequired)){
            setShowClearButton(true);
        }
    }, [])
    
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
                <div className={cx(globalStyles.formBlock, styles.selectGlobal, !isNullOrEmpty(className) && className)}>
                    <label htmlFor={name} className={globalStyles.globalLabel}>
                        {label}
                        {isRequired && <span
                            style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
                    </label>

                    <Select
                        {...props}
                        {...addCypressTag(name)}
                        ref={selectRef}
                        placeholder={innerPlaceholder}
                        value={isNullOrEmpty(field.value) ? undefined : toBoolean(multi) ? field.value : `${field.value}`}
                        open={false}
                        mode={toBoolean(multi) ? 'multiple' : undefined}
                        loading={toBoolean(loading)}
                        onDropdownVisibleChange={() => !toBoolean(disabled) && setIsDrawerOpen(true)}
                        disabled={disabled}
                        className={styles.select}
                        showSearch={false}
                        status={hasError ? 'error' : ''}
                    >
                        {options.map((option, index) => {
                            return (
                                <Select.Option
                                    key={index}
                                    value={toBoolean(multi) ? option[propValue] : `${option[propValue]}`}
                                >
                                    {toBoolean(option?.translate) ? t(option[propText]) : option[propText]}
                                </Select.Option>
                            )
                        })}
                    </Select>

                    {hasError && meta && typeof meta.error === 'string' ? (
                        <Paragraph {...addCypressTag(`error-${name}`)} className={cx(globalStyles.formError, 'ant-input-status-error')}>
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
                    onConfirmButtonClick={clearAndCloseDrawer}
                >
                    <FormDrawerRadio
                        options={options}
                        show={isDrawerOpen}
                        multi={toBoolean(multi)}
                        selectedCurrentValue={`${field.value}`}
                        multiSelectedValues={field.value}
                        onValueSelect={onDrawerOptionSelect}
                        setMultiSelectedValues={(e) => {
                            formik.setFieldValue(name, e)
                        }}
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