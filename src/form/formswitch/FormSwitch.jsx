import {equalString, toBoolean} from "../../utils/Utils.jsx";
import {Flex, Skeleton, Switch, Typography} from 'antd';
import {useApp} from "../../context/AppProvider.jsx";
import {Ellipsis} from "antd-mobile";
import {useState} from "react";
import {cx} from "antd-style";
const {Text} = Typography;

const FormSwitch = ({ form, name, checked, label, disabled, rows = 1, loading }) => {
    const [isChecked, setIsChecked] = useState(checked);
    const {token, globalStyles} = useApp();
    
    const handleClick = () => {
        if (!disabled) {
            setIsChecked(!isChecked);
            form.setFieldValue(name, !isChecked);
        }
    };

    let field = '';
    let meta = null;

    if (form && typeof form.getFieldProps === 'function') {
        field = form.getFieldProps(name);
        meta = form.getFieldMeta(name);
    }

    if (toBoolean(loading)){
        return (
            <div className={cx(globalStyles.formBlock) }>
                <Skeleton.Input block active={true} className={cx(globalStyles.skeletonLabel) }/>
                <Flex gap={token.padding}>
                    <Skeleton.Input block active={true} className={cx(globalStyles.skeletonInput) }/>
                    <Skeleton.Input block active={true} style={{width: '120px !important'}} className={cx(globalStyles.skeletonInput, globalStyles.skeletonSwitch) }/>
                </Flex>
            </div>
        )
    }
    
    return (
        <Flex justify={"space-between"} align={"center"} style={{height: 44, paddingBottom: (rows > 1 ? `${token.padding}px` : 0)}}>
            <Text onClick={handleClick}>
                <Ellipsis direction='end' rows={rows} content={label}/>
            </Text>
            
            <Switch disabled={disabled} checked={isChecked} onChange={handleClick} />
        </Flex>
    )
};

export default FormSwitch;