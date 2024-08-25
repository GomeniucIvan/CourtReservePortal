/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { useCollection as i, classNames as k } from "@progress/kendo-react-common";
import { SchedulerViewContext as T } from "../context/SchedulerViewContext.mjs";
import { useItemsSelection as b, ITEMS_SELECT_ACTION as w } from "../hooks/use-items-selection.mjs";
import { useSlotsSelection as A, SLOTS_SELECT_ACTION as F } from "../hooks/use-slots-selection.mjs";
import { useCellSync as m } from "../hooks/useCellSync.mjs";
import { useItemsFocus as R } from "../hooks/use-items-focus.mjs";
import { useSlotsFocus as _ } from "../hooks/use-slots-focus.mjs";
const g = e.forwardRef((t, n) => {
  const s = e.useRef(null);
  e.useImperativeHandle(n, () => s.current);
  const [o, u] = i([]), [d, S] = i([]), [p, h] = R(o), [f, I] = _(d), [C, l] = b(o), [y, c] = A(), x = e.useCallback(
    (a, r) => {
      c({ type: F.reset }), l(a, r);
    },
    [l, c]
  ), E = e.useCallback(
    (a, r) => {
      l({ type: w.reset }, r), c(a);
    },
    [l, c]
  ), N = e.useMemo(
    () => k("k-scheduler-layout k-scheduler-layout-flex", t.className),
    [t.className]
  );
  return m({ element: s, selector: ".k-group-cell", attribute: "data-depth-index", explicitDepth: !0 }), m({ element: s, selector: ".k-side-cell", attribute: "data-depth-index", explicitDepth: !1 }), /* @__PURE__ */ e.createElement(
    T,
    {
      props: t.props,
      ranges: t.ranges,
      items: [o, u],
      slots: [d, S],
      selectedItems: [C, x],
      selectedSlots: [y, E],
      focusedItems: [p, h],
      focusedSlots: [f, I]
    },
    /* @__PURE__ */ e.createElement(
      "div",
      {
        ref: s,
        style: t.style,
        className: N,
        role: "presentation"
      },
      t.children
    )
  );
});
g.displayName = "KendoReactSchedulerBaseView";
export {
  g as BaseView
};
