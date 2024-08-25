/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { timezoneNames as ge } from "@progress/kendo-date-math";
import { Label as l, Error as s } from "@progress/kendo-react-labels";
import { useLocalization as Ce } from "@progress/kendo-react-intl";
import { FieldWrapper as m, Field as n, FormElement as Ne } from "@progress/kendo-react-form";
import { Input as Se, Checkbox as h, TextArea as De } from "@progress/kendo-react-inputs";
import { DatePicker as S, DateTimePicker as D } from "@progress/kendo-react-dateinputs";
import { editorValidationRequired as y, messages as d, editorEventTitle as x, editorEventStart as p, editorEventTimeZone as w, editorEventStartTimeZone as F, editorEventEnd as R, editorEventSeparateTimeZones as I, editorEventEndTimeZone as Z, editorEventAllDay as A, editorEventDescription as G } from "../messages/index.mjs";
import { FilterableComboBox as P } from "./FilterableComboBox.mjs";
import { classNames as ye } from "@progress/kendo-react-common";
import { RecurrenceEditor as xe } from "../recurrence/RecurrenceEditor.mjs";
import { ResourceEditor as pe } from "./ResourceEditor.mjs";
import { ZonedDateTime as V } from "./ZonedDateTime.mjs";
import { useSchedulerFieldsContext as we, useSchedulerPropsContext as Fe } from "../context/SchedulerContext.mjs";
const Re = e.forwardRef((r, b) => {
  const E = e.useRef(null), f = e.useRef(null), L = ge(), i = Ce(), t = we(), { resources: q, timezone: z } = Fe();
  e.useImperativeHandle(f, () => ({
    element: E.current && E.current.element ? E.current.element : E.current,
    props: r
  })), e.useImperativeHandle(b, () => f.current);
  const {
    as: v = a.as,
    ...B
  } = r, {
    titleLabel: M = a.titleLabel,
    titleError: H = a.titleError,
    titleEditor: _ = a.titleEditor,
    startLabel: K = a.startLabel,
    startError: W = a.startError,
    startEditor: j = a.startEditor,
    startTimezoneLabel: J = a.startTimezoneLabel,
    startTimezoneError: O = a.startTimezoneError,
    startTimezoneEditor: Q = a.startTimezoneEditor,
    startTimezoneCheckedLabel: g = a.startTimezoneCheckedLabel,
    startTimezoneCheckedEditor: U = a.startTimezoneCheckedEditor,
    endLabel: X = a.endLabel,
    endError: Y = a.endError,
    endEditor: $ = a.endEditor,
    endTimezoneLabel: ee = a.endTimezoneLabel,
    endTimezoneError: te = a.endTimezoneError,
    endTimezoneEditor: re = a.endTimezoneEditor,
    endTimezoneCheckedLabel: ae = a.endTimezoneCheckedLabel,
    endTimezoneCheckedEditor: ne = a.endTimezoneCheckedEditor,
    allDayLabel: oe = a.allDayLabel,
    allDayEditor: le = a.allDayEditor,
    recurrenceEditor: ie = a.recurrenceEditor,
    descriptionLabel: me = a.descriptionLabel,
    descriptionEditor: de = a.descriptionEditor,
    descriptionError: ce = a.descriptionError,
    resourceLabel: se = a.resourceLabel,
    resourceEditor: Ee = a.resourceEditor
  } = r, ue = r.valueGetter(t.start) || /* @__PURE__ */ new Date(), ze = r.valueGetter(t.startTimezone) || z || "", Te = r.valueGetter(t.endTimezone) || z || "", C = e.useMemo(() => i.toLanguageString(y, d[y]), [i]), [c, ke] = e.useState(!!r.valueGetter(t.startTimezone)), [T, N] = e.useState(!!r.valueGetter(t.endTimezone)), be = e.useCallback(
    (o) => {
      o.value || (r.onChange(t.startTimezone, { value: null }), r.onChange(t.endTimezone, { value: null }), N(o.value)), ke(o.value);
    },
    [r.onChange, t.startTimezone, t.endTimezone]
  ), he = e.useCallback(
    (o) => {
      o.value || r.onChange(t.endTimezone, { value: null }), N(o.value);
    },
    [r.onChange]
  ), u = e.useCallback(
    (o) => o ? void 0 : C,
    [C]
  ), fe = e.useCallback(
    (o, k) => c ? u(k(t.startTimezone)) : void 0,
    [u, c, t.startTimezone]
  ), Le = e.useCallback(
    (o, k) => c && T ? u(k(t.endTimezone)) || u(k(t.startTimezone)) : void 0,
    [u, c, T, t.startTimezone, t.endTimezone]
  ), ve = e.useMemo(
    () => ye("k-scheduler-edit-form", r.className),
    [r.className]
  );
  return /* @__PURE__ */ e.createElement(
    v,
    {
      ref: v === a.as ? E : void 0,
      ...B,
      className: ve
    },
    /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.title,
        component: M,
        editorId: "k-scheduler-editor-title",
        className: "k-form-label"
      },
      i.toLanguageString(x, d[x])
    ), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
      n,
      {
        id: "k-scheduler-editor-title",
        name: t.title,
        field: t.title,
        component: _
      }
    ), r.errors[t.title] && /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.title,
        component: H
      },
      r.errors[t.title]
    ))), /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.start,
        component: K,
        editorId: "k-scheduler-editor-start",
        className: "k-form-label"
      },
      i.toLanguageString(p, d[p])
    ), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
      n,
      {
        id: "k-scheduler-editor-start",
        name: t.start,
        width: "auto",
        component: j,
        as: r.valueGetter(t.isAllDay) ? S : D,
        timezone: z
      }
    ), r.errors[t.start] && /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.start,
        component: W
      },
      r.errors[t.start]
    ))), /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(
      g,
      {
        className: "k-form-label"
      }
    ), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
      U,
      {
        id: "k-scheduler-editor-set-start-timezone",
        onChange: be,
        value: c
      }
    ), /* @__PURE__ */ e.createElement(
      g,
      {
        className: "k-checkbox-label",
        editorId: "k-scheduler-editor-set-start-timezone"
      },
      i.toLanguageString(w, d[w])
    ))), c && /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.start,
        component: J,
        className: "k-form-label"
      },
      i.toLanguageString(F, d[F])
    ), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
      n,
      {
        component: Q,
        value: ze,
        validator: fe,
        data: L,
        name: t.startTimezone
      }
    ), r.errors[t.startTimezone] && /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.startTimezone,
        component: O
      },
      r.errors[t.startTimezone]
    ))), /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.end,
        component: X,
        editorId: "k-scheduler-editor-end",
        className: "k-form-label"
      },
      i.toLanguageString(R, d[R])
    ), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
      n,
      {
        id: "k-scheduler-editor-end",
        name: t.end,
        width: "auto",
        component: $,
        as: r.valueGetter(t.isAllDay) ? S : D,
        timezone: z
      }
    ), r.errors[t.end] && /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.end,
        component: Y
      },
      r.errors[t.end]
    ))), c && /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
      ne,
      {
        id: "k-scheduler-editor-set-end-timezone",
        onChange: he,
        value: T
      }
    )), /* @__PURE__ */ e.createElement(
      ae,
      {
        editorId: "k-scheduler-editor-set-end-timezone",
        className: "k-form-label"
      },
      i.toLanguageString(I, d[I])
    )), T && /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.endTimezone,
        component: ee,
        className: "k-form-label"
      },
      i.toLanguageString(Z, d[Z])
    ), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
      n,
      {
        value: Te,
        data: L,
        validator: Le,
        component: re,
        name: t.endTimezone
      }
    ), r.errors[t.endTimezone] && /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.endTimezone,
        component: te
      },
      r.errors[t.endTimezone]
    ))), /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.isAllDay,
        component: l,
        className: "k-form-label"
      }
    ), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
      n,
      {
        id: "k-is-allday-checkbox",
        name: t.isAllDay,
        component: le
      }
    ), /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.isAllDay,
        field: t.isAllDay,
        editorId: "k-is-allday-checkbox",
        className: "k-checkbox-label",
        component: oe
      },
      i.toLanguageString(A, d[A])
    ))), /* @__PURE__ */ e.createElement("div", { className: "k-recurrence-editor" }, /* @__PURE__ */ e.createElement(
      n,
      {
        component: ie,
        field: t.recurrenceRule,
        name: t.recurrenceRule,
        start: ue
      }
    )), /* @__PURE__ */ e.createElement(m, null, /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.description,
        component: me,
        className: "k-form-label"
      },
      i.toLanguageString(G, d[G])
    ), /* @__PURE__ */ e.createElement("div", { className: "k-form-field-wrap" }, /* @__PURE__ */ e.createElement(
      n,
      {
        component: de,
        name: t.description,
        rows: 1,
        id: "k-event-description"
      }
    ), r.errors[t.description] && /* @__PURE__ */ e.createElement(
      n,
      {
        name: t.description,
        component: ce
      },
      r.errors[t.description]
    ))), (q || []).map((o) => /* @__PURE__ */ e.createElement(m, { key: o.field }, /* @__PURE__ */ e.createElement(
      n,
      {
        name: o.field,
        component: se,
        className: "k-form-label"
      }
    ), /* @__PURE__ */ e.createElement(l, { className: "k-form-label" }, o.name), /* @__PURE__ */ e.createElement(
      n,
      {
        name: o.field,
        component: Ee,
        resource: o,
        multiple: o.multiple,
        data: o.data,
        textField: o.textField,
        valueField: o.valueField,
        colorField: o.colorField
      }
    ))))
  );
}), a = {
  as: e.forwardRef((r, b) => /* @__PURE__ */ e.createElement(
    Ne,
    {
      ref: b,
      id: r.id,
      style: r.style,
      tabIndex: r.tabIndex,
      className: r.className,
      horizontal: r.horizontal,
      children: r.children
    }
  )),
  titleLabel: l,
  titleError: s,
  titleEditor: Se,
  startLabel: l,
  startError: s,
  startEditor: V,
  startTimezoneLabel: l,
  startTimezoneError: s,
  startTimezoneEditor: P,
  startTimezoneCheckedLabel: l,
  startTimezoneCheckedEditor: h,
  endLabel: l,
  endError: s,
  endEditor: V,
  endTimezoneLabel: l,
  endTimezoneError: s,
  endTimezoneEditor: P,
  endTimezoneCheckedLabel: l,
  endTimezoneCheckedEditor: h,
  allDayLabel: l,
  allDayEditor: h,
  recurrenceEditor: xe,
  descriptionLabel: l,
  descriptionEditor: De,
  descriptionError: s,
  resourceLabel: l,
  resourceEditor: pe
};
Re.displayName = "KendoReactSchedulerFormEditor";
export {
  Re as SchedulerFormEditor,
  a as schedulerFormEditorDefaultProps
};