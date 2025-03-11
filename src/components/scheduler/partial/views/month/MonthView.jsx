import * as React from "react";
import PropTypes from 'prop-types';
import { BaseView} from "../../components/BaseView.jsx";
import { ZonedDate, MS_PER_DAY, firstDayInWeek, firstDayOfMonth, getDate, addDays, lastDayOfMonth } from "@progress/kendo-date-math";
import { classNames } from "@progress/kendo-react-common";
import { VerticalResourceIterator} from "../common/VerticalResourceIterator.mjs";
import { HorizontalResourceIterator } from "../common/HorizontalResourceIterator.jsx";
import { mapItemsToSlots, mapSlotsToItems, orderSort, toUTCDateTime } from "../../utils/index.jsx";
import { monthViewTitle, messages } from "../../messages/index.mjs";
import { SchedulerEditSlot } from "../../slots/SchedulerEditSlotDisplay.jsx";
import { useInternationalization } from "../../intl/index.mjs";
import { DAYS_IN_WEEK_COUNT } from "../../constants/index.mjs";
import { toRanges} from "../../services/rangeService.jsx";
import { toSlots } from "../../services/slotsServiceDisplay.js";
import { toOccurrences} from "../../services/occurrenceService.jsx";
import { toItems} from "../../services/itemsService.mjs";
import { ShowMoreItemsButton } from "../../components/ShowMoreItemsButton.jsx";
import { SchedulerEditItem } from "../../items/SchedulerEditItemDisplay.jsx";
import { useSchedulerPropsContext, useSchedulerDataContext, useSchedulerDateContext, useSchedulerActiveViewContext, useSchedulerViewsContext, useSchedulerGroupsContext, useSchedulerOrientationContext, useSchedulerDateRangeContext, useSchedulerFieldsContext } from "../../context/SchedulerContext.jsx";
import { SchedulerResourceIteratorContext } from "../../context/SchedulerResourceIteratorContext.mjs";
import { DateHeaderCell } from "../../components/DateHeaderCell.jsx";

const DAY_FORMAT = { skeleton: 'dd' };

