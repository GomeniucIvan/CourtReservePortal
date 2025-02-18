import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Checkbox, Flex, Radio, Typography} from 'antd';
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
import {useApp} from "../../context/AppProvider.jsx";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import SVGRadioCheck from "@/components/svg/SVGRadioCheck.jsx";
import * as React from "react";

const {Title} = Typography;

const FormDrawerRadio = ({
                             options,
                             multi,
                             show,
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
        if (!toBoolean(multi) && selectedCurrentValue && toBoolean(show)) {
            if (selectedCurrentValue && radioRefs.current[selectedCurrentValue] && radioRefs.current[selectedCurrentValue].scrollIntoView) {
                const parentElement = radioRefs.current[selectedCurrentValue]?.closest('.ant-radio-group').parentElement;
                const selectedElement = radioRefs.current[selectedCurrentValue]?.closest('.ant-radio-wrapper'); 
                
                if (parentElement) {
                    setTimeout(() => {
                        selectedElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                        });
                    }, 100);
                }
            } 
        }
    }, [selectedCurrentValue, show]);

    const handleMultiChange = (value, checked) => {
        if (checked) {
            setMultiSelectedValues([...multiSelectedValues, value]);
        } else {
            setMultiSelectedValues(multiSelectedValues.filter(v => !equalString(v, value)));
        }
    };

    const handleRowClick = (option) => {
        const value = option[propValue];
        const isChecked = multiSelectedValues.includes(value);
        handleMultiChange(value, !isChecked);
    };

    if (toBoolean(multi)) {
        return (
            <div className={styles.drawerRadioGroup}>
                {options.map((option, index) => {

                    const isChecked = anyInList(multiSelectedValues) ? multiSelectedValues.includes(option[propValue]) : false;

                    return (
                        <div key={`${name}_${option[propValue]}_${index}`} className={styles.radioItem}
                             onClick={() => handleRowClick(option)}>
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) => handleMultiChange(option[propValue], e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                            />

                            <Flex justify={'space-between'} align={'center'} flex={1}>
                                <Title level={3} className={cx(styles.radioLabel, globalStyles.noSpace)}
                                       style={{width: '100%'}}>
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

                                <SVGRadioCheck checked={isChecked} multi={true}/>
                            </Flex>
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
                    const isChecked = anyInList(multiSelectedValues) ? 
                        multiSelectedValues.includes(option[propValue]) : 
                        !isNullOrEmpty(selectedCurrentValue) && equalString(option[propValue], selectedCurrentValue);

                    return (
                        <div key={`${name}_${option[propValue]}_${index}`} className={cx(styles.radioItem, styles.radioSingleItemSelection)}
                             onClick={() => onValueSelect(option)}>
                            <Radio
                                value={option[propValue]}
                                ref={el => {
                                    if (el) {
                                        radioRefs.current[option[propValue]] = el.input;
                                    }
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Flex justify={'space-between'} align={'center'}>
                                    <Title level={3} className={cx(styles.radioLabel, globalStyles.noSpace)}
                                           style={{width: '100%'}}>
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

                                    <SVGRadioCheck checked={isChecked}/>
                                </Flex>
                            </Radio>
                        </div>
                    )
                })}
            </Radio.Group>
        </>
    )
};

export default FormDrawerRadio;
