import React, {useEffect, useRef, useImperativeHandle, useState} from 'react';
import {useStyles} from "./styles.jsx";
import {anyInList, calculateSkeletonLabelWidth, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {cultureStartingWithDay} from "../../utils/DateUtils.jsx";
import {cx} from "antd-style";
import InlineBlock from "../../components/inlineblock/InlineBlock.jsx";
import {Flex, Input, Select, Skeleton, Typography} from "antd";
import DrawerBottom from "../../components/drawer/DrawerBottom.jsx";
import FormDrawerRadio from "../formradio/FormDrawerRadio.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {useTranslation} from "react-i18next";

const {Paragraph} = Typography;

const FormDateOfBirth = React.forwardRef(({
                                              uiCulture,
                                              name,
                                              formik,
                                              required,
                                              dateOfBirthValue,
                                              disabled,
                                              loading,
                                              onDateChange,
                                              displayAge,
                                              ...props
                                          }, ref) => {
    const [isDayDrawerOpen, setIsDayDrawerOpen] = useState(false);
    const [isMonthDrawerOpen, setIsMonthDrawerOpen] = useState(false);
    const [isYearDrawerOpen, setIsYearDrawerOpen] = useState(false);

    const [selectedDay, setSelectedDay] = useState(undefined);
    const [selectedMonth, setSelectedMonth] = useState(undefined);
    const [selectedYear, setSelectedYear] = useState(undefined);

    const [daysOptions, setDaysOptions] = useState([]);
    const [monthsOptions, setMonthsOptions] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);

    const [age, setAge] = useState('');
    const {globalStyles, token} = useApp();
    const styles = useStyles();
    const [isInitialized, setIsInitialized] = useState(false);


    const [showDayClear, setShowDayClear] = useState(false);
    const [showMonthClear, setShowMonthClear] = useState(false);
    const [showYearClear, setShowYearClear] = useState(false);
    
    
    
    const minYear = 1950;
    const maxYear = new Date().getFullYear();
    const isRequired = toBoolean(required);
    const {t} = useTranslation('');
    
    useImperativeHandle(ref, () => ({
        reset: () => {
            setSelectedDay(null);
            setSelectedMonth(null);
            setSelectedYear(null);
            setAge('');
        }
    }));

    const months = () => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return Array.from({length: 12}, (_, i) => ({
            Value: i + 1,
            Text: monthNames[i]
        }))
    }

    const years = () => {
        return Array.from({length: maxYear - minYear + 1}, (_, i) => ({
            Value: maxYear - i,
            Text: maxYear - i
        }));
    }
    
    const setLists = () => {
        if (!anyInList(monthsOptions)){
            setMonthsOptions(months());
        }
        
        if (!anyInList(yearOptions)){
            setYearOptions(years())
        }
    }
    
    const calculateAge = (day, month, year) => {
        const dob = new Date(year, month - 1, day);
        const today = new Date();
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        } else if (months === 0 && today.getDate() < dob.getDate()) {
            years--;
            months = 11;
        }

        if (equalString(months, 0)){
            setAge(`${years}-yr`);
        } else{
            setAge(`${years}-yr ${months}-m`);
        }
    };

    useEffect(() => {
        setLists();
    }, []);
    
    useEffect(() => {
        setLists();
        if (!toBoolean(loading)){
            const monthsOptions = months();
            const yearOptions = years();
            
            if (!isNullOrEmpty(formik?.values?.[name]) && isNullOrEmpty(dateOfBirthValue)) {
                const date = new Date(formik.values?.[name]);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                const dayOption = {Value: day, Text: day.toString()};

                const monthOption = monthsOptions.find(option => option.Value === month);
                const yearOption = yearOptions.find(option => option.Value === year);

                setSelectedDay(dayOption?.Value);
                setSelectedMonth(monthOption?.Value);
                setSelectedYear(yearOption?.Value);
                calculateAge(day, month, year);
            }
            if (!isNullOrEmpty(dateOfBirthValue) && isNullOrEmpty(formik?.values?.[name])) {
                const date = new Date(dateOfBirthValue);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                const dayOption = {Value: day, Text: day.toString()};

                const monthOption = monthsOptions.find(option => option.Value === month);
                const yearOption = yearOptions.find(option => option.Value === year);

                setSelectedDay(dayOption?.Value);
                setSelectedMonth(monthOption?.Value);
                setSelectedYear(yearOption?.Value);
                calculateAge(day, month, year);
            }
            setIsInitialized(true);
        }
    }, [loading]);

    const formatDateOfBirthByUiCulture = (day, month, year) => {
        if (isNullOrEmpty(day) && isNullOrEmpty(month) && isNullOrEmpty(year)) {
            formik.setFieldValue(name, null);
            return;
        }

        let regionCode = uiCulture;

        if (isNullOrEmpty(regionCode)) {
            regionCode = 'en-US';
        }

        if (equalString(regionCode, "en-GB") ||
            equalString(regionCode, "en-IE") ||
            equalString(regionCode, "en-AU") ||
            equalString(regionCode, "id-ID") ||
            equalString(regionCode, "es-GT") ||
            equalString(regionCode, "nl-AW") ||
            equalString(regionCode, "en-SG") ||
            equalString(regionCode, "en-KE") ||
            equalString(regionCode, "es-MX") ||
            equalString(regionCode, "en-KY")) {
            formik.setFieldValue(name, `${day}/${month}/${year}`);
        } else if (equalString(regionCode, "tr-TR")) {
            formik.setFieldValue(name, `${day}.${month}.${year}`);
        } else {
            formik.setFieldValue(name, `${month}/${day}/${year}`);
        }
    }

    useEffect(() => {
        let daysInMonth;
        if (selectedYear && selectedMonth) {
            daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        } else {
            daysInMonth = 31;
        }

        const newDaysOptions = Array.from({length: daysInMonth}, (_, i) => ({Value: i + 1, Text: i + 1}));
        setDaysOptions(newDaysOptions);

        if (selectedDay && selectedDay > daysInMonth) {
            setSelectedDay(null);
            formik.setFieldValue(name, null);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        if (isInitialized){
            if (onDateChange) {
                onDateChange(selectedDay, selectedMonth, selectedYear);
            }
            if (selectedDay && selectedMonth && selectedYear) {
                formatDateOfBirthByUiCulture(selectedDay, selectedMonth, selectedYear);
                calculateAge(selectedDay, selectedMonth, selectedYear);
            } else {
                formik.setFieldValue(name, null);
                setAge('');
            }
        }
        
        setTimeout(() =>{
            setShowDayClear(!isNullOrEmpty(selectedDay))
            setShowMonthClear(!isNullOrEmpty(selectedMonth))
            setShowYearClear(!isNullOrEmpty(selectedYear))  
        }, 500);
        
    }, [selectedDay, selectedMonth, selectedYear]);

    let field = '';
    let meta = null;

    if (formik && typeof formik.getFieldProps === 'function') {
        field = formik.getFieldProps(name);
        meta = formik.getFieldMeta(name);
    }

    let hasError = meta && meta.error && meta.touched;

    const handleSelectOption = (day, month, year) => {
        if (day) {
            setSelectedDay(day);
            setIsDayDrawerOpen(false);
        }

        if (month) {
            setSelectedMonth(month);
            setIsMonthDrawerOpen(false);
        }

        if (year) {
            setSelectedYear(year);
            setIsYearDrawerOpen(false);
        }
    }

    const isStartingWithDay = cultureStartingWithDay(uiCulture);

    const orderedKeys = [];

    if (isStartingWithDay) {
        orderedKeys.push('day');
        orderedKeys.push('month');
        orderedKeys.push('year');
    } else {
        orderedKeys.push('month');
        orderedKeys.push('day');
        orderedKeys.push('year');
    }

    if (toBoolean(loading)){
        return (
            <div className={cx(globalStyles.formBlock) }>
                <Skeleton.Input block
                                active={true}
                                className={cx(globalStyles.skeletonLabel)}
                                style={{ width: `${calculateSkeletonLabelWidth(t('date.dateOfBirth'))}` }}/>
                <Flex gap={token.padding}>
                    <Skeleton.Input active={true} className={cx(globalStyles.skeletonInput) }/>
                    <Skeleton.Input active={true} className={cx(globalStyles.skeletonInput) }/>
                    <Skeleton.Input active={true} className={cx(globalStyles.skeletonInput) }/>
                </Flex>
            </div>
        )
    }
    
    return (
        <div className={cx(globalStyles.formBlock, styles.selectGlobal)}>
            <label style={{
                fontSize: token.Form.labelFontSize,
                padding: token.Form.verticalLabelPadding,
                marginLeft: token.Form.labelColonMarginInlineStart,
                color: token.colorText,
                display: 'block'
            }}>
                {t('date.dateOfBirth')}
                {isRequired && <span
                    style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
            </label>

            <InlineBlock>
                <>
                    {orderedKeys.map((item, index) => (
                        <div key={index} style={{width: '100%'}}>
                            {equalString(item, 'day') &&
                                <Select
                                    placeholder={'Day'}
                                    value={isNullOrEmpty(selectedDay) ? undefined : selectedDay}
                                    open={false}
                                    onDropdownVisibleChange={() => !toBoolean(disabled) && setIsDayDrawerOpen(true)}
                                    disabled={disabled}
                                    style={{width: '100%'}}
                                    status={hasError ? 'error' : ''}
                                >
                                    {daysOptions.map((option) => (
                                        <Select.Option
                                            key={option.Value}
                                            value={option.Value}
                                        >
                                            {option.Text.toString()}
                                        </Select.Option>
                                    ))}
                                </Select>
                            }

                            {equalString(item, 'month') &&
                                <Select
                                    placeholder='Month'
                                    value={isNullOrEmpty(selectedMonth) ? undefined : selectedMonth}
                                    open={false}
                                    onDropdownVisibleChange={() => !toBoolean(disabled) && setIsMonthDrawerOpen(true)}
                                    style={{width: '100%'}}
                                    className={styles.select}
                                    status={hasError ? 'error' : ''}
                                >
                                    {monthsOptions.map((option) => (
                                        <Select.Option
                                            key={`month_${option.Value}`}
                                            value={option.Value}
                                        >
                                            {option.Text.toString()}
                                        </Select.Option>
                                    ))}
                                </Select>
                            }

                            {equalString(item, 'year') &&
                                <Select
                                    placeholder={'Year'}
                                    value={isNullOrEmpty(selectedYear) ? undefined : selectedYear}
                                    open={false}
                                    onDropdownVisibleChange={() => !toBoolean(disabled) && setIsYearDrawerOpen(true)}
                                    onChange={setSelectedYear}
                                    disabled={disabled}
                                    style={{width: '100%'}}
                                    className={styles.select}
                                    status={hasError ? 'error' : ''}
                                >
                                    {yearOptions.map((option) => (
                                        <Select.Option
                                            key={option.Value}
                                            value={option.Value}
                                        >
                                            {option.Text.toString()}
                                        </Select.Option>
                                    ))}
                                </Select>
                            }
                        </div>
                    ))}
                    {(toBoolean(displayAge) && !isNullOrEmpty(age)) &&
                        <Input disabled={true}
                               style={{
                                   width: '350px',
                                   textAlign: 'center',
                                   color: token.colorTextLightSolid,
                                   fontWeight: 600,
                                   backgroundColor: token.colorPrimary
                               }}
                               value={age}/>
                    }
                </>
            </InlineBlock>

            {hasError && meta && typeof meta.error === 'string' ? (
                <Paragraph style={{color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart}}>
                    {meta.error}
                </Paragraph>
            ) : null}


            <DrawerBottom
                showDrawer={isDayDrawerOpen}
                closeDrawer={() => setIsDayDrawerOpen(false)}
                label={'Day'}
                showButton={!isRequired && toBoolean(showDayClear)}
                confirmButtonText={'Clear'}
                onConfirmButtonClick={() => {
                    setShowDayClear(false);
                    setSelectedDay(null);     
                    setIsDayDrawerOpen(false);
                }}
            >
                <FormDrawerRadio
                    options={daysOptions}
                    selectedCurrentValue={selectedDay}
                    onValueSelect={(option) => {
                        handleSelectOption(/*day*/ option.Value, /*month*/ null)
                    }}
                    name={'dob_day'}
                />
            </DrawerBottom>


            <DrawerBottom
                showDrawer={isMonthDrawerOpen}
                closeDrawer={() => setIsMonthDrawerOpen(false)}
                label={'Month'}
                showButton={!isRequired && toBoolean(showMonthClear)}
                confirmButtonText={'Clear'}
                onConfirmButtonClick={() => {
                    setShowMonthClear(false);
                    setSelectedMonth(null);
                    setIsMonthDrawerOpen(false);
                }}
            >
                <FormDrawerRadio
                    options={monthsOptions}
                    selectedCurrentValue={selectedMonth}
                    onValueSelect={(option) => {
                        handleSelectOption(/*day*/ null, /*month*/ option.Value)
                    }}
                    name={'dob_month'}
                />
            </DrawerBottom>

            <DrawerBottom
                showDrawer={isYearDrawerOpen}
                closeDrawer={() => setIsYearDrawerOpen(false)}
                label={'Year'}
                showButton={!isRequired && showYearClear}
                confirmButtonText={'Clear'}
                onConfirmButtonClick={() => {
                    setShowYearClear(false);
                    setSelectedYear(null);
                    setIsYearDrawerOpen(false);
                }}
            >
                <FormDrawerRadio
                    options={yearOptions}
                    selectedCurrentValue={selectedYear}
                    onValueSelect={(option) => {
                        handleSelectOption(/*day*/ null, /*month*/ null, /*year*/ option.Value)
                    }}
                    name={'dob_year'}
                />
            </DrawerBottom>
        </div>
    );
});

export default FormDateOfBirth;