export const MonthView = (props) => {
    const {
        group,
        timezone,
        resources: propResources
    } = useSchedulerPropsContext();

    const EditItem = props.editItem || SchedulerEditItem;
    const EditSlot = props.editSlot || SchedulerEditSlot;

    const [data] = useSchedulerDataContext();
    const [, setDate] = useSchedulerDateContext();
    const [, setView] = useSchedulerActiveViewContext();

    const views = useSchedulerViewsContext();
    const groups = useSchedulerGroupsContext();
    const orientation = useSchedulerOrientationContext();
    const dateRange = useSchedulerDateRangeContext();

    const intl = useInternationalization();
    const fields = useSchedulerFieldsContext();

    const itemsPerSlot = props.itemsPerSlot || monthViewDefaultProps.itemsPerSlot;
    
    const ranges = React.useMemo(
        () => toRanges(
            dateRange,
            { step: (MS_PER_DAY * DAYS_IN_WEEK_COUNT), timezone }),
        [dateRange.start.getTime(), dateRange.end.getTime(), timezone]
    );

    const slots = React.useMemo(
        () => toSlots(
            dateRange,
            { step: MS_PER_DAY },
            { groups, ranges }),
        [
            dateRange.start.getTime(),
            dateRange.end.getTime(),
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

    const handleShowMoreItemsClick = React.useCallback(
        (event) => {
            const newView = views.find((vw) => vw.props.name === 'day');
            if (!setView || !newView || !newView.props.name || !event.target.slot) { return; }
            setView(newView.props.name, event);
            setDate(event.target.slot.start, event);
        },
        [
            setView,
            views
        ]);

    React.useMemo(() => mapItemsToSlots(items, slots, true), [items, slots]);
    React.useMemo(() => mapSlotsToItems(items, slots, true), [items, slots]);

    const head = (
        <SchedulerResourceIteratorContext.Consumer>
            {({ groupIndex }) => (
                <div className="k-scheduler-row" key={groupIndex}>
                    {slots
                        .filter(slot => slot.group.index === groupIndex && slot.range.index === 0)
                        .map((slot, slotIndex) => (
                            <DateHeaderCell
                                as={props.dateHeaderCell}
                                key={slotIndex}
                                data-dayslot-index={slotIndex}
                                date={
                                    ZonedDate.fromLocalDate(
                                        new Date(slot.zonedEnd.getTime() - ((slot.zonedEnd.getTime() - slot.zonedStart.getTime()) / 2)),
                                        timezone)
                                }
                                start={slot.start}
                                end={slot.end}
                                format={{ skeleton: 'EEEE' }}
                            />
                        ))}
                </div>
            )}
        </SchedulerResourceIteratorContext.Consumer>
    );

    const body = (
        <SchedulerResourceIteratorContext.Consumer>
            {({ groupIndex }) => (
                ranges.map((_, rangeIndex) => (
                    <div className="k-scheduler-row" key={rangeIndex}>
                        {slots
                            .filter(slot => slot.group.index === groupIndex && slot.range.index === rangeIndex)
                            .map((slot, slotIndex, filtered) => (
                                <EditSlot
                                    slot={props.slot}
                                    viewSlot={props.viewSlot}
                                    selectedView={props.selectedView}
                                    key={slotIndex}
                                    form={props.form}
                                    {...slot}
                                    expandable={{offsetTop: 30, offsetBottom: (itemsPerSlot < slot.items.length) ? 15 : 0}}
                                    onDataAction={props.onDataAction}
                                    col={orientation === 'horizontal'
                                        ? ((filtered.length * (groupIndex || 0)) + slotIndex)
                                        : slotIndex}
                                    row={orientation === 'horizontal'
                                        ? rangeIndex
                                        : ((ranges.length * (groupIndex || 0)) + rangeIndex)
                                    }
                                    editable={props.editable}
                                >
                          <span className="k-link k-nav-day">
                            {intl.formatDate(
                                new Date(slot.end.getTime() - ((slot.end.getTime() - slot.start.getTime()) / 2)),
                                DAY_FORMAT)}
                          </span>
                                    {(itemsPerSlot < slot.items.length) && (
                                        <ShowMoreItemsButton slot={slot} onClick={handleShowMoreItemsClick} />
                                    )}
                                </EditSlot>
                            ))}
                    </div>
                ))
            )}
        </SchedulerResourceIteratorContext.Consumer>
    );

    return (
        <BaseView
            props={props}
            slots={slots}
            ranges={ranges}
            className={classNames('k-scheduler-monthview', props.className)}
        >
            <div className="k-scheduler-head">
                {orientation === 'horizontal'
                    ? <HorizontalResourceIterator nested={true} resources={propResources} group={group}>
                        {head}
                    </HorizontalResourceIterator>
                    : <VerticalResourceIterator resources={propResources} group={group}>
                        {head}
                    </VerticalResourceIterator>}
            </div>
            <div className="k-scheduler-body k-scheduler-body-monthly" style={{minHeight: `${props.height -56 - 40}px`}}>
                {orientation === 'horizontal'
                    ? <HorizontalResourceIterator resources={propResources} group={group}>
                        {body}
                    </HorizontalResourceIterator>
                    : <VerticalResourceIterator nested={true} resources={propResources} group={group} >
                        {body}
                    </VerticalResourceIterator>}
                {items
                    .filter((item) => item.order === null || item.order < itemsPerSlot)
                    .sort(orderSort)
                    .map((item) => (
                        <EditItem
                            item={props.item}
                            viewItem={props.viewItem}
                            selectedView={props.selectedView}
                            form={props.form}
                            key={item.isRecurring
                                ? `${item.uid}:${item.group.index}:${item.range.index}:${item.originalStart}`
                                : `${item.uid}:${item.group.index}:${item.range.index}`}
                            {...item}
                            onDataAction={props.onDataAction}
                            style={{ transform: 'translateY(30px)' }}
                            vertical={false}
                            editable={props.editable}
                            ignoreIsAllDay={true}
                        />
                    ))}
            </div>
        </BaseView>
    );
};

const monthViewDateRange = ({ intl, date, timezone, startDayOfTheWeek }) => {
    // The DateRange start from the first day of the week containing the first day of the month.
    // I know it sounds strange, but take a look and a wall-calendar!
    const firstDay = firstDayInWeek(firstDayOfMonth(getDate(date)), intl.firstDay(startDayOfTheWeek));
    const lastDay = addDays(firstDayInWeek(lastDayOfMonth(getDate(date)), intl.firstDay(startDayOfTheWeek)), DAYS_IN_WEEK_COUNT);

    const zonedStart = ZonedDate.fromUTCDate(toUTCDateTime(firstDay), timezone);
    const zonedEnd = ZonedDate.fromUTCDate(toUTCDateTime(lastDay), timezone);

    const start = new Date(zonedStart.getTime());
    const end = new Date(zonedEnd.getTime());

    return {
        start,
        end,
        zonedStart,
        zonedEnd
    };
};

export const monthViewDefaultProps = {
    name: 'month',

    dateRange: monthViewDateRange,

    slotDuration: 24 * 60,
    slotDivision: 1,
    itemsPerSlot: 2,

    numberOfDays: 31,
    title: (localization) => localization.toLanguageString(monthViewTitle, messages[monthViewTitle]),
    selectedDateFormat: '{0:Y}',
    selectedShortDateFormat: '{0:Y}',
    startDayOfTheWeek: 0
};

const propTypes = {
    itemsPerSlot: PropTypes.number
};

MonthView.propTypes = propTypes;
MonthView.displayName = 'KendoReactSchedulerMonthView';