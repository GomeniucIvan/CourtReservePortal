import * as React from "react";
import { getModelFields, toSchedulerGroups, findMaster, setField, getField, getToday } from "./utils/index.mjs";
import { useRtl as useDir, clone, classNames } from "@progress/kendo-react-common";
import { SchedulerContext } from "./context/SchedulerContext.mjs";
import { useControlledState } from "./hooks/useControlledState.mjs";
import { useInternationalization, useLocalization } from "@progress/kendo-react-intl";
import { SchedulerHeader } from "./components/header/SchedulerHeader.mjs";
import { SchedulerNavigation } from "./components/header/navigation/SchedulerNavigation.mjs";
import { SchedulerViewSelector } from "./components/header/view-selector/SchedulerViewSelector.mjs";
import { addMonths, addDays } from "@progress/kendo-date-math";
import { ButtonGroup, Button, ToolbarSpacer } from "@progress/kendo-react-buttons";
import { today, messages, previousTitle, nextTitle } from "./messages/index.mjs";
import { NavigationDatePicker } from "./components/header/navigation/NavigationDatePicker.jsx";
import { ViewSelectorList } from "./components/header/view-selector/ViewSelectorList.mjs";
import { DayView, dayViewDefaultProps } from "./views/day/DayViewDisplay.jsx";
import { caretAltRightIcon, caretAltLeftIcon, clockIcon } from "@progress/kendo-svg-icons";
import { DATA_ACTION } from "./constants/index.mjs";
import { AgendaView, agendaViewDefaultProps } from "./views/agenda/AgendaView.mjs";
import { MonthView, monthViewDefaultProps } from "./views/month/MonthView.mjs";
import { WeekView, weekViewDefaultProps } from "./views/week/WeekView.mjs";
import { WorkWeekView, workWeekDefaultProps } from "./views/week/WorkWeekView.mjs";
import { TimelineView, timeLineViewDefaultProps } from "./views/time/TimelineView.mjs";

const DEFAULT_DATE_FORMAT = '{0:D}';
const DEFAULT_SHORT_DATE_FORMAT = '{0:d}';
const DEFAULT_SCHEDULER_ROLE = 'application';


const viewDefaultPropsMap = new Map();
viewDefaultPropsMap.set(AgendaView, agendaViewDefaultProps);
viewDefaultPropsMap.set(DayView, dayViewDefaultProps);
viewDefaultPropsMap.set(MonthView, monthViewDefaultProps);
viewDefaultPropsMap.set(WeekView, weekViewDefaultProps);
viewDefaultPropsMap.set(WorkWeekView, workWeekDefaultProps);
viewDefaultPropsMap.set(TimelineView, timeLineViewDefaultProps);

