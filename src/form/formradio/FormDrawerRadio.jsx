import {equalString, isNullOrEmpty} from "../../utils/Utils.jsx";
import {Radio, Typography} from 'antd';
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
import {useApp} from "../../context/AppProvider.jsx";
import {useEffect, useRef} from "react";
const {Title} = Typography;

const FormDrawerRadio = ({ options, selectedCurrentValue, onValueSelect, propText = "Text", propValue = "Value", name }) => {
    const {styles} = useStyles();
    const {globalStyles} = useApp();
    const radioRefs = useRef({});
    
    useEffect(() => {
        if (selectedCurrentValue && radioRefs.current[selectedCurrentValue] && radioRefs.current[selectedCurrentValue].scrollIntoView) {
            radioRefs.current[selectedCurrentValue].scrollIntoView({
                behavior: 'auto',
                block: 'center',
            });
        }
    }, [selectedCurrentValue]);
    
    return (
        <>
            <Radio.Group
                rootClassName={styles.drawerRadioGroup}
                onChange={(e) => {
                    const selectedOptionInList = options.find(option => equalString(option[propValue], e.target.value));
                    onValueSelect(selectedOptionInList);
                }}
                value={selectedCurrentValue}
            >
                {options.map((option, index) => (
                    <Radio
                        key={`${name}_${option[propValue]}_${index}`}
                        value={option[propValue]}
                        className={styles.radioItem}
                        ref={el => {
                            if (el) {
                                radioRefs.current[option[propValue]] = el.input;
                            }
                        }}
                    >
                        <Title level={5} className={cx(styles.radioLabel, globalStyles.noSpace)}>
                            {isNullOrEmpty(option[propText]) ? (<></>) : (<Ellipsis direction='end' content={option[propText].toString()}/>)}
                        </Title>
                    </Radio>
                ))}
            </Radio.Group>
        </>
    )
};

export default FormDrawerRadio;