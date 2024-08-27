import * as React from "react";
import { intersects } from "../utils/index.jsx";
import { ZonedDate } from "@progress/kendo-date-math";


const orderBy = (data, descriptors) => {
  return [...data].sort((a, b) => {
    for (const descriptor of descriptors) {
      const field = descriptor.field;
      const dirMultiplier = descriptor.dir === 'asc' ? 1 : -1;

      const aValue = a[field];
      const bValue = b[field];

      if (aValue > bValue) {
        return dirMultiplier;
      } else if (aValue < bValue) {
        return -dirMultiplier;
      }
    }
    return 0;
  });
};

export const toItems = (
        occurrences,
    { timezone },
    { groups, ranges }
) => {
  const result = [];

  const sorted = orderBy(
      occurrences,
      [
        { field: 'start', dir: 'asc' },
        { field: 'end', dir: 'desc' },
        { field: 'isAllDay', dir: 'desc' }
      ]
  );

  sorted.forEach((occurrence) => {
    groups.forEach((g) => {
      const group = groups.length === 1
          ? personalizedGroup(occurrence, g)
          : g;
      if (inGroup(occurrence, group)) {
        ranges.forEach((range) => {
          if (inRange(occurrence, range)) {
            const itemRef = React.createRef();
            const _ref = React.createRef();

            const head = range.end < occurrence.end;
            const tail = occurrence.start < range.start;

            const zonedStart = ZonedDate.fromLocalDate(occurrence.start, timezone);
            const zonedEnd = ZonedDate.fromLocalDate(occurrence.end, timezone);

            const item = {
              ...occurrence,

              _ref,
              itemRef,
              head,
              tail,
              order: null,

              zonedStart,
              zonedEnd,

              group,
              range,
              slots: [],

              isRecurring: Boolean(occurrence.recurrenceRule),
              isException: Boolean(!occurrence.recurrenceRule
                  && occurrence.recurrenceId !== null && occurrence.recurrenceId !== undefined),
              isAllDay: Boolean(occurrence.isAllDay)
            };

            result.push(item);
          }
        });
      }
    });
  });

  return result;
};

const personalizedGroup = (occurrence, group) => {
  return {
    index: 0,
    resources: group.resources.filter((resource) => inResource(occurrence, resource))
  };
};

const inResource = (occurrence, resource) => {
  return resource.multiple
      ? (occurrence.dataItem[resource.field] || []).some((val) => (resource)[resource.valueField] === val)
: occurrence.dataItem[resource.field] === (resource)[resource.valueField];
};

export const inGroup = (occurrence, group) => {
  return !group.resources.some((res) => res.multiple
      ? !occurrence.dataItem[res.field].some((val) => res[res.valueField] === val)
      : occurrence.dataItem[res.field] !== res[res.valueField]);
};

export const inSlot = (occurrence, slot) => {
  return intersects(slot.start, slot.end, occurrence.start, occurrence.end);
};

export const inRange = (occurrence, range) => {
  return intersects(range.start, range.end, occurrence.start, occurrence.end)
      && (range.isAllDay === undefined
          || occurrence.isAllDay === undefined
          || (occurrence.isAllDay === range.isAllDay)
      );
};
