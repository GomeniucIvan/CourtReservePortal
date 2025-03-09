import * as React from "react";
import PropTypes from "prop-types";
import { BaseView } from "../../components/BaseView.jsx";
import { VerticalResourceIterator} from "../common/VerticalResourceIterator.mjs";
import { dateTitle, messages, timeTitle, eventTitle, allDay, noEvents, agendaViewTitle } from "../../messages/index.mjs";
import { DAYS_IN_WEEK_COUNT} from "../../constants/index.mjs";
import { MS_PER_DAY, ZonedDate, firstDayInWeek, getDate, addDays } from "@progress/kendo-date-math";
import { useDir, classNames, IconWrap } from "@progress/kendo-react-common";
import { useInternationalization, useLocalization} from "../../intl/index.mjs";
import { toRanges } from "../../services/rangeService.mjs";
import { toOccurrences } from "../../services/occurrenceService.jsx";
import { toItems } from "../../services/itemsService.mjs";
import { mapItemsToSlots, mapSlotsToItems, toUTCDateTime } from "../../utils/index.jsx";
import { SchedulerEditTask } from "../../tasks/SchedulerEditTask.jsx";
import { SchedulerEditSlot } from "../../slots/SchedulerEditSlotDisplay.jsx";
import { useSchedulerPropsContext, useSchedulerDataContext , useSchedulerGroupsContext, useSchedulerFieldsContext, useSchedulerDateRangeContext } from "../../context/SchedulerContext.mjs";
import { SchedulerResourceIteratorContext } from "../../context/SchedulerResourceIteratorContext.mjs";
import { toSlots  } from "../../services/slotsServiceDisplay.js";
import { useCellSync} from "../../hooks/useCellSync.mjs";

export const AgendaView = (props) => {
    const {
        group,
        timezone,
        resources: propResources
    } = useSchedulerPropsContext();

    const EditTask = props.editTask || SchedulerEditTask;
    const EditSlot = props.editSlot || SchedulerEditSlot;

    const element = React.useRef(null);

    const dir = useDir(element);

    const intl = useInternationalization();
    const localization = useLocalization();
    const [data] = useSchedulerDataContext();

    const groups = useSchedulerGroupsContext();
    const fields = useSchedulerFieldsContext();
    const dateRange = useSchedulerDateRangeContext();

    const ranges = React.useMemo(
        () => toRanges(
            dateRange,
            { step: MS_PER_DAY, timezone }),
        [
            dateRange.start.getTime(),
            dateRange.end.getTime(),
            timezone
        ]);

    const slots = React.useMemo(
        () => toSlots(
            dateRange,
            { step: MS_PER_DAY },
            { groups, ranges }),
        [
            dateRange.start.getTime(),
            dateRange.end.getTime(),
            timezone,
            groups,
            ranges
        ]
    );

    const occurrences = React.useMemo(
        () => toOccurrences(data, { dateRange, fields, timezone }),
        [data, dateRange.start.getTime(), dateRange.end.getTime(), fields, timezone]
    );

    const items = React.useMemo(
        () => toItems(occurrences, { timezone }, { groups, ranges }),
        [occurrences, timezone, groups, ranges]
    );

    const className = React.useMemo(
        () => classNames(
            'k-scheduler-agendaview',
            props.className
        ),
        [props.className]
    );

    useCellSync({ element, selector: '.k-scheduler-datecolumn', explicitDepth: false });
    useCellSync({ element, selector: '.k-scheduler-timecolumn', explicitDepth: false });

    React.useMemo(() => mapItemsToSlots(items, slots, true), [items, slots]);
    React.useMemo(() => mapSlotsToItems(items, slots, true), [items, slots]);
    
    return (
        <BaseView
            ref={element}
            id={props.id}
            style={props.style}
            className={className}

            props={props}
            slots={items}
            ranges={ranges}
        >
            <div className="k-scheduler-head">
                <VerticalResourceIterator resources={propResources} group={group}>
                    <SchedulerResourceIteratorContext.Consumer>
                        {({ groupIndex }) => (
                            <div className="k-scheduler-row" key={groupIndex}>
                                <div className="k-scheduler-cell k-heading-cell k-group-cell k-scheduler-datecolumn">
                                    {localization.toLanguageString(dateTitle, messages[dateTitle])}
                                </div>
                                <div className="k-scheduler-cell k-heading-cell k-group-cell k-scheduler-timecolumn">
                                    {localization.toLanguageString(timeTitle, messages[timeTitle])}
                                </div>
                                <div className="k-scheduler-cell k-heading-cell k-scheduler-eventcolumn">
                                    {localization.toLanguageString(eventTitle, messages[eventTitle])}
                                </div>
                            </div>)}
                    </SchedulerResourceIteratorContext.Consumer>
                </VerticalResourceIterator>
            </div>
            <div className="k-scheduler-body">
                <VerticalResourceIterator resources={propResources} group={group} nested={true}>
                    <SchedulerResourceIteratorContext.Consumer>
                        {({ groupIndex }) => {
                            return slots
                                .filter((slot) => slot.group.index === (groupIndex || 0))
                                .map((slot, slotIndex, filtered) => {
                                    return (
                                        <div className="k-scheduler-row  k-scheduler-content" key={`${groupIndex}:${slotIndex}`}>
                                            <EditSlot
                                                {...slot}
                                                editable={props.editable}
                                                row={(filtered.length * (groupIndex || 0) + slotIndex)}
                                                col={0}
                                                slot={props.slot}
                                                viewSlot={props.viewSlot}
                                                className="k-scheduler-datecolumn k-group-cell"
                                            >
                                                <div className={'k-agenda-date-display'}>
                                                    <strong className="k-scheduler-agendaday">
                                                        {intl.formatDate(slot.zonedStart, 'dd')}
                                                    </strong>
                                                    <em className="k-scheduler-agendaweek">
                                                        {intl.formatDate(slot.zonedStart, 'EEEE')}
                                                    </em>
                                                    <span className="k-scheduler-agendadate">
                                                        {intl.formatDate(slot.zonedStart, 'y')}
                                                    </span>
                                                </div>
                                            </EditSlot>
                                            <div className="k-scheduler-cell k-group-content">
                                                {slot.items.length
                                                    ? slot.items.map((item, itemIndex) => (
                                                        <div className="k-scheduler-row" key={itemIndex}>
                                                            <div className="k-scheduler-cell k-scheduler-timecolumn"
                                                                 dangerouslySetInnerHTML={{__html: getTimeFormat(intl, item)}}/>
                                                            
                                                            {/*<div className="k-scheduler-cell k-scheduler-timecolumn">*/}
                                                            {/*    {getTimeFormat(intl, item)}*/}
                                                            {/*    /!*{item.isAllDay*!/*/}
                                                            {/*    /!*    ? localization.toLanguageString(allDay, messages[allDay])*!/*/}
                                                            {/*    /!*    : getTimeFormat(intl, item)}*!/*/}
                                                            {/*</div>*/}
                                                            <div className="k-scheduler-cell k-cell-agenda">
                                                                <EditTask
                                                                    key={`${slotIndex}:${itemIndex}`}
                                                                    {...item}
                                                                    onDataAction={props.onDataAction}
                                                                    task={props.task}
                                                                    viewTask={props.viewTask}
                                                                    editable={props.editable}
                                                                />
                                                            </div>
                                                        </div>

                                                    ))
                                                    : <div className="k-scheduler-cell k-heading-cell k-group-cell">
                                                        {localization.toLanguageString(noEvents, messages[noEvents])}
                                                    </div>
                                                }
                                            </div>
                                        </div>);
                                });
                        }}
                    </SchedulerResourceIteratorContext.Consumer>
                </VerticalResourceIterator>
            </div>
        </BaseView>
    );
};

