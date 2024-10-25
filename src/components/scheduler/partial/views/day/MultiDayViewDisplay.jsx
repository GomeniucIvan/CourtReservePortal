import * as React from 'react';
import PropTypes from 'prop-types';
import { MS_PER_DAY, ZonedDate, Day, getDate, addDays } from "@progress/kendo-date-math";
import { BaseView } from "../../components/BaseView.jsx";
import { HorizontalResourceIterator } from "../common/HorizontalResourceIterator.jsx";
import { DayViewGroupRowContent } from "./DayViewGroupRowContent.mjs";
import { VerticalResourceIterator } from "../common/VerticalResourceIterator.mjs";
import { DayViewRowContent } from "./DayViewRowContent.mjs";
import { classNames } from "@progress/kendo-react-common";
import { isInTimeRange, mapItemsToSlots, mapSlotsToItems, isInDaysRange, intersects, last, first, toUTCDateTime } from "../../utils/index.jsx";
import { useInternationalization } from "../../intl/index.mjs";
import { MS_PER_MINUTE } from "../../constants/index.mjs";
import { SchedulerEditSlot } from "../../slots/SchedulerEditSlotDisplay.jsx";
import { SchedulerEditItem } from "../../items/SchedulerEditItemDisplay.jsx";
import { useSchedulerPropsContext, useSchedulerDataContext, useSchedulerGroupsContext, useSchedulerOrientationContext, useSchedulerFieldsContext, useSchedulerDateRangeContext } from "../../context/SchedulerContext.mjs";
import { SchedulerResourceIteratorContext } from "../../context/SchedulerResourceIteratorContext.mjs";
import { CurrentTimeMarker } from "../../components/CurrentTimeMarket.mjs";
import { DateHeaderCell } from "../../components/DateHeaderCell.jsx";
import { toRanges } from "../../services/rangeService.mjs";
import { toSlots } from "../../services/slotsServiceDisplay.js";
import { toOccurrences } from "../../services/occurrenceService.jsx";
import { toItems } from "../../services/itemsService.mjs";
import {toBoolean} from "../../../../../utils/Utils.jsx";


const FIRST_INDEX = 0;
const GRID_OFFSET = 1;
const EMPTY_CELL = <div className="k-scheduler-cell k-side-cell" />;

