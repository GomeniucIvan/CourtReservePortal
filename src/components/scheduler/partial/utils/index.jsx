import { getDate } from "@progress/kendo-date-math";
import { toGroupResources, toFlatGroupResources } from "../views/common/utilsJava.js";
import { getter, setter } from "@progress/kendo-react-common";
import {orderBy} from "../services/itemsService.mjs";


export const first = (arr) => arr[0];
export const last = (arr) => arr[arr.length - 1];

export const isMultiDay = (item) => {
  const result = (item.end.getTime() - item.start.getTime()) > new Date(0).setHours(24);
  return result;
};

export const isGroupped = (resources) => {
  const set =  new Set();

  resources.forEach((resource) => {
    set.add(resource.field);
  });

  return set.size === resources.length;
};

export function formatEventTime(intl, start, end, isAllDay) {
  const startTimeFormat = { skeleton: 'yMMMMEEEEdhm' };
  const startDateFormat = { skeleton: 'yMMMMEEEEd' };
  const endFormat = 't';

  return isAllDay ?
      `${intl.formatDate(start, startDateFormat)}` :
      `${intl.formatDate(start, startTimeFormat)}–${intl.formatDate(end, endFormat)}`;
}

export const addUTCDays = (date, offset) => {
  const newDate = new Date(date.getTime());

  newDate.setUTCDate(newDate.getUTCDate() + offset);

  return newDate;
};


export function dateWithTime(target, time) {
  return new Date(target.getFullYear(), target.getMonth(), target.getDate(), time.getHours(), time.getMinutes());
}

export const getToday = () => getDate(new Date());

export const slotDive = (x, y, maxDepth, level = 0) => {
  if (level === maxDepth) { return null; }
  let result = null;
  const element = document.elementFromPoint(x, y);
  if (!element) { return result; }
  const isSlot = element.getAttribute('data-slot') === 'true';

  if (isSlot) {
    return element;
  } else {
    const oldPointerEvents = element.style.pointerEvents;
    element.style.pointerEvents = 'none';
    result = slotDive(x, y, maxDepth, level + 1);
    element.style.pointerEvents = oldPointerEvents;
  }

  return result;
};

export const getField = (obj, field) => getter(field)(obj);

export const setField = (obj, field, value) => {
  if (!field) { return; }
  return setter(field)(obj, value);
};

export function assignField(target, source, field) {
  setField(target, field, getField(source, field));
}

export function assignFields(target, source, ...fields) {
  for (let idx = 0; idx < fields.length; idx++) {
    assignField(target, source, fields[idx]);
  }
}

export const isPresent = (value) => value !== null && value !== undefined;

export const isRecurringMaster = (event) => event.recurrenceRule && !isPresent(event.recurrenceId);

export function toUTCDate(localDate) {
  return new Date(Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate()
  ));
}

export function getUTCDate(utcDate) {
  return new Date(Date.UTC(
      utcDate.getUTCFullYear(),
      utcDate.getUTCMonth(),
      utcDate.getUTCDate()
  ));
}

export function toUTCDateTime(localDate) {
  return new Date(Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds(),
      localDate.getMilliseconds()
  ));
}

export function toInvariantTime(date) {
  const staticDate = new Date(1980, 1, 1, 0, 0, 0);

  if (date) {
    staticDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }

  return staticDate;
}

export function isRecurringException(event) {
  return event && isPresent(event.recurrenceId) && !event.recurrenceRule;
}

export const isRecurring = (event, fields) => {
  const recurrenceId = getter(fields.recurrenceId || 'recurrenceId')(event);
  const recurrenceRule = getter(fields.recurrenceRule || 'recurrenceRule')(event);
  return !!(recurrenceRule || recurrenceId);
};

export const groupResources = (group, resources) => {
  const result = [];

  if (group && group.resources && group.resources.length) {
    const groups = group.resources;
    for (let idx = 0; idx < groups.length; idx++) {
      const resource = resources.find(r => r.name === groups[idx]);
      result.push(resource);
    }
  }

  return result;
};

export const findMaster = (event, fields, data) => {
  const headId = isMaster(event, fields) ? getField(event, fields.id) : getField(event, fields.recurrenceId);

  return data.find(currentEvent => getField(currentEvent, fields.id) === headId);
};

export const isMaster = (event, fields) => {
  const id = getField(event, fields.id);
  const recurrenceId = getField(event, fields.recurrenceId);
  const recurrenceRule = getField(event, fields.recurrenceRule);

  return !!(id && recurrenceRule && (recurrenceId === undefined || recurrenceId === null));
};

export const buildException = (event, fields, data) => {
  const headEvent = findMaster(event, fields, data);

  const copy = clone(event);

  assignField(copy, headEvent, fields.id);

  if (fields.id !== undefined) {
    setField(copy, fields.id, DEFAULT_ID);
  }
  if (fields.recurrenceRule !== undefined) {
    setField(copy, fields.recurrenceRule, undefined);
  }
  if (fields.recurrenceId !== undefined) {
    setField(copy, fields.recurrenceId, getField(headEvent, fields.id));
  }

  return copy;
};