const getTimeFormat = (intl, props) => {
    let format = '<div>{0:t}</div> <div>{1:t}</div>';

    if (props.head) {
        format = '{0:t}';
    } else if (props.tail) {
        format = '{1:t}';
    }

    return intl.format(format, props.zonedStart, props.zonedEnd);
};

const GET_START_DATE = (date) => getDate(date);
const GET_END_DATE = (start, numberOfDays) => getDate(addDays(start, numberOfDays || 1));

const agendaViewDateRange = ({ intl, date, numberOfDays = 1, timezone, startDayOfTheWeek }) => {
    const normalized = ZonedDate.fromLocalDate(date, timezone);

    const firstDate = numberOfDays === DAYS_IN_WEEK_COUNT
        ? GET_START_DATE(firstDayInWeek(normalized, intl.firstDay(startDayOfTheWeek)))
        : GET_START_DATE(normalized);

    const lastDate = GET_END_DATE(firstDate, numberOfDays);

    const zonedStart = ZonedDate.fromUTCDate(toUTCDateTime(firstDate), timezone);
    const zonedEnd = ZonedDate.fromUTCDate(toUTCDateTime(lastDate), timezone);

    const start = new Date(zonedStart.getTime());
    const end = new Date(zonedEnd.getTime());

    return {
        start,
        end,
        zonedStart,
        zonedEnd
    };
};

export const agendaViewDefaultProps = {
    name: 'agenda',

    title: (localization) => localization.toLanguageString(agendaViewTitle, messages[agendaViewTitle]),
    dateRange: agendaViewDateRange,
    selectedDateFormat: '{0:D} - {1:D}',
    selectedShortDateFormat: '{0:d} - {1:d}',

    slotDuration: 60 * 24,
    slotDivision: 1,
    step: DAYS_IN_WEEK_COUNT,
    numberOfDays: DAYS_IN_WEEK_COUNT,
    startDayOfTheWeek: 0
};

const propTypes = {
    title: PropTypes.any
};

AgendaView.propTypes = propTypes;
AgendaView.displayName = 'KendoReactSchedulerAgendaView';