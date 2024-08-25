/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { ZonedDate as d } from "@progress/kendo-date-math";
const f = (t, { step: o, timezone: a }) => {
  const c = [], m = d.fromLocalDate(t.start, a), g = d.fromLocalDate(t.end, a);
  for (let e = m.clone(), r = 0; e.getTime() < g.getTime(); r++, e = e.addTime(o)) {
    const n = e.clone(), s = n.clone().addTime(o), i = new Date(n.getTime()), l = new Date(s.getTime()), T = {
      index: r,
      end: l,
      start: i,
      zonedStart: n,
      zonedEnd: s
    };
    c.push(T);
  }
  return c;
};
export {
  f as toRanges
};
