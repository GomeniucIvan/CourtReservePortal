import {equalString} from "../../utils/Utils.jsx";
import {Flex, Switch, Typography} from 'antd';
import {useApp} from "../../context/AppProvider.jsx";
import {Ellipsis} from "antd-mobile";
import {useState} from "react";
const {Text} = Typography;

const FormSwitch = ({ checked, label, disabled, rows = 1 }) => {
    const [isChecked, setIsChecked] = useState(checked);

    const handleClick = () => {
        if (!disabled) {
            setIsChecked(!isChecked);
        }
    };
    
    return (
        <Flex justify={"space-between"} align={"center"} style={{height: 44}}>
            <Text onClick={handleClick}>
                <Ellipsis direction='end' rows={rows} content={label}/>
            </Text>
            
            <Switch disabled={disabled} checked={isChecked} onChange={handleClick} />
        </Flex>
    )
};

export default FormSwitch;