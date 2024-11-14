import React, {useRef} from "react";
import {Input, Skeleton} from "antd";
import {calculateSkeletonLabelWidth, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";

const FormInputDisplay = ({ label,
                       form,
                       name,
                       value,
                       noBottomPadding,
                       style,
                       className,
                        loading,
                       ...props }) => {
    
    const { token, globalStyles } = useApp();
    
    let field = '';
    let meta = null;
    
    const inputRef = useRef(null);

    if (form && typeof form.getFieldProps === 'function') {
        field = form.getFieldProps(name);
        meta = form.getFieldMeta(name);

        if (field.value === null) {
            field = { ...field, value: '' };
        }
    }

    if (isNullOrEmpty(value)){
        if (field && !isNullOrEmpty(field.value)){
            value = field.value;
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
        <div className={cx(globalStyles.formBlock, className)}>
            <label htmlFor={name} className={globalStyles.globalLabel}>
                {label}
            </label>

            <Input
                {...props}
                {...field}
                readOnly={true}
                defaultValue={value}
                name={name}
                variant="filled"
                autoCorrect="off"
                autoComplete="off"
                ref={inputRef}/>
            
        </div>
    )
};

export default FormInputDisplay;