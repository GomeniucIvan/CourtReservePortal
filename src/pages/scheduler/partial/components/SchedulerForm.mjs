/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import * as K from "react-dom";
import { canUseDOM as U } from "@progress/kendo-react-common";
import { Button as p } from "@progress/kendo-react-buttons";
import { Form as W } from "@progress/kendo-react-form";
import { DialogActionsBar as j, Dialog as J } from "@progress/kendo-react-dialogs";
import { useLocalization as P } from "@progress/kendo-react-intl";
import { SchedulerFormEditor as Q } from "../editors/SchedulerFormEditor.mjs";
import { editorValidationRequired as k, messages as n, editorValidationEnd as E, editorSave as I, editorCancel as L, editorTitle as B, editorValidationStart as D } from "../messages/index.mjs";
import { saveIcon as X, cancelIcon as Y } from "@progress/kendo-svg-icons";
import { useSchedulerFieldsContext as Z } from "../context/SchedulerContext.mjs";
const _ = e.forwardRef((r, R) => {
  const {
    onCancel: s,
    onClose: c,
    onSubmit: d,
    editor: T,
    dialog: y = F.dialog,
    validator: S = F.validator,
    ...V
  } = r, l = e.useRef(null);
  e.useImperativeHandle(l, () => ({ props: r })), e.useImperativeHandle(R, () => l.current);
  const i = P(), o = Z(), C = e.useMemo(() => i.toLanguageString(k, n[k]), [i]), f = e.useMemo(() => i.toLanguageString(E, n[E]), [i]), q = e.useMemo(() => i.toLanguageString(I, n[I]), [i]), A = e.useMemo(() => i.toLanguageString(L, n[L]), [i]), w = e.useMemo(() => i.toLanguageString(B, n[B]), [i]), b = e.useMemo(() => i.toLanguageString(D, n[D]), [i]), x = e.useCallback(
    (t) => {
      s && s.call(void 0, { value: null, syntheticEvent: t, target: l.current });
    },
    [s]
  ), z = e.useCallback(
    ({ syntheticEvent: t }) => {
      c && c.call(void 0, { value: null, syntheticEvent: t, target: l.current });
    },
    [c]
  ), H = e.useCallback(
    (t, a) => {
      d && d.call(void 0, { value: t, syntheticEvent: a, target: l.current });
    },
    [d]
  ), M = e.useCallback(
    (t, a) => t && a(o.end) && t.getTime() > a(o.end).getTime() ? b : void 0,
    [o, b]
  ), h = e.useCallback(
    (t, a) => t && a(o.start) && t.getTime() < a(o.start).getTime() ? f : void 0,
    [o, f]
  ), m = e.useCallback(
    (t) => t ? void 0 : C,
    [C]
  ), N = e.useCallback(
    (t, a) => {
      let u = {};
      u[o.start] = [
        m(a(o.start)),
        M(a(o.start), a)
      ].filter(Boolean).reduce((g, v) => g || v, ""), u[o.end] = [
        m(a(o.start)),
        h(a(o.start), a)
      ].filter(Boolean).reduce((g, v) => g || v, "");
      const O = S(t, a);
      return { ...u, ...O };
    },
    [h, o.end, o.start, m, M, S]
  );
  return U ? K.createPortal(
    /* @__PURE__ */ e.createElement(
      W,
      {
        initialValues: r.dataItem,
        onSubmit: H,
        validator: N,
        render: (t) => /* @__PURE__ */ e.createElement(
          y,
          {
            title: w,
            minWidth: 400,
            onClose: z,
            className: "k-scheduler-edit-dialog"
          },
          /* @__PURE__ */ e.createElement(Q, { ...t, as: T }),
          /* @__PURE__ */ e.createElement(j, { layout: "start" }, /* @__PURE__ */ e.createElement(
            p,
            {
              themeColor: "primary",
              disabled: !t.allowSubmit,
              onClick: t.onSubmit,
              icon: "save",
              svgIcon: X
            },
            q
          ), /* @__PURE__ */ e.createElement(
            p,
            {
              onClick: x,
              icon: "cancel",
              svgIcon: Y
            },
            A
          ))
        ),
        ...V
      }
    ),
    document && document.body
  ) : null;
}), F = {
  dialog: J,
  validator: () => ({})
};
_.displayName = "KendoReactSchedulerForm";
export {
  _ as SchedulerForm,
  F as schedulerFormDefaultProps
};
