import {calculateSkeletonLabelWidth, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Flex, Skeleton, Switch, Typography} from 'antd';
import {useApp} from "../../context/AppProvider.jsx";
import {Ellipsis} from "antd-mobile";
import React, {useEffect, useState} from "react";
import {cx} from "antd-style";
import {pNotify} from "../../components/notification/PNotify.jsx";
import {addCypressTag} from "@/utils/TestUtils.jsx";
const {Text} = Typography;

const FormSwitch = ({ formik, name, label, disabled, rows = 1, tooltip }) => {
    const {token, globalStyles} = useApp();

    let field = '';
    let meta = null;

    if (formik && typeof formik.getFieldProps === 'function') {
        field = formik.getFieldProps(name);
        meta = formik.getFieldMeta(name);
    }

    const onRowClick = () => {
        if (toBoolean(disabled) && !isNullOrEmpty(tooltip)) {
            pNotify(tooltip, 'info');
        }
    }

    const onCheckboxChangeClick = (checked) => {
        if (!toBoolean(disabled)) {
            formik.setFieldValue(name, checked);
        }
    }
    
    return (
        <Flex justify={"space-between"} align={"center"} style={{height: 44}} onClick={onRowClick}>
            <Text onClick={() => {onCheckboxChangeClick(!toBoolean(field?.value))}}>
                <Ellipsis direction='end' rows={rows} content={label} style={{opacity: (toBoolean(disabled) ? "0.6" : "1")}}/>
            </Text>

            <Switch {...field} disabled={disabled}
                    {...addCypressTag(name)}
                    checked={toBoolean(field?.value)}
                    onChange={onCheckboxChangeClick} />
        </Flex>
    )
};

export default FormSwitch;