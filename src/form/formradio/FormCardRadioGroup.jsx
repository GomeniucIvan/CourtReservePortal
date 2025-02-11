import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Card, Checkbox, Flex, Radio, Typography} from 'antd';
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
import {useApp} from "../../context/AppProvider.jsx";
import {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";

const {Title, Text} = Typography;

const FormCardRadioGroup = ({formik,
                                options,
                                name
                            }) => {
    const {styles} = useStyles();
    const {globalStyles, token} = useApp();
    const radioRefs = useRef({});
    const {t} = useTranslation('');

    let field = '';
    let meta = null;

    if (formik && typeof formik.getFieldProps === 'function') {
        field = formik.getFieldProps(name);
        meta = formik.getFieldMeta(name);
    }
    
    return (
        <>
            <Card className={cx(globalStyles.card, globalStyles.cardNoPadding)}>
                <Radio.Group
                    onChange={(e) => {
                        formik.setFieldValue(name, e.target.value);
                    }}
                    value={field.value}
                >
                    {options.map((option, index) => {
                        return (
                            <Radio
                                key={`${name}_${option.Value}_${index}`}
                                value={option.Value}
                                className={cx(styles.radioItem, styles.cardRadioItem)}
                                ref={el => {
                                    if (el) {
                                        radioRefs.current[option.Value] = el.input;
                                    }
                                }}
                            >
                                <Flex vertical={true} gap={token.paddingXXS}>
                                    {!isNullOrEmpty(option.Label) &&
                                        <Title level={4} className={cx(styles.radioLabel, globalStyles.noSpace)}
                                               style={{width: '100%'}}>
                                            {option.Label}
                                        </Title>
                                    }

                                    {!isNullOrEmpty(option.Description) &&
                                        <Text style={{color: isNullOrEmpty(option.Label) ? '' : token.colorSecondary}}>
                                            {option.Description}
                                        </Text>
                                    }
                                </Flex>
                            </Radio>
                        )
                    })}
                </Radio.Group>
            </Card>
        </>
    )
};

export default FormCardRadioGroup;