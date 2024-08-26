/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { classNames as o } from "@progress/kendo-react-common";
import { Toolbar as u } from "@progress/kendo-react-buttons";
const d = e.forwardRef((r, s) => {
  const {
    className: t,
    ...c
  } = r, a = e.useRef(null), l = e.useRef(null);
  e.useImperativeHandle(l, () => ({ element: a.current, props: r })), e.useImperativeHandle(s, () => l.current);
  const m = e.useMemo(() => o("k-scheduler-toolbar", t), [t]);
  return /* @__PURE__ */ e.createElement(
    u,
    {
      id: r.id,
      ref: (n) => {
        n && (a.current = n.element);
      },
      className: m,
      ...c
    },
    r.children
  );
});
d.displayName = "KendoReactSchedulerHeader";
export {
  d as SchedulerHeader
};
