/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { useInternationalization as Q, useLocalization as X } from "@progress/kendo-react-intl";
import { messages as L, recurrenceEditorRepeat as K, recurrenceEditorWeeklyRepeatOn as _, recurrenceEditorMonthlyRepeatOn as $, recurrenceEditorMonthlyDay as ee, recurrenceEditorYearlyRepeatOn as te, recurrenceEditorYearlyOf as ae, recurrenceEditorEndLabel as ne, recurrenceEditorEndNever as le, recurrenceEditorEndAfter as re, recurrenceEditorEndOccurrence as oe, recurrenceEditorEndOn as ce } from "../messages/index.mjs";
import { serializeRule as se } from "@progress/kendo-recurrence";
import { ZonedDate as M, toLocalDate as ue } from "@progress/kendo-date-math";
import { RecurrenceFrequencyEditor as ie } from "./RecurrenceFrequencyEditor.mjs";
import { RecurrenceRepeatOnWeekEditor as de } from "./RecurrenceRepeatOnWeekEditor.mjs";
import { getRule as me, getFrequencies as ye, getFrequency as ke, getExtendedWeekDays as he, getWeekDay as fe, getMonths as ve, getMonth as ge, getOffsets as be, getOffset as Ee, getEndRule as Ce, getMonthDay as De, getUntil as we, getWeekDays as Me, getRepeatOnRule as Re, weekDayRuleFromString as P, capitalize as U } from "./common.mjs";
import { Label as i } from "@progress/kendo-react-labels";
import { NumericTextBox as E, RadioGroup as R } from "@progress/kendo-react-inputs";
import { DropDownList as k } from "@progress/kendo-react-dropdowns";
import { DatePicker as Oe } from "@progress/kendo-react-dateinputs";
import { FieldWrapper as h } from "@progress/kendo-react-form";
import { useSchedulerPropsContext as We } from "../context/SchedulerContext.mjs";
const Ne = (l) => {
  const d = Q(), C = X(), { timezone: W } = We(), [N, q] = e.useState(1), [x, G] = e.useState(M.fromUTCDate(l.start)), c = e.useCallback(
    (n, t) => {
      const o = t ? n : "scheduler.recurrenceEditor" + n;
      return C.toLanguageString(o, L[o]);
    },
    [C]
  ), a = e.useMemo(
    () => {
      var n;
      return me((n = l.value) != null ? n : xe.value);
    },
    [l.value]
  ), T = e.useMemo(
    () => ye(c),
    [c]
  ), u = e.useMemo(
    () => ke(a),
    [a]
  ), v = e.useMemo(
    () => he(d, c),
    [d, c]
  ), m = e.useMemo(
    () => fe(v, a, l.start),
    [v, a, l.start]
  ), g = e.useMemo(
    () => ve(d),
    [d]
  ), F = e.useMemo(
    () => ge(g, a),
    [g, a]
  ), b = e.useMemo(
    () => be(c),
    [c]
  ), y = e.useMemo(
    () => Ee(b, a),
    [b, a]
  ), f = e.useMemo(
    () => Ce(a),
    [a]
  ), D = e.useMemo(
    () => De(a, l.start),
    [a, l.start]
  ), Y = e.useMemo(
    () => we(a),
    [a.until]
  ), w = e.useMemo(
    () => Me(d),
    [d]
  ), s = e.useMemo(
    () => Re(a),
    [a.byWeekDay, a.byMonthDay]
  ), r = e.useCallback(
    (n) => {
      n.freq === "never" ? l.onChange({ value: null }) : (n.weekStart === void 0 && (n.weekStart = d.firstDay()), l.onChange({ value: se(n, l.timezone) }));
    },
    [l.onChange, l.timezone]
  ), A = e.useCallback(
    (n) => {
      const t = {};
      t.freq = n, t.interval = 1, n === "weekly" && (t.byWeekDay = [{
        day: M.fromLocalDate(l.start, W).getDay(),
        offset: 0
      }]), (n === "monthly" || n === "yearly") && (t.byMonthDay = [l.start.getDate()]), n === "yearly" && (t.byMonth = [l.start.getMonth() + 1]), r(t);
    },
    [r, l.start, W]
  ), B = e.useCallback(
    (n) => {
      const t = n.value;
      r(Object.assign({}, a, {
        interval: t
      }));
    },
    [r, a]
  ), H = e.useCallback(
    (n) => {
      const t = n.value;
      r(Object.assign({}, a, {
        count: t
      })), t !== null && q(t);
    },
    [r, a]
  ), V = e.useCallback(
    (n) => {
      const t = n.value;
      if (!t)
        return;
      const o = M.fromLocalDate(t, l.timezone);
      r(Object.assign({}, a, {
        until: o
      })), G(o);
    },
    [r, a, l.timezone]
  ), Z = e.useCallback(
    (n) => {
      r(Object.assign({}, a, {
        byWeekDay: w.filter((t) => n.some((o) => o === t.value)).map((t) => ({ offset: 0, day: t.value }))
      }));
    },
    [r, a, w]
  ), p = e.useCallback(
    (n) => {
      const t = Object.assign({}, a), o = n.target.value;
      typeof o.value == "string" ? (t.byWeekDay = P(o.value), t.bySetPosition = [y.value]) : t.byWeekDay = [{
        day: o.value,
        offset: y.value
      }], r(t);
    },
    [r, a]
  ), I = e.useCallback(
    (n) => {
      r(Object.assign({}, a, {
        byMonthDay: [n.value]
      }));
    },
    [r, a]
  ), S = e.useCallback(
    (n) => {
      const t = n.value;
      r(Object.assign({}, a, {
        byMonth: [t.value]
      }));
    },
    [r, a]
  ), J = e.useCallback(
    (n) => {
      const t = n.value, o = Object.assign({}, a);
      switch (t) {
        case "never":
          o.until = void 0, o.count = void 0;
          break;
        case "count":
          o.until = void 0, o.count = N;
          break;
        case "until":
          o.until = x, o.count = void 0;
          break;
      }
      r(o);
    },
    [r, a, l.timezone]
  ), z = e.useCallback(
    (n) => {
      const t = Object.assign({}, a);
      n.value === "monthday" ? (t.byWeekDay = void 0, t.bySetPosition = void 0, t.byMonthDay = [D]) : n.value === "weekday" && (t.byMonthDay = void 0, typeof m.value == "string" ? (t.bySetPosition = [y.value], t.byWeekDay = P(m.value)) : t.byWeekDay = [{
        day: m.value,
        offset: y.value
      }]), r(t);
    },
    [r, a, D, m]
  ), j = e.useCallback(
    (n) => {
      const t = Object.assign({}, a), o = n.value;
      if (t.byWeekDay)
        switch (t.byWeekDay.length) {
          case 7:
          case 5:
          case 2:
            t.bySetPosition = [o.value];
            break;
          case 1:
            t.byWeekDay[0].offset = o.value;
            break;
        }
      r(t);
    },
    [r, a]
  );
  return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(h, null, /* @__PURE__ */ e.createElement(i, { className: "k-form-label" }, C.toLanguageString(K, L[K])), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
    ie,
    {
      value: u,
      data: T,
      onChange: A
    }
  ))), u !== "never" && /* @__PURE__ */ e.createElement(h, null, /* @__PURE__ */ e.createElement(i, { editorId: "interval-editor", className: "k-form-label" }, c(U(u) + "RepeatEvery")), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
    E,
    {
      min: 1,
      step: 1,
      defaultValue: 1,
      value: a.interval,
      onChange: B,
      id: "interval-editor",
      className: "k-recur-interval"
    }
  ), /* @__PURE__ */ e.createElement(e.Fragment, null, " "), /* @__PURE__ */ e.createElement(i, { editorId: "interval-editor", className: "k-form-label" }, c(U(u) + "Interval")))), u === "weekly" && /* @__PURE__ */ e.createElement(h, null, /* @__PURE__ */ e.createElement(i, { className: "k-form-label" }, c(_, !0)), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
    de,
    {
      data: w,
      value: (a.byWeekDay || []).map(({ day: n }) => n),
      onChange: Z
    }
  ))), u === "monthly" && /* @__PURE__ */ e.createElement(h, null, /* @__PURE__ */ e.createElement(i, { key: "recurrence-repeat-on-monthly-label", className: "k-form-label" }, c($, !0)), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
    R,
    {
      value: s,
      onChange: z,
      item: O,
      className: "k-reset",
      data: [
        {
          value: "monthday",
          label: c(ee, !0),
          children: [
            /* @__PURE__ */ e.createElement(e.Fragment, { key: "separator" }, " "),
            /* @__PURE__ */ e.createElement(
              E,
              {
                key: "weekday-day",
                min: 1,
                max: 31,
                disabled: s !== "monthday",
                value: a && a.byMonthDay && a.byMonthDay[0],
                onChange: I,
                width: "auto"
              }
            )
          ]
        },
        {
          value: "weekday",
          label: " ",
          children: [
            /* @__PURE__ */ e.createElement(
              k,
              {
                key: "weekday-offset",
                textField: "text",
                dataItemKey: "value",
                disabled: s !== "weekday",
                data: b,
                value: y,
                onChange: j,
                style: { width: "auto" }
              }
            ),
            /* @__PURE__ */ e.createElement(e.Fragment, { key: "separator" }, " "),
            /* @__PURE__ */ e.createElement(
              k,
              {
                key: "weekday-value",
                disabled: s !== "weekday",
                value: m,
                data: v,
                onChange: p,
                textField: "text",
                dataItemKey: "value",
                style: { width: "auto" }
              }
            )
          ]
        }
      ]
    }
  ))), u === "yearly" && /* @__PURE__ */ e.createElement(h, null, /* @__PURE__ */ e.createElement(i, null, c(te, !0)), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
    R,
    {
      value: s,
      item: O,
      onChange: z,
      className: "k-reset",
      data: [
        {
          value: "monthday",
          label: " ",
          children: [
            /* @__PURE__ */ e.createElement(
              k,
              {
                key: "monthday-month",
                disabled: s !== "monthday",
                value: F,
                data: g,
                textField: "text",
                dataItemKey: "value",
                onChange: S,
                style: { width: "auto" }
              }
            ),
            /* @__PURE__ */ e.createElement(e.Fragment, { key: "separator" }, " "),
            /* @__PURE__ */ e.createElement(
              E,
              {
                key: "monthday-day",
                min: 1,
                max: 31,
                disabled: s !== "monthday",
                value: D,
                onChange: I,
                width: "auto"
              }
            )
          ]
        },
        {
          value: "weekday",
          label: " ",
          children: [
            /* @__PURE__ */ e.createElement(
              k,
              {
                key: "yearly-weekday-offset",
                textField: "text",
                dataItemKey: "value",
                disabled: s !== "weekday",
                data: b,
                value: y,
                onChange: j,
                style: { width: "auto" }
              }
            ),
            /* @__PURE__ */ e.createElement(e.Fragment, { key: "yearly-separator-1" }, " "),
            /* @__PURE__ */ e.createElement(
              k,
              {
                key: "yearly-weekday-day",
                textField: "text",
                dataItemKey: "value",
                disabled: s !== "weekday",
                value: m,
                data: v,
                onChange: p,
                style: { width: "auto" }
              }
            ),
            /* @__PURE__ */ e.createElement(e.Fragment, { key: "yearly-separator-2" }, " "),
            /* @__PURE__ */ e.createElement("span", { key: "yearly-weekday-of-label" }, c(ae, !0)),
            /* @__PURE__ */ e.createElement(e.Fragment, { key: "yearly-separator-3" }, " "),
            /* @__PURE__ */ e.createElement(
              k,
              {
                key: "yearly-weekday-month",
                textField: "text",
                dataItemKey: "value",
                disabled: s !== "weekday",
                value: F,
                data: g,
                onChange: S,
                style: { width: "auto" }
              }
            )
          ]
        }
      ]
    }
  ))), u !== "never" && /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-recurrence-end-rule-editor" }, /* @__PURE__ */ e.createElement(h, null, /* @__PURE__ */ e.createElement(i, { className: "k-form-label" }, c(ne, !0)), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
    R,
    {
      item: O,
      value: f,
      onChange: J,
      data: [
        {
          value: "never",
          label: c(le, !0)
        },
        {
          value: "count",
          label: c(re, !0),
          children: [
            /* @__PURE__ */ e.createElement(e.Fragment, { key: "separator-1" }, " "),
            /* @__PURE__ */ e.createElement(
              E,
              {
                key: "endrule-after-editor",
                id: "k-endrule-after",
                className: "k-recur-count",
                min: 1,
                width: "auto",
                value: f === "count" ? a.count : N,
                onChange: H,
                disabled: f !== "count"
              }
            ),
            /* @__PURE__ */ e.createElement(e.Fragment, { key: "separator-2" }, " "),
            /* @__PURE__ */ e.createElement(
              i,
              {
                key: "endrule-after-label",
                className: "k-radio-label",
                editorId: "k-endrule-after"
              },
              c(oe, !0)
            )
          ]
        },
        {
          value: "until",
          label: c(ce, !0),
          children: [
            /* @__PURE__ */ e.createElement(e.Fragment, { key: "separator" }, " "),
            /* @__PURE__ */ e.createElement(
              Oe,
              {
                key: "k-endrule-until-editor",
                id: "k-endrule-until",
                disabled: f !== "until",
                min: l.start,
                value: f === "until" ? Y : ue(x),
                onChange: V,
                width: "auto"
              }
            )
          ]
        }
      ]
    }
  )))));
}, O = (l) => /* @__PURE__ */ e.createElement("li", { ...l }, l.children), xe = {
  value: ""
};
Ne.displayName = "KendoReactSchedulerRepeatEditor";
export {
  Ne as RecurrenceEditor
};
