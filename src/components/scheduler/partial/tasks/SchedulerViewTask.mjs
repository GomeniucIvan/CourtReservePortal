/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { SchedulerTask as o } from "./SchedulerTask.mjs";
const k = e.forwardRef((r, a) => {
  const { task: n, _ref: c, ...u } = r, t = e.useRef(null), s = e.useRef(null);
  e.useImperativeHandle(s, () => ({ props: r, element: t.current && t.current.element })), e.useImperativeHandle(c, () => t.current), e.useImperativeHandle(a, () => s.current);
  const l = n || i.task;
  return /* @__PURE__ */ e.createElement(l, { ...u, _ref: t });
}), i = {
  task: o
};
k.displayName = "KendoReactSchedulerViewTask";
export {
  k as SchedulerViewTask,
  i as schedulerViewTaskDefaultProps
};