export const isException = (event, fields) => {
  return isPresent(getField(event, fields.recurrenceId)) && !getField(event, fields.recurrenceRule);
};

const maxDate = (x, y) => Math.max(x.getTime(), y.getTime());
const minDate = (x, y) => Math.min(x.getTime(), y.getTime());

/** @hidden */
export const intersects = (
    startTime,
    endTime,
    periodStart,
    periodEnd,
    inclusive = false
) => inclusive
    ? maxDate(endTime, periodEnd) - minDate(startTime, periodStart) <=
    (endTime.getTime() - startTime.getTime()) + (periodEnd.getTime() - periodStart.getTime())
    : maxDate(endTime, periodEnd) - minDate(startTime, periodStart) <
    (endTime.getTime() - startTime.getTime()) + (periodEnd.getTime() - periodStart.getTime());

export const roundAllDayEnd = ({ start, end }) => {
  const startDate = start.stripTime();
  const endDate = end.stripTime();
  return endDate.getTime() !== end.getTime() || startDate.getTime() === endDate.getTime() ? endDate.addDays(1) : endDate;
};

export const defaultModelFields = {
  id: 'id',
  start: 'start',
  startTimezone: 'startTimezone',
  originalStart: 'originalStart',
  end: 'end',
  endTimezone: 'endTimezone',
  isAllDay: 'isAllDay',
  title: 'title',
  description: 'description',
  recurrenceRule: 'recurrenceRule',
  recurrenceId: 'recurrenceId',
  recurrenceExceptions: 'recurrenceExceptions'
};

export const getModelFields = (modelFields) => {
  return { fields: { ...defaultModelFields, ...modelFields } };
};

export const isInTimeRange = (date, min, max) => {
  return ((min.getHours() < date.getHours()) || (min.getHours() === date.getHours() && min.getMinutes() <= date.getMinutes()))
      && ((date.getHours() < max.getHours()) || (max.getHours() === date.getHours() && date.getMinutes() < max.getMinutes()));
};

export const isInDaysRange = (date, min, max) => {
  return min < max
      ? (min <= date && date <= max)
      : (date <= max || min <= date);
};

export const toSchedulerGroups = (group, resources) => {
  const groupedResources = toGroupResources(group, resources);
  const flat = toFlatGroupResources(groupedResources);

  if (flat.length === 1) {
    return [{
      index: 0,
      // resources: []
      resources: (resources || [])
          .reduce(
              (all, res) => [...all, ...res.data
                  .map((item) => ({
                    ...item,
                    field: res.field,
                    valueField: res.valueField,
                    colorField: res.colorField,
                    multiple: res.multiple
                  }))],
              [])
    }];
  } else {
    return flat.map((res, index) => ({
      index,
      resources: res
    }));
  }
};

export const toSchedulerResources = (resources = []) => {
  return resources.reduce(
      (all, res) => [...all, ...res.data.map((item) => ({
        ...item,
        field: res.field,
        valueField: res.valueField,
        colorField: res.colorField,
        multiple: res.multiple
      }))],
      []);
};

export const generateResourceFields = (groups, defaultFields) => {
  if (!groups || !groups.length) { return defaultFields; }
  const result = {};

  groups.forEach((group) => {
    group.resources.forEach((resource) => {
      if (result[resource.field] === undefined) {
        result[resource.field] = resource[resource.valueField];
      }
    });
  });

  return result;
};

export const isBlank = (value) => value === null || value === undefined;

export const isNullOrEmptyString = (value) => isBlank(value) || (value && value.trim && value.trim().length === 0);

export const setTime = (origin, candidate) => {
  const date = cloneDate(origin);
  date.setHours(
      candidate.getHours(),
      candidate.getMinutes(),
      candidate.getSeconds(),
      candidate.getMilliseconds()
  );
  return date;
};

function getDataIdx(value, resource) {
  const data = resource.data;
  for (let dataIdx = 0; dataIdx < data.length; dataIdx++) {
    if (getField(data[dataIdx], resource.valueField) === value) {
      return dataIdx;
    }
  }

  return 0;
}

export const extractGroups = (
    dataItem,
    fields,
    group,
    resources
) => {
  const groupedResources = toGroupResources(group, resources);
  const flat = toFlatGroupResources(groupedResources);

  const flatGroupsReducer = (acc, items, index) => {
    let match = true;
    items.forEach((item) => {
      const expected = item[item.valueField];
      const actual = dataItem[(fields)[item.field] || item.field];

      if (Array.isArray(actual)) {
        match = match && actual.indexOf(expected) >= 0;
      } else {
        match = match && actual === expected;
      }
    });

    if (match) {
      return [...acc, { index, resources: items }];
    } else {
      return acc;
    }
  };

  return flat.reduce(flatGroupsReducer, []);
};

const findLeafResource = (level = 0) => {
  return findLeafResource(level + 1);
};


export const extractResourceFields = (
    dataItem,
    fields,
    resources
) => {
  const result = {};
  if (!resources || !resources.length) { return result; }

  resources.forEach((resource) => {
    const match = resource.data.find((item) => item.value === dataItem[(fields)[resource.field] || resource.field]);
    if (match) {
      result[resource.field] = match.value;
    }
  });

  return result;
};

