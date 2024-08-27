import * as React from "react";
import { BaseView } from "../../components/BaseView.mjs";
import { MS_PER_DAY, MS_PER_MINUTE, ZonedDate, Day, getDate, addDays } from "@progress/kendo-date-math";
import { HorizontalResourceIterator} from "../common/HorizontalResourceIterator.jsx";
import { TimelineViewRowContent } from "./TimelineViewRowContent.mjs";
import { TimelineViewAllEventsRowContent } from "./TimelineViewAllEventsRowContent.mjs";
import { VerticalResourceIterator } from "../common/VerticalResourceIterator.mjs";
import { isInTimeRange, mapItemsToSlots, mapSlotsToItems, toUTCDateTime, isInDaysRange, intersects, last, first, orderSort } from "../../utils/index.mjs";
import { classNames } from "@progress/kendo-react-common";
import { toRanges } from "../../services/rangeService.mjs";
import { toSlots } from "../../services/slotsServiceDisplay.js";
import { toOccurrences } from "../../services/occurrenceService.mjs";
import { toItems } from "../../services/itemsService.mjs";
import { SchedulerEditSlot } from "../../slots/SchedulerEditSlotDisplay.jsx";
import { BORDER_WIDTH } from "../../constants/index.mjs";
import { useInternationalization } from "@progress/kendo-react-intl";
import { SchedulerEditItem } from "../../items/SchedulerEditItemDisplay.jsx";
import { useSchedulerPropsContext, useSchedulerDataContext, useSchedulerOrientationContext, useSchedulerGroupsContext, useSchedulerDateRangeContext, useSchedulerFieldsContext } from "../../context/SchedulerContext.mjs";
import { SchedulerResourceIteratorContext } from "../../context/SchedulerResourceIteratorContext.mjs";
import { CurrentTimeMarker } from "../../components/CurrentTimeMarket.mjs";
import { DateHeaderCell} from "../../components/DateHeaderCell.mjs";
import { TimeHeaderCell } from "../../components/TimeHeaderCell.jsx";
import { useCellSync } from "../../hooks/useCellSync.mjs";
import { useRowSync } from "../../hooks/useRowSync.mjs";
const TIME_FORMAT = 't';
const FIRST_INDEX = 0;

