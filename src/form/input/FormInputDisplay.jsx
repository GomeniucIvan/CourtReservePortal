import React, {useRef} from "react";
import {Input, Skeleton, Typography} from "antd";
import {calculateSkeletonLabelWidth, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {useStyles} from "./styles.jsx";
const {Text} = Typography;

const FormInputDisplay = ({ label,
                       formik,
                       name,
                       value,
                       noBottomPadding,
                       style,
                       className,
                        loading,
                       ...props }) => {
    
    const { token, globalStyles } = useApp();
    const {styles} = useStyles();
    
    let field = '';
    let meta = null;
    
    const inputRef = useRef(null);

    if (formik && typeof formik.getFieldProps === 'function') {
        field = formik.getFieldProps(name);
        meta = formik.getFieldMeta(name);

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
    
    console.log(value)
    
    return (
        <div className={cx(globalStyles.formBlock, className)}>
            <label htmlFor={name} className={globalStyles.globalLabel} style={{paddingBottom: '4px'}}>
                {label}
            </label>

            <Text>
                {!isNullOrEmpty(value) &&
                    <div dangerouslySetInnerHTML={{__html: value}} style={{color: token.colorLabelValue}}/>
                }
            </Text>
            {/*<Input*/}
            {/*    {...props}*/}
            {/*    {...field}*/}
            {/*    readOnly={true}*/}
            {/*    defaultValue={value}*/}
            {/*    name={name}*/}
            {/*    className={styles.inputFilled}*/}
            {/*    variant="filled"*/}
            {/*    autoCorrect="off"*/}
            {/*    autoComplete="off"*/}
            {/*    ref={inputRef}/>*/}
            
        </div>
    )
};

export default FormInputDisplay;