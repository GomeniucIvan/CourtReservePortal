import React, { useEffect, useRef, useImperativeHandle, useState } from 'react';
import {useStyles} from "./styles.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {cultureStartingWithDay} from "../../utils/DateUtils.jsx";
import {cx} from "antd-style";
import InlineBlock from "../../components/inlineblock/InlineBlock.jsx";
import {Select, Typography} from "antd";
import DrawerBottom from "../../components/drawer/DrawerBottom.jsx";
import FormDrawerRadio from "../formradio/FormDrawerRadio.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {genderList} from "../../utils/SelectUtils.jsx";
const { Paragraph } = Typography;

const FormDateOfBirth = React.forwardRef(({ uiCulture, name, form, required, dateOfBirthValue, disabled, onDateChange, ...props }, ref) => {
    const [isDayDrawerOpen, setIsDayDrawerOpen] = useState(false);
    const [isMonthDrawerOpen, setIsMonthDrawerOpen] = useState(false);
    const [isYearDrawerOpen, setIsYearDrawerOpen] = useState(false);

    const [selectedDay, setSelectedDay] = useState(undefined);
    const [selectedMonth, setSelectedMonth] = useState(undefined);
    const [selectedYear, setSelectedYear] = useState(undefined);
    const [daysOptions, setDaysOptions] = useState([]);
    const {globalStyles, token} = useApp();
    const styles = useStyles();
    
    const minYear = 1900;
    const maxYear = new Date().getFullYear();
    const isRequired = toBoolean(required);

    useImperativeHandle(ref, () => ({
        reset: () => {
            setSelectedDay(null);
            setSelectedMonth(null);
            setSelectedYear(null);
        }
    }));

    useEffect(() => {
        if (!isNullOrEmpty(form.values.DateOfBirth) && isNullOrEmpty(dateOfBirthValue)) {
            const date = new Date(form.values.DateOfBirth);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const dayOption = { Value: day, Text: day.toString() };

            const monthOption = monthsOptions.find(option => option.Value === month);
            const yearOption = yearsOptions.find(option => option.Value === year);

            setSelectedDay(dayOption);
            setSelectedMonth(monthOption);
            setSelectedYear(yearOption);
        }
        if (!isNullOrEmpty(dateOfBirthValue) && isNullOrEmpty(form.values.DateOfBirth)) {
            const date = new Date(dateOfBirthValue);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const dayOption = { Value: day, Text: day.toString() };

            const monthOption = monthsOptions.find(option => option.Value === month);
            const yearOption = yearsOptions.find(option => option.Value === year);

            setSelectedDay(dayOption);
            setSelectedMonth(monthOption);
            setSelectedYear(yearOption);
        }

    }, [form.values?.DateOfBirth]);

    const formatDateOfBirthByUiCulture = (day, month, year) => {
        if (isNullOrEmpty(day) && isNullOrEmpty(month) && isNullOrEmpty(year)) {
            form.setFieldValue(name, null);
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
            form.setFieldValue(name, `${day}/${month}/${year}`);
        }
        else if (equalString(regionCode, "tr-TR")) {
            form.setFieldValue(name, `${day}.${month}.${year}`);
        }
        else {
            form.setFieldValue(name, `${month}/${day}/${year}`);
        }
    }

    useEffect(() => {
        let daysInMonth;
        if (selectedYear && selectedMonth) {
            daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        } else {
            daysInMonth = 31;
        }

        const newDaysOptions = Array.from({ length: daysInMonth }, (_, i) => ({ Value: i + 1, Text: i + 1 }));
        setDaysOptions(newDaysOptions);

        if (selectedDay && selectedDay > daysInMonth) {
            setSelectedDay(null);
            form.setFieldValue(name, null);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        if (onDateChange) {
            onDateChange(selectedDay, selectedMonth, selectedYear);
        }

        if (selectedDay && selectedMonth && selectedYear) {
            formatDateOfBirthByUiCulture(selectedDay, selectedMonth, selectedYear);
        } else {
            form.setFieldValue(name, null);
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthsOptions = Array.from({ length: 12 }, (_, i) => ({
        Value: i + 1,
        Text: monthNames[i]
    }));

    const yearsOptions = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
        Value: maxYear - i,
        Text: maxYear - i
    }));

    let field = '';
    let meta = null;

    if (form && typeof form.getFieldProps === 'function') {
        field = form.getFieldProps(name);
        meta = form.getFieldMeta(name);
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
    
    if (isStartingWithDay){
        orderedKeys.push('day');
        orderedKeys.push('month');
        orderedKeys.push('year');
    } else{
        orderedKeys.push('month');
        orderedKeys.push('day');
        orderedKeys.push('year');  
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
                Date of Birth
                {isRequired && <span
                    style={{color: token.Form.labelRequiredMarkColor, marginLeft: token.Form.marginXXS}}>*</span>}
            </label>
            
            <InlineBlock>
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
                                {yearsOptions.map((option) => (
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
            </InlineBlock>

            {hasError && meta && typeof meta.error === 'string' ? (
                <Paragraph style={{ color: token.Form.colorError, marginLeft: token.Form.labelColonMarginInlineStart }}>
                    {meta.error}
                </Paragraph>
            ) : null}


            <DrawerBottom
                showDrawer={isDayDrawerOpen}
                closeDrawer={() => setIsDayDrawerOpen(false)}
                label={'Day'}
                showButton={!isRequired}
                confirmButtonText={'Clear'}
                onConfirmButtonClick={() => setSelectedDay(null)}
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
                showButton={!isRequired}
                confirmButtonText={'Clear'}
                onConfirmButtonClick={() => setSelectedMonth(null)}
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
                showButton={!isRequired}
                confirmButtonText={'Clear'}
                onConfirmButtonClick={() => setSelectedYear(null)}
            >
                <FormDrawerRadio
                    options={yearsOptions}
                    selectedCurrentValue={selectedYear}
                    onValueSelect={(option) => {handleSelectOption(/*day*/ null, /*month*/ null, /*year*/ option.Value)}}
                    name={'dob_year'}
                />
            </DrawerBottom>
        </div>
    );
});

export default FormDateOfBirth;