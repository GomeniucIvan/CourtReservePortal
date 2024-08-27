import { getter, clone } from "@progress/kendo-react-common";
import { isMaster} from "../utils/index.jsx";

export const toOccurrences = (data, { dateRange, fields, timezone }) => {
  const result = data
      .map(readItem(fields))
      .reduce(occurrenceReducer(dateRange, timezone, fields), [])
      .filter((occurrence) => !isMaster(occurrence.dataItem, fields));

  return result;
};

const readItem = (fields) => (dataItem) => {
  const result = {
    uid: getter(fields.id || 'id')(dataItem),
    start: getter(fields.start || 'start')(dataItem),
    startTimezone: getter(fields.startTimezone || 'startTimezone')(dataItem),
    originalStart: getter(fields.originalStart || 'originalStart')(dataItem),
    end: getter(fields.end || 'end')(dataItem),
    endTimezone: getter(fields.endTimezone || 'endTimezone')(dataItem),
    isAllDay: getter(fields.isAllDay || 'isAllDay')(dataItem),
    title: getter(fields.title || 'title')(dataItem),
    description: getter(fields.description || 'description')(dataItem),
    occurrenceId: getter('occurrenceId')(dataItem),
    recurrenceRule: getter(fields.recurrenceRule || 'recurrenceRule')(dataItem),
    recurrenceExceptions: getter(fields.recurrenceExceptions || 'recurrenceExceptions')(dataItem),
    recurrenceId: getter(fields.recurrenceId || 'recurrenceId')(dataItem),
    dataItem: clone(dataItem)
  };

  return result;
};

const occurrenceReducer = (dateRange, timezone, fields) => (acc, current) => {
  return [
    ...acc,
    ...((Boolean(current.recurrenceRule)
        && Boolean(current.recurrenceId === null || current.recurrenceId === undefined)
        && isMaster(current.dataItem, fields))
        ? [...occurrences(current, { dateRange, timezone, fields })]
        : [current])
  ];
};

const occurrences = (item, { dateRange, timezone, fields }) => {
  
  console.log('occurrences')
 
  // const rrule = item.recurrenceRule;
  // const rule = parseRule({ recurrenceRule: rrule });
  //
  // // changed as for display purposes timezone of the scheduler is the correct one
  // if (!rule.start) { rule.start = ZonedDate.fromLocalDate(item.start, timezone); }
  // if (!rule.end) { rule.end = ZonedDate.fromLocalDate(item.end, timezone); }
  //
  // const exceptionRule = item.recurrenceExceptions;
  // if (exceptionRule) {
  //   rule.exceptionDates = exceptionRule
  //       .map(exDate =>
  //           ZonedDate.fromLocalDate(exDate, timezone)
  //       );
  // }
  //
  // const utcRangeStart = dateRange.zonedStart;
  // const utcRangeEnd = dateRange.zonedEnd;
  // const series = expand(rule, {
  //   rangeStart: utcRangeStart,
  //   rangeEnd: utcRangeEnd
  // });
  //
  // if (!series.events.length) { return []; }
  //
  // const expanded = series.events.map((occurrence, idx) => {
  //   const occurrenceItem = clone(item);
  //   const occurrenceDataItem = clone(item.dataItem);
  //
  //   occurrenceItem.recurrenceId = occurrenceItem.uid;
  //   setField(occurrenceDataItem, fields.recurrenceId, item.uid);
  //
  //   occurrenceItem.originalStart = occurrence.start.toLocalDate();
  //   setField(occurrenceDataItem, fields.originalStart, occurrence.start.toLocalDate());
  //
  //   occurrenceItem.start = occurrence.start.toLocalDate();
  //   setField(occurrenceDataItem, fields.start, occurrence.start.toLocalDate());
  //
  //   occurrenceItem.end = occurrence.end.toLocalDate();
  //   setField(occurrenceDataItem, fields.end, occurrence.end.toLocalDate());
  //
  //   occurrenceItem.occurrenceId = String(idx);
  //   setField(occurrenceDataItem, 'occurrenceId', String(idx));
  //
  //   occurrenceItem.dataItem = occurrenceDataItem;
  //
  //   return occurrenceItem;
  // });

  return [];
};
