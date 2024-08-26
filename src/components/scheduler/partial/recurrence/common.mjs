/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { isPresent as y, isNullOrEmptyString as f } from "../utils/index.mjs";
import { parseRule as i } from "@progress/kendo-recurrence";
import { toLocalDate as u } from "@progress/kendo-date-math";
const o = (e) => e.charAt(0).toUpperCase() + e.slice(1), l = ["first", "second", "third", "fourth", "last"], k = ["never", "daily", "weekly", "monthly", "yearly"], m = [
  { day: 0, offset: 0 },
  { day: 1, offset: 0 },
  { day: 2, offset: 0 },
  { day: 3, offset: 0 },
  { day: 4, offset: 0 },
  { day: 5, offset: 0 },
  { day: 6, offset: 0 }
], D = [
  { day: 1, offset: 0 },
  { day: 2, offset: 0 },
  { day: 3, offset: 0 },
  { day: 4, offset: 0 },
  { day: 5, offset: 0 }
], b = [
  { day: 0, offset: 0 },
  { day: 6, offset: 0 }
], w = (e) => {
  switch (e) {
    case "day":
      return m;
    case "weekday":
      return D;
    case "weekend":
      return b;
  }
}, v = (e) => i({ recurrenceRule: e }) || {}, W = (e) => k.map((t) => ({
  value: t,
  text: e("Frequencies" + o(t))
})), R = (e) => y(e) && !f(e.freq) ? e.freq : "never", x = (e) => y(e.until) ? u(e.until) : null, F = (e) => e.dateFormatNames({
  type: "months",
  nameType: "wide",
  standAlone: !0
}).map((t, a) => ({
  text: t,
  value: a + 1
})), N = (e) => {
  const t = e.firstDay(), a = e.dateFormatNames({
    type: "days",
    nameType: "abbreviated"
  }).map((s, n) => ({
    text: s,
    value: n
  }));
  return a.slice(t).concat(a.slice(0, t));
}, O = (e, t, a) => e.find((s) => {
  let n;
  if (y(t.byWeekDay))
    switch (t.byWeekDay.length) {
      case 7:
        n = "day";
        break;
      case 5:
        n = "weekday";
        break;
      case 2:
        n = "weekend";
        break;
      case 1:
        n = t.byWeekDay[0].day;
        break;
      default:
        n = a.getDay();
        break;
    }
  return n === s.value;
}) || e[0], S = (e, t) => {
  const a = e.firstDay();
  let s = e.dateFormatNames({
    type: "days",
    nameType: "wide"
  }).map((c, d) => ({
    text: c,
    value: d
  }));
  const n = s.slice(a).concat(s.slice(0, a));
  return [
    { text: t("WeekdaysDay"), value: "day" },
    { text: t("WeekdaysWeekday"), value: "weekday" },
    { text: t("WeekdaysWeekendday"), value: "weekend" }
  ].concat(n);
}, E = (e, t) => e.find((a) => a.value === (t.bySetPosition ? t.bySetPosition[0] : t.byWeekDay && t.byWeekDay[0] ? t.byWeekDay[0].offset : 1)) || e[0], M = (e) => {
  const t = [1, 2, 3, 4, -1];
  return l.map((a, s) => ({
    text: e("OffsetPositions" + o(a)),
    value: t[s]
  }));
}, P = (e) => y(e.count) ? "count" : y(e.until) ? "until" : "never", T = (e) => {
  if (y(e.byWeekDay))
    return "weekday";
  if (y(e.byMonthDay))
    return "monthday";
}, q = (e, t) => e.find((a) => (t.byMonth ? t.byMonth[0] : null) === a.value) || e[0], C = (e, t) => y(e.byMonthDay) && e.byMonthDay.length > 0 ? e.byMonthDay[0] : t.getDate();
export {
  k as FREQUENCIES,
  l as OFFSET_POSITIONS,
  o as capitalize,
  m as dayRule,
  P as getEndRule,
  S as getExtendedWeekDays,
  W as getFrequencies,
  R as getFrequency,
  q as getMonth,
  C as getMonthDay,
  F as getMonths,
  E as getOffset,
  M as getOffsets,
  T as getRepeatOnRule,
  v as getRule,
  x as getUntil,
  O as getWeekDay,
  N as getWeekDays,
  w as weekDayRuleFromString,
  D as weekdayRule,
  b as weekendRule
};