export const extractResources = (
    dataItem,
    fields,
    resources
) => {
  let resourceIndex = 0;
  const itemResources = [];

  for (let resourceIdx = 0; resourceIdx < resources.length; resourceIdx++) {
    const resource = resources[resourceIdx];

    let values = getField(dataItem, (fields)[resource.field] || resource.field);

    if (!Array.isArray(values)) {
      values = [values];
    }

    for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
      if (values[valueIndex] !== undefined) {
        const dataIdx = getDataIdx(values[valueIndex], resource);
        const data = resource.data[dataIdx];

        const itemResource = {
          text: getField(data, resource.textField),
          color: getField(data, resource.colorField),
          value: getField(data, resource.valueField)
        };

        itemResources.push({
          ...itemResource,
          index: resourceIndex
        });
      }
      resourceIndex++;
    }
  }

  return itemResources;

};

export const shallowCompare = (x, y) => JSON.stringify(x) === JSON.stringify(y);

export const findMissing = (orderNumbers) => {
  let result = 0;
  const numbers = orderNumbers.slice();

  // Array.find is also O(n)
  numbers.sort((a,b) => a - b).forEach((_, index) => {
    if (numbers[index] === index) {
      result = index + 1;
    }
  });

  return result;
};

/** @hidden */
export const calculateOrder = (
    current,
    items,
    slots,
    ignoreIsAllDay = false
) => {
  let result;
  slots.forEach((slot) => {
    const orderNumbers = [];
    const sorted = items.sort((a,b) => a.props.start.getTime() - b.props.start.getTime());

    sorted.forEach((item) => {
      const fit = (ignoreIsAllDay || (item.props.isAllDay === slot.current.props.isAllDay))
    && item.props.range.index === slot.current.props.range.index
      && item.props.group.index === slot.current.props.group.index
      && intersects(item.props.start, item.props.end, slot.current.props.start, slot.current.props.end);

      if (fit) {
        const order = findMissing(orderNumbers);

        if(item === current && result === undefined) {
          result = order;
        }

        orderNumbers.splice(order, 0, order);
      }
    });
  });

  return result;
};

export const mapSlotsToItems = (
    items,
    slots,
    ignoreIsAllDay = false
) => {
  // Clear
  slots.forEach(slot => slot.items.splice(0, slot.items.length));

  // Populate
  slots.forEach((slot) => {
    const orderNumbers = [];
    items.forEach((item) => {
      const fit = (ignoreIsAllDay || (item.isAllDay === slot.isAllDay))
          && item.range.index === slot.range.index
          && item.group.index === slot.group.index
          && intersects(item.start, item.end, slot.start, slot.end);

      if (fit) {
        const order = findMissing(orderNumbers);

        if (item.order === null || item.order === undefined || item.order < order) {
          item.order = order;
        }

        orderNumbers.splice(item.order, 0, item.order);
        slot.items.push(item);
      }
    });
  });
};

export const mapItemsToSlots = (
    items,
    slots,
    ignoreIsAllDay = false
) => {
  // Clear
  items.forEach(item => item.slots.splice(0, item.slots.length));

  // Populate
  items.forEach((item) => {
    slots.forEach((slot) => {
      const fit = (ignoreIsAllDay || (item.isAllDay === slot.isAllDay))
          && item.range.index === slot.range.index
          && item.group.index === slot.group.index
          && intersects(item.start, item.end, slot.start, slot.end);

      if (fit) {
        item.slots.push(slot);
      }
    });
  });
};

export const noop = (..._args) => {/** */ };

export const findFirstItem = (current) => {
  const next = current.props.items.find((i) => i.order === 0) || current.props.items[0];
  return next && next._ref.current;
};

export const findNextItem = (
        ref,
    all,
    ignoreIsAllDay = false,
    backwards = false
)  => {
  const current = ref.current;

  if(!current || !all) { return null; }
  const filtered = all.filter((i) => i.current !== null && i.current.element !== null);

  const sorted = orderBy(
      filtered,
      [
        { field: 'current.props.group.index', dir: 'asc' },
        { field: 'current.props.range.index', dir: 'asc' },
        (ignoreIsAllDay ? { field: '' } : { field: 'current.props.isAllDay', dir: 'desc' }),
        { field: 'current.props.start', dir: 'asc' }
      ]
  );

  const currentIndex = sorted
      .findIndex(i => i.current !== null && Boolean(i.current.props.uid === current.props.uid
          && ((i.current.props.occurrenceId === undefined) || i.current.props.occurrenceId === current.props.occurrenceId)
          && (i.current.props.group.index === current.props.group.index)
          && (i.current.props.range.index === current.props.range.index)
          && (ignoreIsAllDay || i.current.props.isAllDay === current.props.isAllDay)));

  const next = sorted[currentIndex + (backwards ? -1 : 1)];

  return next;
};


export const orderSort = (a,b) => {
  return (a.order || 0) - (b.order || 0);
};
