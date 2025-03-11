import { ZonedDate } from '@progress/kendo-date-math';

/**
 * 
 * 
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
export const toRanges = (dateRange, { step, timezone }) => {
  const ranges = [];

  const zonedRangeStart = ZonedDate.fromLocalDate(dateRange.start, timezone);
  const zonedRangeEnd = ZonedDate.fromLocalDate(dateRange.end, timezone);

  console.log(dateRange.start)
  console.log(timezone)
  for (
      let current = zonedRangeStart.clone(), index = 0;
      current.getTime() < zonedRangeEnd.getTime();
      index++, current = current.addTime(step)
  ) {
    const zonedStart = current.clone();
    const zonedEnd = zonedStart.clone().addTime(step);

    const start = new Date(zonedStart.getTime());
    const end = new Date(zonedEnd.getTime());

    const range = {
      index,

      end,
      start,

      zonedStart,
      zonedEnd
    };

    ranges.push(range);
  }

  return ranges;
};

