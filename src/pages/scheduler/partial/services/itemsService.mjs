/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as f from "react";
import { intersects as I } from "../utils/index.mjs";
import { orderBy as h } from "@progress/kendo-data-query";
import { ZonedDate as m } from "@progress/kendo-date-math";
const S = (l, { timezone: t }, { groups: i, ranges: a }) => {
  const e = [];
  return h(
    l,
    [
      { field: "start", dir: "asc" },
      { field: "end", dir: "desc" },
      { field: "isAllDay", dir: "desc" }
    ]
  ).forEach((d) => {
    i.forEach((o) => {
      const n = i.length === 1 ? u(d, o) : o;
      B(d, n) && a.forEach((s) => {
        if (F(d, s)) {
          const p = f.createRef(), r = f.createRef(), D = s.end < d.end, R = d.start < s.start, y = m.fromLocalDate(d.start, t), v = m.fromLocalDate(d.end, t), A = {
            ...d,
            _ref: r,
            itemRef: p,
            head: D,
            tail: R,
            order: null,
            zonedStart: y,
            zonedEnd: v,
            group: n,
            range: s,
            slots: [],
            isRecurring: !!d.recurrenceRule,
            isException: !d.recurrenceRule && d.recurrenceId !== null && d.recurrenceId !== void 0,
            isAllDay: !!d.isAllDay
          };
          e.push(A);
        }
      });
    });
  }), e;
}, u = (l, t) => ({
  index: 0,
  resources: t.resources.filter((i) => E(l, i))
}), E = (l, t) => t.multiple ? (l.dataItem[t.field] || []).some((i) => t[t.valueField] === i) : l.dataItem[t.field] === t[t.valueField], B = (l, t) => !t.resources.some((i) => i.multiple ? !l.dataItem[i.field].some((a) => i[i.valueField] === a) : l.dataItem[i.field] !== i[i.valueField]), F = (l, t) => I(t.start, t.end, l.start, l.end) && (t.isAllDay === void 0 || l.isAllDay === void 0 || l.isAllDay === t.isAllDay);
export {
  B as inGroup,
  F as inRange,
  S as toItems
};
