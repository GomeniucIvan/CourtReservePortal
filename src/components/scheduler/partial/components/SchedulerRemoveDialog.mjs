/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import * as k from "react-dom";
import { Dialog as L, DialogActionsBar as b } from "@progress/kendo-react-dialogs";
import { useLocalization as E } from "@progress/kendo-react-intl";
import { editorCancel as s, messages as l, editorDelete as m, deleteConfirmation as u, deleteDialogTitle as g } from "../messages/index.mjs";
import { canUseDOM as y } from "@progress/kendo-react-common";
import { Button as d } from "@progress/kendo-react-buttons";
const z = e.forwardRef((c, f) => {
  const { onClose: a, onCancel: n, onConfirm: r } = c, i = e.useRef(null);
  e.useImperativeHandle(i, () => ({ props: c })), e.useImperativeHandle(f, () => i.current);
  const t = E(), C = t.toLanguageString(s, l[s]), v = t.toLanguageString(m, l[m]), p = t.toLanguageString(u, l[u]), D = t.toLanguageString(g, l[g]), R = e.useCallback(
    ({ syntheticEvent: o }) => {
      if (!a)
        return;
      const h = {
        syntheticEvent: o,
        value: null,
        target: i.current
      };
      a.call(void 0, h);
    },
    [a]
  ), M = e.useCallback(
    (o) => {
      n && n.call(void 0, { syntheticEvent: o, value: null });
    },
    [n]
  ), S = e.useCallback(
    (o) => {
      r && r.call(void 0, { syntheticEvent: o, value: null });
    },
    [r]
  );
  return y ? k.createPortal(
    /* @__PURE__ */ e.createElement(L, { title: D, onClose: R }, p, /* @__PURE__ */ e.createElement(b, null, /* @__PURE__ */ e.createElement(d, { onClick: M }, C), /* @__PURE__ */ e.createElement(d, { onClick: S }, v))),
    document && document.body
  ) : null;
});
z.displayName = "KendoReactSchedulerRemoveDialog";
export {
  z as SchedulerRemoveDialog
};
