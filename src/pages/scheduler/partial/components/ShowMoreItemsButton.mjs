/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { Button as s } from "@progress/kendo-react-buttons";
import { useLocalization as u } from "@progress/kendo-react-intl";
import { moreEvents as r, messages as f } from "../messages/index.mjs";
import { moreHorizontalIcon as d } from "@progress/kendo-svg-icons";
const k = e.forwardRef((t, l) => {
  const n = e.useRef(null), o = e.useRef(null), a = u();
  e.useImperativeHandle(n, () => ({
    element: o.current && o.current.element,
    ...t
  })), e.useImperativeHandle(l, () => n.current);
  const c = e.useCallback(
    (i) => {
      !t.onClick || !n.current || t.onClick.call(void 0, {
        target: n.current,
        syntheticEvent: i
      });
    },
    [
      n,
      t.slot,
      t.onClick
    ]
  ), m = a.toLanguageString(r, f[r]);
  return /* @__PURE__ */ e.createElement(
    s,
    {
      ref: o,
      tabIndex: -1,
      className: "k-more-events",
      onClick: c,
      "aria-label": m,
      icon: "more-horizontal",
      svgIcon: d
    }
  );
});
k.displayName = "KendoReactSchedulerShowMoreItemsButton";
export {
  k as ShowMoreItemsButton
};
