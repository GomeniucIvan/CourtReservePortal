/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import B from "prop-types";
import { BaseView as Z } from "../../components/BaseView.jsx";
import { VerticalResourceIterator as C } from "../common/VerticalResourceIterator.mjs";
import { dateTitle as A, messages as d, timeTitle as z, eventTitle as L, allDay as _, noEvents as M, agendaViewTitle as V } from "../../messages/index.mjs";
import { DAYS_IN_WEEK_COUNT as p } from "../../constants/index.mjs";
import { MS_PER_DAY as I, ZonedDate as v, firstDayInWeek as j, getDate as W, addDays as q } from "@progress/kendo-date-math";
import { useDir as H, classNames as J, IconWrap as b } from "@progress/kendo-react-common";
import { useInternationalization as Q, useLocalization as X } from "@progress/kendo-react-intl";
import { toRanges as ee } from "../../services/rangeService.mjs";
import { toOccurrences as te } from "../../services/occurrenceService.jsx";
import { toItems as ae } from "../../services/itemsService.mjs";
import { mapItemsToSlots as le, mapSlotsToItems as re, toUTCDateTime as x } from "../../utils/index.mjs";
import { SchedulerEditTask as ce } from "../../tasks/SchedulerEditTask.jsx";
import { SchedulerEditSlot as se } from "../../slots/SchedulerEditSlotDisplay.jsx";
import { useSchedulerPropsContext as oe, useSchedulerDataContext as ne, useSchedulerGroupsContext as me, useSchedulerFieldsContext as ie, useSchedulerDateRangeContext as de } from "../../context/SchedulerContext.mjs";
import { SchedulerResourceIteratorContext as F } from "../../context/SchedulerResourceIteratorContext.mjs";
import { caretAltRightIcon as P, caretAltLeftIcon as U } from "@progress/kendo-svg-icons";
import { toSlots as ue } from "../../services/slotsServiceDisplay.js";
import { useCellSync as $ } from "../../hooks/useCellSync.mjs";
const K = (t) => {
  const {
    group: l,
    timezone: a,
    resources: m
  } = oe(), f = t.editTask || ce, D = t.editSlot || se, i = e.useRef(null), s = H(i), o = Q(), n = X(), [T] = ne(), S = me(), y = ie(), r = de(), u = e.useMemo(
    () => ee(
      r,
      { step: I, timezone: a }
    ),
    [
      r.start.getTime(),
      r.end.getTime(),
      a
    ]
  ), g = e.useMemo(
    () => ue(
      r,
      { step: I },
      { groups: S, ranges: u }
    ),
    [
      r.start.getTime(),
      r.end.getTime(),
      a,
      S,
      u
    ]
  ), w = e.useMemo(
    () => te(T, { dateRange: r, fields: y, timezone: a }),
    [T, r.start.getTime(), r.end.getTime(), y, a]
  ), h = e.useMemo(
    () => ae(w, { timezone: a }, { groups: S, ranges: u }),
    [w, a, S, u]
  ), O = e.useMemo(
    () => J(
      "k-scheduler-agendaview",
      t.className
    ),
    [t.className]
  );
  return $({ element: i, selector: ".k-scheduler-datecolumn", explicitDepth: !1 }), $({ element: i, selector: ".k-scheduler-timecolumn", explicitDepth: !1 }), e.useMemo(() => le(h, g, !0), [h, g]), e.useMemo(() => re(h, g, !0), [h, g]), /* @__PURE__ */ e.createElement(
    Z,
    {
      ref: i,
      id: t.id,
      style: t.style,
      className: O,
      props: t,
      slots: h,
      ranges: u
    },
    /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-head" }, /* @__PURE__ */ e.createElement(C, { resources: m, group: l }, /* @__PURE__ */ e.createElement(F.Consumer, null, ({ groupIndex: k }) => /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-row", key: k }, /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-cell k-heading-cell k-group-cell k-scheduler-datecolumn" }, n.toLanguageString(A, d[A])), /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-cell k-heading-cell k-group-cell k-scheduler-timecolumn" }, n.toLanguageString(z, d[z])), /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-cell k-heading-cell k-scheduler-eventcolumn" }, n.toLanguageString(L, d[L])))))),
    /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-body" }, /* @__PURE__ */ e.createElement(C, { resources: m, group: l, nested: !0 }, /* @__PURE__ */ e.createElement(F.Consumer, null, ({ groupIndex: k }) => g.filter((c) => c.group.index === (k || 0)).map((c, N, Y) => /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-row  k-scheduler-content", key: `${k}:${N}` }, /* @__PURE__ */ e.createElement(
      D,
      {
        ...c,
        editable: t.editable,
        row: Y.length * (k || 0) + N,
        col: 0,
        slot: t.slot,
        viewSlot: t.viewSlot,
        className: "k-scheduler-datecolumn k-group-cell"
      },
      /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("strong", { className: "k-scheduler-agendaday" }, o.formatDate(c.zonedStart, "dd")), /* @__PURE__ */ e.createElement("em", { className: "k-scheduler-agendaweek" }, o.formatDate(c.zonedStart, "EEEE")), /* @__PURE__ */ e.createElement("span", { className: "k-scheduler-agendadate" }, o.formatDate(c.zonedStart, "y")))
    ), /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-cell k-group-content" }, c.items.length ? c.items.map((E, R) => /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-row", key: R }, /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-cell k-scheduler-timecolumn" }, /* @__PURE__ */ e.createElement("div", null, E.tail && /* @__PURE__ */ e.createElement(
      b,
      {
        name: s === "rtl" ? "caret-alt-right" : "caret-alt-left",
        icon: s === "rtl" ? P : U
      }
    ), E.isAllDay ? n.toLanguageString(_, d[_]) : ge(o, E), E.head && /* @__PURE__ */ e.createElement(
      b,
      {
        name: s === "rtl" ? "caret-alt-left" : "caret-alt-right",
        icon: s === "rtl" ? U : P
      }
    ))), /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-cell" }, /* @__PURE__ */ e.createElement(
      f,
      {
        key: `${N}:${R}`,
        ...E,
        onDataAction: t.onDataAction,
        task: t.task,
        viewTask: t.viewTask,
        editable: t.editable
      }
    )))) : /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-cell k-heading-cell k-group-cell" }, n.toLanguageString(M, d[M]))))))))
  );
}, ge = (t, l) => {
  let a = "{0:t}-{1:t}";
  return l.head ? a = "{0:t}" : l.tail && (a = "{1:t}"), t.format(a, l.zonedStart, l.zonedEnd);
}, G = (t) => W(t), he = (t, l) => W(q(t, l || 1)), ke = ({ intl: t, date: l, numberOfDays: a = 1, timezone: m }) => {
  const f = v.fromLocalDate(l, m), D = G(a === p ? j(f, t.firstDay()) : f), i = he(D, a), s = v.fromUTCDate(x(D), m), o = v.fromUTCDate(x(i), m), n = new Date(s.getTime()), T = new Date(o.getTime());
  return {
    start: n,
    end: T,
    zonedStart: s,
    zonedEnd: o
  };
}, xe = {
  name: "agenda",
  title: (t) => t.toLanguageString(V, d[V]),
  dateRange: ke,
  selectedDateFormat: "{0:D} - {1:D}",
  selectedShortDateFormat: "{0:d} - {1:d}",
  slotDuration: 60 * 24,
  slotDivision: 1,
  step: p,
  numberOfDays: p
}, Ee = {
  title: B.any
};
K.propTypes = Ee;
K.displayName = "KendoReactSchedulerAgendaView";
export {
  K as AgendaView,
  xe as agendaViewDefaultProps
};
