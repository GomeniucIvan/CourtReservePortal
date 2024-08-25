/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as t from "react";
import { BaseView as re } from "../../components/BaseView.mjs";
import { MS_PER_DAY as oe, MS_PER_MINUTE as ne, ZonedDate as z, Day as B, getDate as ae, addDays as ie } from "@progress/kendo-date-math";
import { HorizontalResourceIterator as L } from "../common/HorizontalResourceIterator.mjs";
import { TimelineViewRowContent as se } from "./TimelineViewRowContent.mjs";
import { TimelineViewAllEventsRowContent as le } from "./TimelineViewAllEventsRowContent.mjs";
import { VerticalResourceIterator as Z } from "../common/VerticalResourceIterator.mjs";
import { isInTimeRange as E, mapItemsToSlots as me, mapSlotsToItems as ce, toUTCDateTime as H, isInDaysRange as ue, intersects as X, last as Y, first as j, orderSort as de } from "../../utils/index.mjs";
import { classNames as De } from "@progress/kendo-react-common";
import { toRanges as Te } from "../../services/rangeService.mjs";
import { toSlots as fe } from "../../services/slotsServiceDisplay.js";
import { toOccurrences as ge } from "../../services/occurrenceService.mjs";
import { toItems as ke } from "../../services/itemsService.mjs";
import { SchedulerEditSlot as we } from "../../slots/SchedulerEditSlotDisplay.jsx";
import { BORDER_WIDTH as he } from "../../constants/index.mjs";
import { useInternationalization as Ee } from "@progress/kendo-react-intl";
import { SchedulerEditItem as Se } from "../../items/SchedulerEditItemDisplay.jsx";
import { useSchedulerPropsContext as ye, useSchedulerDataContext as Re, useSchedulerOrientationContext as Ce, useSchedulerGroupsContext as We, useSchedulerDateRangeContext as ze, useSchedulerFieldsContext as ve } from "../../context/SchedulerContext.mjs";
import { SchedulerResourceIteratorContext as A } from "../../context/SchedulerResourceIteratorContext.mjs";
import { CurrentTimeMarker as q } from "../../components/CurrentTimeMarket.mjs";
import { DateHeaderCell as Me } from "../../components/DateHeaderCell.mjs";
import { TimeHeaderCell as xe } from "../../components/TimeHeaderCell.mjs";
import { useCellSync as Ie } from "../../hooks/useCellSync.mjs";
import { useRowSync as be } from "../../hooks/useRowSync.mjs";
const Ae = "t", He = 0, nt = (e) => {
  const {
    group: D,
    timezone: n,
    resources: T
  } = ye(), f = t.useRef(null), v = t.useRef(null), S = e.editItem || Se, y = e.editSlot || we, g = t.useRef(null), [R] = Re(), k = Ce(), h = We(), i = ze(), N = ve(), C = Ee(), W = e.showWorkHours, _ = e.slotDivisions || l.slotDivisions, M = e.slotDuration || l.slotDuration, J = e.workWeekStart || l.workWeekStart, K = e.workWeekEnd || l.workWeekEnd, x = C.parseDate(e.workDayStart || e.isWorkDayStart || l.isWorkDayStart), I = C.parseDate(e.workDayEnd || e.isWorkDayEnd || l.isWorkDayEnd), $ = C.parseDate(e.startTime || l.startTime), F = C.parseDate(e.endTime || l.endTime), m = t.useMemo(
    () => W ? x : $,
    [
      W,
      x,
      $
    ]
  ), c = t.useMemo(
    () => W ? I : F,
    [
      W,
      I,
      F
    ]
  ), o = t.useMemo(
    () => Te(
      i,
      { step: oe, timezone: n }
    ),
    [
      i.start.getTime(),
      i.end.getTime(),
      n
    ]
  ), s = t.useMemo(
    () => fe(
      i,
      { step: M / _ * ne },
      { groups: h, ranges: o }
    ).filter((r) => E(r.zonedStart, m, c) || m.getTime() === c.getTime()),
    [
      h,
      o,
      i.start.getTime(),
      i.end.getTime(),
      n,
      M,
      _,
      m.getTime(),
      c.getTime()
    ]
  ), U = t.useMemo(
    () => ge(R, { dateRange: i, fields: N, timezone: n }),
    [R, i.start.getTime(), i.end.getTime(), N, n]
  ), u = t.useMemo(
    () => ke(U, { timezone: n }, { groups: h, ranges: o }).filter(
      (r) => m.getTime() === c.getTime() || E(r.zonedStart, m, c) || E(r.zonedEnd, m, c) || E(
        new Date(r.zonedEnd.getTime() - (r.zonedEnd.getTime() - r.zonedStart.getTime()) / 2),
        m,
        c
      )
    ),
    [U, n, h, o, m.getTime(), c.getTime()]
  );
  t.useMemo(() => me(u, s, !0), [u, s]), t.useMemo(() => ce(u, s, !0), [u, s]);
  const V = (k === "horizontal" ? s.length : s.length / h.length) * ((e.columnWidth || l.columnWidth) + he), O = /* @__PURE__ */ t.createElement(A.Consumer, null, () => /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-row" }, o.map((r, w) => /* @__PURE__ */ t.createElement(
    Me,
    {
      as: e.dateHeaderCell,
      key: w,
      date: r.zonedStart,
      start: r.start,
      end: r.end,
      format: "m"
    }
  ))), /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-row", ref: f }, o.map((r, w) => s.filter((a) => a.group.index === He && a.range.index === w).map(
    (a) => a.zonedStart.getMinutes() % M === 0 ? /* @__PURE__ */ t.createElement(
      xe,
      {
        key: a.index,
        as: e.timeHeaderCell,
        format: Ae,
        date: a.zonedStart,
        start: a.zonedStart,
        end: a.zonedEnd
      }
    ) : null
  ))))), P = /* @__PURE__ */ t.createElement(A.Consumer, null, ({ groupIndex: r }) => /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-row" }, o.map((w, a) => s.filter((d) => d.group.index === r && d.range.index === a).map((d, G, b) => {
    const ee = z.fromUTCDate(H(d.zonedStart), n), te = ue(ee.getDay(), J, K);
    return /* @__PURE__ */ t.createElement(
      y,
      {
        key: `${d.start.getTime()}:${d.group.index}`,
        slot: e.slot,
        viewSlot: e.viewSlot,
        ...d,
        form: e.form,
        onDataAction: e.onDataAction,
        isWorkHour: E(d.zonedStart, x, I),
        isWorkDay: te,
        col: k === "horizontal" ? a * b.length + G + b.length * o.length * (r || 0) : a * b.length + G,
        row: k === "horizontal" ? 0 : r || 0,
        expandable: !0,
        editable: e.editable
      }
    );
  })))), Q = t.useMemo(
    () => De(
      "k-scheduler-timeline-view",
      e.className
    ),
    [e.className]
  );
  Ie({
    element: g,
    selector: ".k-resource-cell",
    attribute: "data-depth-index",
    explicitDepth: !0
  });
  const p = g.current ? g.current.closest(".k-scheduler-layout") : null;
  return be({
    element: p,
    selector: ".k-resource-row",
    horizontalAttribute: "data-depth-index",
    verticalAttribute: "data-resource-index",
    applyTo: ".k-resource-cell",
    syncHeight: u && !u.length
  }), /* @__PURE__ */ t.createElement(t.Fragment, null, /* @__PURE__ */ t.createElement(
    re,
    {
      ref: g,
      id: e.id,
      style: { ...e.style },
      className: Q,
      props: e,
      slots: s,
      ranges: o
    },
    /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-head", style: { width: V } }, k === "horizontal" ? /* @__PURE__ */ t.createElement(
      L,
      {
        nested: !0,
        group: D,
        resources: T,
        rowContent: se
      },
      O
    ) : /* @__PURE__ */ t.createElement(
      Z,
      {
        wrapGroup: !0,
        group: D,
        resources: T
      },
      O
    )),
    /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-body", style: { width: V }, ref: v }, k === "horizontal" ? /* @__PURE__ */ t.createElement(
      L,
      {
        group: D,
        resources: T,
        rowContent: le
      },
      P,
      /* @__PURE__ */ t.createElement(A.Consumer, null, ({ groupIndex: r }) => e.currentTimeMarker && X(j(o).start, Y(o).end, /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date(), !0) && /* @__PURE__ */ t.createElement(
        q,
        {
          groupIndex: r,
          attachArrow: f,
          vertical: !0
        }
      ))
    ) : /* @__PURE__ */ t.createElement(
      Z,
      {
        nested: !0,
        wrapGroup: !0,
        group: D,
        resources: T
      },
      P
    ), k === "vertical" && e.currentTimeMarker && X(j(o).start, Y(o).end, /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date(), !0) && /* @__PURE__ */ t.createElement(
      q,
      {
        attachArrow: f,
        vertical: !0
      }
    ), u.sort(de).map((r, w) => /* @__PURE__ */ t.createElement(
      S,
      {
        key: r.isRecurring ? `${r.uid}:${r.group.index}:${r.range.index}:${r.originalStart}` : `${r.uid}:${r.group.index}:${r.range.index}`,
        ...r,
        format: "t",
        form: e.form,
        onDataAction: e.onDataAction,
        item: e.item,
        viewItem: e.viewItem,
        editable: e.editable,
        ignoreIsAllDay: !0,
        vertical: !1,
        isLast: w === u.length - 1
      }
    )))
  ));
}, Ne = ({ date: e, numberOfDays: D = 1, timezone: n }) => {
  const T = z.fromLocalDate(e, n), f = ae(T), v = ie(f, D), S = z.fromUTCDate(H(f), n), y = z.fromUTCDate(H(v), n), g = new Date(S.getTime()), R = new Date(y.getTime());
  return {
    start: g,
    end: R,
    zonedStart: S,
    zonedEnd: y
  };
}, l = {
  name: "multi-day-timeline",
  title: "Multi Day Timeline",
  currentTimeMarker: !0,
  dateRange: Ne,
  selectedDateFormat: "{0:D} - {1:D}",
  selectedShortDateFormat: "{0:d} - {1:d}",
  step: 1,
  numberOfDays: 1,
  startTime: "00:00",
  endTime: "00:00",
  isWorkDayStart: "8:00",
  isWorkDayEnd: "17:00",
  workWeekStart: B.Monday,
  workWeekEnd: B.Friday,
  slotDivisions: 2,
  slotDuration: 60,
  // showCurrentTime: true // TODO: Phase 2
  defaultShowWorkHours: !0,
  columnWidth: 100
};
export {
  nt as MultiDayTimelineView,
  l as multiDayTimelineViewDefaultProps
};