import {equalString} from "../../utils/Utils.jsx";
import {Radio, Typography} from 'antd';
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
import {useApp} from "../../context/AppProvider.jsx";
const {Title} = Typography;

const FormDrawerRadio = ({ options, selectedCurrentValue, onValueSelect, propText = "Text", propValue = "Value", name }) => {
    const {styles} = useStyles();
    const {globalStyles} = useApp();
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
                {options.map((option) => (
                    <Radio key={`${name}_${option[propValue]}`} value={option[propValue]} className={styles.radioItem}>
                        <Title level={5} className={cx(styles.radioLabel, globalStyles.noSpace)}>
                            <Ellipsis direction='end' content={option[propText]}/>
                        </Title>
                    </Radio>
                ))}
            </Radio.Group>
        </>
    )
};

export default FormDrawerRadio;