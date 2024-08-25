/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as o from "react";
import { SchedulerViewTask as B } from "./SchedulerViewTask.mjs";
import { useControlledState as u } from "../hooks/useControlledState.mjs";
import { findMaster as G } from "../utils/index.mjs";
import { DATA_ACTION as J } from "../constants/index.mjs";
import { SchedulerRemoveDialog as L } from "../components/SchedulerRemoveDialog.mjs";
import { SchedulerOccurrenceDialog as Q } from "../components/SchedulerOccurrenceDialog.jsx";
import { useSchedulerFieldsContext as U, useSchedulerDataContext as W } from "../context/SchedulerContext.mjs";
import { SchedulerEditTaskContext as X } from "../context/SchedulerEditTaskContext.mjs";
import { useEditable as Y } from "../hooks/useEditable.mjs";
const Z = o.forwardRef((t, D) => {
  const {
    _ref: k,
    onDataAction: f,
    viewTask: v,
    removeDialog: R,
    removeItem: w,
    onRemoveItemChange: S,
    occurrenceDialog: I,
    showOccurrenceDialog: p,
    onShowOccurrenceDialogChange: O,
    showRemoveDialog: T,
    onShowRemoveDialogChange: b,
    ...E
  } = t, i = o.useRef(null);
  o.useImperativeHandle(i, () => ({ props: t, element: i.current && i.current.element })), o.useImperativeHandle(k, () => i.current), o.useImperativeHandle(D, () => i.current);
  const x = v || d.viewTask, A = I || d.occurrenceDialog, H = R || d.removeDialog, P = Y(t.editable), h = U(), [_, y] = W(), [N, s] = o.useState(null), [r, l] = u(null, w, S), [g, a] = u(!1, T, b), [C, c] = u(!1, p, O), V = o.useCallback(
    (e) => {
      P.remove && (l(t.dataItem, e), t.isRecurring ? c(!0, e) : a(!0, e));
    },
    [
      l,
      t.dataItem,
      t.isRecurring,
      c,
      a
    ]
  ), m = o.useCallback(
    (e) => {
      s(null), l(null, e), a(!1, e), c(!1, e);
    },
    [
      s,
      l,
      a,
      c
    ]
  ), F = o.useCallback(
    (e) => {
      f && r && f.call(void 0, {
        type: J.remove,
        series: N,
        dataItem: r
      }), l(null, e), a(!1, e);
    },
    [
      r,
      y,
      a
    ]
  ), K = o.useCallback(
    (e, n) => {
      l && l(e, n);
    },
    [l]
  ), M = o.useCallback(
    (e, n) => {
      a && a(e, n);
    },
    [a]
  ), j = o.useCallback(
    (e, n) => {
      c && c(e, n);
    },
    [c]
  ), q = o.useCallback(
    (e) => {
      r && (s(!1), l(t.dataItem, e), a(!0, e)), c(!1, e);
    },
    [
      s,
      t.dataItem,
      r,
      l,
      a
    ]
  ), z = o.useCallback(
    (e) => {
      if (r) {
        s(!0);
        const n = G(r, h, _);
        l(n, e), a(!0, e);
      }
      c(!1, e);
    },
    [
      h,
      r,
      s,
      l,
      a,
      c
    ]
  );
  return /* @__PURE__ */ o.createElement(
    X,
    {
      remove: [r, K],
      showRemoveDialog: [g, M],
      showOccurrenceDialog: [C, j]
    },
    /* @__PURE__ */ o.createElement(
      x,
      {
        _ref: i,
        ...E,
        onRemoveClick: V
      }
    ),
    C && /* @__PURE__ */ o.createElement(
      A,
      {
        dataItem: r,
        isRemove: r !== null,
        onClose: m,
        onOccurrenceClick: q,
        onSeriesClick: z
      }
    ),
    g && /* @__PURE__ */ o.createElement(
      H,
      {
        dataItem: r,
        onClose: m,
        onCancel: m,
        onConfirm: F
      }
    )
  );
}), d = {
  viewTask: B,
  occurrenceDialog: Q,
  removeDialog: L
};
Z.displayName = "KendoReactSchedulerEditTask";
export {
  Z as SchedulerEditTask,
  d as schedulerEditTaskDefaultProps
};