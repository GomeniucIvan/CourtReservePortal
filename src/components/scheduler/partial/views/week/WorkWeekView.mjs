/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as g from "react";
import { MS_PER_DAY as S, Day as a, ZonedDate as i, getDate as p, addDays as T } from "@progress/kendo-date-math";
import { DAYS_IN_WEEK_COUNT as w } from "../../constants/index.mjs";
import { MultiDayView as E } from "../day/MultiDayViewDisplay.jsx";
import { workWeekViewTitle as D, messages as R } from "../../messages/index.mjs";
import { toUTCDateTime as c } from "../../utils/index.jsx";
import { useSchedulerDateRangeContext as C } from "../../context/SchedulerContext.jsx";
const M = (t) => {
  const o = C(), e = Math.round((o.end.getTime() - o.start.getTime()) / S);
  return /* @__PURE__ */ g.createElement(
    E,
    {
      ...t,
      step: w,
      numberOfDays: e
    }
  );
}, V = (t, o = a.Sunday) => {
  let e = t.clone();
  for (; e.getDay() !== o; )
    e = e.addDays(-1);
  return e;
}, _ = ({ intl: t, date: o, timezone: e, ...r }) => {
  const l = i.fromLocalDate(o, e), n = r.workWeekStart !== void 0 ? r.workWeekStart : a.Monday, s = r.workWeekEnd !== void 0 ? r.workWeekEnd : a.Friday, W = s < n ? w + s - n + 1 : s - n + 1, d = p(V(l, n)), f = T(d, W), k = i.fromUTCDate(c(d), e), m = i.fromUTCDate(c(f), e), u = new Date(k.getTime()), y = new Date(m.getTime());
  return {
    start: u,
    end: y,
    zonedStart: k,
    zonedEnd: m
  };
}, h = {
  name: "work-week",
  slotDuration: 60,
  slotDivisions: 2,
  numberOfDays: 7,
  dateRange: _,
  title: (t) => t.toLanguageString(D, R[D]),
  workWeekStart: a.Monday,
  workWeekEnd: a.Friday,
  selectedDateFormat: "{0:D} - {1:D}",
  selectedShortDateFormat: "{0:d} - {1:d}"
};
M.displayName = "KendoReactSchedulerWorkWeekView";
export {
  M as WorkWeekView,
  h as workWeekDefaultProps
};
