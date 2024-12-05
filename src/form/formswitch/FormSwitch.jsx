import {calculateSkeletonLabelWidth, equalString, toBoolean} from "../../utils/Utils.jsx";
import {Flex, Skeleton, Switch, Typography} from 'antd';
import {useApp} from "../../context/AppProvider.jsx";
import {Ellipsis} from "antd-mobile";
import React, {useEffect, useState} from "react";
import {cx} from "antd-style";
const {Text} = Typography;

const FormSwitch = ({ formik, name, label, disabled, rows = 1 }) => {
    const {token, globalStyles} = useApp();

    let field = '';
    let meta = null;

    if (formik && typeof formik.getFieldProps === 'function') {
        field = formik.getFieldProps(name);
        meta = formik.getFieldMeta(name);
    }
    
    return (
        <Flex justify={"space-between"} align={"center"} style={{height: 44, paddingBottom: (rows > 1 ? `${token.padding}px` : 0)}}>
            <Text onClick={() => {formik.setFieldValue(name, !toBoolean(field?.value))}}>
                <Ellipsis direction='end' rows={rows} content={label}/>
            </Text>
            
            <Switch {...field} disabled={disabled} checked={toBoolean(field?.value)} onChange={(e) =>{
                formik.setFieldValue(name, e.target.checked);
            }} />
        </Flex>
    )
};

export default FormSwitch;