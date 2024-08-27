/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as t from "react";
import U from "prop-types";
import { BaseView as B } from "../../components/BaseView.mjs";
import { ZonedDate as y, MS_PER_DAY as v, firstDayInWeek as z, firstDayOfMonth as H, getDate as N, addDays as K, lastDayOfMonth as L } from "@progress/kendo-date-math";
import { classNames as W } from "@progress/kendo-react-common";
import { VerticalResourceIterator as V } from "../common/VerticalResourceIterator.mjs";
import { HorizontalResourceIterator as b } from "../common/HorizontalResourceIterator.jsx";
import { mapItemsToSlots as G, mapSlotsToItems as Z, orderSort as j, toUTCDateTime as A } from "../../utils/index.mjs";
import { monthViewTitle as P, messages as q } from "../../messages/index.mjs";
import { SchedulerEditSlot as J } from "../../slots/SchedulerEditSlotDisplay.jsx";
import { useInternationalization as Q } from "@progress/kendo-react-intl";
import { DAYS_IN_WEEK_COUNT as O } from "../../constants/index.mjs";
import { toRanges as X } from "../../services/rangeService.mjs";
import { toSlots as ee } from "../../services/slotsServiceDisplay.js";
import { toOccurrences as te } from "../../services/occurrenceService.mjs";
import { toItems as oe } from "../../services/itemsService.mjs";
import { ShowMoreItemsButton as re } from "../../components/ShowMoreItemsButton.mjs";
import { SchedulerEditItem as ae } from "../../items/SchedulerEditItemDisplay.jsx";
import { useSchedulerPropsContext as ne, useSchedulerDataContext as se, useSchedulerDateContext as me, useSchedulerActiveViewContext as ie, useSchedulerViewsContext as ce, useSchedulerGroupsContext as le, useSchedulerOrientationContext as de, useSchedulerDateRangeContext as ue, useSchedulerFieldsContext as fe } from "../../context/SchedulerContext.mjs";
import { SchedulerResourceIteratorContext as I } from "../../context/SchedulerResourceIteratorContext.mjs";
import { DateHeaderCell as he } from "../../components/DateHeaderCell.jsx";
const De = { skeleton: "dd" }, _ = (o) => {
  const {
    group: i,
    timezone: a,
    resources: d
  } = ne(), E = o.editItem || ae, D = o.editSlot || J, [u] = se(), [, p] = me(), [, f] = ie(), C = ce(), g = le(), S = de(), s = ue(), $ = Q(), k = fe(), T = o.itemsPerSlot || Se.itemsPerSlot, c = t.useMemo(
    () => X(
      s,
      { step: v * O, timezone: a }
    ),
    [s.start.getTime(), s.end.getTime(), a]
  ), l = t.useMemo(
    () => ee(
      s,
      { step: v },
      { groups: g, ranges: c }
    ),
    [
      s.start.getTime(),
      s.end.getTime(),
      g,
      c
    ]
  ), M = t.useMemo(
    () => te(u, { dateRange: s, fields: k, timezone: a }),
    [u, s.start.getTime(), s.end.getTime(), k, a]
  ), h = t.useMemo(
    () => oe(M, { timezone: a }, { groups: g, ranges: c }),
    [M, a, g, c]
  ), Y = t.useCallback(
    (e) => {
      const r = C.find((m) => m.props.name === "day");
      !f || !r || !r.props.name || !e.target.slot || (f(r.props.name, e), p(e.target.slot.start, e));
    },
    [
      f,
      C
    ]
  );
  t.useMemo(() => G(h, l, !0), [h, l]), t.useMemo(() => Z(h, l, !0), [h, l]);
  const R = /* @__PURE__ */ t.createElement(I.Consumer, null, ({ groupIndex: e }) => /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-row", key: e }, l.filter((r) => r.group.index === e && r.range.index === 0).map((r, m) => /* @__PURE__ */ t.createElement(
    he,
    {
      as: o.dateHeaderCell,
      key: m,
      "data-dayslot-index": m,
      date: y.fromLocalDate(
        new Date(r.zonedEnd.getTime() - (r.zonedEnd.getTime() - r.zonedStart.getTime()) / 2),
        a
      ),
      start: r.start,
      end: r.end,
      format: { skeleton: "EEEE" }
    }
  )))), x = /* @__PURE__ */ t.createElement(I.Consumer, null, ({ groupIndex: e }) => c.map((r, m) => /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-row", key: m }, l.filter((n) => n.group.index === e && n.range.index === m).map((n, w, F) => /* @__PURE__ */ t.createElement(
    D,
    {
      slot: o.slot,
      viewSlot: o.viewSlot,
      key: w,
      form: o.form,
      ...n,
      expandable: { offsetTop: 30, offsetBottom: T < n.items.length ? 15 : 0 },
      onDataAction: o.onDataAction,
      col: S === "horizontal" ? F.length * (e || 0) + w : w,
      row: S === "horizontal" ? m : c.length * (e || 0) + m,
      editable: o.editable
    },
    /* @__PURE__ */ t.createElement("span", { className: "k-link k-nav-day" }, $.formatDate(
      new Date(n.end.getTime() - (n.end.getTime() - n.start.getTime()) / 2),
      De
    )),
    T < n.items.length && /* @__PURE__ */ t.createElement(re, { slot: n, onClick: Y })
  )))));
  return /* @__PURE__ */ t.createElement(
    B,
    {
      props: o,
      slots: l,
      ranges: c,
      className: W("k-scheduler-monthview", o.className)
    },
    /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-head" }, S === "horizontal" ? /* @__PURE__ */ t.createElement(b, { nested: !0, resources: d, group: i }, R) : /* @__PURE__ */ t.createElement(V, { resources: d, group: i }, R)),
    /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-body" }, S === "horizontal" ? /* @__PURE__ */ t.createElement(b, { resources: d, group: i }, x) : /* @__PURE__ */ t.createElement(V, { nested: !0, resources: d, group: i }, x), h.filter((e) => e.order === null || e.order < T).sort(j).map((e) => /* @__PURE__ */ t.createElement(
      E,
      {
        item: o.item,
        viewItem: o.viewItem,
        form: o.form,
        key: e.isRecurring ? `${e.uid}:${e.group.index}:${e.range.index}:${e.originalStart}` : `${e.uid}:${e.group.index}:${e.range.index}`,
        ...e,
        onDataAction: o.onDataAction,
        style: { transform: "translateY(30px)" },
        vertical: !1,
        editable: o.editable,
        ignoreIsAllDay: !0
      }
    )))
  );
}, ge = ({ intl: o, date: i, timezone: a }) => {
  const d = z(H(N(i)), o.firstDay()), E = K(z(L(N(i)), o.firstDay()), O), D = y.fromUTCDate(A(d), a), u = y.fromUTCDate(A(E), a), p = new Date(D.getTime()), f = new Date(u.getTime());
  return {
    start: p,
    end: f,
    zonedStart: D,
    zonedEnd: u
  };
}, Se = {
  name: "month",
  dateRange: ge,
  slotDuration: 24 * 60,
  slotDivision: 1,
  itemsPerSlot: 2,
  numberOfDays: 31,
  title: (o) => o.toLanguageString(P, q[P]),
  selectedDateFormat: "{0:Y}",
  selectedShortDateFormat: "{0:Y}"
}, Ee = {
  itemsPerSlot: U.number
};
_.propTypes = Ee;
_.displayName = "KendoReactSchedulerMonthView";
export {
  _ as MonthView,
  Se as monthViewDefaultProps
};
