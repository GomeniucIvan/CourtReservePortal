import { getDate as h } from "@progress/kendo-date-math";
import { toGroupResources as E, toFlatGroupResources as x } from "../views/common/utilsJava.js";
import { getter as M, setter as T } from "@progress/kendo-react-common";
import { orderBy as y } from "@progress/kendo-data-query";

const z = (e) => e[0], b = (e) => e[e.length - 1], G = (e) => {
  const r = /* @__PURE__ */ new Set();
  return e.forEach((s) => {
    r.add(s.field);
  }), r.size === e.length;
};

function N(e, r, s, t) {
  const n = { skeleton: "yMMMMEEEEdhm" }, o = { skeleton: "yMMMMEEEEd" };
  return t ? `${e.formatDate(r, o)}` : `${e.formatDate(r, n)}–${e.formatDate(s, "t")}`;
}
const k = () => h(/* @__PURE__ */ new Date()), D = (e, r, s, t = 0) => {
  if (t === s)
    return null;
  let n = null;
    const element = document.elementFromPoint(e, r);
    if (!element)
        return n;
    if (element.getAttribute("data-slot") === "true")
      return element;
    {
        const d = element.style.pointerEvents;
        element.style.pointerEvents = "none", n = D(e, r, s, t + 1), element.style.pointerEvents = d;
    }
  return n;
}, l = (e, r) => M(r)(e), w = (e, r, s) => {
  if (r)
    return T(r)(e, s);
}, B = (e) => e != null;
function P(e) {
  return new Date(Date.UTC(
    e.getFullYear(),
    e.getMonth(),
    e.getDate(),
    e.getHours(),
    e.getMinutes(),
    e.getSeconds(),
    e.getMilliseconds()
  ));
}
const _ = (e, r, s) => {
  const t = F(e, r) ? l(e, r.id) : l(e, r.recurrenceId);
  return s.find((n) => l(n, r.id) === t);
}, F = (e, r) => {
  const s = l(e, r.id), t = l(e, r.recurrenceId), n = l(e, r.recurrenceRule);
  return !!(s && n && t == null);
    }, g = (e, r) => Math.max(e.getTime(), r.getTime()), f = (e, r) => Math.min(e.getTime(), r.getTime()),
    a = (e, r, s, t, n = !1) => n ? g(r, t) - f(e, s) <= r.getTime() - e.getTime() + (t.getTime() - s.getTime()) : g(r, t) - f(e, s) < r.getTime() - e.getTime() + (t.getTime() - s.getTime()), I = {
  id: "id",
  start: "start",
  startTimezone: "startTimezone",
  originalStart: "originalStart",
  reserveStart: "reserveStart",
  reserveEnd: "reserveEnd",
  end: "end",
  endTimezone: "endTimezone",
  isAllDay: "isAllDay",
  title: "title",
  description: "description",
  recurrenceRule: "recurrenceRule",
  recurrenceId: "recurrenceId",
  recurrenceExceptions: "recurrenceExceptions"
}, $ = (e) => ({ fields: { ...I, ...e } }), C = (e, r, s) => (r.getHours() < e.getHours() || r.getHours() === e.getHours() && r.getMinutes() <= e.getMinutes()) && (e.getHours() < s.getHours() || s.getHours() === e.getHours() && e.getMinutes() < s.getMinutes()), O = (e, r, s) => r < s ? r <= e && e <= s : e <= s || r <= e, U = (e, r) => {
  const s = E(e, r), t = x(s);
  return t.length === 1 ? [{
    index: 0,
    // resources: []
    resources: (r || []).reduce(
      (n, o) => [...n, ...o.data.map((u) => ({
        ...u,
        field: o.field,
        valueField: o.valueField,
        colorField: o.colorField,
        multiple: o.multiple
      }))],
      []
    )
  }] : t.map((n, o) => ({
    index: o,
    resources: n
  }));
}, A = (e) => e == null, Y = (e) => A(e) || e.trim && e.trim().length === 0, m = (e) => {
  let r = 0;
  const s = e.slice();
  return s.sort((t, n) => t - n).forEach((t, n) => {
    s[n] === n && (r = n + 1);
  }), r;
}, j = (e, r, s, t = !1) => {
  let n;
  return s.forEach((o) => {
    const u = [];
    r.sort((i, c) => i.props.start.getTime() - c.props.start.getTime()).forEach((i) => {
      if ((t || i.props.isAllDay === o.current.props.isAllDay) && i.props.range.index === o.current.props.range.index && i.props.group.index === o.current.props.group.index && a(i.props.start, i.props.end, o.current.props.start, o.current.props.end)) {
        const p = m(u);
        i === e && n === void 0 && (n = p), u.splice(p, 0, p);
      }
    });
  }), n;
}, q = (e, r, s = !1) => {
  r.forEach((t) => t.items.splice(0, t.items.length)), r.forEach((t) => {
    const n = [];
    e.forEach((o) => {
      if ((s || o.isAllDay === t.isAllDay) && o.range.index === t.range.index && o.group.index === t.group.index && a(o.start, o.end, t.start, t.end)) {
        const d = m(n);
        (o.order === null || o.order === void 0 || o.order < d) && (o.order = d), n.splice(o.order, 0, o.order), t.items.push(o);
      }
    });
  });
}, J = (e, r, s = !1) => {
  e.forEach((t) => t.slots.splice(0, t.slots.length)), e.forEach((t) => {
    r.forEach((n) => {
      (s || t.isAllDay === n.isAllDay) && t.range.index === n.range.index && t.group.index === n.group.index && a(t.start, t.end, n.start, n.end) && t.slots.push(n);
    });
  });
}, K = (...e) => {
}, L = (e) => {
  const r = e.props.items.find((s) => s.order === 0) || e.props.items[0];
  return r && r._ref.current;
}, Q = (e, r, s = !1, t = !1) => {
  const n = e.current;
  if (!n || !r)
    return null;
  const o = r.filter((c) => c.current !== null && c.current.element !== null), u = y(
    o,
    [
      { field: "current.props.group.index", dir: "asc" },
      { field: "current.props.range.index", dir: "asc" },
      s ? { field: "" } : { field: "current.props.isAllDay", dir: "desc" },
      { field: "current.props.start", dir: "asc" }
    ]
  ), d = u.findIndex((c) => c.current !== null && !!(c.current.props.uid === n.props.uid && (c.current.props.occurrenceId === void 0 || c.current.props.occurrenceId === n.props.occurrenceId) && c.current.props.group.index === n.props.group.index && c.current.props.range.index === n.props.range.index && (s || c.current.props.isAllDay === n.props.isAllDay)));
  return u[d + (t ? -1 : 1)];
    }, V = (e, r) => (e.order || 0) - (r.order || 0);

const maxDate = (x, y) => Math.max(x.getTime(), y.getTime());
const minDate = (x, y) => Math.min(x.getTime(), y.getTime());

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
        (endTime.getTime() - startTime.getTime()) + (periodEnd.getTime() - periodStart.getTime()) &&
        endTime.getTime() !== periodStart.getTime() && startTime.getTime() !== periodEnd.getTime();


export {
  j as calculateOrder,
  I as defaultModelFields,
  L as findFirstItem,
  _ as findMaster,
  m as findMissing,
  Q as findNextItem,
  z as first,
  N as formatEventTime,
  l as getField,
  $ as getModelFields,
  k as getToday,
  A as isBlank,
  G as isGroupped,
  O as isInDaysRange,
  C as isInTimeRange,
  F as isMaster,
  Y as isNullOrEmptyString,
  B as isPresent,
  b as last,
  J as mapItemsToSlots,
  q as mapSlotsToItems,
  K as noop,
  V as orderSort,
  w as setField,
  D as slotDive,
  U as toSchedulerGroups,
  P as toUTCDateTime
};
