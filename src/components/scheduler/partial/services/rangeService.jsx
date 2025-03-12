import { ZonedDate } from '@progress/kendo-date-math';
import {isNullOrEmpty} from "@/utils/Utils.jsx";

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

export const toRanges = (dateRange, { step, timezone }, incZonedStart = null, incZonedEnd = null) => {
  const ranges = [];

  let zonedRangeStart = ZonedDate.fromLocalDate(dateRange.start, timezone);
  let zonedRangeEnd = ZonedDate.fromLocalDate(dateRange.end, timezone);

  for (
      let current = zonedRangeStart.clone(), index = 0;
      current.getTime() < zonedRangeEnd.getTime();
      index++, current = current.addTime(step)
  ) {
    const zonedStart = current.clone();
    const zonedEnd = zonedStart.clone().addTime(step);

    let start = new Date(zonedStart.getTime());
    let end = new Date(zonedEnd.getTime());
    
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

