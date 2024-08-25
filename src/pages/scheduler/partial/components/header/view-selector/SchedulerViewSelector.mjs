/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { ToolbarItem as n } from "@progress/kendo-react-buttons";
import { classNames as o } from "@progress/kendo-react-common";
const s = e.forwardRef((r, c) => {
  const {
    className: a,
    ...m
  } = r, t = e.useRef(null);
  return e.useImperativeHandle(c, () => ({ element: t.current, props: r })), /* @__PURE__ */ e.createElement(
    n,
    {
      ref: (l) => {
        l && (t.current = l.element);
      },
      className: o("k-scheduler-views", a),
      ...m
    },
    r.children
  );
});
s.displayName = "KendoReactSchedulerViewSelector";
export {
  s as SchedulerViewSelector
};
