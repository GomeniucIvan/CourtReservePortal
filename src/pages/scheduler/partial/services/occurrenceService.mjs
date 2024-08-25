/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { getter as t, clone as p } from "@progress/kendo-react-common";
import { parseRule as m, expand as E } from "@progress/kendo-recurrence";
import { ZonedDate as d } from "@progress/kendo-date-math";
import { isMaster as S, setField as l } from "../utils/index.mjs";
const F = (e, { dateRange: r, fields: n, timezone: o }) => e.map(z(n)).reduce(I(r, o, n), []).filter((a) => !S(a.dataItem, n)), z = (e) => (r) => ({
  uid: t(e.id || "id")(r),
  start: t(e.start || "start")(r),
  startTimezone: t(e.startTimezone || "startTimezone")(r),
  originalStart: t(e.originalStart || "originalStart")(r),
  reserveStart: t(e.reserveStart || "reserveStart")(r),
  reserveEnd: t(e.reserveEnd || "reserveEnd")(r),
  end: t(e.end || "end")(r),
  endTimezone: t(e.endTimezone || "endTimezone")(r),
  isAllDay: t(e.isAllDay || "isAllDay")(r),
  title: t(e.title || "title")(r),
  description: t(e.description || "description")(r),
  occurrenceId: t("occurrenceId")(r),
  recurrenceRule: t(e.recurrenceRule || "recurrenceRule")(r),
  recurrenceExceptions: t(e.recurrenceExceptions || "recurrenceExceptions")(r),
  recurrenceId: t(e.recurrenceId || "recurrenceId")(r),
  dataItem: p(r)
}), I = (e, r, n) => (o, c) => [
  ...o,
  ...c.recurrenceRule && (c.recurrenceId === null || c.recurrenceId === void 0) && S(c.dataItem, n) ? [...T(c, { dateRange: e, timezone: r, fields: n })] : [c]
], T = (e, { dateRange: r, timezone: n, fields: o }) => {
  const c = e.recurrenceRule, a = m({ recurrenceRule: c });
  a.start || (a.start = d.fromLocalDate(e.start, n)), a.end || (a.end = d.fromLocalDate(e.end, n));
  const D = e.recurrenceExceptions;
  D && (a.exceptionDates = D.map(
    (u) => d.fromLocalDate(u, n)
  ));
  const x = r.zonedStart, L = r.zonedEnd, g = E(a, {
    rangeStart: x,
    rangeEnd: L
  });
  return g.events.length ? g.events.map((u, R) => {
    const s = p(e), i = p(e.dataItem);
    return s.recurrenceId = s.uid, l(i, o.recurrenceId, e.uid), s.originalStart = u.start.toLocalDate(), l(i, o.originalStart, u.start.toLocalDate()), s.start = u.start.toLocalDate(), l(i, o.start, u.start.toLocalDate()), s.end = u.end.toLocalDate(), l(i, o.end, u.end.toLocalDate()), s.occurrenceId = String(R), l(i, "occurrenceId", String(R)), s.dataItem = i, s;
  }) : [];
};
export {
  F as toOccurrences
};