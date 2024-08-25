/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { classNames as m } from "@progress/kendo-react-common";
import { Toolbar as u } from "@progress/kendo-react-buttons";
const N = e.forwardRef((t, o) => {
  const {
    className: f,
    style: a,
    ...n
  } = t, r = e.useRef(null), s = e.useRef(null);
  e.useImperativeHandle(r, () => ({ element: s.current, props: t })), e.useImperativeHandle(o, () => r.current);
  const c = e.useMemo(() => m("k-scheduler-footer", t.className), [t.className]);
  return /* @__PURE__ */ e.createElement(
    u,
    {
      ref: (l) => {
        l && (s.current = l.element);
      },
      className: c,
      style: { boxShadow: "none", ...a },
      ...n
    },
    t.children
  );
});
export {
  N as SchedulerFooter
};
