import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Checkbox, Radio, Typography} from 'antd';
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
import {useApp} from "../../context/AppProvider.jsx";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";

const {Title} = Typography;

const FormDrawerRadio = ({
                             options,
                             multi,
                             selectedCurrentValue,
                             multiSelectedValues,
                             onValueSelect,
                             setMultiSelectedValues,
                             propText = "Text",
                             propValue = "Value",
                             name
                         }) => {
    const {styles} = useStyles();
    const {globalStyles} = useApp();
    const radioRefs = useRef({});
    const {t} = useTranslation('');

    useEffect(() => {
        if (!toBoolean(multi)) {
            if (selectedCurrentValue && radioRefs.current[selectedCurrentValue] && radioRefs.current[selectedCurrentValue].scrollIntoView) {
                radioRefs.current[selectedCurrentValue].scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                });
            }
        }
    }, [selectedCurrentValue]);

    const handleMultiChange = (value, checked) => {
        if (checked) {
            setMultiSelectedValues([...multiSelectedValues, value]);
        } else {
            setMultiSelectedValues(multiSelectedValues.filter(v => !equalString(v, value)));
        }
    };

    if (toBoolean(multi)) {
        return (
            <div className={styles.drawerRadioGroup}>
                {options.map((option, index) => {

                    const isChecked = multiSelectedValues.includes(option[propValue]);

                    return (
                        <div key={`${name}_${option[propValue]}_${index}`} className={styles.radioItem}>
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) => handleMultiChange(option[propValue], e.target.checked)}
                            />

                            <Title level={5} className={cx(styles.radioLabel, globalStyles.noSpace)}
                                   style={{marginRight: 'auto'}}
                                   onClick={() => handleMultiChange(option[propValue], !isChecked)}>
                                {isNullOrEmpty(option[propText]) ? (
                                    <></>
                                ) : (
                                    <>
                                        {toBoolean(option?.translate) ? (
                                            <Ellipsis direction='end' content={t(option[propText]).toString()}/>
                                        ) : (
                                            <Ellipsis direction='end' content={option[propText].toString()}/>
                                        )}
                                    </>
                                )}
                            </Title>
                        </div>
                    )
                })}
            </div>
        )
    }

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
                {options.map((option, index) => {
                    return (
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
                                {isNullOrEmpty(option[propText]) ? (
                                    <></>
                                ) : (
                                    <>
                                        {toBoolean(option?.translate) ? (
                                            <Ellipsis direction='end' content={t(option[propText]).toString()}/>
                                        ) : (
                                            <Ellipsis direction='end' content={option[propText].toString()}/>
                                        )}
                                    </>
                                )}
                            </Title>
                        </Radio>
                    )
                })}
            </Radio.Group>
        </>
    )
};

export default FormDrawerRadio;