export const MultiDayView = (props) => {

    const {
        group,
        timezone,
        resources: propResources
    } = useSchedulerPropsContext();

    const intl = useInternationalization();
    const EditItem = props.editItem || SchedulerEditItem;
    const EditSlot = props.editSlot || SchedulerEditSlot;

    const showWorkHours = props.showWorkHours;
    const numberOfDays = props.numberOfDays || multiDayViewDefaultProps.numberOfDays;

    const slotDivisions = props.slotDivisions || multiDayViewDefaultProps.slotDivisions;
    const slotDuration = props.slotDuration || multiDayViewDefaultProps.slotDuration;

    const workWeekStart = props.workWeekStart || multiDayViewDefaultProps.workWeekStart;
    const workWeekEnd = props.workWeekEnd || multiDayViewDefaultProps.workWeekEnd;

    const workDayStart = intl.parseDate(props.workDayStart || props.isWorkDayStart || multiDayViewDefaultProps.isWorkDayStart);
    const workDayEnd = intl.parseDate(props.workDayEnd || props.isWorkDayEnd || multiDayViewDefaultProps.isWorkDayEnd);

    const startTime = intl.parseDate(props.startTime || multiDayViewDefaultProps.startTime);
    const endTime = intl.parseDate(props.endTime || multiDayViewDefaultProps.endTime);

    const [data] = useSchedulerDataContext();
    const groups = useSchedulerGroupsContext();
    const orientation = useSchedulerOrientationContext();

    const fields = useSchedulerFieldsContext();
    const dateRange = useSchedulerDateRangeContext();

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

    const dayRanges = React.useMemo(
        () => toRanges(
            dateRange,
            { step: MS_PER_DAY * numberOfDays, timezone })
            .map((r) => ({ ...r, isAllDay: true })),
        [
            dateRange.start.getTime(),
            dateRange.end.getTime(),
            numberOfDays
        ]
    );

    const timeRanges = React.useMemo(
        () => toRanges(
            dateRange,
            { step: MS_PER_DAY, timezone })
            .map((r) => ({ ...r, isAllDay: false })),
        [
            dateRange.start.getTime(),
            dateRange.end.getTime(),
            timezone
        ]
    );

    const daySlots = React.useMemo(
        () => toSlots(
            dateRange,
            { step: MS_PER_DAY },
            { groups, ranges: dayRanges }),
        [
            dateRange.start.getTime(),
            dateRange.end.getTime(),
            timezone,
            dayRanges,
            groups
        ]
    );

    const timeSlots = React.useMemo(
        () => toSlots(
            dateRange,
            { step: (slotDuration * MS_PER_MINUTE) / slotDivisions },
            { groups, ranges: timeRanges })
            .filter((slot) => viewEnd.getTime() === viewStart.getTime()
                || isInTimeRange(slot.zonedStart, viewStart, viewEnd)),
        [
            dateRange.start.getTime(),
            dateRange.end.getTime(),
            slotDuration,
            slotDivisions,
            viewStart.getTime(),
            viewEnd.getTime(),
            groups,
            timeRanges
        ]);

    const occurrences = React.useMemo(
        () => toOccurrences(data, { dateRange, fields, timezone }),
        [data, dateRange.start.getTime(), dateRange.end.getTime(), fields, timezone]
    );

    const dayOccurrences = React.useMemo(
        () => occurrences.filter(o => o.isAllDay),
        [occurrences]
    );

    const timeOccurrences = React.useMemo(
        () => occurrences.filter(o => !o.isAllDay),
        [occurrences]
    );
    
    const dayItems = React.useMemo(
        () => toItems(dayOccurrences, { timezone }, { groups, ranges: dayRanges }),
        [occurrences, timezone, groups, dayRanges]
    );

    const timeItems = React.useMemo(
        () => toItems(timeOccurrences, { timezone }, { groups, ranges: timeRanges })
            .filter((item) => viewStart.getTime() === viewEnd.getTime()
                || isInTimeRange(item.zonedStart, viewStart, viewEnd)
                || isInTimeRange(item.zonedEnd, viewStart, viewEnd)
                || isInTimeRange(
                    new Date(item.zonedEnd.getTime() - ((item.zonedEnd.getTime() - item.zonedStart.getTime()) / 2)),
                    viewStart,
                    viewEnd
                )
            ),
        [occurrences, timezone, groups, timeRanges, viewStart.getTime(), viewEnd.getTime()]
    );

    React.useMemo(() => mapItemsToSlots(dayItems, daySlots, false), [dayItems, daySlots]);
    React.useMemo(() => mapSlotsToItems(dayItems, daySlots, false), [dayItems, daySlots]);

    React.useMemo(() => mapItemsToSlots(timeItems, timeSlots, false), [timeItems, timeSlots]);
    React.useMemo(() => mapSlotsToItems(timeItems, timeSlots, false), [timeItems, timeSlots]);
    
    const head = (
        <SchedulerResourceIteratorContext.Consumer>
            {({ groupIndex }) => (
                <div className="k-scheduler-row k-group-1" key={groupIndex}>
                    {timeRanges.map((range, rangeIndex) => (
                        <DateHeaderCell
                            as={props.dateHeaderCell}
                            key={rangeIndex}
                            date={
                                ZonedDate.fromLocalDate(
                                    new Date(range.zonedEnd.getTime() - ((range.zonedEnd.getTime() - range.zonedStart.getTime()) / 2)),
                                    timezone)
                            }
                            start={range.start}
                            end={range.end}
                            format={{ skeleton: 'MEd' }}
                        />
                    ))}
                </div>
            )}
        </SchedulerResourceIteratorContext.Consumer>
    );

    const className = React.useMemo(
        () => classNames(
            'k-scheduler-day-view',
            props.className
        ),
        [props.className]
    );
    
    return (
        <>
            <BaseView
                id={props.id}
                props={props}
                style={props.style}
                className={className}

                ranges={[...dayRanges, ...timeRanges]}
                slots={[...daySlots, ...timeSlots]}
            >
                <div className="k-scheduler-head">
                    {orientation === 'horizontal'
                        ? <React.Fragment>
                            <HorizontalResourceIterator
                                nested={true}
                                group={group}
                                resources={propResources}
                                rowContent={DayViewGroupRowContent}
                                hideDateRow={toBoolean(props.hideDateRow)}
                                childRowContent={DayViewGroupRowContent}
                            >
                                {head}
                            </HorizontalResourceIterator>
                            {dayItems.map((item) => (
                                <EditItem
                                    key={item.isRecurring
                                        ? `${item.uid}:${item.group.index}:${item.range.index}:${item.originalStart}`
                                        : `${item.uid}:${item.group.index}:${item.range.index}`}
                                    {...item}
                                    form={props.form}
                                    onDataAction={props.onDataAction}
                                    item={props.item}
                                    interval={props.slotDuration}
                                    eventOffset={props.eventOffset}
                                    closeTime={endTime}
                                    viewItem={props.viewItem}
                                    selectedView={props.selectedView}
                                    editable={props.editable}
                                    vertical={false}
                                />)
                            )}
                        </React.Fragment>
                        : <VerticalResourceIterator
                            group={group}
                            resources={propResources}
                            cellContent={EMPTY_CELL}
                        >
                            {head}
                        </VerticalResourceIterator>}
                </div>
                <div className="k-scheduler-body">
                    {orientation === 'horizontal'
                        ? (<React.Fragment>
                            {timeSlots
                                .filter((slot) => slot.group.index === FIRST_INDEX && slot.range.index === FIRST_INDEX)
                                .map((root, rootIndex) => {
                                    
                                    return (
                                        <React.Fragment key={root.index}>
                                            <HorizontalResourceIterator
                                                nested={false}
                                                group={group}
                                                resources={propResources}
                                                rowContent={DayViewRowContent}
                                                hideDateRow={toBoolean(props.hideDateRow)}
                                                rowContentProps={{
                                                    timeHeaderCell: props.timeHeaderCell,
                                                    isMaster: (rootIndex % slotDivisions === 0),
                                                    isLast: ((rootIndex + 1) % slotDivisions === 0),
                                                    slot: root
                                                }}
                                            >
                                                <SchedulerResourceIteratorContext.Consumer>
                                                    {({ groupIndex }) => (
                                                        <div
                                                            className={classNames(
                                                                'k-scheduler-row k-group-2',
                                                                {
                                                                    'k-middle-row': !((rootIndex + 1) % slotDivisions === 0)
                                                                })}
                                                        >
                                                            {timeRanges.map((_range, rangeIndex) => (
                                                                timeSlots
                                                                    .filter(s => s.index === root.index
                                                                        && s.range.index === rangeIndex
                                                                        && s.group.index === groupIndex)
                                                                    .map((slot) => {
                                                                        let isPastStart = slot.start < props.currentDateTime;
                                                                        
                                                                        return (
                                                                            <EditSlot
                                                                                key={`${slot.start.getTime()}:${slot.group.index}`}
                                                                                {...slot}
                                                                                onDataAction={props.onDataAction}
                                                                                slot={props.slot}
                                                                                viewSlot={props.viewSlot}
                                                                                form={props.form}
                                                                                useTextSchedulerSlot={props.useTextSchedulerSlot}
                                                                                openReservationCreateModal={props.openReservationCreateModal}
                                                                                selectedView={props.selectedView}
                                                                                row={rootIndex + GRID_OFFSET}
                                                                                col={(timeRanges.length * (groupIndex || 0)) + rangeIndex}
                                                                                isPastStart={isPastStart}
                                                                                isWorkHour={
                                                                                    isInTimeRange(slot.zonedStart, workDayStart, workDayEnd)
                                                                                }
                                                                                isWorkDay={isInDaysRange(slot.zonedEnd.getDay(), workWeekStart, workWeekEnd)}
                                                                                editable={props.editable}
                                                                            />
                                                                        )
                                                                    })
                                                            ))}
                                                        </div>
                                                    )}
                                                </SchedulerResourceIteratorContext.Consumer>
                                            </HorizontalResourceIterator>
                                        </React.Fragment>
                                    );
                                })}
                            {(props.currentTimeMarker
                                && intersects(first(timeRanges).start, last(timeRanges).end, new Date(), new Date(), true))
                                && (<CurrentTimeMarker />)}
                        </React.Fragment>)
                        : <React.Fragment>
                            <VerticalResourceIterator
                                nested={true}
                                group={group}
                                resources={propResources}
                            >
                                <SchedulerResourceIteratorContext.Consumer>
                                    {({ groupIndex }) => (
                                        <React.Fragment key={groupIndex}>
                                            {timeSlots
                                                .filter(s => s.group.index === groupIndex && s.range.index === FIRST_INDEX)
                                                .map((root, rootIndex, filtered) => (
                                                    <div className="k-scheduler-row" key={root.index}>
                                                        <DayViewRowContent
                                                            slot={root}
                                                            isMaster={rootIndex % slotDivisions === 0}
                                                            isLast={(rootIndex + 1) % slotDivisions === 0}
                                                            timeHeaderCell={props.timeHeaderCell}
                                                        >
                                                            {timeRanges.map((_, rangeIndex) => (
                                                                timeSlots
                                                                    .filter(s => s.index === root.index
                                                                        && s.group.index === groupIndex
                                                                        && s.range.index === rangeIndex)
                                                                    .map((slot) => (
                                                                        <EditSlot
                                                                            slot={props.slot}
                                                                            viewSlot={props.viewSlot}
                                                                            form={props.form}
                                                                            onDataAction={props.onDataAction}
                                                                            {...slot}
                                                                            key={`${slot.start.getTime()}:${slot.group.index}`}
                                                                            row={((filtered.length * (groupIndex || 0)) + rootIndex)
                                                                                + ((groupIndex || 0) * GRID_OFFSET) + GRID_OFFSET}
                                                                            col={rangeIndex}
                                                                            editable={props.editable}
                                                                            isWorkHour={
                                                                                isInTimeRange(slot.zonedStart, workDayStart, workDayEnd)
                                                                            }
                                                                            isWorkDay={
                                                                                0 <= ((slot.zonedStart.getDay()
                                                                                    + (numberOfDays - workWeekStart)))
                                                                                && ((slot.zonedStart.getDay()
                                                                                    + (numberOfDays - workWeekStart))
                                                                                    % numberOfDays)
                                                                                <= ((workWeekEnd + (numberOfDays - workWeekStart)))
                                                                            }
                                                                        />
                                                                    )))
                                                            )}
                                                        </DayViewRowContent>
                                                    </div>
                                                ))}
                                            {((props.currentTimeMarker
                                                && intersects(first(timeRanges).start, last(timeRanges).end, new Date(), new Date(), true)))
                                                && (<CurrentTimeMarker groupIndex={groupIndex} />)}

                                        </React.Fragment>
                                    )}
                                </SchedulerResourceIteratorContext.Consumer>
                            </VerticalResourceIterator>
                            {dayItems.map((item) => (
                                <EditItem
                                    key={item.isRecurring
                                        ? `${item.uid}:${item.group.index}:${item.range.index}:${item.originalStart}`
                                        : `${item.uid}:${item.group.index}:${item.range.index}`}
                                    {...item}
                                    onDataAction={props.onDataAction}
                                    viewItem={props.viewItem}
                                    interval={props.slotDuration}
                                    eventOffset={props.eventOffset}
                                    closeTime={endTime}
                                    item={props.item}
                                    form={props.form}
                                    editable={props.editable}
                                    vertical={false}
                                />
                            ))}
                        </React.Fragment>
                    }
                    {timeItems.map((item) => (
                        <EditItem
                            key={item.isRecurring
                                ? `${item.uid}:${item.group.index}:${item.range.index}:${item.originalStart}`
                                : `${item.uid}:${item.group.index}:${item.range.index}`}
                            {...item}
                            format={'t'}
                            onDataAction={props.onDataAction}
                            viewItem={props.viewItem}
                            interval={props.slotDuration}
                            eventOffset={props.eventOffset}
                            closeTime={endTime}
                            item={props.item}
                            form={props.form}
                            editable={props.editable}
                            vertical={true}
                        />
                    ))}
                </div>
            </BaseView >
        </>
    );
};

