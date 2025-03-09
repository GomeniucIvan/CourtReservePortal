import * as React from 'react';
import { MultiDayView } from "../day/MultiDayViewDisplay.jsx";
import { DAYS_IN_WEEK_COUNT  } from "../../constants/index.mjs";
import { ZonedDate, firstDayInWeek, getDate, addDays } from "@progress/kendo-date-math";
import { weekViewTitle, messages } from "../../messages/index.mjs";
import { toUTCDateTime } from "../../utils/index.jsx";

export const WeekView = (props) => (
    <MultiDayView
        {...props}
        step={DAYS_IN_WEEK_COUNT}
        numberOfDays={props.numberOfDays}
    />
);

const GET_START_DATE = (date) => getDate(date);
const GET_END_DATE = (start, numberOfDays) => getDate(addDays(start, numberOfDays || 1));

const weekViewDateRange = ({ intl, date, timezone, startDayOfTheWeek }) => {
  const normalized = ZonedDate.fromLocalDate(date, timezone);
  const firstDate = GET_START_DATE(firstDayInWeek(normalized, intl.firstDay(startDayOfTheWeek)));
  const lastDate = GET_END_DATE(firstDate, DAYS_IN_WEEK_COUNT);

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

/** @hidden */
export const weekViewDefaultProps = {
  name: 'week',
  slotDuration: 60,
  slotDivisions: 2,
  numberOfDays: DAYS_IN_WEEK_COUNT,
  dateRange: weekViewDateRange,
  title: (localization) => localization.toLanguageString(weekViewTitle, messages[weekViewTitle]),
  selectedDateFormat: '{0:D} - {1:D}',
  selectedShortDateFormat: '{0:d} - {1:d}',
  startDayOfTheWeek: 0
};

WeekView.displayName = 'KendoReactSchedulerWeekView';