export const MultiDayTimelineView = (props) => {
    const {
        group,
        timezone,
        resources: propResources
    } = useSchedulerPropsContext();

    const timeRef = React.useRef(null);
    const bodyRef = React.useRef(null);

    const EditItem = props.editItem || SchedulerEditItem;
    const EditSlot = props.editSlot || SchedulerEditSlot;

    const element = React.useRef(null);

    const [data] = useSchedulerDataContext();

    const orientation = useSchedulerOrientationContext();
    const groups = useSchedulerGroupsContext();
    const dateRange = useSchedulerDateRangeContext();
    const fields = useSchedulerFieldsContext();

    const intl = useInternationalization();

    const showWorkHours = props.showWorkHours;

    const slotDivisions = props.slotDivisions || multiDayTimelineViewDefaultProps.slotDivisions;
    const slotDuration = props.slotDuration || multiDayTimelineViewDefaultProps.slotDuration;

    const workWeekStart = props.workWeekStart || multiDayTimelineViewDefaultProps.workWeekStart;
    const workWeekEnd = props.workWeekEnd || multiDayTimelineViewDefaultProps.workWeekEnd;

    const workDayStart = intl.parseDate(props.workDayStart || props.isWorkDayStart || multiDayTimelineViewDefaultProps.isWorkDayStart);
    const workDayEnd = intl.parseDate(props.workDayEnd || props.isWorkDayEnd || multiDayTimelineViewDefaultProps.isWorkDayEnd);

    const startTime = intl.parseDate(props.startTime || multiDayTimelineViewDefaultProps.startTime);
    const endTime = intl.parseDate(props.endTime || multiDayTimelineViewDefaultProps.endTime);

    const viewStart = React.useMemo(
        () => showWorkHours
            ? workDayStart
            : startTime,
        [
            showWorkHours,
            workDayStart,
            startTime
        ]);

    const viewEnd = React.useMemo(
        () => showWorkHours
            ? workDayEnd
            : endTime,
        [
            showWorkHours,
            workDayEnd,
            endTime
        ]);

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
            { step: slotDuration / slotDivisions * MS_PER_MINUTE },
            { groups, ranges })
            .filter((slot) => isInTimeRange(slot.zonedStart, viewStart, viewEnd) || viewStart.getTime() === viewEnd.getTime()),
        [
            groups,
            ranges,
            dateRange.start.getTime(),
            dateRange.end.getTime(),
            timezone,
            slotDuration,
            slotDivisions,
            viewStart.getTime(),
            viewEnd.getTime()
        ]);

    const occurrences = React.useMemo(
        () => toOccurrences(data, { dateRange, fields, timezone }),
        [data, dateRange.start.getTime(), dateRange.end.getTime(), fields, timezone]
    );

    const items = React.useMemo(
        () => toItems(occurrences, { timezone }, { groups, ranges })
            .filter((item) => viewStart.getTime() === viewEnd.getTime()
                || isInTimeRange(item.zonedStart, viewStart, viewEnd)
                || isInTimeRange(item.zonedEnd, viewStart, viewEnd)
                || isInTimeRange(
                    new Date(item.zonedEnd.getTime() - ((item.zonedEnd.getTime() - item.zonedStart.getTime()) / 2)),
                    viewStart,
                    viewEnd
                )
            ),
        [occurrences, timezone, groups, ranges, viewStart.getTime(), viewEnd.getTime()]
    );

    React.useMemo(() => mapItemsToSlots(items, slots, true), [items, slots]);
    React.useMemo(() => mapSlotsToItems(items, slots, true), [items, slots]);

    const width = (
            orientation === 'horizontal' ? slots.length : slots.length / groups.length)
        * ((props.columnWidth || multiDayTimelineViewDefaultProps.columnWidth) + BORDER_WIDTH);

    const head = (
        <SchedulerResourceIteratorContext.Consumer>
            {() => (
                <React.Fragment>
                    <div className="k-scheduler-row">
                        {ranges.map((range, rangeIndex) => (
                            <DateHeaderCell
                                as={props.dateHeaderCell}
                                key={rangeIndex}
                                date={range.zonedStart}
                                start={range.start}
                                end={range.end}
                                format={'m'}
                            />
                        ))}
                    </div>
                    <div className="k-scheduler-row" ref={timeRef} >
                        {ranges.map((_, rangeIndex) => {
                            return slots
                                .filter(s => (s.group.index === FIRST_INDEX && s.range.index === rangeIndex))
                                .map((slot) => (
                                    slot.zonedStart.getMinutes() % slotDuration === 0
                                        ? (
                                            <TimeHeaderCell
                                                key={slot.index}
                                                as={props.timeHeaderCell}
                                                format={TIME_FORMAT}
                                                date={slot.zonedStart}
                                                start={slot.zonedStart}
                                                end={slot.zonedEnd}
                                            />
                                        ) : null)
                                );
                        })}
                    </div>
                </React.Fragment>
            )}
        </SchedulerResourceIteratorContext.Consumer>
    );

    const body = (
        <SchedulerResourceIteratorContext.Consumer>
            {({ groupIndex }) => (
                <div className="k-scheduler-row">
                    {ranges.map((_, rangeIndex) => {
                        return (
                            slots
                                .filter(s => s.group.index === groupIndex && s.range.index === rangeIndex)
                                .map((slot, slotIndex, filtered) => {
                                    const utcZonedDayStart = ZonedDate.fromUTCDate(toUTCDateTime(slot.zonedStart), timezone);
                                    const isWorkDayUTCStart = isInDaysRange(utcZonedDayStart.getDay(), workWeekStart, workWeekEnd);
                                    return (<EditSlot
                                        key={`${slot.start.getTime()}:${slot.group.index}`}
                                        slot={props.slot}
                                        viewSlot={props.viewSlot}
                                        {...slot}
                                        form={props.form}
                                        onDataAction={props.onDataAction}
                                        isWorkHour={isInTimeRange(slot.zonedStart, workDayStart, workDayEnd)}
                                        isWorkDay={isWorkDayUTCStart}
                                        col={orientation === 'horizontal'
                                            ? (((rangeIndex * filtered.length) + slotIndex)
                                                + ((filtered.length * ranges.length) * (groupIndex || 0)))
                                            : ((rangeIndex * filtered.length) + slotIndex)}
                                        row={orientation === 'horizontal'
                                            ? 0
                                            : (groupIndex || 0)}
                                        expandable={true}
                                        editable={props.editable}
                                    />);
                                })
                        );
                    })}
                </div>
            )}
        </SchedulerResourceIteratorContext.Consumer>
    );

    const className = React.useMemo(
        () => classNames(
            'k-scheduler-timeline-view',
            props.className
        ),
        [props.className]
    );

    useCellSync({
        element,
        selector: '.k-resource-cell',
        attribute: 'data-depth-index',
        explicitDepth: true
    });

    const schedulerElement = element.current
        ? (element.current).closest('.k-scheduler-layout') : null;

    useRowSync({
        element: schedulerElement,
        selector: '.k-resource-row',
        horizontalAttribute: 'data-depth-index',
        verticalAttribute: 'data-resource-index',
        applyTo: '.k-resource-cell',
        syncHeight: items && !items.length
    });

    return (
        <>
            <BaseView
                ref={element}
                id={props.id}
                style={({ ...props.style })}
                className={className}

                props={props}
                slots={slots}
                ranges={ranges}
            >
                <div className="k-scheduler-head" style={{ width }} >
                    {orientation === 'horizontal'
                        ? <HorizontalResourceIterator
                            nested={true}
                            group={group}
                            resources={propResources}
                            rowContent={TimelineViewRowContent}
                        >
                            {head}
                        </HorizontalResourceIterator>
                        : <VerticalResourceIterator
                            wrapGroup={true}
                            group={group}
                            resources={propResources}
                        >
                            {head}
                        </VerticalResourceIterator>}
                </div>
                <div className="k-scheduler-body" style={{ width }} ref={bodyRef}>
                    {orientation === 'horizontal'
                        ? <HorizontalResourceIterator
                            group={group}
                            resources={propResources}
                            rowContent={TimelineViewAllEventsRowContent}
                        >
                            {body}
                            <SchedulerResourceIteratorContext.Consumer>
                                {({ groupIndex }) => (
                                    (props.currentTimeMarker
                                        && intersects(first(ranges).start, last(ranges).end, new Date(), new Date(), true))
                                    && (<CurrentTimeMarker
                                        groupIndex={groupIndex}
                                        attachArrow={timeRef}
                                        vertical={true}
                                    />)
                                )}
                            </SchedulerResourceIteratorContext.Consumer>
                        </HorizontalResourceIterator>
                        : <VerticalResourceIterator
                            nested={true}
                            wrapGroup={true}
                            group={group}
                            resources={propResources}
                        >
                            {body}
                        </VerticalResourceIterator>}
                    {(orientation === 'vertical'
                            && props.currentTimeMarker
                            && intersects(first(ranges).start, last(ranges).end, new Date(), new Date(), true))
                        && (<CurrentTimeMarker
                            attachArrow={timeRef}
                            vertical={true}
                        />)}
                    {items
                        .sort(orderSort)
                        .map((item, itemIndex) => (
                            <EditItem
                                key={item.isRecurring
                                    ? `${item.uid}:${item.group.index}:${item.range.index}:${item.originalStart}`
                                    : `${item.uid}:${item.group.index}:${item.range.index}`}
                                {...item}
                                format={'t'}
                                form={props.form}
                                onDataAction={props.onDataAction}
                                item={props.item}
                                viewItem={props.viewItem}
                                editable={props.editable}
                                ignoreIsAllDay={true}
                                vertical={false}
                                isLast={(itemIndex === items.length -1)}
                            />
                        ))}
                </div>
            </BaseView>
        </>

    );
};

const multiDayTimelineDateRange = ({ date, numberOfDays = 1, timezone }) => {
    const normalized = ZonedDate.fromLocalDate(date, timezone);

    const firstDay = getDate(normalized);
    const lastDay = addDays(firstDay, numberOfDays);

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

export const multiDayTimelineViewDefaultProps = {
    name: 'multi-day-timeline',
    title: 'Multi Day Timeline',
    currentTimeMarker: true,

    dateRange: multiDayTimelineDateRange,

    selectedDateFormat: '{0:D} - {1:D}',
    selectedShortDateFormat: '{0:d} - {1:d}',
    step: 1,
    numberOfDays: 1,
    startTime: '00:00',
    endTime: '00:00',
    isWorkDayStart: '8:00',
    isWorkDayEnd: '17:00',
    workWeekStart: Day.Monday,
    workWeekEnd: Day.Friday,
    slotDivisions: 2,
    slotDuration: 60,
    // showCurrentTime: true // TODO: Phase 2
    defaultShowWorkHours: true,
    columnWidth: 100
};