const multiDayViewDateRange = ({ date, numberOfDays = 1, timezone }) => {
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

export const multiDayViewDefaultProps = {
    name: 'multi-day',
    title: 'Multi Day',
    currentTimeMarker: true,
    dateRange: multiDayViewDateRange,
    selectedDateFormat: '{0:D} - {1:D}',
    selectedShortDateFormat: '{0:d} - {1:d}',
    numberOfDays: 1,
    startTime: '00:00',
    endTime: '23:59',
    isWorkDayStart: '08:00',
    isWorkDayEnd: '17:00',
    workWeekStart: Day.Monday,
    workWeekEnd: Day.Friday,
    step: 1,
    slotDivisions: 2,
    slotDuration: 60,
    showCurrentTime: true,
    defaultShowWorkHours: true,
    hideDateRow: false
};

MultiDayView.propTypes = {
    currentTimeMarker: PropTypes.bool,
    name: PropTypes.string,
    numberOfDays: PropTypes.number,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    workDayStart: PropTypes.string,
    workDayEnd: PropTypes.string,
    workWeekStart: PropTypes.number,
    workWeekEnd: PropTypes.any,
    slotDivisions: PropTypes.number,
    slotDuration: PropTypes.number,
    showWorkHours: PropTypes.bool,
    selectedDateFormat: PropTypes.string,
    selectedShortDateFormat: PropTypes.string
};

MultiDayView.displayName = 'KendoReactSchedulerMultiDayView';