export const InnerScheduler = React.forwardRef((props, ref) => {
    const {
        timezone,
        onDataChange
    } = props;

    const element = React.useRef(null);
    const scheduler = React.useRef(null);

    React.useImperativeHandle(scheduler, () => ({ props, element: element.current }));
    React.useImperativeHandle(ref, () => scheduler.current);

    const dir = useDir(element);
    const intl = useInternationalization();
    const localization = useLocalization();
    const { fields }
        = React.useMemo(() => getModelFields(props.modelFields), [props.modelFields]);

    const [
        date,
        setDate
    ] = useControlledState(props.defaultDate || schedulerDefaultProps.defaultDate, props.date, props.onDateChange);

    const views = React.Children.toArray(props.children || []).map((v) => React.isValidElement(v)
        ? React.cloneElement(v, { ...viewDefaultPropsMap.get(v.type), ...v.props })
        : v);
    const defaultView = React.cloneElement(<DayView />, viewDefaultPropsMap.get(DayView));

    const [
        activeViewName,
        setActiveViewName
    ] = useControlledState(props.defaultView || (views[0] && views[0].props.name) || 'day', props.view, props.onViewChange);

    const [
        showWorkHours,
        setShowWorkHours
    ] = useControlledState(true);

    const view = views.find((currentView) => currentView.props.name === activeViewName)
        || views[0]
        || defaultView;

    const data = (props.data ?? schedulerDefaultProps.data) || schedulerDefaultProps.data;
    const groups = toSchedulerGroups(props.group, props.resources);
    const orientation = props.group && props.group.orientation ? props.group.orientation : 'horizontal';

    const dateFormat = view.props.selectedDateFormat || DEFAULT_DATE_FORMAT;
    const shortDateFormat = view.props.selectedShortDateFormat || DEFAULT_SHORT_DATE_FORMAT;

    const slotDuration = view.props.slotDuration;

    const dateRange = (view.props.dateRange !== undefined
        ? typeof view.props.dateRange === 'function'
            ? view.props.dateRange.call(undefined, {
                intl,
                date,
                timezone,
                numberOfDays: view.props.numberOfDays,
                workWeekStart: view.props.workWeekStart || intl.firstDay(),
                workWeekEnd: view.props.workWeekEnd || (intl.firstDay() + view.props.numberOfDays) % 6
            })
            : view.props.dateRange
        : { start: schedulerDefaultProps.defaultDate, end: schedulerDefaultProps.defaultDate });

    const handleDataChange = React.useCallback(
        ({ created = [], updated = [], deleted = [] }) => {
            if (onDataChange) {
                const args = {
                    created,
                    updated,
                    deleted
                };

                onDataChange.call(undefined, args);
            }
        },
        [onDataChange]
    );

    const handleCreate = React.useCallback(
        (action) => {
            const created = [action.dataItem];
            handleDataChange({ created });
        },
        [handleDataChange]
    );

    const handleUpdate = React.useCallback(
        (action) => {
            const created = [];
            const updated = [];

            if (action.series) {
                if (Array.isArray(action.dataItem)) {
                    action.dataItem.map((dataItem) => {
                        const masterClone = clone(findMaster(action.dataItem, fields, data));
                        const newDataItem = clone(dataItem);

                        setField(newDataItem, fields.originalStart, getField(masterClone, fields.originalStart));
                        setField(newDataItem, fields.recurrenceId, getField(masterClone, fields.recurrenceId));
                        setField(newDataItem, fields.recurrenceExceptions, getField(masterClone, fields.recurrenceExceptions));
                        updated.push(newDataItem);
                    });
                } else {
                    const masterClone = clone(findMaster(action.dataItem, fields, data));
                    const newDataItem = clone(action.dataItem);

                    setField(newDataItem, fields.originalStart, getField(masterClone, fields.originalStart));
                    setField(newDataItem, fields.recurrenceId, getField(masterClone, fields.recurrenceId));
                    setField(newDataItem, fields.recurrenceExceptions, getField(masterClone, fields.recurrenceExceptions));
                    updated.push(newDataItem);
                }
            } else {
                if (Array.isArray(action.dataItem)) {
                    action.dataItem.map((dataItem) => {
                        const isException = getField(dataItem, fields.recurrenceRule) !== null
                            && getField(dataItem, fields.recurrenceRule) !== undefined;
                        const isRecurring = getField(dataItem, fields.recurrenceId) !== null
                            && getField(dataItem, fields.recurrenceId) !== undefined;

                        if (isRecurring && isException) {
                            const masterClone = clone(findMaster(dataItem, fields, data));

                            const exceptionDate = getField(dataItem, fields.originalStart);
                            const currentExceptions = getField(masterClone, fields.recurrenceExceptions) || [];

                            setField(masterClone, fields.recurrenceExceptions, [...currentExceptions, exceptionDate]);
                            setField(dataItem, fields.recurrenceRule, null);

                            updated.push(masterClone);
                            created.push(dataItem);
                        } else {
                            updated.push(dataItem);
                        }
                    });
                } else {
                    const isException = getField(action.dataItem, fields.recurrenceRule) !== null
                        && getField(action.dataItem, fields.recurrenceRule) !== undefined;
                    const isRecurring = getField(action.dataItem, fields.recurrenceId) !== null
                        && getField(action.dataItem, fields.recurrenceId) !== undefined;

                    if (isRecurring && isException) {
                        const masterClone = clone(findMaster(action.dataItem, fields, data));

                        const exceptionDate = getField(action.dataItem, fields.originalStart);
                        const currentExceptions = getField(masterClone, fields.recurrenceExceptions) || [];

                        setField(masterClone, fields.recurrenceExceptions, [...currentExceptions, exceptionDate]);
                        setField(action.dataItem, fields.recurrenceRule, null);

                        updated.push(masterClone);
                        created.push(action.dataItem);
                    } else {
                        updated.push(action.dataItem);

                    }
                }
            }

            handleDataChange({ updated, created });
        },
        [handleDataChange, fields, data]
    );

    const handleRemove = React.useCallback(
        (action) => {
            const updated = [];
            const deleted = [];

            if (action.series) {
                const masterClone = clone(findMaster(action.dataItem, fields, data));
                const dataItem = clone(action.dataItem);

                setField(dataItem, fields.originalStart, getField(masterClone, fields.originalStart));
                setField(dataItem, fields.recurrenceId, getField(masterClone, fields.recurrenceId));
                setField(dataItem, fields.recurrenceRule, getField(masterClone, fields.recurrenceRule));
                setField(dataItem, fields.recurrenceExceptions, getField(masterClone, fields.recurrenceExceptions));

                deleted.push(dataItem);
            } else {
                const isException = getField(action.dataItem, fields.recurrenceRule) !== null
                    && getField(action.dataItem, fields.recurrenceRule) !== undefined;

                if (!isException) {
                    deleted.push(action.dataItem);
                } else {
                    const masterClone = clone(findMaster(action.dataItem, fields, data));

                    const exceptionDate = getField(action.dataItem, fields.originalStart);
                    const currentExceptions = getField(masterClone, fields.recurrenceExceptions) || [];

                    setField(masterClone, fields.recurrenceExceptions, [...currentExceptions, exceptionDate]);
                    setField(action.dataItem, fields.recurrenceRule, null);

                    updated.push(masterClone);
                }
            }

            handleDataChange({ updated, deleted });
        },
        [handleDataChange, fields, data]
    );

    const handleDataAction = React.useCallback(
        (action) => {
            switch (action.type) {
                case DATA_ACTION.create:
                    handleCreate(action);
                    break;
                case DATA_ACTION.update:
                    handleUpdate(action);
                    break;
                case DATA_ACTION.remove:
                    handleRemove(action);
                    break;
                default:
                    break;
            }
        },
        [handleCreate, handleRemove, handleUpdate]
    );

    const handleActiveViewNameChange = React.useCallback(
        (newView, event) => {
            setActiveViewName(newView, {
                ...event,
                target: scheduler.current
            });
        },
        [
            setActiveViewName,
            scheduler
        ]);

    const handleDateChange = React.useCallback(
        (newDate, event) => {

            const elementDiv = element.current;
            if (elementDiv) {
                elementDiv.classList.add('--loading');
            }

            setTimeout(function () {
                setDate(newDate, {
                    ...event,
                    target: scheduler.current
                });
            }, 50)
        },
        [
            setDate,
            scheduler
        ]
    );

    const handleDatePickerChange = React.useCallback(
        (event) => {
            if (!event.value) { return; }

            const elementDiv = element.current;
            if (elementDiv) {
                elementDiv.classList.add('--loading');
            }

            setTimeout(function () {
                setDate(event.value, {
                    ...event,
                    target: scheduler.current,
                    nativeEvent: event.nativeEvent
                });
            }, 50)
        },
        [
            setDate,
            scheduler
        ]
    );

    const handleNextClick = React.useCallback(
        (syntheticEvent) => {
            syntheticEvent.preventDefault();

            const elementDiv = element.current;
            if (elementDiv) {
                elementDiv.classList.add('--loading');
            }

            setTimeout(function () {
                const offset = view.props.numberOfDays || 1;
                const isMonthView = offset > 27;
                const newDate = isMonthView
                    ? addMonths(date, Math.round(offset / 27))
                    : addDays(date, offset);
                // eslint-disable-next-line no-restricted-globals
                setDate(newDate, event);
            }, 50);
        },
        [date, setDate, view.props.numberOfDays]
    );

    const handlePrevClick = React.useCallback(
        (syntheticEvent) => {
            syntheticEvent.preventDefault();

            const elementDiv = element.current;
            if (elementDiv) {
                elementDiv.classList.add('--loading');
            }

            const offset = view.props.numberOfDays || 1;
            const isMonthView = offset > 27;
            const newDate = isMonthView
                ? addMonths(date, -(Math.round(offset / 27)))
                : addDays(date, -(offset));
            // eslint-disable-next-line no-restricted-globals
            setDate(newDate, event);
        },
        [date, setDate, view.props.numberOfDays]
    );

    const handleTodayClick = React.useCallback(
        (syntheticEvent) => {
            syntheticEvent.preventDefault();
            const newDate = getToday();
            // eslint-disable-next-line no-restricted-globals
            setDate(newDate, event);
        },
        [setDate]
    );

    const handleShowWorkHoursClick = React.useCallback(
        () => { setShowWorkHours(!showWorkHours); },
        [setShowWorkHours, showWorkHours]
    );

    const handleFocus = React.useCallback(
        () => {
            if (element.current) {
                element.current.style.boxShadow = '0 0.5px 0.5px 0.5px rgba(0, 0, 0, .12)';
            }
        },
        [element]
    );

    const handleBlur = React.useCallback(
        () => {
            if (element.current) {
                element.current.style.boxShadow = '';
            }
        },
        [element]
    );

    const style = React.useMemo(
        () => ({ ...props.style, height: props.height ?? schedulerDefaultProps.height }),
        [props.height, props.style]
    );

    const className = React.useMemo(
        () => classNames(
            { 'k-rtl': props.rtl !== undefined ? props.rtl : dir === 'rtl' },
            'k-widget k-scheduler k-floatwrap k-pos-relative',
            props.className
        ),
        [props.className, props.rtl, dir]);

    const todayText = localization.toLanguageString(today, messages[today]);
    const previousText = localization.toLanguageString(previousTitle, messages[previousTitle]);
    const nextText = localization.toLanguageString(nextTitle, messages[nextTitle]);

    const Header = view.props.header || props.header || schedulerDefaultProps.header;

    const Navigation = SchedulerNavigation;

    const [eventSelection, setEventSelection] = React.useState(null);

    return (
        <SchedulerContext
            // Static
            element={element}
            props={props}
            views={views}
            fields={fields}
            groups={groups}
            dateRange={dateRange}
            orientation={orientation}
            dateFormat={{ dateFormat, shortDateFormat }}

            // State
            date={[date, handleDateChange]}
            activeView={[activeViewName, handleActiveViewNameChange]}
            selection={[eventSelection, setEventSelection]}

            // Reducers
            data={[data, handleDataAction]}
        >
            <div
                ref={element}
                id={props.id}
                style={style}
                className={`${className} rct-sched-wrapper`}
                tabIndex={props.tabIndex ?? schedulerDefaultProps.tabIndex}

                // Aria
                dir={dir}
                role={props.role || DEFAULT_SCHEDULER_ROLE}
                aria-label={props.ariaLabel}
                aria-labelledby={props.ariaLabelledby}
                aria-activedescendant={(eventSelection && eventSelection.props.id) || undefined}

                // Handlers
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <Header>
                    <Navigation>
                        <ButtonGroup className="k-scheduler-navigation">
                            <Button
                                role="button"
                                tabIndex={-1}
                                title={todayText}
                                aria-label={todayText}
                                onClick={handleTodayClick}
                            >
                                {todayText}
                            </Button>
                            <Button
                                role="button"
                                tabIndex={-1}
                                icon={dir === 'rtl' ? 'caret-alt-right' : 'caret-alt-left'}
                                svgIcon={dir === 'rtl' ? caretAltRightIcon : caretAltLeftIcon}
                                title={previousText}
                                aria-label={previousText}
                                onClick={handlePrevClick}
                            />
                            <Button
                                role="button"
                                tabIndex={-1}
                                icon={dir === 'rtl' ? 'caret-alt-left' : 'caret-alt-right'}
                                svgIcon={dir === 'rtl' ? caretAltLeftIcon : caretAltRightIcon}
                                title={nextText}
                                aria-label={nextText}
                                onClick={handleNextClick}
                            />
                        </ButtonGroup>
                    </Navigation>
                    <NavigationDatePicker
                        value={date}
                        onChange={handleDatePickerChange}
                    />
                    <ToolbarSpacer />
                    <ViewSelectorList />
                </Header>
                {view && (<view.type
                    editable={props.editable ?? schedulerDefaultProps.editable}
                    key={view.props.name}
                    item={props.item}
                    viewItem={props.viewItem}
                    editItem={props.editItem}
                    task={props.task}
                    viewTask={props.viewTask}
                    editTask={props.viewTask}
                    slot={props.slot}
                    viewSlot={props.viewSlot}
                    editSlot={props.editSlot}
                    form={props.form}
                    onDataAction={handleDataAction}
                    showWorkHours={showWorkHours}
                    {...view.props}
                />)}
            </div>
        </SchedulerContext>
    );
});

export const schedulerDefaultProps = {
    data: [],
    height: 600,
    tabIndex: -1,
    editable: false,
    defaultDate: new Date(),
    header: SchedulerHeader,
    navigation: SchedulerNavigation,
    viewSelector: SchedulerViewSelector
};
